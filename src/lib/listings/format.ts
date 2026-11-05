import { NEIGHBORHOODS } from "../../data/neighborhoods";
import type { LandTenure, Listing } from "./types";

export function districtName(slug: string | null): string {
  if (!slug) return "Hawai'i Island";
  return NEIGHBORHOODS.find((area) => area.slug === slug)?.name ?? "Hawai'i Island";
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPriceShort(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    const digits = value % 100_000 === 0 ? 1 : 2;
    const text = millions.toFixed(digits).replace(/\.0$/, "");
    return `$${text}M`;
  }
  if (value >= 1_000) {
    return `$${Math.round(value / 1_000)}k`;
  }
  return formatPrice(value);
}

export function formatAcres(acres: number): string {
  const amount = acres.toFixed(2).replace(/\.?0+$/, "");
  return `${amount} ${acres === 1 ? "acre" : "acres"}`;
}

export function formatLot(acres: number | null): string {
  if (acres == null) return "Not in feed";
  if (acres < 1) {
    const sqft = Math.round(acres * 43560).toLocaleString("en-US");
    return `${formatAcres(acres)} (${sqft} sq ft)`;
  }
  return formatAcres(acres);
}

export function formatCount(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function tenureLabel(tenure: LandTenure | null): string {
  if (tenure === "fee-simple") return "Fee simple";
  if (tenure === "leasehold") return "Leasehold";
  return "Not in feed";
}

export function formatListedDate(iso: string): string {
  const date = new Date(`${iso.slice(0, 10)}T12:00:00Z`);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Pacific/Honolulu",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatRefreshedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Pacific/Honolulu",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function listingCityLine(listing: Listing): string {
  const stateZip = [listing.state, listing.postalCode].filter(Boolean).join(" ");
  return [listing.city, stateZip].filter(Boolean).join(", ");
}

export function listingAddress(listing: Listing): string {
  if (!listing.addressDisplayed || !listing.streetAddress) return listingCityLine(listing);
  return `${listing.streetAddress}, ${listingCityLine(listing)}`;
}
