// ─── VIDEO CONFIG ────────────────────────────────────────────────
// When Yordana's video is ready, paste the YouTube URL here.
// It will autoplay muted on loop automatically — no play button.
//
// YouTube example: "https://www.youtube.com/watch?v=VIDEO_ID"
// Vimeo example:   "https://player.vimeo.com/video/VIDEO_ID"
//
const VIDEO_URL = ""; // ← paste URL here when ready
// ─────────────────────────────────────────────────────────────────

import Image from "next/image";

function toEmbedUrl(url: string): string {
  const short = url.match(/youtu\.be\/([^?&]+)/);
  if (short)
    return `https://www.youtube.com/embed/${short[1]}?autoplay=1&mute=1&loop=1&playlist=${short[1]}&controls=0&rel=0&playsinline=1`;

  const watch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
  if (watch)
    return `https://www.youtube.com/embed/${watch[1]}?autoplay=1&mute=1&loop=1&playlist=${watch[1]}&controls=0&rel=0&playsinline=1`;

  // Vimeo or already an embed URL
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}autoplay=1&muted=1&loop=1&background=1`;
}

export default function WelcomeVideo() {
  const hasVideo = VIDEO_URL.trim().length > 0;
  const embedUrl = hasVideo ? toEmbedUrl(VIDEO_URL) : "";

  return (
    <section className="bg-coral">
      <div className="mx-auto max-w-4xl px-6 lg:px-8 py-16 lg:py-20">
        <p className="eyebrow text-paper/80 text-center mb-8">
          A Message from Yordana
        </p>

        <div className="relative aspect-video w-full rounded-sm overflow-hidden shadow-lg">
          {hasVideo ? (
            /* ── LIVE VIDEO — autoplays muted on loop, no controls ── */
            <iframe
              src={embedUrl}
              title="Welcome message from Yordana Bolanos Salas"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="absolute inset-0 w-full h-full border-0 scale-[1.03]"
              /* scale-[1.03] hides the thin YouTube letterbox border at edges */
            />
          ) : (
            /* ── STATIC IMAGE — shown until VIDEO_URL is set ── */
            <Image
              src="/images/hero-coastline.png"
              alt="Hawai'i Island coastline"
              fill
              className="object-cover"
            />
          )}
        </div>
      </div>
    </section>
  );
}
