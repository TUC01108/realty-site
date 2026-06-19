"use client";

import { useState } from "react";

export default function ContactCTA() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: wire up to a real form handler / CRM (e.g. a serverless
    // function, Formspree, or Coldwell Banker's lead system) before launch.
    setSubmitted(true);
  }

  return (
    <section className="bg-coral text-paper">
      <div className="mx-auto max-w-6xl px-6 lg:px-8 py-20 lg:py-28 grid gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow text-paper/80">Let&apos;s Connect</p>
          <h2 className="font-display text-3xl lg:text-4xl mt-3">
            Aloha! Let&apos;s start your Hawai&apos;i real estate journey
          </h2>
          <p className="mt-5 text-paper/85 max-w-md">
            Whether you&apos;re buying, selling, or just curious about the
            market, reach out and Yordana will follow up personally.
          </p>
        </div>

        <div>
          {submitted ? (
            <p className="text-paper">
              Thank you — Yordana will be in touch shortly.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4">
              <input
                required
                type="text"
                placeholder="Full name"
                className="rounded-sm bg-paper/10 border border-paper/30 px-4 py-3 text-sm placeholder:text-paper/60 focus:outline-none focus:border-paper"
              />
              <input
                required
                type="email"
                placeholder="Email"
                className="rounded-sm bg-paper/10 border border-paper/30 px-4 py-3 text-sm placeholder:text-paper/60 focus:outline-none focus:border-paper"
              />
              <input
                required
                type="tel"
                placeholder="Phone"
                className="rounded-sm bg-paper/10 border border-paper/30 px-4 py-3 text-sm placeholder:text-paper/60 focus:outline-none focus:border-paper"
              />
              <textarea
                placeholder="Tell us about your goals — buying, selling, timeline..."
                rows={4}
                className="rounded-sm bg-paper/10 border border-paper/30 px-4 py-3 text-sm placeholder:text-paper/60 focus:outline-none focus:border-paper"
              />
              <button
                type="submit"
                className="rounded-sm bg-paper border border-paper px-6 py-3 text-sm font-medium text-coral hover:bg-transparent hover:text-paper transition-colors"
              >
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
