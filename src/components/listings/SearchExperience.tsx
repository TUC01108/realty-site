"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { NEIGHBORHOODS } from "@/data/neighborhoods";
import {
  districtName,
  formatAcres,
  formatPrice,
  isNewListing,
  listingAddress,
  listingFacts,
} from "@/lib/listings/format";
import {
  ACRE_STOPS,
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

const PHOTO = "repeating-linear-gradient(135deg, #f7f4f0 0 12px, #ffffff 12px 24px)";

export default function SearchExperience({ feed }: { feed: ListingFeed }) {
  const [filters, setFilters] = useState<ListingFilters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortKey>("newest");
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const edited = useRef(false);

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
    () => (bounds ? matched.filter((listing) => inBounds(listing, bounds)) : matched),
    [matched, bounds],
  );
  const fitToken = useMemo(() => JSON.stringify(filters), [filters]);
  const highlightedId = hoveredId ?? selectedId;
  const heading = filters.districtSlug === "any"
    ? "Hawai'i Island Homes For Sale"
    : `${districtName(filters.districtSlug)} Homes For Sale`;

  function update(partial: Partial<ListingFilters>) {
    edited.current = true;
    setBounds(null);
    setFilters((current) => ({ ...current, ...partial }));
  }

  return (
    <div className="bg-paper">
      <div className="border-b hairline bg-paper px-4 py-3 lg:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="sr-only" htmlFor="listing-search">Search listings</label>
          <input
            id="listing-search"
            value={filters.text}
            onChange={(event) => update({ text: event.target.value })}
            placeholder="City, address, or ZIP"
            className="h-10 w-full rounded-full border border-line bg-paper px-4 text-sm text-ink focus:border-coral focus:outline-none lg:max-w-xs"
          />
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Menu label="For sale">
              <p className="text-sm text-ink">These preview listings are active and for sale.</p>
            </Menu>
            <Menu label="Price" active={filters.minPrice != null || filters.maxPrice != null}>
              <div className="grid gap-3">
                <RangeSelect label="Min price" value={filters.minPrice} options={PRICE_STOPS} format={formatPrice} empty="No min" onChange={(minPrice) => update({ minPrice })} />
                <RangeSelect label="Max price" value={filters.maxPrice} options={PRICE_STOPS} format={formatPrice} empty="No max" onChange={(maxPrice) => update({ maxPrice })} />
              </div>
            </Menu>
            <Menu label="Beds & baths" active={filters.minBeds != null || filters.minBaths != null}>
              <div className="grid gap-3">
                <RangeSelect label="Beds" value={filters.minBeds} options={[1, 2, 3, 4, 5]} format={(value) => `${value}+`} empty="Any" onChange={(minBeds) => update({ minBeds })} />
                <RangeSelect label="Baths" value={filters.minBaths} options={[1, 2, 3, 4]} format={(value) => `${value}+`} empty="Any" onChange={(minBaths) => update({ minBaths })} />
              </div>
            </Menu>
            <Menu label="Property type" active={filters.propertyType !== "any"}>
              <div className="grid gap-2">
                <TypeOption label="Any" checked={filters.propertyType === "any"} onChange={() => update({ propertyType: "any" })} />
                {PROPERTY_TYPES.map((type) => (
                  <TypeOption key={type} label={type} checked={filters.propertyType === type} onChange={() => update({ propertyType: type })} />
                ))}
              </div>
            </Menu>
            <Menu
              label="More filters"
              active={filters.districtSlug !== "any" || filters.minAcres != null || filters.tenure !== "any" || filters.lavaZones.length > 0}
            >
              <div className="grid w-72 gap-3">
                <label className="grid gap-1 text-sm text-ink">
                  District
                  <select className="h-10 rounded-sm border border-line px-2" value={filters.districtSlug} onChange={(event) => update({ districtSlug: event.target.value })}>
                    <option value="any">All districts</option>
                    {NEIGHBORHOODS.map((area) => <option key={area.slug} value={area.slug}>{area.name}</option>)}
                  </select>
                </label>
                <RangeSelect label="Min lot" value={filters.minAcres} options={ACRE_STOPS} format={(value) => `${formatAcres(value)}+`} empty="Any size" onChange={(minAcres) => update({ minAcres })} />
                <label className="grid gap-1 text-sm text-ink">
                  Land tenure
                  <select className="h-10 rounded-sm border border-line px-2" value={filters.tenure} onChange={(event) => update({ tenure: event.target.value as ListingFilters["tenure"] })}>
                    <option value="any">Any</option>
                    <option value="fee-simple">Fee simple</option>
                    <option value="leasehold">Leasehold</option>
                  </select>
                </label>
                <fieldset>
                  <legend className="text-sm text-ink">Lava zone</legend>
                  <p className="mt-1 text-xs leading-relaxed text-ink">Zone 1 is the highest hazard and zone 9 is the lowest.</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {Array.from({ length: 9 }, (_, index) => index + 1).map((zone) => {
                      const on = filters.lavaZones.includes(zone);
                      return (
                        <button
                          key={zone}
                          type="button"
                          aria-pressed={on}
                          className={`h-8 w-8 rounded-sm border text-sm ${on ? "border-coral bg-coral text-paper" : "border-line text-ink"}`}
                          onClick={() => {
                            const lavaZones = on
                              ? filters.lavaZones.filter((item) => item !== zone)
                              : [...filters.lavaZones, zone].sort((a, b) => a - b);
                            update({ lavaZones });
                          }}
                        >
                          {zone}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
                <button type="button" className="text-left text-sm font-medium text-coral" onClick={() => update(EMPTY_FILTERS)}>Clear filters</button>
              </div>
            </Menu>
            <div className="ml-auto flex shrink-0 rounded-full border border-line lg:hidden">
              <button type="button" className={`px-3 py-2 text-sm ${mobileView === "list" ? "bg-coral text-paper" : "text-ink"}`} onClick={() => setMobileView("list")}>List</button>
              <button type="button" className={`px-3 py-2 text-sm ${mobileView === "map" ? "bg-coral text-paper" : "text-ink"}`} onClick={() => setMobileView("map")}>Map</button>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:items-start">
        <div className={`${mobileView === "map" ? "block h-[72dvh]" : "hidden"} lg:sticky lg:top-40 lg:block lg:h-[calc(100dvh-11rem)]`}>
          <ListingMap
            listings={matched}
            highlightedId={highlightedId}
            selectedId={selectedId}
            onHover={setHoveredId}
            onSelect={setSelectedId}
            onBounds={setBounds}
            fitToken={fitToken}
            layoutKey={mobileView}
          />
        </div>
        <div className={`${mobileView === "list" ? "block" : "hidden"} lg:block`}>
          <div className="flex flex-wrap items-end justify-between gap-3 px-4 py-4 lg:px-6">
            <div>
              <h1 className="font-display text-2xl text-ink lg:text-3xl">{heading}</h1>
              <p className="mt-1 text-sm text-ink" aria-live="polite">{visible.length} results</p>
            </div>
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
          </div>
          {visible.length === 0 ? (
            <p className="px-4 py-10 text-sm text-ink lg:px-6">
              {matched.length === 0 ? "No sample listings match these filters." : "No sample listings in this map area. Zoom out or clear a filter."}
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-4 px-4 pb-8 lg:grid-cols-2 lg:px-6">
              {visible.map((listing) => (
                <li key={listing.id}>
                  <ListingCard
                    listing={listing}
                    highlighted={highlightedId === listing.id}
                    onHover={setHoveredId}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function ListingCard({
  listing,
  highlighted,
  onHover,
}: {
  listing: Listing;
  highlighted: boolean;
  onHover: (id: string | null) => void;
}) {
  return (
    <Link
      id={`listing-card-${listing.id}`}
      href={`/preview/search/${encodeURIComponent(listing.id)}`}
      onMouseEnter={() => onHover(listing.id)}
      onMouseLeave={() => onHover(null)}
      className={`block overflow-hidden rounded-sm border bg-paper ${highlighted ? "border-coral ring-2 ring-coral" : "border-line"}`}
    >
      <div className="relative aspect-[16/10]" style={{ background: PHOTO }}>
        {isNewListing(listing.listedAt) && (
          <span className="absolute left-2 top-2 rounded-sm bg-paper px-2 py-1 text-xs font-semibold text-ink">New</span>
        )}
      </div>
      <div className="p-3">
        <p className="font-display text-2xl text-ink">{formatPrice(listing.price)}</p>
        <p className="mt-1 text-sm text-ink">{listingFacts(listing)}</p>
        <p className="mt-1 text-sm text-ink">{listingAddress(listing)}</p>
        <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-ink">{listing.office.name}</p>
        <p className="text-sm text-ink">{listing.office.phone}</p>
      </div>
    </Link>
  );
}

function Menu({ label, active = false, children }: { label: string; active?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const panelId = useId();
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);
  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={`h-10 rounded-full border px-4 text-sm ${active || open ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink"}`}
      >
        {label}
      </button>
      {open && (
        <div id={panelId} className="absolute left-0 z-30 mt-2 rounded-sm border border-line bg-paper p-4 shadow-lg">
          {children}
        </div>
      )}
    </div>
  );
}

function RangeSelect<T extends number>({
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
  const id = useId();
  return (
    <label className="grid gap-1 text-sm text-ink" htmlFor={id}>
      {label}
      <select
        id={id}
        className="h-10 rounded-sm border border-line bg-paper px-2"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value === "" ? null : (Number(event.target.value) as T))}
      >
        <option value="">{empty}</option>
        {options.map((option) => <option key={option} value={option}>{format(option)}</option>)}
      </select>
    </label>
  );
}

function TypeOption({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink">
      <input type="radio" name="property-type" checked={checked} onChange={onChange} className="accent-coral" />
      {label}
    </label>
  );
}
