"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { NEIGHBORHOODS } from "@/data/neighborhoods";
import { districtName, formatAcres, formatCount, formatLot, formatPrice, formatRefreshedAt, listingAddress, tenureLabel } from "@/lib/listings/format";
import {
  ACRE_STOPS,
  countActiveFilters,
  EMPTY_FILTERS,
  filtersToSearch,
  inBounds,
  matchesFilters,
  PRICE_STOPS,
  PROPERTY_TYPES,
  sortListings,
  type ListingFilters,
  type MapBounds,
  type SortKey,
} from "@/lib/listings/query";
import type { Listing, ListingFeed } from "@/lib/listings/types";
import ListingMap from "./ListingMap";
import ListingOfficeBlock from "./ListingOffice";

const controlClass =
  "h-10 w-full rounded-sm border border-line bg-paper px-2 text-sm text-ink focus:border-coral focus:outline-none";

export default function SearchExperience({ feed }: { feed: ListingFeed }) {
  const [filters, setFilters] = useState<ListingFilters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortKey>("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const [mapAsked, setMapAsked] = useState(false);
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusNonce, setFocusNonce] = useState(0);
  const edited = useRef(false);
  const desktop = useSyncExternalStore(
    (onStoreChange) => {
      const media = window.matchMedia("(min-width: 1024px)");
      media.addEventListener("change", onStoreChange);
      return () => media.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => false,
  );
  const mapMounted = desktop || mapAsked;

  useEffect(() => {
    if (!edited.current) return;
    const search = filtersToSearch(filters, sort);
    window.history.replaceState(null, "", `${window.location.pathname}${search}`);
    sessionStorage.setItem("preview-search", search);
  }, [filters, sort]);

  const matched = useMemo(
    () => sortListings(feed.listings.filter((listing) => matchesFilters(listing, filters)), sort),
    [feed.listings, filters, sort],
  );
  const visible = useMemo(
    () => (bounds && mapMounted ? matched.filter((listing) => inBounds(listing, bounds)) : matched),
    [matched, bounds, mapMounted],
  );
  const fitToken = useMemo(() => JSON.stringify(filters), [filters]);
  const selected = matched.find((listing) => listing.id === selectedId) ?? null;
  const activeCount = countActiveFilters(filters);

  function update(partial: Partial<ListingFilters>) {
    edited.current = true;
    setBounds(null);
    setFilters((current) => ({ ...current, ...partial }));
  }

  function showOnMap(id: string) {
    setSelectedId(id);
    setFocusNonce((nonce) => nonce + 1);
    setMapAsked(true);
    setMobileView("map");
  }

  function selectFromMarker(id: string) {
    setSelectedId(id);
    if (window.matchMedia("(min-width: 1024px)").matches) {
      document.getElementById(`listing-card-${id}`)?.scrollIntoView({ block: "nearest" });
    }
  }

  const countLabel = `${visible.length} ${feed.sourceId === "sample" ? "sample " : ""}${visible.length === 1 ? "listing" : "listings"}${mapMounted ? " in this map area" : ""}`;

  return (
    <div className="bg-paper lg:grid lg:grid-cols-[minmax(340px,440px)_minmax(0,1fr)] lg:items-start">
      <div className={`${mobileView === "map" ? "hidden" : "flex flex-col"} lg:sticky lg:top-40 lg:flex lg:h-[calc(100dvh-11rem)] lg:flex-col`}>
        <div className="border-b hairline px-6 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-2xl text-ink">Sample listings</p>
              <p className="mt-1 text-sm text-ink">
                {feed.sourceId === "sample" ? "Sample data" : "HIS feed"} last loaded {formatRefreshedAt(feed.fetchedAt)} HST. Refresh cycle is 12 hours.
              </p>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-sm border border-coral px-4 py-2 text-sm font-medium text-coral lg:hidden"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((open) => !open)}
            >
              Filters{activeCount > 0 ? ` (${activeCount})` : ""}
            </button>
          </div>
        </div>
        <div className={`${filtersOpen ? "block" : "hidden"} border-b hairline lg:block`}>
          <FilterBar filters={filters} onChange={update} onClear={() => update(EMPTY_FILTERS)} activeCount={activeCount} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b hairline px-6 py-3">
          <p className="text-sm text-ink" aria-live="polite">{countLabel}. Move the map to narrow the list.</p>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-ink" htmlFor="listing-sort">
              Sort
              <select
                id="listing-sort"
                className="h-10 rounded-sm border border-line bg-paper px-2 text-sm"
                value={sort}
                onChange={(event) => {
                  edited.current = true;
                  setSort(event.target.value as SortKey);
                }}
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price, low to high</option>
                <option value="price-desc">Price, high to low</option>
                <option value="lot-desc">Largest lot</option>
              </select>
            </label>
            <button
              type="button"
              className="rounded-sm bg-coral px-3 py-2 text-sm text-paper lg:hidden"
              onClick={() => {
                setMapAsked(true);
                setMobileView("map");
              }}
            >
              Map
            </button>
          </div>
        </div>
        {visible.length === 0 ? (
          <p className="px-6 py-10 text-sm text-ink">
            {matched.length === 0
              ? "No sample listings match these filters."
              : "No sample listings in this map area. Zoom out or clear a filter."}
          </p>
        ) : (
          <ul className="divide-y divide-line lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
            {visible.map((listing) => (
              <li key={listing.id}>
                <ListingCard
                  listing={listing}
                  selected={listing.id === selectedId}
                  onSelect={() => showOnMap(listing.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={`${mobileView === "map" ? "block" : "hidden"} lg:sticky lg:top-40 lg:block lg:h-[calc(100dvh-11rem)]`}>
        <div className="flex items-center justify-between border-b hairline px-4 py-2 lg:hidden">
          <p className="text-sm text-ink">{countLabel}</p>
          <button type="button" className="rounded-sm border border-coral px-3 py-2 text-sm text-coral" onClick={() => setMobileView("list")}>List</button>
        </div>
        <div id="listing-map-panel" className="relative h-[72dvh] lg:h-full">
          {mapMounted ? (
            <ListingMap
              listings={matched}
              selectedId={selectedId}
              onSelect={selectFromMarker}
              onBounds={setBounds}
              fitToken={fitToken}
              layoutKey={`${mobileView}-${desktop ? "desktop" : "mobile"}`}
              focusNonce={focusNonce}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-sand text-sm text-ink">Open the map to browse by area.</div>
          )}
          {selected && mobileView === "map" && (
            <div className="absolute bottom-4 left-3 right-20 z-10 rounded-sm border border-line bg-paper p-3 shadow lg:hidden">
              <p className="font-display text-xl">{formatPrice(selected.price)}</p>
              <p className="mt-1 text-sm text-ink">{listingAddress(selected)}</p>
              <p className="mt-2 text-sm font-medium text-ink">{selected.office.name}</p>
              <p className="text-sm text-ink">{selected.office.phone}</p>
              <Link href={`/preview/search/${encodeURIComponent(selected.id)}`} className="mt-2 inline-block text-sm font-medium text-coral">
                View sample listing
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterBar({
  filters,
  onChange,
  onClear,
  activeCount,
}: {
  filters: ListingFilters;
  onChange: (partial: Partial<ListingFilters>) => void;
  onClear: () => void;
  activeCount: number;
}) {
  return (
    <div className="px-6 py-4">
      <div className="grid grid-cols-2 gap-3">
        <Select label="Min price" value={filters.minPrice} options={PRICE_STOPS} format={formatPrice} empty="No min" onChange={(value) => onChange({ minPrice: value })} />
        <Select label="Max price" value={filters.maxPrice} options={PRICE_STOPS} format={formatPrice} empty="No max" onChange={(value) => onChange({ maxPrice: value })} />
        <Select label="Beds" value={filters.minBeds} options={[1, 2, 3, 4, 5]} format={(value) => `${value}+`} empty="Any" onChange={(value) => onChange({ minBeds: value })} />
        <Select label="Baths" value={filters.minBaths} options={[1, 2, 3, 4]} format={(value) => `${value}+`} empty="Any" onChange={(value) => onChange({ minBaths: value })} />
        <label className="flex flex-col gap-1 text-sm text-ink" htmlFor="filter-type">
          Type
          <select id="filter-type" className={controlClass} value={filters.propertyType} onChange={(event) => onChange({ propertyType: event.target.value as ListingFilters["propertyType"] })}>
            <option value="any">Any</option>
            {PROPERTY_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink" htmlFor="filter-district">
          District
          <select id="filter-district" className={controlClass} value={filters.districtSlug} onChange={(event) => onChange({ districtSlug: event.target.value })}>
            <option value="any">All districts</option>
            {NEIGHBORHOODS.map((area) => <option key={area.slug} value={area.slug}>{area.name}</option>)}
          </select>
        </label>
        <Select label="Min lot" value={filters.minAcres} options={ACRE_STOPS} format={(value) => `${formatAcres(value)}+`} empty="Any size" onChange={(value) => onChange({ minAcres: value })} />
        <label className="flex flex-col gap-1 text-sm text-ink" htmlFor="filter-tenure">
          Land tenure
          <select id="filter-tenure" className={controlClass} value={filters.tenure} onChange={(event) => onChange({ tenure: event.target.value as ListingFilters["tenure"] })}>
            <option value="any">Any</option>
            <option value="fee-simple">Fee simple</option>
            <option value="leasehold">Leasehold</option>
          </select>
        </label>
      </div>
      <fieldset className="mt-4">
        <legend className="text-sm text-ink">Lava zone</legend>
        <p className="mt-1 text-sm text-ink/80">USGS zones. Zone 1 is the highest hazard and zone 9 is the lowest. Leave them all off to include every zone.</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={filters.lavaZones.length === 0}
            className={`rounded-sm border px-3 py-1.5 text-sm ${filters.lavaZones.length === 0 ? "border-coral bg-coral text-paper" : "border-line text-ink"}`}
            onClick={() => onChange({ lavaZones: [] })}
          >
            Any zone
          </button>
          {Array.from({ length: 9 }, (_, index) => index + 1).map((zone) => {
            const on = filters.lavaZones.includes(zone);
            return (
              <button
                key={zone}
                type="button"
                aria-pressed={on}
                className={`rounded-sm border px-3 py-1.5 text-sm ${on ? "border-coral bg-coral text-paper" : "border-line text-ink"}`}
                onClick={() => {
                  const lavaZones = on
                    ? filters.lavaZones.filter((item) => item !== zone)
                    : [...filters.lavaZones, zone].sort((a, b) => a - b);
                  onChange({ lavaZones });
                }}
              >
                {zone}
              </button>
            );
          })}
        </div>
      </fieldset>
      {activeCount > 0 && (
        <button type="button" className="mt-3 text-sm font-medium text-coral" onClick={onClear}>Clear filters</button>
      )}
    </div>
  );
}

function Select<T extends number>({
  label,
  value,
  options,
  format,
  empty,
  onChange,
}: {
  label: string;
  value: T | null;
  options: readonly T[];
  format: (value: T) => string;
  empty: string;
  onChange: (value: T | null) => void;
}) {
  const id = `filter-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <label className="flex flex-col gap-1 text-sm text-ink" htmlFor={id}>
      {label}
      <select
        id={id}
        className={controlClass}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value === "" ? null : (Number(event.target.value) as T))}
      >
        <option value="">{empty}</option>
        {options.map((option) => (
          <option key={option} value={option}>{format(option)}</option>
        ))}
      </select>
    </label>
  );
}

function ListingCard({ listing, selected, onSelect }: { listing: Listing; selected: boolean; onSelect: () => void }) {
  const facts = [
    listing.bedrooms != null ? `${formatCount(listing.bedrooms)} bd` : null,
    listing.bathrooms != null ? `${formatCount(listing.bathrooms)} ba` : null,
    formatLot(listing.lotAcres),
  ].filter(Boolean);
  return (
    <article
      id={`listing-card-${listing.id}`}
      className={`px-6 py-5 ${selected ? "bg-sand ring-2 ring-inset ring-coral" : "bg-paper"}`}
    >
      <Link href={`/preview/search/${encodeURIComponent(listing.id)}`} className="block">
        <div className="flex h-36 items-end rounded-sm bg-sand p-3" style={{ background: "repeating-linear-gradient(135deg, #f7f4f0 0 14px, #ffffff 14px 28px)" }}>
          <span className="rounded-sm bg-paper/90 px-2 py-1 text-xs text-ink">Sample photo</span>
        </div>
        <p className="mt-3 font-display text-2xl text-ink">{formatPrice(listing.price)}</p>
        <p className="mt-1 text-sm text-ink">{listingAddress(listing)}</p>
      </Link>
      <p className="mt-2 text-sm text-ink">
        {districtName(listing.districtSlug)} · {listing.propertyType} · {tenureLabel(listing.tenure)}
      </p>
      <p className="mt-1 text-sm text-ink">{facts.join(" · ")}</p>
      <p className="mt-1 text-sm text-ink">{listing.lavaZone == null ? "Lava zone not in feed" : `Lava zone ${listing.lavaZone}`}</p>
      <div className="mt-3">
        <ListingOfficeBlock office={listing.office} compact />
      </div>
      <div className="mt-3 flex flex-wrap gap-4">
        <button type="button" className="text-sm font-medium text-coral" onClick={onSelect}>Show on map</button>
        <Link href={`/preview/search/${encodeURIComponent(listing.id)}`} className="text-sm font-medium text-coral">View sample listing</Link>
      </div>
    </article>
  );
}
