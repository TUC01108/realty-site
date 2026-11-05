import { NEIGHBORHOODS } from "../../data/neighborhoods";
import { HIS_LAND_TENURE_FIELD } from "./his-config";
import type { LandTenure, Listing, PropertyType } from "./types";

// RESO Data Dictionary 2.0 Property fields used for a public IDX display.
// HIS documents ListingKey as the record key. Private fields are not listed,
// so a $select built from this array cannot ask for them.
export const PUBLIC_RESO_FIELDS = [
  "ListingKey",
  "ListingId",
  "StandardStatus",
  "ListPrice",
  "PropertyType",
  "PropertySubType",
  "BedroomsTotal",
  "BathroomsTotalInteger",
  "BathroomsFull",
  "BathroomsHalf",
  "LivingArea",
  "LotSizeAcres",
  "LotSizeSquareFeet",
  "YearBuilt",
  "Latitude",
  "Longitude",
  "UnparsedAddress",
  "City",
  "StateOrProvince",
  "PostalCode",
  "CountyOrParish",
  "PublicRemarks",
  "ListingContractDate",
  "PhotosCount",
  "ListOfficeKey",
  "ListOfficeName",
  "ListOfficePhone",
  "ListOfficeEmail",
  "CoListOfficeName",
  "CoListOfficePhone",
  "InternetAddressDisplayYN",
  HIS_LAND_TENURE_FIELD,
] as const;

export const MEDIA_FIELDS = [
  "MediaKey",
  "ResourceRecordKey",
  "ResourceName",
  "MediaCategory",
  "MediaURL",
  "Order",
  "PreferredPhotoYN",
] as const;

export const OFFICE_FIELDS = ["OfficeKey", "OfficeName", "OfficePhone", "OfficeEmail"] as const;

const SAFE_FIELD = /^[A-Za-z][A-Za-z0-9_]*$/;
const PRIVATE_FIELD = /private|owner|occupant|showing|lock|alarm|security|seller|concession|openhouse/i;

export const BIG_ISLAND_BOUNDS = {
  south: 18.9,
  north: 20.28,
  west: -156.15,
  east: -154.75,
} as const;

const CITY_TO_DISTRICT: Record<string, string> = {
  hawi: "north-kohala",
  kapaau: "north-kohala",
  waimea: "south-kohala",
  kamuela: "south-kohala",
  waikoloa: "south-kohala",
  "kailua kona": "north-kona",
  holualoa: "north-kona",
  keauhou: "north-kona",
  "captain cook": "south-kona",
  honaunau: "south-kona",
  kealakekua: "south-kona",
  honokaa: "hamakua",
  papaaloa: "hamakua",
  pahoa: "puna",
  keaau: "puna",
  volcano: "puna",
  "mountain view": "puna",
  kurtistown: "puna",
  "hawaiian paradise park": "puna",
  naalehu: "kau",
  pahala: "kau",
  "ocean view": "kau",
  "discovery harbour": "kau",
  laupahoehoe: "north-hilo",
  hakalau: "north-hilo",
  ookala: "north-hilo",
  hilo: "south-hilo",
  pepeekeo: "south-hilo",
  papaikou: "south-hilo",
};

export type ResoMapOptions = {
  lavaZoneField?: string;
  districtField?: string;
};

export function extraResoFields(options: ResoMapOptions): string[] {
  const extras: string[] = [];
  for (const name of [options.lavaZoneField, options.districtField]) {
    if (!name || !SAFE_FIELD.test(name) || PRIVATE_FIELD.test(name)) continue;
    if ((PUBLIC_RESO_FIELDS as readonly string[]).includes(name)) continue;
    if (!extras.includes(name)) extras.push(name);
  }
  return extras;
}

export function publicResoSelect(options: ResoMapOptions = {}): string {
  return [...PUBLIC_RESO_FIELDS, ...extraResoFields(options)].join(",");
}

export function mapPropertyType(propertyType: unknown, propertySubType: unknown): PropertyType | null {
  const type = asText(propertyType).toLowerCase();
  const sub = asText(propertySubType).toLowerCase();
  const blob = `${type} ${sub}`;
  if (/commercial|business opportunity|residential lease|rental/.test(blob)) return null;
  if (/condo/.test(sub)) return "Condo";
  if (/townhouse|town house/.test(sub)) return "House";
  if (/duplex|triplex|four or more|multi/.test(sub) || /residential income/.test(type)) return "Multi-family";
  if (/\bland\b|\blots?\b|unimproved|acreage|vacant/.test(blob)) return "Land";
  if (/residential|single family|manufactured|cabin/.test(blob)) return "House";
  return null;
}

export function mapResoProperty(raw: Record<string, unknown>, options: ResoMapOptions = {}): Listing | null {
  if (asText(raw.StandardStatus).toLowerCase() !== "active") return null;

  const listingKey = asText(raw.ListingKey);
  if (!listingKey || listingKey.length > 120 || /[\s/?#\\]/.test(listingKey)) return null;

  const price = asNumber(raw.ListPrice);
  if (price == null || price <= 0 || price > 500_000_000) return null;

  const propertyType = mapPropertyType(raw.PropertyType, raw.PropertySubType);
  if (!propertyType) return null;

  const latitude = asNumber(raw.Latitude);
  const longitude = asNumber(raw.Longitude);
  if (latitude == null || longitude == null) return null;
  if (
    latitude < BIG_ISLAND_BOUNDS.south ||
    latitude > BIG_ISLAND_BOUNDS.north ||
    longitude < BIG_ISLAND_BOUNDS.west ||
    longitude > BIG_ISLAND_BOUNDS.east
  ) {
    return null;
  }

  const state = asText(raw.StateOrProvince).toUpperCase();
  if (state && state !== "HI" && state !== "HAWAII") return null;

  const officeName = plain(raw.ListOfficeName, 120) || plain(raw.CoListOfficeName, 120);
  const officePhone = cleanPhone(raw.ListOfficePhone) || cleanPhone(raw.CoListOfficePhone);
  if (!officeName || !officePhone) return null;

  const land = propertyType === "Land";
  const addressDisplayed = asBool(raw.InternetAddressDisplayYN) !== false;
  const listed = asText(raw.ListingContractDate).slice(0, 10);
  const mlsNumber = plain(raw.ListingId, 40) || null;

  return {
    id: listingKey,
    listingKey,
    mlsNumber,
    status: "Active",
    price: Math.round(price),
    propertyType,
    districtSlug: mapDistrict(raw, options),
    bedrooms: land ? null : boundedInt(raw.BedroomsTotal, 0, 30),
    bathrooms: land ? null : mapBathrooms(raw),
    livingAreaSqFt: land ? null : boundedInt(raw.LivingArea, 1, 100_000),
    lotAcres: mapAcres(raw),
    yearBuilt: land ? null : boundedInt(raw.YearBuilt, 1800, 2100),
    lavaZone: mapZone(readOption(raw, options.lavaZoneField)),
    tenure: mapTenure(raw[HIS_LAND_TENURE_FIELD]),
    latitude,
    longitude,
    streetAddress: addressDisplayed ? plain(raw.UnparsedAddress, 160) : "",
    addressDisplayed,
    city: plain(raw.City, 80) || "Hawai'i Island",
    state: "HI",
    postalCode: postal(raw.PostalCode),
    publicRemarks: plain(raw.PublicRemarks, 2000),
    listedAt: /^\d{4}-\d{2}-\d{2}$/.test(listed) ? listed : null,
    photoCount: boundedInt(raw.PhotosCount, 0, 200) ?? 0,
    photoUrls: [],
    office: {
      name: officeName,
      phone: officePhone,
      email: cleanEmail(raw.ListOfficeEmail),
    },
  };
}

export function mapMediaUrl(raw: Record<string, unknown>): { listingKey: string; url: string; order: number; preferred: boolean } | null {
  if (asText(raw.MediaCategory).toLowerCase() !== "photo" && asText(raw.MediaCategory) !== "") return null;
  const listingKey = asText(raw.ResourceRecordKey);
  const url = asText(raw.MediaURL);
  if (!listingKey || !/^https?:\/\//i.test(url)) return null;
  return {
    listingKey,
    url,
    order: asNumber(raw.Order) ?? 999,
    preferred: asBool(raw.PreferredPhotoYN) === true,
  };
}

function mapBathrooms(raw: Record<string, unknown>): number | null {
  const full = boundedInt(raw.BathroomsFull, 0, 30);
  const half = boundedInt(raw.BathroomsHalf, 0, 30);
  if (full != null || half != null) {
    const total = (full ?? 0) + (half ?? 0) * 0.5;
    return total > 0 ? total : null;
  }
  const integer = boundedInt(raw.BathroomsTotalInteger, 1, 30);
  return integer;
}

function mapAcres(raw: Record<string, unknown>): number | null {
  const acres = boundedNumber(raw.LotSizeAcres, 0, 100_000);
  if (acres != null && acres > 0) return Math.round(acres * 1000) / 1000;
  const sqft = boundedNumber(raw.LotSizeSquareFeet, 1, 5_000_000_000);
  if (sqft == null) return null;
  return Math.round((sqft / 43560) * 1000) / 1000;
}

function readOption(raw: Record<string, unknown>, field: string | undefined): unknown {
  if (!field || !SAFE_FIELD.test(field) || PRIVATE_FIELD.test(field)) return undefined;
  return raw[field];
}

export function mapDistrict(raw: Record<string, unknown>, options: ResoMapOptions): string | null {
  const fromField = normalizePlace(asText(readOption(raw, options.districtField)));
  const fromCity = normalizePlace(asText(raw.City));
  for (const candidate of [fromField, fromCity]) {
    if (!candidate) continue;
    const bySlug = NEIGHBORHOODS.find((area) => area.slug === candidate.replace(/\s+/g, "-"));
    if (bySlug) return bySlug.slug;
    const byName = NEIGHBORHOODS.find((area) => normalizePlace(area.name) === candidate);
    if (byName) return byName.slug;
    const byCity = CITY_TO_DISTRICT[candidate];
    if (byCity) return byCity;
  }
  return null;
}

function mapTenure(value: unknown): LandTenure | null {
  const text = asText(value).toLowerCase();
  if (!text) return null;
  if (text.includes("lease")) return "leasehold";
  if (text.includes("fee")) return "fee-simple";
  return null;
}

function mapZone(value: unknown): number | null {
  const direct = asNumber(value);
  if (direct != null && Number.isInteger(direct) && direct >= 1 && direct <= 9) return direct;
  const match = asText(value).match(/([1-9])/);
  if (!match) return null;
  return Number(match[1]);
}

function normalizePlace(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['ʻʼ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : typeof value === "number" ? String(value) : "";
}

function asNumber(value: unknown): number | null {
  const parsed = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(parsed) ? parsed : null;
}

function asBool(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  if (value === 1 || value === "1" || value === "Y" || value === "y" || value === "true") return true;
  if (value === 0 || value === "0" || value === "N" || value === "n" || value === "false") return false;
  return null;
}

function boundedInt(value: unknown, min: number, max: number): number | null {
  const parsed = asNumber(value);
  if (parsed == null) return null;
  const rounded = Math.round(parsed);
  if (rounded < min || rounded > max) return null;
  return rounded;
}

function boundedNumber(value: unknown, min: number, max: number): number | null {
  const parsed = asNumber(value);
  if (parsed == null || parsed < min || parsed > max) return null;
  return parsed;
}

function plain(value: unknown, max: number): string {
  return asText(value)
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function cleanPhone(value: unknown): string | null {
  const text = plain(value, 40);
  if (text.replace(/\D/g, "").length < 7) return null;
  return text;
}

function cleanEmail(value: unknown): string | null {
  const text = plain(value, 80);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return null;
  return text;
}

function postal(value: unknown): string {
  const match = asText(value).match(/\d{5}/);
  return match ? match[0] : "";
}
