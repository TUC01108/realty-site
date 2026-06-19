export default function WelcomeVideo() {
  return (
    <section className="bg-coral text-paper">
      <div className="mx-auto max-w-6xl px-6 lg:px-8 py-16 lg:py-20">
        <div className="relative aspect-video w-full max-w-3xl mx-auto bg-ink/15 rounded-sm flex flex-col items-center justify-center gap-4 border border-paper/20">
          {/* PLACEHOLDER: swap this block for Yordana's welcome video
              (e.g. an embedded YouTube/Vimeo player or self-hosted file)
              once it's filmed and ready. */}
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-paper/90">
            <span
              className="ml-1 h-0 w-0 border-y-[10px] border-y-transparent border-l-[16px] border-l-coral"
              aria-hidden
            />
          </span>
          <p className="eyebrow text-paper/80 text-center px-6">
            Coming soon — a personal welcome video from Yordana
          </p>
        </div>
      </div>
    </section>
  );
}
