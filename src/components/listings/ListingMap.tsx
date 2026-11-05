"use client";

import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { formatPinPrice, formatPrice, listingAddress, listingFacts } from "@/lib/listings/format";
import type { MapBounds } from "@/lib/listings/query";
import type { Listing } from "@/lib/listings/types";

const MAP_STYLE = "https://tiles.openfreemap.org/styles/positron";
const PHOTO = "repeating-linear-gradient(135deg, #f7f4f0 0 12px, #ffffff 12px 24px)";

type MapLibre = typeof import("maplibre-gl");
type MarkerRecord = { marker: import("maplibre-gl").Marker; button: HTMLButtonElement };

async function loadMapLibre(): Promise<MapLibre> {
  const loaded = await import("maplibre-gl");
  if (typeof loaded.Map === "function") return loaded;
  const fallback = (loaded as { default?: MapLibre }).default;
  if (fallback && typeof fallback.Map === "function") return fallback;
  throw new Error("MapLibre did not load.");
}

function stopMapGesture(event: Event) {
  event.stopPropagation();
}

function buildPopup(listing: Listing): HTMLAnchorElement {
  const link = document.createElement("a");
  link.href = `/preview/search/${encodeURIComponent(listing.id)}`;
  link.style.display = "block";
  link.style.width = "240px";
  link.style.color = "#1a1a1a";
  link.style.textDecoration = "none";

  const photo = document.createElement("div");
  photo.style.height = "120px";
  photo.style.background = PHOTO;
  link.appendChild(photo);

  const body = document.createElement("div");
  body.style.padding = "10px 12px 12px";

  const price = document.createElement("p");
  price.textContent = formatPrice(listing.price);
  price.style.fontFamily = "var(--font-playfair), Georgia, serif";
  price.style.fontSize = "1.25rem";
  price.style.margin = "0";
  body.appendChild(price);

  const facts = document.createElement("p");
  facts.textContent = listingFacts(listing);
  facts.style.fontSize = "0.8rem";
  facts.style.margin = "6px 0 0";
  body.appendChild(facts);

  const address = document.createElement("p");
  address.textContent = listingAddress(listing);
  address.style.fontSize = "0.8rem";
  address.style.margin = "4px 0 0";
  body.appendChild(address);

  const firm = document.createElement("p");
  firm.textContent = listing.office.name;
  firm.style.fontSize = "0.75rem";
  firm.style.fontWeight = "600";
  firm.style.letterSpacing = "0.06em";
  firm.style.textTransform = "uppercase";
  firm.style.margin = "8px 0 0";
  body.appendChild(firm);

  link.appendChild(body);
  link.addEventListener("mousedown", stopMapGesture);
  link.addEventListener("touchstart", stopMapGesture);
  return link;
}

export default function ListingMap({
  listings,
  highlightedId = null,
  selectedId,
  onHover = () => undefined,
  onSelect = () => undefined,
  onBounds,
  fitToken,
  layoutKey,
}: {
  listings: Listing[];
  highlightedId?: string | null;
  selectedId: string | null;
  onHover?: (id: string | null) => void;
  onSelect?: (id: string | null) => void;
  onBounds?: (bounds: MapBounds) => void;
  fitToken: string;
  layoutKey: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("maplibre-gl").Map | null>(null);
  const markersRef = useRef<Map<string, MarkerRecord>>(new Map());
  const popupRef = useRef<import("maplibre-gl").Popup | null>(null);
  const listingsRef = useRef(listings);
  const highlightedRef = useRef(highlightedId);
  const selectedRef = useRef(selectedId);
  const onHoverRef = useRef(onHover);
  const onSelectRef = useRef(onSelect);
  const onBoundsRef = useRef(onBounds);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    listingsRef.current = listings;
    highlightedRef.current = highlightedId;
    selectedRef.current = selectedId;
    onHoverRef.current = onHover;
    onSelectRef.current = onSelect;
    onBoundsRef.current = onBounds;
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
        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
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
        map.on("click", () => onSelectRef.current(null));
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
      popupRef.current?.remove();
      popupRef.current = null;
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
          const label = formatPinPrice(listing.price);
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
          button.setAttribute("aria-label", `${label}, ${listing.streetAddress || listing.city}`);
          button.addEventListener("mousedown", stopMapGesture);
          button.addEventListener("touchstart", stopMapGesture);
          button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            onSelectRef.current(listing.id);
          });
          button.addEventListener("mouseenter", () => onHoverRef.current(listing.id));
          button.addEventListener("mouseleave", () => onHoverRef.current(null));
          const marker = new maplibregl.Marker({ element: button, anchor: "center" })
            .setLngLat([listing.longitude, listing.latitude])
            .addTo(map);
          markersRef.current.set(listing.id, { marker, button });
        }
        paintMarkers(markersRef.current, highlightedRef.current, selectedRef.current);
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
    paintMarkers(markersRef.current, highlightedId, selectedId);
  }, [highlightedId, selectedId, ready, listings]);

  useEffect(() => {
    if (!ready) return;
    const map = mapRef.current;
    if (!map) return;
    let cancelled = false;
    let ignoreClose = false;
    const closePopup = () => {
      ignoreClose = true;
      popupRef.current?.remove();
      popupRef.current = null;
      ignoreClose = false;
    };
    if (!selectedId) {
      closePopup();
      return;
    }
    const listing = listingsRef.current.find((item) => item.id === selectedId);
    if (!listing) {
      closePopup();
      return;
    }
    void loadMapLibre().then((maplibregl) => {
      if (cancelled || !mapRef.current || selectedRef.current !== listing.id) return;
      closePopup();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      mapRef.current.easeTo({
        center: [listing.longitude, listing.latitude],
        offset: [0, 120],
        duration: reduce ? 0 : 250,
      });
      const popup = new maplibregl.Popup({ offset: 16, closeButton: true, maxWidth: "280px", anchor: "bottom" })
        .setLngLat([listing.longitude, listing.latitude])
        .setDOMContent(buildPopup(listing))
        .addTo(mapRef.current);
      popup.on("close", () => {
        if (ignoreClose) return;
        if (selectedRef.current === listing.id) onSelectRef.current(null);
      });
      popupRef.current = popup;
    });
    return () => {
      cancelled = true;
    };
  }, [selectedId, ready]);

  useEffect(() => {
    if (!ready) return;
    const map = mapRef.current;
    if (!map) return;
    let cancelled = false;
    const fit = () => {
      if (cancelled || !mapRef.current) return;
      const current = listingsRef.current;
      if (current.length === 0) return;
      void loadMapLibre().then((maplibregl) => {
        if (cancelled || !mapRef.current) return;
        const bounds = new maplibregl.LngLatBounds();
        for (const listing of current) bounds.extend([listing.longitude, listing.latitude]);
        mapRef.current.fitBounds(bounds, { padding: 48, maxZoom: 12, duration: 0 });
      });
    };
    if (map.isStyleLoaded()) fit();
    else map.once("load", fit);
    return () => {
      cancelled = true;
    };
  }, [fitToken, ready]);

  useEffect(() => {
    mapRef.current?.resize();
  }, [layoutKey, ready]);

  return (
    <div ref={containerRef} className="listing-map h-full min-h-[320px] w-full" role="application" aria-label="Map of sample listings" />
  );
}

function paintMarkers(markers: Map<string, MarkerRecord>, highlightedId: string | null, selectedId: string | null) {
  for (const [id, record] of markers) {
    const selected = id === selectedId;
    const hovered = id === highlightedId;
    record.button.classList.toggle("is-selected", selected);
    record.button.classList.toggle("is-hovered", hovered && !selected);
    record.button.setAttribute("aria-pressed", selected ? "true" : "false");
    record.marker.getElement().style.zIndex = selected ? "4" : hovered ? "3" : "1";
  }
}
