import Image from "next/image";

const STATS = [
  { value: "3,000+", label: "Offices Worldwide" },
  { value: "100+", label: "Countries & Territories" },
  { value: "100,000+", label: "Sales Associates" },
];

export default function BrandBanner() {
  return (
    <section className="relative text-paper">
      <div className="absolute inset-0">
        <Image
          src="/images/coldwell-banner.png"
          alt="Luxury Hawai'i property at dusk"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/50" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8 py-20 text-center">
        <p className="font-display text-2xl lg:text-3xl">
          Coldwell Banker Global Luxury&reg;
        </p>
        <p className="eyebrow text-paper/80 mt-2">Guiding You Home Since 1906</p>

        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-3xl lg:text-4xl">{stat.value}</p>
              <p className="eyebrow text-paper/80 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
