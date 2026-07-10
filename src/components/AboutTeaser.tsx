import Image from "next/image";
import Link from "next/link";

export default function AboutTeaser() {
  return (
    <section className="bg-sand">
      <div className="mx-auto max-w-6xl px-6 lg:px-8 py-20 lg:py-28 grid gap-12 lg:grid-cols-2 items-center">
        <div className="relative aspect-[4/5] w-full rounded-sm overflow-hidden">
          <Image src="/images/headshot.png" alt="Yordana Bolanos Salas" fill className="object-cover" />
        </div>
        <div>
          <p className="eyebrow text-coral">Meet Yordana</p>
          <h2 className="font-display text-3xl lg:text-4xl mt-3">Your Trusted Real Estate Advisor in Hawai&apos;i</h2>
          <p className="text-sm text-ink/50 mt-2">RS - 88323</p>
          <p className="mt-5 text-ink/70 leading-relaxed">
            Yordana&apos;s commitment to excellence extends beyond transactions — she takes pride in becoming a lifelong resource for her clients. Whether you&apos;re buying, selling, investing, remodeling, or exploring ground-up construction, her guidance is rooted in deep knowledge and genuine care. Yordana&apos;s extensive background in strategic sales, international market development, and high-level negotiations gives her a unique advantage in real estate, allowing her to guide clients with insight, confidence, and a global perspective.
          </p>
          <Link href="/about" className="mt-6 inline-block text-sm font-medium text-coral border-b border-coral pb-0.5 hover:text-coral-dark hover:border-coral-dark transition-colors">Learn more about Yordana</Link>
        </div>
      </div>
    </section>
  );
}
