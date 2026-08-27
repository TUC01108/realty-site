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
          <h2 className="font-display text-3xl lg:text-4xl mt-3">Yordana Bolanos Salas, Realtor in Hilo</h2>
          <p className="text-sm text-ink/50 mt-2">RS-88323 · Coldwell Banker Island Properties</p>
          <p className="mt-5 text-ink/70 leading-relaxed">
            More than 17 years in strategic sales and international market development — Mexico,
            Australia — then diplomatic-level work as Venezuela Coordinator of the Department of
            Culture. I have relocated internationally. I am a hula mom. I work from 101 Hualalai
            Street in Hilo, in English, Spanish, and Portuguese. Strategy over the transaction.
          </p>
          <Link href="/about" className="mt-6 inline-block text-sm font-medium text-coral border-b border-coral pb-0.5 hover:text-coral-dark hover:border-coral-dark transition-colors">Learn more about Yordana</Link>
        </div>
      </div>
    </section>
  );
}
