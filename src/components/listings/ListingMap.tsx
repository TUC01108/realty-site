"use client";

import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { formatPriceShort } from "@/lib/listings/format";
import type { MapBounds } from "@/lib/listings/query";
import type { Listing } from "@/lib/listings/types";

const MAP_STYLE = "https://tiles.openfreemap.org/styles/positron";

type MapLibre = typeof import("maplibre-gl");
type MarkerRecord = { marker: import("maplibre-gl").Marker; button: HTMLButtonElement };

async function loadMapLibre(): Promise<MapLibre> {
  const loaded = await import("maplibre-gl");
  if (typeof loaded.Map === "function") return loaded;
  const fallback = (loaded as { default?: MapLibre }).default;
  if (fallback && typeof fallback.Map === "function") return fallback;
  throw new Error("MapLibre did not load.");
}

function paintSelection(markers: Map<string, MarkerRecord>, selectedId: string | null) {
  for (const [id, record] of markers) {
    const selected = id === selectedId;
    record.button.classList.toggle("is-selected", selected);
    record.button.setAttribute("aria-pressed", selected ? "true" : "false");
    record.marker.getElement().style.zIndex = selected ? "3" : "1";
  }
}

export default function ListingMap({
  listings,
  selectedId,
  onSelect,
  onBounds,
  fitToken,
  layoutKey,
  focusNonce,
}: {
  listings: Listing[];
  selectedId: string | null;
  onSelect?: (id: string) => void;
  onBounds?: (bounds: MapBounds) => void;
  fitToken: string;
  layoutKey: string;
  focusNonce: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("maplibre-gl").Map | null>(null);
  const markersRef = useRef<Map<string, MarkerRecord>>(new Map());
  const listingsRef = useRef(listings);
  const selectedRef = useRef(selectedId);
  const onSelectRef = useRef(onSelect);
  const onBoundsRef = useRef(onBounds);
  const focusRef = useRef(focusNonce);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    listingsRef.current = listings;
    selectedRef.current = selectedId;
    onSelectRef.current = onSelect;
    onBoundsRef.current = onBounds;
    focusRef.current = focusNonce;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let disposed = false;
    let map: import("maplibre-gl").Map | null = null;
    const observer = new ResizeObserver(() => map?.resize());
    observer.observe(container);

    void loadMapLibre()
      .then((maplibregl) => {
        if (disposed || !containerRef.current) return;
        map = new maplibregl.Map({
          container: containerRef.current,
          style: MAP_STYLE,
          center: [-155.5, 19.6],
          zoom: 7,
          maxZoom: 14,
          attributionControl: { compact: true },
        });
        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-left");
        map.on("moveend", () => {
          if (!map) return;
          const bounds = map.getBounds();
          onBoundsRef.current?.({
            west: bounds.getWest(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            north: bounds.getNorth(),
          });
        });
        mapRef.current = map;
        setReady(true);
      })
      .catch(() => {
        if (!disposed) setReady(false);
      });

    const markers = markersRef.current;
    return () => {
      disposed = true;
      observer.disconnect();
      markers.forEach((record) => record.marker.remove());
      markers.clear();
      map?.remove();
      mapRef.current = null;
      setReady(false);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    void loadMapLibre().then((maplibregl) => {
      const map = mapRef.current;
      if (cancelled || !map) return;
      const paint = () => {
        if (cancelled || !mapRef.current) return;
        const current = listingsRef.current;
        const ids = new Set(current.map((listing) => listing.id));
        for (const [id, record] of markersRef.current) {
          if (!ids.has(id)) {
            record.marker.remove();
            markersRef.current.delete(id);
          }
        }
        for (const listing of current) {
          const label = formatPriceShort(listing.price);
          const existing = markersRef.current.get(listing.id);
          if (existing) {
            existing.marker.setLngLat([listing.longitude, listing.latitude]);
            existing.button.textContent = label;
            continue;
          }
          const button = document.createElement("button");
          button.type = "button";
          button.className = "listing-marker";
          button.textContent = label;
          const place = listing.streetAddress || listing.city;
          button.setAttribute("aria-label", `${label}, ${place}`);
          button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            onSelectRef.current?.(listing.id);
          });
          const marker = new maplibregl.Marker({ element: button, anchor: "center" })
            .setLngLat([listing.longitude, listing.latitude])
            .addTo(map);
          markersRef.current.set(listing.id, { marker, button });
        }
        paintSelection(markersRef.current, selectedRef.current);
      };
      if (map.loaded()) paint();
      else map.once("load", paint);
    });
    return () => {
      cancelled = true;
    };
  }, [listings, ready]);

  useEffect(() => {
    if (!ready) return;
    paintSelection(markersRef.current, selectedId);
  }, [selectedId, ready, listings]);

  useEffect(() => {
    if (!ready) return;
    const map = mapRef.current;
    if (!map) return;
    let cancelled = false;
    const fit = () => {
      if (cancelled) return;
      const current = listingsRef.current;
      if (current.length === 0 || !mapRef.current) return;
      if (focusRef.current > 0 && selectedRef.current) return;
      void loadMapLibre().then((maplibregl) => {
        if (cancelled || !mapRef.current) return;
        const bounds = new maplibregl.LngLatBounds();
        for (const listing of current) bounds.extend([listing.longitude, listing.latitude]);
        mapRef.current.fitBounds(bounds, { padding: 56, maxZoom: 12, duration: 0 });
      });
    };
    if (map.isStyleLoaded()) fit();
    else map.once("load", fit);
    return () => {
      cancelled = true;
    };
  }, [fitToken, ready]);

  useEffect(() => {
    if (!ready || focusNonce === 0) return;
    const map = mapRef.current;
    const listing = listingsRef.current.find((item) => item.id === selectedRef.current);
    if (!map || !listing) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    map.easeTo({
      center: [listing.longitude, listing.latitude],
      zoom: Math.max(map.getZoom(), 12),
      duration: reduce ? 0 : 450,
    });
  }, [focusNonce, ready]);

  useEffect(() => {
    mapRef.current?.resize();
  }, [layoutKey, ready]);

  return (
    <div ref={containerRef} className="listing-map h-full min-h-[320px] w-full" role="application" aria-label="Map of sample listings" />
  );
}
