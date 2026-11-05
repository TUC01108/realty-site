import { HIS_PAGE_SIZE, hisCountyFilter, hisCredentials, hisLavaZoneField, hisServiceRoot, hisTokenUrl } from "./his-config";
import {
  mapMediaUrl,
  mapResoProperty,
  MEDIA_FIELDS,
  OFFICE_FIELDS,
  publicResoSelect,
  type ResoMapOptions,
} from "./reso";
import type { Listing, ListingSource } from "./types";

const MAX_PAGES = 250;

type TokenCache = { token: string; expiresAt: number };
let tokenCache: TokenCache | null = null;

type ODataPage = {
  value?: unknown;
  "@odata.nextLink"?: unknown;
};

export function odataString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

export function activePropertyFilter(county: string | null): string {
  const status = "StandardStatus eq 'Active'";
  if (!county) return status;
  return `${status} and CountyOrParish eq ${odataString(county)}`;
}

export function isUsableNextLink(root: string, link: string): boolean {
  try {
    const base = new URL(root);
    const next = new URL(link);
    return next.origin === base.origin && next.pathname.startsWith(base.pathname);
  } catch {
    return false;
  }
}

export function buildCollectionUrl(root: string, resource: string, query: Record<string, string>): string {
  const url = new URL(`${root}/${resource}`);
  for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value);
  return url.toString();
}

export function createHisSource(): ListingSource {
  return {
    id: "his",
    async fetchActive() {
      const root = hisServiceRoot();
      const token = await getAccessToken();
      const options: ResoMapOptions = { lavaZoneField: hisLavaZoneField() };
      const rows = await collectRows(
        token,
        buildCollectionUrl(root, "Property", {
          $count: "true",
          $select: publicResoSelect(options),
          $filter: activePropertyFilter(hisCountyFilter()),
        }),
        root,
      );
      const enriched = await fillOffices(root, token, rows);
      const listings: Listing[] = [];
      for (const row of enriched) {
        const mapped = mapResoProperty(row, options);
        if (mapped) listings.push(mapped);
      }
      await attachMedia(root, token, listings);
      return listings;
    },
  };
}

async function getAccessToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) return tokenCache.token;
  const { clientId, clientSecret } = hisCredentials();
  const response = await fetch(hisTokenUrl(), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`HIS token request failed (${response.status}).`);
  }
  const body = (await response.json()) as { access_token?: unknown; expires_in?: unknown };
  if (typeof body.access_token !== "string" || body.access_token.length < 8) {
    throw new Error("HIS token response did not include an access_token.");
  }
  const expiresIn = typeof body.expires_in === "number" && body.expires_in > 0 ? body.expires_in : 3600;
  tokenCache = { token: body.access_token, expiresAt: Date.now() + expiresIn * 1000 };
  return body.access_token;
}

async function hisGet(url: string, token: string): Promise<ODataPage> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      Prefer: `odata.maxpagesize=${HIS_PAGE_SIZE}`,
    },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`HIS RESO request failed (${response.status}).`);
  }
  return (await response.json()) as ODataPage;
}

async function collectRows(token: string, firstUrl: string, root: string): Promise<Record<string, unknown>[]> {
  const rows: Record<string, unknown>[] = [];
  const seenLinks = new Set<string>();
  let nextUrl: string | null = firstUrl;
  let pages = 0;
  while (nextUrl) {
    if (seenLinks.has(nextUrl)) break;
    seenLinks.add(nextUrl);
    pages += 1;
    if (pages > MAX_PAGES) {
      throw new Error("HIS feed exceeded the page cap. Narrow the filter or raise the cap after checking the result count.");
    }
    const page = await hisGet(nextUrl, token);
    if (Array.isArray(page.value)) {
      for (const row of page.value) {
        if (row && typeof row === "object" && !Array.isArray(row)) rows.push(row as Record<string, unknown>);
      }
    }
    const link = typeof page["@odata.nextLink"] === "string" ? page["@odata.nextLink"] : "";
    nextUrl = link && isUsableNextLink(root, link) ? link : null;
  }
  return rows;
}

async function fillOffices(root: string, token: string, rows: Record<string, unknown>[]): Promise<Record<string, unknown>[]> {
  const keys = new Set<string>();
  for (const row of rows) {
    const phone = text(row.ListOfficePhone) || text(row.CoListOfficePhone);
    const key = text(row.ListOfficeKey);
    if (!phone && key) keys.add(key);
  }
  if (keys.size === 0) return rows;
  const offices = new Map<string, Record<string, unknown>>();
  for (const chunk of chunks([...keys], 20)) {
    const filter = chunk.map((key) => `OfficeKey eq ${odataString(key)}`).join(" or ");
    try {
      const officeRows = await collectRows(
        token,
        buildCollectionUrl(root, "Office", {
          $select: OFFICE_FIELDS.join(","),
          $filter: filter,
        }),
        root,
      );
      for (const office of officeRows) {
        const key = text(office.OfficeKey);
        if (key) offices.set(key, office);
      }
    } catch (error) {
      console.error("HIS Office lookup failed.", error instanceof Error ? error.message : "");
    }
  }
  return rows.map((row) => {
    const office = offices.get(text(row.ListOfficeKey));
    if (!office) return row;
    return {
      ...row,
      ListOfficeName: text(row.ListOfficeName) || text(office.OfficeName),
      ListOfficePhone: text(row.ListOfficePhone) || text(office.OfficePhone),
      ListOfficeEmail: text(row.ListOfficeEmail) || text(office.OfficeEmail),
    };
  });
}

async function attachMedia(root: string, token: string, listings: Listing[]): Promise<void> {
  const photos = new Map<string, { url: string; order: number; preferred: boolean }[]>();
  for (const chunk of chunks(listings.map((listing) => listing.listingKey), 15)) {
    const filter = chunk.map((key) => `ResourceRecordKey eq ${odataString(key)}`).join(" or ");
    let mediaRows: Record<string, unknown>[] = [];
    try {
      mediaRows = await collectRows(
        token,
        buildCollectionUrl(root, "Media", {
          $select: MEDIA_FIELDS.join(","),
          $filter: `(${filter}) and MediaCategory eq 'Photo'`,
        }),
        root,
      );
    } catch (error) {
      console.error("HIS Media lookup failed.", error instanceof Error ? error.message : "");
      continue;
    }
    for (const row of mediaRows) {
      const photo = mapMediaUrl(row);
      if (!photo) continue;
      const list = photos.get(photo.listingKey) ?? [];
      list.push(photo);
      photos.set(photo.listingKey, list);
    }
  }
  for (const listing of listings) {
    const list = photos.get(listing.listingKey);
    if (!list || list.length === 0) continue;
    list.sort((a, b) => Number(b.preferred) - Number(a.preferred) || a.order - b.order);
    listing.photoUrls = list.slice(0, 24).map((photo) => photo.url);
    listing.photoCount = Math.max(listing.photoCount, listing.photoUrls.length);
  }
}

function chunks<T>(items: T[], size: number): T[][] {
  const groups: T[][] = [];
  for (let index = 0; index < items.length; index += size) groups.push(items.slice(index, index + size));
  return groups;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : typeof value === "number" ? String(value) : "";
}
