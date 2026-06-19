const PLACEHOLDER_TESTIMONIALS = [
  {
    quote:
      "[Client testimonial goes here — keep it specific to what the agent did well: communication, market knowledge, negotiation, etc.]",
    name: "[Client initials or name]",
  },
  {
    quote:
      "[Second testimonial — real quotes from past clients build more trust than generic praise.]",
    name: "[Client initials or name]",
  },
  {
    quote:
      "[Third testimonial. Three to six is a good range for the home page; link to a full page for more.]",
    name: "[Client initials or name]",
  },
];

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-6 lg:px-8 py-20 lg:py-28">
      <p className="eyebrow text-center">What clients say</p>
      <h2 className="font-display text-3xl lg:text-4xl mt-3 text-center">
        Client experiences
      </h2>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {PLACEHOLDER_TESTIMONIALS.map((t, i) => (
          <figure key={i} className="border hairline rounded-sm p-6">
            <blockquote className="text-ink/75 text-sm leading-relaxed">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-sm font-medium text-coral">
              — {t.name}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
