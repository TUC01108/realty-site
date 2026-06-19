import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-evergreen text-paper">
      <div className="mx-auto max-w-6xl px-6 lg:px-8 py-28 lg:py-36">
        <p className="eyebrow">[City / Market Area] Real Estate</p>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.1] mt-4 max-w-2xl">
          Buying &amp; selling beautifully designed homes
        </h1>
        <p className="mt-6 max-w-xl text-paper/75 text-lg">
          [One or two sentences establishing the agent&apos;s track record,
          market, and what makes working with them different — swap in real
          copy once we have it.]
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/listings"
            className="rounded-sm bg-paper px-6 py-3 text-sm font-medium text-evergreen hover:bg-brass hover:text-paper transition-colors"
          >
            Browse Available Homes
          </Link>
          <Link
            href="/sell"
            className="rounded-sm border border-paper/40 px-6 py-3 text-sm font-medium hover:bg-paper/10 transition-colors"
          >
            What&apos;s My Home Worth
          </Link>
        </div>
      </div>
    </section>
  );
}
