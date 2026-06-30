"use client";

import Image from "next/image";
import { useState } from "react";

const PROPERTY_TYPES = [
  "Single Family Home",
  "Condo / Townhouse",
  "Multi-Family",
  "Land / Lot",
  "Commercial",
  "Other",
];

type FormState = "idle" | "submitting" | "success" | "error";

export default function ValuationPage() {
  const [state, setState] = useState<FormState>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      address: (form.elements.namedItem("address") as HTMLInputElement).value,
      propertyType: (form.elements.namedItem("propertyType") as HTMLSelectElement).value,
      notes: (form.elements.namedItem("notes") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setState(res.ok ? "success" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <>
      {/* ── HERO BANNER ── */}
      <section className="relative h-64 sm:h-80 flex items-center justify-center">
        <Image
          src="/images/valuation-hero.jpeg"
          alt="Aerial view of Hawai'i Island coastline"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/40" />
        <div className="relative text-center text-paper px-6">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl uppercase tracking-wide">
            How Much Is Your Home Worth?
          </h1>
          <p className="mt-3 text-sm sm:text-base text-paper/85">
            Instant property valuation&nbsp;&nbsp;|&nbsp;&nbsp;Trusted guidance&nbsp;&nbsp;|&nbsp;&nbsp;Maximize Value
          </p>
        </div>
      </section>

      {/* ── SELL DESCRIPTION + HOUSE IMAGE ── */}
      <section className="mx-auto max-w-6xl px-6 lg:px-8 py-16 grid gap-12 lg:grid-cols-2 items-start">
        <div>
          <p className="eyebrow text-coral">Sell with Yordana</p>
          <h2 className="font-display text-3xl lg:text-4xl mt-3">
            Your property, expertly priced
          </h2>
          <p className="mt-5 text-ink/70 leading-relaxed">
            When you click &ldquo;Sell,&rdquo; you&apos;ll be prompted to enter
            your property address. This allows Yordana to connect with you and
            provide all the relevant information about your home and the selling
            process.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3 text-center">
            {["Instant result", "Sell for more", "Get expert advice"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-ink/70">
                <span className="text-coral">✓</span> {item}
              </div>
            ))}
          </div>

          <div className="mt-10 space-y-4">
            <p className="eyebrow text-ink/60">What sets Yordana apart</p>
            {[
              { icon: "🎥", label: "Drone video marketing" },
              { icon: "✍️", label: "Storytelling-led listings" },
              { icon: "🌏", label: "International buyer exposure" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm text-ink/80">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative aspect-[4/3] rounded-sm overflow-hidden">
          <Image
            src="/images/valuation-house.png"
            alt="Luxury Hawai'i property"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* ── VALUATION FORM ── */}
      <section className="bg-sand py-16 lg:py-20">
        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          <p className="eyebrow text-coral text-center">Free Home Valuation</p>
          <h2 className="font-display text-3xl lg:text-4xl mt-3 text-center">
            Get Your Instant Home Valuation
          </h2>
          <p className="text-center text-ink/60 mt-3 text-sm">
            Enter your details to see how much your home is worth.
          </p>

          {state === "success" ? (
            <div className="mt-10 rounded-sm bg-coral/10 border border-coral/30 p-8 text-center">
              <p className="font-display text-2xl text-coral">Thank you!</p>
              <p className="mt-2 text-ink/70">
                Yordana will be in touch within 24 hours with your home valuation.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="eyebrow text-ink/60">Full Name *</label>
                  <input
                    required
                    name="name"
                    type="text"
                    className="border-b border-ink/30 bg-transparent pb-2 text-sm focus:outline-none focus:border-coral transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="eyebrow text-ink/60">Email *</label>
                  <input
                    required
                    name="email"
                    type="email"
                    className="border-b border-ink/30 bg-transparent pb-2 text-sm focus:outline-none focus:border-coral transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="eyebrow text-ink/60">Phone *</label>
                <input
                  required
                  name="phone"
                  type="tel"
                  className="border-b border-ink/30 bg-transparent pb-2 text-sm focus:outline-none focus:border-coral transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="eyebrow text-ink/60">Property Address *</label>
                <input
                  required
                  name="address"
                  type="text"
                  placeholder="123 Main St, Hilo, HI 96720"
                  className="border-b border-ink/30 bg-transparent pb-2 text-sm placeholder:text-ink/30 focus:outline-none focus:border-coral transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="eyebrow text-ink/60">Property Type *</label>
                <select
                  required
                  name="propertyType"
                  className="border-b border-ink/30 bg-transparent pb-2 text-sm focus:outline-none focus:border-coral transition-colors"
                >
                  <option value="">Select one…</option>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="eyebrow text-ink/60">Additional Notes</label>
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="Recent upgrades, unique features, timeline to sell…"
                  className="border-b border-ink/30 bg-transparent pb-2 text-sm placeholder:text-ink/30 focus:outline-none focus:border-coral transition-colors resize-none"
                />
              </div>

              <div className="flex items-start gap-3 mt-1">
                <input
                  required
                  type="checkbox"
                  name="consent"
                  id="consent"
                  className="mt-1 accent-coral"
                />
                <label htmlFor="consent" className="text-xs text-ink/50 leading-relaxed">
                  I agree to be contacted by Yordana Bolanos Salas via call, email, and
                  text for real estate services. To opt out, reply &lsquo;stop&rsquo; at any time.
                  Message and data rates may apply.
                </label>
              </div>

              {state === "error" && (
                <p className="text-sm text-red-600">
                  Something went wrong — please try again or email us directly at{" "}
                  <a href="mailto:yourbigislandrealestate@gmail.com" className="underline">
                    yourbigislandrealestate@gmail.com
                  </a>
                </p>
              )}

              <button
                type="submit"
                disabled={state === "submitting"}
                className="mt-2 rounded-sm bg-coral px-6 py-3 text-sm font-medium text-paper hover:bg-coral-dark disabled:opacity-60 transition-colors uppercase tracking-widest"
              >
                {state === "submitting" ? "Submitting…" : "Request Your Free Valuation"}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
