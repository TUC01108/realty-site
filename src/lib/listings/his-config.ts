// Published HIS RESO Web API IDX endpoints. Client id and secret are never
// given defaults. DD 1.7 (/odata/ without /2.0/) is rejected on purpose.

export const HIS_IDX_SERVICE_ROOT = "https://reso.hiinfo.com/2.0/odata/IDX";
export const HIS_TOKEN_URL = "https://auth.hiinfo.com/oauth/token";
export const HIS_PAGE_SIZE = 50;

/** HIS published this Property field in the DD 2.0 changelog. */
export const HIS_LAND_TENURE_FIELD = "HIS_LandTenure";

export function hisServiceRoot(): string {
  const configured = process.env.HIS_RESO_BASE_URL?.trim();
  const root = (configured || HIS_IDX_SERVICE_ROOT).replace(/\/$/, "");
  let url: URL;
  try {
    url = new URL(root);
  } catch {
    throw new Error("HIS_RESO_BASE_URL is not a valid URL.");
  }
  if (!url.pathname.includes("/2.0/odata/")) {
    throw new Error(
      "HIS service root must use Data Dictionary 2.0 (/2.0/odata/IDX). The unversioned /odata/ root is DD 1.7 and is being disabled.",
    );
  }
  return root;
}

export function hisTokenUrl(): string {
  const configured = process.env.HIS_TOKEN_URL?.trim();
  return configured || HIS_TOKEN_URL;
}

export function hisCredentials(): { clientId: string; clientSecret: string } {
  const clientId = process.env.HIS_CLIENT_ID?.trim() ?? "";
  const clientSecret = process.env.HIS_CLIENT_SECRET?.trim() ?? "";
  if (!clientId || !clientSecret) {
    throw new Error("HIS credentials are not configured. Set HIS_CLIENT_ID and HIS_CLIENT_SECRET.");
  }
  return { clientId, clientSecret };
}

/** CountyOrParish value for Hawai'i County. Set HIS_COUNTY=off to skip this clause. */
export function hisCountyFilter(): string | null {
  const value = process.env.HIS_COUNTY;
  if (value === undefined || value.trim() === "") return "Hawaii";
  if (value.trim().toLowerCase() === "off") return null;
  return value.trim();
}

/**
 * Lava zone is not a RESO standard field, and HIS has not published the
 * DD 2.0 name. Leave this unset until $metadata names it. The sample feed
 * does not send this value to HIS.
 */
export function hisLavaZoneField(): string | undefined {
  const value = process.env.HIS_FIELD_LAVA_ZONE?.trim();
  return value || undefined;
}
