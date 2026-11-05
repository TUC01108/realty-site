// Public listing shape shared by the sample feed and a future HIS feed.
// Private IDX fields (seller, occupant, showing instructions, lockbox,
// alarm, gate codes) are intentionally absent so the UI cannot render them.

export const LISTING_REFRESH_SECONDS = 43200;

export type PropertyType = "House" | "Condo" | "Land" | "Multi-family";
export type LandTenure = "fee-simple" | "leasehold";
export type ListingStatus = "Active";
export type ListingSourceId = "sample" | "his";

export type ListingOffice = {
  name: string;
  phone: string;
  email: string | null;
};

export type Listing = {
  /** RESO ListingKey. This is the route id. */
  id: string;
  listingKey: string;
  /** RESO ListingId, the MLS number, when the feed provides one. */
  mlsNumber: string | null;
  status: ListingStatus;
  price: number;
  propertyType: PropertyType;
  districtSlug: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  livingAreaSqFt: number | null;
  lotAcres: number | null;
  yearBuilt: number | null;
  lavaZone: number | null;
  tenure: LandTenure | null;
  latitude: number;
  longitude: number;
  streetAddress: string;
  /** False when InternetAddressDisplayYN is false. */
  addressDisplayed: boolean;
  city: string;
  state: "HI";
  postalCode: string;
  publicRemarks: string;
  listedAt: string | null;
  photoCount: number;
  photoUrls: string[];
  office: ListingOffice;
};

export type ListingFeed = {
  sourceId: ListingSourceId;
  fetchedAt: string;
  listings: Listing[];
};

export interface ListingSource {
  readonly id: ListingSourceId;
  fetchActive(): Promise<Listing[]>;
}
