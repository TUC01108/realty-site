import { NEIGHBORHOODS } from "../../data/neighborhoods";
import { districtName, formatCount, formatLot } from "./format";
import { mapResoProperty, type ResoMapOptions } from "./reso";
import type { LandTenure, Listing, PropertyType } from "./types";

// Fictional listings stored as RESO Data Dictionary 2.0 Property records.
// They run through the same mapper as the live HIS feed. Nothing here is
// copied from Hawaii Information Service or hiinfo.com.
// HIS_LavaZone is a local placeholder. HIS has not published that field name.

const SAMPLE_MAP_OPTIONS: ResoMapOptions = { lavaZoneField: "HIS_LavaZone" };

type Office = { key: string; name: string; phone: string; email: string };

const NORTH: Office = {
  key: "sample-office-north",
  name: "North Shore Sample Properties",
  phone: "808.555.0190",
  email: "office@northshore-sample.example",
};
const KONA: Office = {
  key: "sample-office-kona",
  name: "Preview Kona Realty",
  phone: "808.555.0174",
  email: "office@kona-preview.example",
};
const PUNA: Office = {
  key: "sample-office-puna",
  name: "Sample Puna Land Office",
  phone: "808.555.0118",
  email: "office@puna-sample.example",
};
const HILO: Office = {
  key: "sample-office-hilo",
  name: "Sample Hilo Brokerage",
  phone: "808.555.0141",
  email: "office@hilo-sample.example",
};

type Row = {
  id: string;
  price: number;
  propertyType: PropertyType;
  districtSlug: string;
  bedrooms?: number;
  bathrooms?: number;
  livingAreaSqFt?: number;
  lotAcres: number;
  yearBuilt?: number;
  lavaZone: number;
  tenure: LandTenure;
  latitude: number;
  longitude: number;
  streetAddress: string;
  city: string;
  postalCode: string;
  listedAt: string;
  photoCount?: number;
  office: Office;
};

function resoPropertyType(type: PropertyType): { PropertyType: string; PropertySubType?: string } {
  if (type === "Land") return { PropertyType: "Land" };
  if (type === "Condo") return { PropertyType: "Residential", PropertySubType: "Condominium" };
  if (type === "Multi-family") return { PropertyType: "Residential Income", PropertySubType: "Duplex" };
  return { PropertyType: "Residential", PropertySubType: "Single Family Residence" };
}

function bathFields(bathrooms: number | undefined): Record<string, number> {
  if (bathrooms == null) return {};
  const full = Math.floor(bathrooms);
  const half = bathrooms - full >= 0.5 ? 1 : 0;
  return { BathroomsFull: full, BathroomsHalf: half, BathroomsTotalInteger: full + half };
}

function toResoRecord(row: Row, index: number): Record<string, unknown> {
  const land = row.propertyType === "Land";
  const label = row.propertyType === "Multi-family" ? "Multi-family property" : row.propertyType;
  const rooms =
    land || row.bedrooms == null || row.bathrooms == null
      ? ""
      : ` It has ${formatCount(row.bedrooms)} ${row.bedrooms === 1 ? "bedroom" : "bedrooms"} and ${formatCount(row.bathrooms)} ${row.bathrooms === 1 ? "bathroom" : "bathrooms"}.`;
  const living = !land && row.livingAreaSqFt ? ` Living area is ${row.livingAreaSqFt.toLocaleString("en-US")} square feet.` : "";
  const tenure = row.tenure === "fee-simple" ? "fee simple" : "leasehold";
  return {
    ListingKey: row.id,
    ListingId: `SAMPLE-${1001 + index}`,
    StandardStatus: "Active",
    ListPrice: row.price,
    ...resoPropertyType(row.propertyType),
    ...(land
      ? {}
      : {
          BedroomsTotal: row.bedrooms,
          LivingArea: row.livingAreaSqFt,
          YearBuilt: row.yearBuilt,
          ...bathFields(row.bathrooms),
        }),
    LotSizeAcres: row.lotAcres,
    Latitude: row.latitude,
    Longitude: row.longitude,
    UnparsedAddress: row.streetAddress,
    City: row.city,
    StateOrProvince: "HI",
    PostalCode: row.postalCode,
    CountyOrParish: "Hawaii",
    PublicRemarks: `Fictional sample listing. ${label} in ${districtName(row.districtSlug)}.${rooms}${living} The lot is ${formatLot(row.lotAcres)}, ${tenure}, USGS lava-flow hazard zone ${row.lavaZone}.`,
    ListingContractDate: row.listedAt,
    PhotosCount: row.photoCount ?? 4,
    ListOfficeKey: row.office.key,
    ListOfficeName: row.office.name,
    ListOfficePhone: row.office.phone,
    ListOfficeEmail: row.office.email,
    InternetAddressDisplayYN: true,
    HIS_LandTenure: row.tenure === "fee-simple" ? "Fee Simple" : "Leasehold",
    HIS_LavaZone: row.lavaZone,
  };
}

const SAMPLE_ROWS: Row[] = [
{ id: "sample-hawi-house", price: 1285000, propertyType: "House", districtSlug: "north-kohala", bedrooms: 3, bathrooms: 2, livingAreaSqFt: 1680, lotAcres: 1.12, yearBuilt: 1998, lavaZone: 8, tenure: "fee-simple", latitude: 20.2412, longitude: -155.8305, streetAddress: "18 Sample Maile Road", city: "Hawi", postalCode: "96719", listedAt: "2026-09-12", photoCount: 5, office: NORTH },
{ id: "sample-kapaau-house", price: 1640000, propertyType: "House", districtSlug: "north-kohala", bedrooms: 4, bathrooms: 3, livingAreaSqFt: 2460, lotAcres: 2.4, yearBuilt: 2006, lavaZone: 9, tenure: "fee-simple", latitude: 20.2336, longitude: -155.8018, streetAddress: "77 Preview Lehua Place", city: "Kapaau", postalCode: "96755", listedAt: "2026-08-03", photoCount: 5, office: NORTH },
{ id: "sample-kohala-land", price: 525000, propertyType: "Land", districtSlug: "north-kohala", lotAcres: 10.5, lavaZone: 8, tenure: "leasehold", latitude: 20.2194, longitude: -155.824, streetAddress: "400 Fictional Ridge Road", city: "Hawi", postalCode: "96719", listedAt: "2026-06-18", office: NORTH },
{ id: "sample-hawi-estate", price: 3400000, propertyType: "House", districtSlug: "north-kohala", bedrooms: 5, bathrooms: 4.5, livingAreaSqFt: 4280, lotAcres: 3.8, yearBuilt: 2015, lavaZone: 9, tenure: "fee-simple", latitude: 20.2488, longitude: -155.8165, streetAddress: "1 Fictional Lookout Road", city: "Hawi", postalCode: "96719", listedAt: "2026-10-08", photoCount: 5, office: NORTH },
{ id: "sample-waimea-house", price: 1275000, propertyType: "House", districtSlug: "south-kohala", bedrooms: 3, bathrooms: 2.5, livingAreaSqFt: 1920, lotAcres: 1.05, yearBuilt: 2012, lavaZone: 8, tenure: "fee-simple", latitude: 20.0228, longitude: -155.6688, streetAddress: "12 Sample Ohia Road", city: "Waimea", postalCode: "96743", listedAt: "2026-10-01", office: NORTH },
{ id: "sample-waikoloa-condo", price: 879000, propertyType: "Condo", districtSlug: "south-kohala", bedrooms: 2, bathrooms: 2, livingAreaSqFt: 1180, lotAcres: 0.05, yearBuilt: 2001, lavaZone: 8, tenure: "leasehold", latitude: 19.9336, longitude: -155.7915, streetAddress: "9 Preview Tradewind Place", city: "Waikoloa", postalCode: "96738", listedAt: "2026-07-22", office: KONA },
{ id: "sample-waikoloa-land", price: 640000, propertyType: "Land", districtSlug: "south-kohala", lotAcres: 3.2, lavaZone: 9, tenure: "fee-simple", latitude: 19.9488, longitude: -155.7722, streetAddress: "260 Sample Cinder Court", city: "Waikoloa", postalCode: "96738", listedAt: "2026-04-14", office: KONA },
{ id: "sample-kona-condo", price: 549000, propertyType: "Condo", districtSlug: "north-kona", bedrooms: 1, bathrooms: 1, livingAreaSqFt: 742, lotAcres: 0.03, yearBuilt: 1986, lavaZone: 4, tenure: "fee-simple", latitude: 19.6432, longitude: -155.9878, streetAddress: "30 Sample Hale Street", city: "Kailua-Kona", postalCode: "96740", listedAt: "2026-10-20", office: KONA },
{ id: "sample-holualoa-house", price: 1490000, propertyType: "House", districtSlug: "north-kona", bedrooms: 3, bathrooms: 2, livingAreaSqFt: 1760, lotAcres: 1.8, yearBuilt: 1979, lavaZone: 4, tenure: "fee-simple", latitude: 19.6234, longitude: -155.9512, streetAddress: "55 Preview Orchard Road", city: "Holualoa", postalCode: "96725", listedAt: "2026-05-09", photoCount: 5, office: KONA },
{ id: "sample-keauhou-house", price: 2150000, propertyType: "House", districtSlug: "north-kona", bedrooms: 4, bathrooms: 3.5, livingAreaSqFt: 3100, lotAcres: 0.48, yearBuilt: 2018, lavaZone: 4, tenure: "leasehold", latitude: 19.5688, longitude: -155.9465, streetAddress: "8 Fictional Bay Court", city: "Keauhou", postalCode: "96739", listedAt: "2026-09-28", photoCount: 5, office: KONA },
{ id: "sample-captain-cook-house", price: 1150000, propertyType: "House", districtSlug: "south-kona", bedrooms: 3, bathrooms: 2, livingAreaSqFt: 1540, lotAcres: 5.25, yearBuilt: 1968, lavaZone: 3, tenure: "fee-simple", latitude: 19.4972, longitude: -155.9034, streetAddress: "140 Sample Coffee Road", city: "Captain Cook", postalCode: "96704", listedAt: "2026-03-11", office: KONA },
{ id: "sample-honaunau-land", price: 780000, propertyType: "Land", districtSlug: "south-kona", lotAcres: 8, lavaZone: 5, tenure: "fee-simple", latitude: 19.4486, longitude: -155.8722, streetAddress: "90 Preview Macadamia Lane", city: "Honaunau", postalCode: "96726", listedAt: "2026-02-02", office: KONA },
{ id: "sample-kealakekua-multi", price: 1325000, propertyType: "Multi-family", districtSlug: "south-kona", bedrooms: 6, bathrooms: 4, livingAreaSqFt: 2840, lotAcres: 0.62, yearBuilt: 1974, lavaZone: 4, tenure: "fee-simple", latitude: 19.5274, longitude: -155.9216, streetAddress: "21 Sample Lanai Road", city: "Kealakekua", postalCode: "96750", listedAt: "2026-08-19", office: KONA },
{ id: "sample-honokaa-house", price: 615000, propertyType: "House", districtSlug: "hamakua", bedrooms: 2, bathrooms: 1, livingAreaSqFt: 980, lotAcres: 0.42, yearBuilt: 1936, lavaZone: 8, tenure: "fee-simple", latitude: 20.0788, longitude: -155.4655, streetAddress: "6 Preview Gulch Road", city: "Honokaa", postalCode: "96727", listedAt: "2026-07-01", office: NORTH },
{ id: "sample-hamakua-land", price: 890000, propertyType: "Land", districtSlug: "hamakua", lotAcres: 15.4, lavaZone: 7, tenure: "fee-simple", latitude: 20.1124, longitude: -155.4522, streetAddress: "800 Fictional Pasture Road", city: "Honokaa", postalCode: "96727", listedAt: "2026-01-20", office: NORTH },
{ id: "sample-papaaloa-house", price: 735000, propertyType: "House", districtSlug: "hamakua", bedrooms: 3, bathrooms: 2, livingAreaSqFt: 1420, lotAcres: 1.7, yearBuilt: 1952, lavaZone: 8, tenure: "fee-simple", latitude: 20.0012, longitude: -155.241, streetAddress: "33 Sample Stream Place", city: "Papaaloa", postalCode: "96780", listedAt: "2026-06-06", office: HILO },
{ id: "sample-pahoa-land", price: 89000, propertyType: "Land", districtSlug: "puna", lotAcres: 2, lavaZone: 1, tenure: "fee-simple", latitude: 19.4766, longitude: -154.9534, streetAddress: "510 Sample Lava Lane", city: "Pahoa", postalCode: "96778", listedAt: "2026-10-11", office: PUNA },
{ id: "sample-pahoa-house", price: 365000, propertyType: "House", districtSlug: "puna", bedrooms: 2, bathrooms: 1, livingAreaSqFt: 864, lotAcres: 1, yearBuilt: 2008, lavaZone: 2, tenure: "fee-simple", latitude: 19.4978, longitude: -154.9468, streetAddress: "27 Preview Ohia Court", city: "Pahoa", postalCode: "96778", listedAt: "2026-09-02", office: PUNA },
{ id: "sample-keaau-house", price: 575000, propertyType: "House", districtSlug: "puna", bedrooms: 4, bathrooms: 2, livingAreaSqFt: 1688, lotAcres: 0.95, yearBuilt: 1994, lavaZone: 3, tenure: "fee-simple", latitude: 19.6228, longitude: -155.0386, streetAddress: "64 Sample Orchid Street", city: "Keaau", postalCode: "96749", listedAt: "2026-04-28", office: HILO },
{ id: "sample-volcano-house", price: 690000, propertyType: "House", districtSlug: "puna", bedrooms: 3, bathrooms: 2, livingAreaSqFt: 1560, lotAcres: 1.25, yearBuilt: 1988, lavaZone: 3, tenure: "fee-simple", latitude: 19.4304, longitude: -155.2346, streetAddress: "11 Fictional Fern Road", city: "Volcano", postalCode: "96785", listedAt: "2026-05-16", office: PUNA },
{ id: "sample-ocean-view-land", price: 72000, propertyType: "Land", districtSlug: "kau", lotAcres: 1, lavaZone: 2, tenure: "fee-simple", latitude: 19.1068, longitude: -155.7764, streetAddress: "300 Sample Kipuka Road", city: "Ocean View", postalCode: "96737", listedAt: "2026-08-30", office: PUNA },
{ id: "sample-naalehu-house", price: 415000, propertyType: "House", districtSlug: "kau", bedrooms: 3, bathrooms: 2, livingAreaSqFt: 1210, lotAcres: 0.88, yearBuilt: 1962, lavaZone: 6, tenure: "fee-simple", latitude: 19.0648, longitude: -155.5866, streetAddress: "5 Preview Mill Street", city: "Naalehu", postalCode: "96772", listedAt: "2026-03-25", office: HILO },
{ id: "sample-pahala-land", price: 310000, propertyType: "Land", districtSlug: "kau", lotAcres: 12, lavaZone: 3, tenure: "leasehold", latitude: 19.2036, longitude: -155.4768, streetAddress: "70 Fictional Cane Road", city: "Pahala", postalCode: "96777", listedAt: "2026-02-17", office: HILO },
{ id: "sample-laupahoehoe-house", price: 548000, propertyType: "House", districtSlug: "north-hilo", bedrooms: 2, bathrooms: 1, livingAreaSqFt: 920, lotAcres: 0.55, yearBuilt: 1948, lavaZone: 8, tenure: "fee-simple", latitude: 19.9832, longitude: -155.2416, streetAddress: "16 Sample Point Road", city: "Laupahoehoe", postalCode: "96764", listedAt: "2026-07-14", office: HILO },
{ id: "sample-hakalau-land", price: 260000, propertyType: "Land", districtSlug: "north-hilo", lotAcres: 6.75, lavaZone: 3, tenure: "fee-simple", latitude: 19.868, longitude: -155.168, streetAddress: "150 Preview Mauka Lane", city: "Hakalau", postalCode: "96710", listedAt: "2026-01-08", office: HILO },
{ id: "sample-hilo-house", price: 649000, propertyType: "House", districtSlug: "south-hilo", bedrooms: 3, bathrooms: 2, livingAreaSqFt: 1480, lotAcres: 0.31, yearBuilt: 1971, lavaZone: 8, tenure: "fee-simple", latitude: 19.7076, longitude: -155.0834, streetAddress: "42 Sample Rainbow Road", city: "Hilo", postalCode: "96720", listedAt: "2026-10-28", photoCount: 5, office: HILO },
{ id: "sample-hilo-condo", price: 389000, propertyType: "Condo", districtSlug: "south-hilo", bedrooms: 2, bathrooms: 2, livingAreaSqFt: 1010, lotAcres: 0.04, yearBuilt: 2004, lavaZone: 8, tenure: "fee-simple", latitude: 19.7168, longitude: -155.0886, streetAddress: "3 Sample Banyan Court", city: "Hilo", postalCode: "96720", listedAt: "2026-06-30", office: HILO },
{ id: "sample-hilo-multi", price: 910000, propertyType: "Multi-family", districtSlug: "south-hilo", bedrooms: 4, bathrooms: 3, livingAreaSqFt: 2210, lotAcres: 0.28, yearBuilt: 1965, lavaZone: 8, tenure: "fee-simple", latitude: 19.6894, longitude: -155.0782, streetAddress: "88 Fictional Lanai Lane", city: "Hilo", postalCode: "96720", listedAt: "2026-04-04", office: HILO },
{ id: "sample-hilo-land", price: 225000, propertyType: "Land", districtSlug: "south-hilo", lotAcres: 4.6, lavaZone: 3, tenure: "fee-simple", latitude: 19.6388, longitude: -155.1584, streetAddress: "25 Sample Upland Road", city: "Hilo", postalCode: "96720", listedAt: "2026-09-19", office: HILO },
{ id: "sample-pepeekeo-house", price: 720000, propertyType: "House", districtSlug: "south-hilo", bedrooms: 3, bathrooms: 1.5, livingAreaSqFt: 1320, lotAcres: 0.72, yearBuilt: 1958, lavaZone: 8, tenure: "fee-simple", latitude: 19.8422, longitude: -155.1088, streetAddress: "19 Preview Garden Road", city: "Pepeekeo", postalCode: "96783", listedAt: "2026-05-27", office: HILO },
];

export const SAMPLE_PROPERTY_RECORDS: Record<string, unknown>[] = SAMPLE_ROWS.map(toResoRecord);

export const SAMPLE_LISTINGS: Listing[] = SAMPLE_PROPERTY_RECORDS.map((record) => {
  const mapped = mapResoProperty(record, SAMPLE_MAP_OPTIONS);
  if (!mapped) throw new Error(`Sample record ${String(record.ListingKey)} did not map through the RESO mapper.`);
  return mapped;
});

const BANNED = /owner|occupant|lockbox|alarm|gate code|showing instruction|seller|[\u2013\u2014]/i;
const PRIVATE_KEYS = ["PrivateRemarks", "OwnerName", "ShowingInstructions", "LockBoxType", "OccupantName"];

export function assertSampleListings(listings: Listing[]): void {
  const ids = new Set<string>();
  const today = new Date().toISOString().slice(0, 10);
  if (listings.length < 27) throw new Error("Sample feed needs at least one page of listings.");
  for (const listing of listings) {
    if (ids.has(listing.id)) throw new Error(`Duplicate sample id ${listing.id}`);
    ids.add(listing.id);
    if (listing.listingKey !== listing.id || !listing.mlsNumber?.startsWith("SAMPLE-")) {
      throw new Error(`Sample id was not mapped from ListingKey and ListingId on ${listing.id}`);
    }
    if (!listing.addressDisplayed) throw new Error(`Sample address was hidden on ${listing.id}`);
    if (!listing.districtSlug || !NEIGHBORHOODS.some((area) => area.slug === listing.districtSlug)) {
      throw new Error(`Unknown district on ${listing.id}`);
    }
    if (listing.lavaZone == null || listing.lavaZone < 1 || listing.lavaZone > 9) {
      throw new Error(`Lava zone missing on ${listing.id}`);
    }
    if (listing.latitude < 18.9 || listing.latitude > 20.28 || listing.longitude < -156.15 || listing.longitude > -154.75) {
      throw new Error(`Coordinates off the Big Island on ${listing.id}`);
    }
    if (!/Sample|Preview|Fictional/.test(listing.streetAddress)) {
      throw new Error(`Street must stay obviously fictional on ${listing.id}`);
    }
    if (!listing.office.phone.includes("555") || !listing.office.email?.endsWith(".example")) {
      throw new Error(`Office contact must stay fictional on ${listing.id}`);
    }
    if (!listing.publicRemarks.startsWith("Fictional sample listing.")) {
      throw new Error(`Remarks must identify the sample on ${listing.id}`);
    }
    const blob = JSON.stringify(listing);
    if (BANNED.test(blob)) throw new Error(`Sample copy has a banned phrase on ${listing.id}`);
    if (listing.propertyType === "Land") {
      if (listing.bedrooms != null || listing.bathrooms != null || listing.livingAreaSqFt != null || listing.yearBuilt != null) {
        throw new Error(`Land listing has building facts on ${listing.id}`);
      }
    } else if (listing.bedrooms == null || listing.bathrooms == null || listing.livingAreaSqFt == null || listing.yearBuilt == null) {
      throw new Error(`Building facts missing on ${listing.id}`);
    }
    if (!listing.listedAt || listing.listedAt > today) throw new Error(`Listed date is not usable on ${listing.id}`);
    if (listing.photoUrls.length > 0 || listing.photoCount < 4) throw new Error(`Photo placeholders missing on ${listing.id}`);
  }
  for (const area of NEIGHBORHOODS) {
    const count = listings.filter((listing) => listing.districtSlug === area.slug).length;
    if (count < 2) throw new Error(`District ${area.slug} needs at least two samples`);
  }
  for (let zone = 1; zone <= 9; zone += 1) {
    if (!listings.some((listing) => listing.lavaZone === zone)) throw new Error(`Missing lava zone ${zone}`);
  }
  for (const record of SAMPLE_PROPERTY_RECORDS) {
    if (record.StandardStatus !== "Active" || typeof record.ListingKey !== "string" || typeof record.ListPrice !== "number") {
      throw new Error("Sample record is missing DD 2.0 key fields.");
    }
    for (const key of PRIVATE_KEYS) {
      if (key in record) throw new Error(`Sample record includes ${key}`);
    }
  }
}

assertSampleListings(SAMPLE_LISTINGS);
