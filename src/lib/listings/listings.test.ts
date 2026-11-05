import assert from "node:assert/strict";
import test from "node:test";
import { hisServiceRoot } from "./his-config";
import { activePropertyFilter, buildCollectionUrl, isUsableNextLink } from "./his-source";
import { EMPTY_FILTERS, filtersToSearch, inBounds, matchesFilters, parseListingSearch, sortListings } from "./query";
import { mapResoProperty, publicResoSelect } from "./reso";
import { SAMPLE_LISTINGS, SAMPLE_PROPERTY_RECORDS } from "./sample-listings";
import { HIS_IDX_SERVICE_ROOT } from "./his-config";

test("sample records are DD 2.0 properties and all map", () => {
  assert.ok(SAMPLE_LISTINGS.length >= 27);
  assert.equal(SAMPLE_LISTINGS.length, SAMPLE_PROPERTY_RECORDS.length);
  const estate = SAMPLE_LISTINGS.find((listing) => listing.id === "sample-hawi-estate");
  assert.ok(estate);
  assert.equal(estate.bathrooms, 4.5);
  assert.equal(estate.mlsNumber, "SAMPLE-1004");
  assert.equal(estate.tenure, "fee-simple");
  const land = SAMPLE_LISTINGS.find((listing) => listing.id === "sample-kohala-land");
  assert.equal(land?.propertyType, "Land");
  assert.equal(land?.tenure, "leasehold");
  assert.equal(land?.bedrooms, null);
  const record = SAMPLE_PROPERTY_RECORDS.find((item) => item.ListingKey === "sample-hilo-house");
  assert.equal(record?.StandardStatus, "Active");
  assert.equal(record?.PropertyType, "Residential");
  assert.equal(record?.PropertySubType, "Single Family Residence");
  assert.equal(record?.HIS_LandTenure, "Fee Simple");
});

test("mapper keeps public fields and drops private ones", () => {
  const secret = "LOCKBOX-SECRET-991";
  const listing = mapResoProperty({
    ListingKey: "HIS100",
    ListingId: "100",
    StandardStatus: "Active",
    ListPrice: 500000,
    PropertyType: "Residential",
    PropertySubType: "Single Family Residence",
    BedroomsTotal: 3,
    BathroomsFull: 2,
    BathroomsHalf: 0,
    LivingArea: 1400,
    LotSizeAcres: 0.5,
    YearBuilt: 1990,
    Latitude: 19.7,
    Longitude: -155.08,
    UnparsedAddress: "1 Test Road",
    City: "Hilo",
    StateOrProvince: "HI",
    PostalCode: "96720",
    PublicRemarks: "A house in Hilo.",
    ListingContractDate: "2026-01-01",
    PhotosCount: 4,
    ListOfficeName: "Example Realty",
    ListOfficePhone: "808-555-0100",
    ListOfficeEmail: "a@example.com",
    InternetAddressDisplayYN: false,
    HIS_LandTenure: "Leasehold",
    HIS_LavaZone: 3,
    PrivateRemarks: secret,
    OwnerName: "Secret Seller",
    ShowingInstructions: "Call the occupant",
    LockBoxType: secret,
  }, { lavaZoneField: "HIS_LavaZone" });
  assert.ok(listing);
  assert.equal(listing.streetAddress, "");
  assert.equal(listing.addressDisplayed, false);
  assert.equal(listing.tenure, "leasehold");
  assert.equal(listing.lavaZone, 3);
  assert.equal(listing.city, "Hilo");
  const blob = JSON.stringify(listing);
  assert.equal(blob.includes(secret), false);
  assert.equal(blob.includes("Secret Seller"), false);
  assert.equal(blob.includes("occupant"), false);
});

test("select list asks for ListingKey and not private fields", () => {
  const select = publicResoSelect();
  assert.match(select, /ListingKey/);
  assert.match(select, /HIS_LandTenure/);
  assert.doesNotMatch(select, /PrivateRemarks|OwnerName|ShowingInstructions|\$skip/);
  assert.equal(publicResoSelect({ lavaZoneField: "PrivateRemarks" }).includes("PrivateRemarks"), false);
  assert.match(publicResoSelect({ lavaZoneField: "HIS_LavaZone" }), /HIS_LavaZone/);
});

test("property query uses the DD 2.0 IDX root and nextLink pages", () => {
  const url = buildCollectionUrl(HIS_IDX_SERVICE_ROOT, "Property", {
    $count: "true",
    $select: "ListingKey,StandardStatus",
    $filter: activePropertyFilter("Hawaii"),
  });
  assert.match(url, /^https:\/\/reso\.hiinfo\.com\/2\.0\/odata\/IDX\/Property\?/);
  assert.match(url, /StandardStatus/);
  assert.equal(url.includes("$skip"), false);
  assert.equal(url.includes("$top"), false);
  const next = "https://reso.hiinfo.com/2.0/odata/IDX/Property?$skiptoken=abc";
  assert.equal(isUsableNextLink(HIS_IDX_SERVICE_ROOT, next), true);
  assert.equal(isUsableNextLink(HIS_IDX_SERVICE_ROOT, "https://example.com/2.0/odata/IDX/Property?$skiptoken=abc"), false);
  assert.equal(isUsableNextLink(HIS_IDX_SERVICE_ROOT, "https://reso.hiinfo.com/odata/IDX/Property?$skiptoken=abc"), false);
});

test("DD 1.7 service root is rejected", () => {
  const previous = process.env.HIS_RESO_BASE_URL;
  process.env.HIS_RESO_BASE_URL = "https://reso.hiinfo.com/odata/IDX";
  assert.throws(() => hisServiceRoot(), /2\.0/);
  if (previous === undefined) delete process.env.HIS_RESO_BASE_URL;
  else process.env.HIS_RESO_BASE_URL = previous;
});

test("filters, bounds, and sort stay on objective fields", () => {
  const land = SAMPLE_LISTINGS.filter((listing) =>
    matchesFilters(listing, { ...EMPTY_FILTERS, propertyType: "Land", lavaZones: [1] }),
  );
  assert.ok(land.every((listing) => listing.propertyType === "Land" && listing.lavaZone === 1));
  const priced = sortListings(
    SAMPLE_LISTINGS.filter((listing) => matchesFilters(listing, { ...EMPTY_FILTERS, minPrice: 3000000 })),
    "price-asc",
  );
  assert.equal(priced.length, 1);
  assert.equal(priced[0]?.id, "sample-hawi-estate");
  const hilo = SAMPLE_LISTINGS.find((listing) => listing.id === "sample-hilo-house");
  assert.ok(hilo);
  assert.equal(inBounds(hilo, { west: -155.2, south: 19.6, east: -155.0, north: 19.8 }), true);
  assert.equal(inBounds(hilo, { west: -156.1, south: 19.4, east: -155.8, north: 19.7 }), false);
  const search = filtersToSearch({ ...EMPTY_FILTERS, districtSlug: "puna", minBeds: 2 }, "price-desc");
  const parsed = parseListingSearch(search);
  assert.equal(parsed.filters.districtSlug, "puna");
  assert.equal(parsed.filters.minBeds, 2);
  assert.equal(parsed.sort, "price-desc");
});
