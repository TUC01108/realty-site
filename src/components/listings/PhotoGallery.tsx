"use client";

import { useState } from "react";
import type { Listing } from "@/lib/listings/types";

const PATTERNS = [
  "repeating-linear-gradient(135deg, #f7f4f0 0 16px, #ffffff 16px 32px)",
  "radial-gradient(circle at 20% 20%, #ffd5d5 0 18%, #f7f4f0 18% 100%)",
  "linear-gradient(160deg, #fff 0%, #f7f4f0 45%, #ffd0d0 100%)",
  "repeating-linear-gradient(90deg, #ffffff 0 18px, #f7f4f0 18px 36px)",
  "linear-gradient(180deg, #f7f4f0 0%, #ffffff 40%, #ffe4e4 100%)",
];

export default function PhotoGallery({ listing }: { listing: Listing }) {
  const photos = listing.photoUrls.filter((url) => /^https?:\/\//i.test(url));
  const count = Math.max(photos.length, listing.photoCount, 1);
  const [index, setIndex] = useState(0);
  const safeIndex = index % count;
  const pattern = PATTERNS[safeIndex % PATTERNS.length];

  function step(delta: number) {
    setIndex((current) => (current + delta + count) % count);
  }

  return (
    <div
      className="outline-none"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") step(1);
        if (event.key === "ArrowLeft") step(-1);
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-sand">
        {photos.length > 0 ? (
          // Remote MLS photo hosts are added to img-src only after the feed names them.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photos[safeIndex]}
            alt={`Photo ${safeIndex + 1} of ${photos.length}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-end p-4" style={{ background: pattern }}>
            <p className="rounded-sm bg-paper/90 px-3 py-1 text-sm text-ink">
              Sample photo {safeIndex + 1} of {count}
            </p>
          </div>
        )}
        {count > 1 && (
          <>
            <button type="button" aria-label="Previous photo" onClick={() => step(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-sm bg-paper/90 px-3 py-2 text-sm text-ink">Prev</button>
            <button type="button" aria-label="Next photo" onClick={() => step(1)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm bg-paper/90 px-3 py-2 text-sm text-ink">Next</button>
          </>
        )}
      </div>
      {count > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {Array.from({ length: count }, (_, frame) => (
            <button
              key={frame}
              type="button"
              aria-label={`Show photo ${frame + 1}`}
              aria-current={frame === safeIndex}
              onClick={() => setIndex(frame)}
              className={`h-14 w-16 shrink-0 rounded-sm border ${frame === safeIndex ? "border-coral" : "border-line"}`}
              style={{ background: PATTERNS[frame % PATTERNS.length] }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
