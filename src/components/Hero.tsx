import Link from "next/link";

export default function Hero() {
  return (
    <section>
      <div className="relative h-[60vh] min-h-[420px] overflow-hidden bg-ink">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero-loop.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-ink/10" />
      </div>

      <div className="mx-auto max-w-6xl px-6 lg:px-8 py-16 lg:py-20">
        <h1 className="font-display text-coral text-4xl sm:text-5xl lg:text-6xl leading-[1.15] max-w-3xl">
          Yordana Bolanos Salas — buying and selling homes on Hawaiʻi Island
        </h1>
        <p className="mt-5 text-ink/70 max-w-2xl leading-relaxed">
          From Hilo. Meaningful journeys in buying and selling homes.
        </p>
        <p className="eyebrow text-ink/70 mt-5">
          Yordana Bolanos Salas &nbsp;|&nbsp; RS-88323 &nbsp;|&nbsp; Coldwell
          Banker Island Properties &nbsp;|&nbsp; Hilo
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
