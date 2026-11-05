import { NEIGHBORHOODS } from "../../data/neighborhoods";
import type { LandTenure, Listing, PropertyType } from "./types";

export type SortKey = "newest" | "price-asc" | "price-desc" | "lot-desc";

export type ListingFilters = {
  minPrice: number | null;
  maxPrice: number | null;
  minBeds: number | null;
  minBaths: number | null;
  propertyType: PropertyType | "any";
  districtSlug: string | "any";
  minAcres: number | null;
  lavaZones: number[];
  tenure: LandTenure | "any";
};

export type MapBounds = {
  west: number;
  south: number;
  east: number;
  north: number;
};

export const EMPTY_FILTERS: ListingFilters = {
  minPrice: null,
  maxPrice: null,
  minBeds: null,
  minBaths: null,
  propertyType: "any",
  districtSlug: "any",
  minAcres: null,
  lavaZones: [],
  tenure: "any",
};

export const PRICE_STOPS = [250000, 400000, 600000, 800000, 1000000, 1500000, 2000000, 3000000, 5000000] as const;
export const ACRE_STOPS = [0.25, 0.5, 1, 2, 5, 10, 20] as const;
export const PROPERTY_TYPES: PropertyType[] = ["House", "Condo", "Land", "Multi-family"];

const SORTS = new Set<SortKey>(["newest", "price-asc", "price-desc", "lot-desc"]);
const TENURES = new Set<LandTenure>(["fee-simple", "leasehold"]);
const DISTRICT_SLUGS = new Set(NEIGHBORHOODS.map((area) => area.slug));

function oneOf<T extends number>(value: string | null, allowed: readonly T[]): T | null {
  if (!value) return null;
  const parsed = Number(value);
  return allowed.some((item) => item === parsed) ? (parsed as T) : null;
}

export function parseListingSearch(search: string): { filters: ListingFilters; sort: SortKey } {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const type = params.get("type");
  const district = params.get("district");
  const tenure = params.get("tenure");
  const sort = params.get("sort");
  const zones = (params.get("zones") ?? "")
    .split(",")
    .map((part) => Number(part))
    .filter((zone) => Number.isInteger(zone) && zone >= 1 && zone <= 9);
  return {
    filters: {
      minPrice: oneOf(params.get("min"), PRICE_STOPS),
      maxPrice: oneOf(params.get("max"), PRICE_STOPS),
      minBeds: oneOf(params.get("beds"), [1, 2, 3, 4, 5]),
      minBaths: oneOf(params.get("baths"), [1, 2, 3, 4]),
      propertyType: PROPERTY_TYPES.includes(type as PropertyType) ? (type as PropertyType) : "any",
      districtSlug: district && DISTRICT_SLUGS.has(district) ? district : "any",
      minAcres: oneOf(params.get("acres"), ACRE_STOPS),
      lavaZones: [...new Set(zones)].sort((a, b) => a - b),
      tenure: tenure && TENURES.has(tenure as LandTenure) ? (tenure as LandTenure) : "any",
    },
    sort: sort && SORTS.has(sort as SortKey) ? (sort as SortKey) : "newest",
  };
}

export function filtersToSearch(filters: ListingFilters, sort: SortKey): string {
  const params = new URLSearchParams();
  if (filters.minPrice != null) params.set("min", String(filters.minPrice));
  if (filters.maxPrice != null) params.set("max", String(filters.maxPrice));
  if (filters.minBeds != null) params.set("beds", String(filters.minBeds));
  if (filters.minBaths != null) params.set("baths", String(filters.minBaths));
  if (filters.propertyType !== "any") params.set("type", filters.propertyType);
  if (filters.districtSlug !== "any") params.set("district", filters.districtSlug);
  if (filters.minAcres != null) params.set("acres", String(filters.minAcres));
  if (filters.lavaZones.length > 0) params.set("zones", filters.lavaZones.join(","));
  if (filters.tenure !== "any") params.set("tenure", filters.tenure);
  if (sort !== "newest") params.set("sort", sort);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function countActiveFilters(filters: ListingFilters): number {
  let count = 0;
  if (filters.minPrice != null) count += 1;
  if (filters.maxPrice != null) count += 1;
  if (filters.minBeds != null) count += 1;
  if (filters.minBaths != null) count += 1;
  if (filters.propertyType !== "any") count += 1;
  if (filters.districtSlug !== "any") count += 1;
  if (filters.minAcres != null) count += 1;
  if (filters.lavaZones.length > 0) count += 1;
  if (filters.tenure !== "any") count += 1;
  return count;
}

export function matchesFilters(listing: Listing, filters: ListingFilters): boolean {
  if (filters.minPrice != null && listing.price < filters.minPrice) return false;
  if (filters.maxPrice != null && listing.price > filters.maxPrice) return false;
  if (filters.minBeds != null && (listing.bedrooms == null || listing.bedrooms < filters.minBeds)) return false;
  if (filters.minBaths != null && (listing.bathrooms == null || listing.bathrooms < filters.minBaths)) return false;
  if (filters.propertyType !== "any" && listing.propertyType !== filters.propertyType) return false;
  if (filters.districtSlug !== "any" && listing.districtSlug !== filters.districtSlug) return false;
  if (filters.minAcres != null && (listing.lotAcres == null || listing.lotAcres < filters.minAcres)) return false;
  if (filters.lavaZones.length > 0 && (listing.lavaZone == null || !filters.lavaZones.includes(listing.lavaZone))) {
    return false;
  }
  if (filters.tenure !== "any" && listing.tenure !== filters.tenure) return false;
  return true;
}

export function inBounds(listing: Listing, bounds: MapBounds): boolean {
  const latitudeOk = listing.latitude >= bounds.south && listing.latitude <= bounds.north;
  const longitudeOk =
    bounds.west <= bounds.east
      ? listing.longitude >= bounds.west && listing.longitude <= bounds.east
      : listing.longitude >= bounds.west || listing.longitude <= bounds.east;
  return latitudeOk && longitudeOk;
}

export function sortListings(listings: Listing[], sort: SortKey): Listing[] {
  const copy = [...listings];
  copy.sort((a, b) => {
    const delta = compareListings(a, b, sort);
    return delta === 0 ? a.id.localeCompare(b.id) : delta;
  });
  return copy;
}

function compareListings(a: Listing, b: Listing, sort: SortKey): number {
  if (sort === "price-asc") return a.price - b.price;
  if (sort === "price-desc") return b.price - a.price;
  if (sort === "lot-desc") return (b.lotAcres ?? -1) - (a.lotAcres ?? -1);
  const aTime = a.listedAt ? Date.parse(a.listedAt) : 0;
  const bTime = b.listedAt ? Date.parse(b.listedAt) : 0;
  return bTime - aTime;
}
