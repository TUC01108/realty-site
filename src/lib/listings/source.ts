import { createHisSource } from "./his-source";
import { createSampleSource } from "./sample-source";
import type { ListingSource } from "./types";

export function getListingSource(): ListingSource {
  const choice = (process.env.LISTING_SOURCE ?? "sample").trim().toLowerCase();
  if (choice === "" || choice === "sample") return createSampleSource();
  if (choice === "his") return createHisSource();
  throw new Error(`Unknown LISTING_SOURCE "${choice}". Use "sample" or "his".`);
}
