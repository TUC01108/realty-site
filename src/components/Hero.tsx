import Link from "next/link";

export default function Hero() {
  return (
    <section>
      <div className="relative h-[60vh] min-h-[420px] bg-ink/90 flex items-center justify-center text-paper/50 text-sm">
        {/*
          PHOTO NOTE: the PDF uses a Canva stock aerial coastline shot here.
          Swap this block for a real drone/listing photo before launch —
          Thomas's own drone footage is a perfect fit for this exact spot.
        */}
        [Full-bleed aerial coastline photo]
      </div>

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
