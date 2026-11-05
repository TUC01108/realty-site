import { SAMPLE_LISTINGS } from "./sample-listings";
import type { ListingSource } from "./types";

export function createSampleSource(): ListingSource {
  return {
    id: "sample",
    async fetchActive() {
      return SAMPLE_LISTINGS;
    },
  };
}
