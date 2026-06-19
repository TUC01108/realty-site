const PLACEHOLDER_AREAS = [
  "[Neighborhood One]",
  "[Neighborhood Two]",
  "[Neighborhood Three]",
  "[Neighborhood Four]",
];

export default function Neighborhoods() {
  return (
    <section className="bg-line/30 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <p className="eyebrow">Areas served</p>
        <h2 className="font-display text-3xl lg:text-4xl mt-3">
          Neighborhoods we know best
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLACEHOLDER_AREAS.map((area) => (
            <div key={area} className="group cursor-pointer">
              <div className="aspect-[4/3] bg-line/60 rounded-sm flex items-center justify-center text-ink/40 text-sm group-hover:opacity-80 transition-opacity">
                [Area photo]
              </div>
              <p className="mt-3 font-display text-lg">{area}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
