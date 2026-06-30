// ─── PERSONAL VIDEO CONFIG ───────────────────────────────────────
// This is Yordana's personal welcome/introduction video — separate
// from the silent looping coastline at the top of the page.
// When her video is ready, paste the YouTube URL here:
// e.g. "https://www.youtube.com/watch?v=VIDEO_ID"
const VIDEO_URL = "";
// ─────────────────────────────────────────────────────────────────

import Image from "next/image";

function toEmbedUrl(url: string): string {
  const short = url.match(/youtu\.be\/([^?&]+)/);
  if (short)
    return `https://www.youtube.com/embed/${short[1]}?autoplay=1&mute=1&loop=1&playlist=${short[1]}&controls=0&rel=0&playsinline=1`;

  const watch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
  if (watch)
    return `https://www.youtube.com/embed/${watch[1]}?autoplay=1&mute=1&loop=1&playlist=${watch[1]}&controls=0&rel=0&playsinline=1`;

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
            />
          ) : (
            /* ── PLACEHOLDER — her headshot with YouTube-style play button ── */
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
              <Image
                src="/images/headshot.png"
                alt="Yordana Bolanos Salas"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-ink/30" />
              {/* Play button */}
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-paper/90 shadow-md">
                <span
                  className="ml-1.5 h-0 w-0 border-y-[14px] border-y-transparent border-l-[22px] border-l-coral"
                  aria-hidden
                />
              </div>
              <p className="relative eyebrow text-paper text-center px-8 [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
                Yordana&apos;s personal welcome video — coming soon
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
