"use client";

import { useState } from "react";

export default function ContactCTA() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: wire up to a real form handler / CRM (e.g. a serverless
    // function, Formspree, or your CRM's lead API) before launch.
    setSubmitted(true);
  }

  return (
    <section className="bg-evergreen text-paper">
      <div className="mx-auto max-w-6xl px-6 lg:px-8 py-20 lg:py-28 grid gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Let&apos;s connect</p>
          <h2 className="font-display text-3xl lg:text-4xl mt-3">
            Thinking about buying or selling?
          </h2>
          <p className="mt-5 text-paper/75 max-w-md">
            [Short prompt encouraging visitors to reach out — e.g. mention a
            free home valuation, a buyer consultation, or just a no-pressure
            conversation about the market.]
          </p>
        </div>

        <div>
          {submitted ? (
            <p className="text-paper">
              Thank you — we&apos;ll be in touch shortly.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4">
              <input
                required
                type="text"
                placeholder="Full name"
                className="rounded-sm bg-paper/10 border border-paper/25 px-4 py-3 text-sm placeholder:text-paper/50 focus:outline-none focus:border-brass"
              />
              <input
                required
                type="email"
                placeholder="Email"
                className="rounded-sm bg-paper/10 border border-paper/25 px-4 py-3 text-sm placeholder:text-paper/50 focus:outline-none focus:border-brass"
              />
              <input
                required
                type="tel"
                placeholder="Phone"
                className="rounded-sm bg-paper/10 border border-paper/25 px-4 py-3 text-sm placeholder:text-paper/50 focus:outline-none focus:border-brass"
              />
              <textarea
                placeholder="Message"
                rows={4}
                className="rounded-sm bg-paper/10 border border-paper/25 px-4 py-3 text-sm placeholder:text-paper/50 focus:outline-none focus:border-brass"
              />
              <button
                type="submit"
                className="rounded-sm bg-brass px-6 py-3 text-sm font-medium text-paper hover:bg-paper hover:text-evergreen transition-colors"
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
