import Link from "next/link";

export default function Hero() {
  return (
    <section>
      {/* ── LOOPING BACKGROUND VIDEO ── */}
      <div className="relative h-[60vh] min-h-[420px] overflow-hidden bg-ink">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          /*
            loop is seamless when the clip's last frame matches its first.
            playsInline prevents iOS from opening the video full-screen.
            When Yordana has her own drone footage, swap hero-loop.mp4
            for the new file — no other changes needed.
          */
        >
          <source src="/videos/hero-loop.mp4" type="video/mp4" />
          {/* Fallback for browsers that block autoplay — video stays hidden, bg-ink shows */}
        </video>

        {/* Subtle dark veil so the text below reads cleanly */}
        <div className="absolute inset-0 bg-ink/10" />
      </div>

      {/* ── HEADLINE + CTAs ── */}
      <div className="mx-auto max-w-6xl px-6 lg:px-8 py-16 lg:py-20">
        <h1 className="font-display text-coral text-4xl sm:text-5xl lg:text-6xl leading-[1.15] max-w-3xl">
          Meaningful Journeys in Buying and Selling Homes
        </h1>
        <p className="eyebrow text-ink/70 mt-5">
          Yordana Bolanos Salas &nbsp;|&nbsp; RS-88323 &nbsp;|&nbsp; Coldwell
          Banker Island Properties
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/valuation"
            className="rounded-sm border border-coral px-6 py-3 text-sm font-medium text-coral hover:bg-coral hover:text-paper transition-colors"
          >
            What Is My Home Worth?
          </Link>
          <Link
            href="/home-search"
            className="rounded-sm bg-coral px-6 py-3 text-sm font-medium text-paper hover:bg-coral-dark transition-colors"
          >
            Browse Available Homes
          </Link>
        </div>
      </div>
    </section>
  );
}
