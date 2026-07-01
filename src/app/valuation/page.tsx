"use client";

import Image from "next/image";
import { useState, useRef } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export default function ValuationPage() {
  const [address, setAddress] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const formRef = useRef<HTMLDivElement>(null);

  function handleAddressSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Scroll down to the form smoothly
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      address,
      propertyType: "Not specified",
      notes: "",
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
      {/* ── HERO BANNER — aerial coastline ── */}
      <section className="relative h-56 sm:h-72 flex items-center justify-center">
        <Image
          src="/images/valuation-hero.jpeg"
          alt="Aerial view of Hawai'i Island coastline"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/35" />
        <div className="relative text-center text-paper px-6">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl uppercase tracking-wide">
            How Much Is Your Home Worth?
          </h1>
          <p className="mt-3 text-sm sm:text-base text-paper/85">
            Instant property valuation&nbsp;&nbsp;|&nbsp;&nbsp;Trusted
            guidance&nbsp;&nbsp;|&nbsp;&nbsp;Maximize Value
          </p>
        </div>
      </section>

      {/* ── HOUSE IMAGE with address bar overlaid ── */}
      <section className="relative">
        <div className="relative w-full h-72 sm:h-96">
          <Image
            src="/images/valuation-house.png"
            alt="Luxury Hawai'i property"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-ink/40" />

          {/* Overlaid content */}
          <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl text-paper uppercase tracking-wide">
                How Much Is Your Home Worth?
              </h2>
              <div className="flex flex-wrap gap-6 mt-3">
                {["Instant property valuation", "Expert advice", "Sell for more"].map((item) => (
                  <span key={item} className="flex items-center gap-1.5 text-xs text-paper/90">
                    <span className="text-paper">✓</span> {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Address bar */}
            <form
              onSubmit={handleAddressSubmit}
              className="flex items-stretch gap-0 bg-paper/95 rounded-sm overflow-hidden"
            >
              <div className="flex items-center pl-4 text-ink/40">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your home address…"
                className="flex-1 px-3 py-3 text-sm text-ink bg-transparent placeholder:text-ink/40 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-coral text-paper px-5 py-3 text-xs font-medium eyebrow hover:bg-coral-dark transition-colors shrink-0"
              >
                Get a Free Home Valuation
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── FORM ── */}
      <section ref={formRef} className="bg-sand py-16 lg:py-20">
        <div className="mx-auto max-w-xl px-6 lg:px-8">
          <p className="eyebrow text-ink/60">Free Home Valuation</p>
          <h2 className="font-display text-2xl lg:text-3xl mt-2">
            Get Your Instant Home Valuation
          </h2>
          <p className="text-ink/60 mt-2 text-sm">
            Enter your details to see how much your home is worth.
          </p>

          {state === "success" ? (
            <div className="mt-10 rounded-sm bg-coral/10 border border-coral/30 p-8">
              <p className="font-display text-2xl text-coral">Thank you!</p>
              <p className="mt-2 text-ink/70">
                Yordana will be in touch within 24 hours with your home
                valuation. Check your inbox for a confirmation email.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="mt-8 grid gap-6">
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

              <div className="flex flex-col gap-1.5">
                <label className="eyebrow text-ink/60">Phone *</label>
                <input
                  required
                  name="phone"
                  type="tel"
                  className="border-b border-ink/30 bg-transparent pb-2 text-sm focus:outline-none focus:border-coral transition-colors"
                />
              </div>

              {/* Show the address they entered above — read-only confirmation */}
              {address && (
                <div className="flex flex-col gap-1.5">
                  <label className="eyebrow text-ink/60">Property Address</label>
                  <p className="border-b border-ink/20 pb-2 text-sm text-ink/70">
                    {address}
                  </p>
                </div>
              )}

              <div className="flex items-start gap-3">
                <input
                  required
                  type="checkbox"
                  name="consent"
                  id="consent"
                  className="mt-1 accent-coral"
                />
                <label htmlFor="consent" className="text-xs text-ink/50 leading-relaxed">
                  I agree to be contacted by Yordana Bolanos Salas via call,
                  email, and text for real estate services. To opt out, reply
                  &lsquo;stop&rsquo; at any time. Message and data rates may apply.
                </label>
              </div>

              {state === "error" && (
                <p className="text-sm text-red-600">
                  Something went wrong — please email us at{" "}
                  <a
                    href="mailto:yourbigislandrealestate@gmail.com"
                    className="underline"
                  >
                    yourbigislandrealestate@gmail.com
                  </a>
                </p>
              )}

              <button
                type="submit"
                disabled={state === "submitting"}
                className="rounded-sm bg-coral px-6 py-3 text-sm font-medium text-paper hover:bg-coral-dark disabled:opacity-60 transition-colors uppercase tracking-widest"
              >
                {state === "submitting"
                  ? "Submitting…"
                  : "Unlock Your Free Valuation"}
              </button>

              <div className="flex flex-wrap gap-6 text-xs text-ink/50">
                {["Instant result", "Sell for more", "Get expert advice"].map(
                  (item) => (
                    <span key={item} className="flex items-center gap-1.5">
                      <span className="text-coral">✓</span> {item}
                    </span>
                  )
                )}
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
