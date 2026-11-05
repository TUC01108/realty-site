# Your Big Island Real Estate

Website for Yordana Bolanos Salas at Coldwell Banker Island Properties.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. `npm test` checks the listing mapper and filters. `npm run lint` and `npm run build` cover the Next.js app.

## Listing preview (sample data)

Live MLS search is not public yet. The map and list at `/preview/search` are a preview. The route is not in the header, `robots.txt` disallows `/preview`, the pages send `noindex`, and `sitemap.ts` leaves them out. The public Home Search page is still the request form.

The listings on that route are fictional. They are not copied from Hawaii Information Service or hiinfo.com.

### Adapter

`src/lib/listings/reso.ts` is the only place a feed record becomes a listing the UI can render. Sample rows in `sample-listings.ts` are already RESO Data Dictionary 2.0 Property records (`ListingKey`, `StandardStatus`, `ListPrice`, `PropertyType`, `PropertySubType`, bathrooms, living area, lot size, office fields, `InternetAddressDisplayYN`, and `HIS_LandTenure`). `mapResoProperty` maps those records, and the HIS client maps the same way. The React pages take the mapped `Listing` type and do not know which source filled it.

`LISTING_SOURCE` chooses the source. The default is `sample`. Set it to `his` only after credentials exist.

The mapper reads a public field list. It does not read private remarks, owner or occupant names, showing instructions, lockbox data, or alarm data. `InternetAddressDisplayYN: false` clears the street address. Listings without a listing firm name and phone are dropped. OpenHouse is not requested, because that resource can carry showing instructions. Member is not requested. Office is requested only when a property has `ListOfficeKey` and no phone. Media photos are attached from `MediaURL` when that request succeeds.

### Plug in the HIS feed

HIS calls this product RESO Web API IDX. Use Data Dictionary 2.0 only. Docs: https://www.hawaiiinformation.com/reso-web-api-documentation/

| Setting | Value |
| --- | --- |
| `LISTING_SOURCE` | `his` |
| `HIS_CLIENT_ID` | From HIS. No default. |
| `HIS_CLIENT_SECRET` | From HIS. No default. |
| `HIS_RESO_BASE_URL` | Optional. Default `https://reso.hiinfo.com/2.0/odata/IDX` |
| `HIS_TOKEN_URL` | Optional. Default `https://auth.hiinfo.com/oauth/token` |
| `HIS_COUNTY` | Optional. Default `Hawaii` (Hawai'i County). Set `off` to skip the county clause. |
| `HIS_FIELD_LAVA_ZONE` | Optional. Set after `$metadata` names the lava field. |
| `CRON_SECRET` | Bearer token for the refresh route. Vercel Cron sends this for you when the variable is set. |

Do not point the base URL at `https://reso.hiinfo.com/odata/` (no `2.0`). That is Data Dictionary 1.7 and HIS is disabling it in 2026. The client rejects a root that is missing `/2.0/odata/`.

Auth is the OAuth 2.0 client credentials grant. The client POSTs `grant_type`, `client_id`, and `client_secret` as `application/x-www-form-urlencoded` and caches the bearer token until `expires_in` (HIS documents one hour). Queries are OData 4.0 and ask for JSON. HIS returns 50 records per page and a full `@odata.nextLink` with a skiptoken. The client follows that link and does not use `$skip`. Resources in use are Property, Office, and Media. Lookup and `$metadata` are available at the same root once credentials work (`/2.0/odata/IDX/$metadata` and `/2.0/odata/IDX/Lookup`). Use Lookup to confirm `CountyOrParish` and the lava zone field name before relying on those filters.

`HIS_LandTenure` is a published HIS field (single value in DD 2.0). Lava zone is not a RESO standard field, and the public DD 2.0 change list does not name it. Sample rows use a local `HIS_LavaZone` value so the preview filter works. That name is not sent to HIS. After you can read `$metadata`, set `HIS_FIELD_LAVA_ZONE` to the real property name.

If a `$select` field is rejected, compare it with `$metadata` and drop the unknown name from `PUBLIC_RESO_FIELDS` in `reso.ts`. The UI does not need a change.

### Refresh

The feed is cached for 12 hours (`LISTING_REFRESH_SECONDS` and `unstable_cache`). `/api/listings/refresh` expires that cache and reads the source again. `vercel.json` schedules it at `0 */12 * * *`. The route requires `Authorization: Bearer $CRON_SECRET`.

On a host plan that only allows a daily cron, the 12 hour cache lifetime still refreshes the feed on the next visit after it expires. A plan that allows the schedule above refreshes it every 12 hours even when the site is quiet.

### Map

The map is MapLibre GL JS with the OpenFreeMap Positron style (`https://tiles.openfreemap.org/styles/positron`). OpenFreeMap allows commercial use, does not require an API key, and does not charge for map views. MapLibre adds the required OpenFreeMap / OpenMapTiles / OpenStreetMap attribution. The service is provided as-is and can change. Self-hosting OpenFreeMap is the fallback if the public instance is not a fit later. No tile key or tile budget is required for the current setup.

The content security policy stays report-only, with `X-Frame-Options: DENY`. The preview map adds `https://tiles.openfreemap.org` to `img-src` and `connect-src`, and `blob:` to `worker-src` and `child-src`, because MapLibre loads tiles from that host and starts its worker from a blob URL. Photo URLs from HIS Media are not allowed yet. When the first `MediaURL` host is known, add that host to `img-src` and nowhere else.

### Still required before this is a public IDX display

- Principal broker approval and the HIS IDX license.
- The official HIS IDX logo file, and the disclaimer text HIS requires, in place of the placeholder.
- A check of `$metadata` against `PUBLIC_RESO_FIELDS`, plus the real lava zone field and the `CountyOrParish` value for the Big Island.
- `HIS_CLIENT_ID`, `HIS_CLIENT_SECRET`, and `CRON_SECRET` in the host environment.
- The Media image host added to `img-src` after you see a real `MediaURL`.
- A broker review that each listing shows the listing firm and a readable phone or email, that seller and occupant names are absent, and that showing instructions and security fields are absent.
- The decision to link the search from the public nav and remove the preview noindex rules. Until that review, keep it at `/preview/search`.
