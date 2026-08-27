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
      timeline: (form.elements.namedItem("timeline") as HTMLSelectElement).value,
      occupancy: (form.elements.namedItem("occupancy") as HTMLSelectElement).value,
      motivation: (form.elements.namedItem("motivation") as HTMLTextAreaElement).value,
      notes: (form.elements.namedItem("motivation") as HTMLTextAreaElement).value,
    };
    try {
      const res = await fetch("/api/valuation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      setState(res.ok ? "success" : "error");
    } catch { setState("error"); }
  }

  return (
    <>
      {/* ── HERO BANNER ── */}
      <section className="relative h-56 sm:h-72 flex items-center justify-center">
        <Image src="/images/valuation-hero.jpeg" alt="Aerial view of Hawai'i Island coastline" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-ink/35" />
        <div className="relative text-center text-paper px-6">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl uppercase tracking-wide">How Much Is Your Home Worth?</h1>
          <p className="mt-3 text-sm sm:text-base text-paper/85">
            A conversation from Hilo — not an automated estimate
          </p>
        </div>
      </section>

      {/* ── ADDRESS BAR — clean contained design ── */}
      <section className="bg-sand mt-6 lg:mt-8 py-12 lg:py-14">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <p className="eyebrow text-coral text-center mb-6">Enter Your Address to Get Started</p>
          <form
            onSubmit={handleAddressSubmit}
            className="flex items-stretch max-w-2xl mx-auto border border-coral rounded-sm overflow-hidden"
          >
            <div className="flex items-center pl-4 text-coral/60 shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Enter your home address…"
              className="flex-1 px-3 py-4 text-sm text-ink bg-transparent placeholder:text-ink/40 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-coral text-paper px-6 py-4 text-xs font-medium eyebrow hover:bg-coral-dark transition-colors shrink-0"
            >
              Get Free Valuation
            </button>
          </form>
        </div>
      </section>

      {/* ── FORM ── */}
      <section ref={formRef} className="bg-sand py-16 lg:py-20">
        <div className="mx-auto max-w-xl px-6 lg:px-8">
          <p className="eyebrow text-ink/60">Home valuation</p>
          <h2 className="font-display text-2xl lg:text-3xl mt-2">Request a home valuation</h2>
          <p className="text-ink/60 mt-2 text-sm">
            There is no instant calculator on this page. Send the form and Yordana will follow up from Hilo
            with a valuation conversation.
          </p>

          {state === "success" ? (
            <div className="mt-10 rounded-sm bg-coral/10 border border-coral/30 p-8">
              <p className="font-display text-2xl text-coral">Thank you!</p>
              <p className="mt-2 text-ink/70">Yordana will be in touch within 24 hours with your home valuation. Check your inbox for a confirmation email.</p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="mt-8 grid gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="eyebrow text-ink/60">Full Name *</label>
                <input required name="name" type="text" className="border-b border-ink/30 bg-transparent pb-2 text-sm focus:outline-none focus:border-coral transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="eyebrow text-ink/60">Email *</label>
                <input required name="email" type="email" className="border-b border-ink/30 bg-transparent pb-2 text-sm focus:outline-none focus:border-coral transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="eyebrow text-ink/60">Phone *</label>
                <input required name="phone" type="tel" className="border-b border-ink/30 bg-transparent pb-2 text-sm focus:outline-none focus:border-coral transition-colors" />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="eyebrow text-ink/60">When would you like to sell?</label>
                  <select name="timeline" defaultValue="90_days" className="border-b border-ink/30 bg-transparent pb-2 text-sm focus:outline-none focus:border-coral transition-colors">
                    <option value="asap">Ready now</option>
                    <option value="30_days">Within 30 days</option>
                    <option value="90_days">Within 90 days</option>
                    <option value="6_months">This year</option>
                    <option value="browsing">Just looking at value</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="eyebrow text-ink/60">Who lives there now?</label>
                  <select name="occupancy" defaultValue="unknown" className="border-b border-ink/30 bg-transparent pb-2 text-sm focus:outline-none focus:border-coral transition-colors">
                    <option value="owner">I live there</option>
                    <option value="tenant">Tenants</option>
                    <option value="vacant">Vacant</option>
                    <option value="unknown">Not sure</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="eyebrow text-ink/60">What should Yordana know?</label>
                <textarea name="motivation" rows={3} placeholder="Inherited, relocating, testing the market…" className="border-b border-ink/30 bg-transparent pb-2 text-sm focus:outline-none focus:border-coral transition-colors placeholder:text-ink/40" />
              </div>
              {address && (
                <div className="flex flex-col gap-1.5">
                  <label className="eyebrow text-ink/60">Property Address</label>
                  <p className="border-b border-ink/20 pb-2 text-sm text-ink/70">{address}</p>
                </div>
              )}
              <div className="flex items-start gap-3">
                <input required type="checkbox" name="consent" id="consent" className="mt-1 accent-coral" />
                <label htmlFor="consent" className="text-xs text-ink/50 leading-relaxed">
                  I agree to be contacted by Yordana Bolanos Salas via call, email, and text for real estate services. To opt out, reply &lsquo;stop&rsquo; at any time. Message and data rates may apply.
                </label>
              </div>
              {state === "error" && (
                <p className="text-sm text-red-600">Something went wrong — please email <a href="mailto:yourbigislandrealestate@gmail.com" className="underline">yourbigislandrealestate@gmail.com</a></p>
              )}
              <button type="submit" disabled={state==="submitting"} className="rounded-sm bg-coral px-6 py-3 text-sm font-medium text-paper hover:bg-coral-dark disabled:opacity-60 transition-colors uppercase tracking-widest">
                {state==="submitting" ? "Submitting…" : "Request a valuation"}
              </button>
              <div className="flex flex-wrap gap-6 text-xs text-ink/50">
                {["Yordana follows up", "Local comparable sales", "Advice from Hilo"].map(item => (
                  <span key={item} className="flex items-center gap-1.5"><span className="text-coral">✓</span> {item}</span>
                ))}
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ── SECTION 1: What's Your Property Worth? ── */}
      <section className="mx-auto max-w-6xl px-6 lg:px-8 py-16 lg:py-24 grid gap-12 lg:grid-cols-2 items-start">
        <div>
          <h2 className="font-display text-coral text-3xl lg:text-5xl leading-tight">What&apos;s Your Property Worth?</h2>
          <p className="mt-6 text-ink/70 leading-relaxed">Home valuations give you valuable knowledge that can help you plan for the future and make smart decisions. It&apos;s good practice to stay informed about how much equity you have in your home and how much you may be able to borrow against it or sell it for.</p>
          <p className="mt-4 text-ink/70 leading-relaxed">
            This site does not run an automated valuation. For a number you can plan around, Yordana
            will talk through a Comparative Market Analysis. An appraisal is a separate professional
            opinion, usually ordered by a lender.
          </p>
        </div>
        <div className="relative aspect-[4/3] rounded-sm overflow-hidden">
          <Image src="/images/valuation-pool.png" alt="Luxury Hawai'i property with pool" fill className="object-cover" />
        </div>
      </section>

      {/* ── SECTION 2: How Is a Valuation Performed? ── */}
      <section className="bg-coral text-paper">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-16 lg:py-24">
          <h2 className="font-display text-3xl lg:text-5xl leading-tight">How Is a Valuation Performed?</h2>
          <p className="mt-2 text-paper/80 text-sm">Two Accurate Ways to Perform Home Valuations</p>
          <div className="mt-12 grid gap-0 lg:grid-cols-2 relative">
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-paper/20" />
            <div className="lg:pr-16 pb-12 lg:pb-0">
              <div className="hidden lg:block">
                <h3 className="font-display text-2xl text-right">Comparative Market Analysis</h3>
                <p className="mt-3 text-paper/80 text-sm leading-relaxed text-right">A Comparative Market Analysis (CMA) is a tool used by real estate agents to value a home. It evaluates similar homes that have recently sold in the same area. Agents find comparable sales and use them to conduct a sales comparison. In most cases, an agent will find three homes that have recently sold and are as similar to and located as close to the home being valued as possible. Each one is then analyzed to pinpoint differences between it and the home being valued.</p>
              </div>
              <div className="lg:hidden">
                <h3 className="font-display text-2xl">Comparative Market Analysis</h3>
                <p className="mt-3 text-paper/80 text-sm leading-relaxed">A CMA is a tool used by real estate agents to value a home. It evaluates similar homes that have recently sold in the same area, finding three comparable homes to analyze and adjust for differences to determine current market value.</p>
              </div>
            </div>
            <div className="lg:pl-16 border-t border-paper/20 lg:border-t-0 pt-12 lg:pt-0">
              <h3 className="font-display text-2xl">Based on a Professional&apos;s Opinion</h3>
              <p className="eyebrow text-paper/70 mt-1">Professional Appraisal</p>
              <p className="mt-3 text-paper/80 text-sm leading-relaxed">An appraisal is an unbiased valuation of a home based on a professional&apos;s opinion. They are usually what mortgage companies use for home purchases and refinances. A lender usually orders a home appraisal and the cost of the appraisal, sometimes up to $500, is paid by the homeowner. An appraiser does a complete visual inspection of the interior and exterior of the home as well as recent sales of similar properties and market trends, then compiles a detailed report.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: Why Is a Valuation Important? ── */}
      <section className="mx-auto max-w-6xl px-6 lg:px-8 py-16 lg:py-24">
        <h2 className="font-display text-coral text-3xl lg:text-5xl leading-tight">Why Is a Valuation Important?</h2>
        <p className="mt-2 text-ink/60 text-sm">Situations When a Home Valuation May Be Necessary</p>
        <div className="mt-12 grid gap-0 lg:grid-cols-2 relative">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-line" />
          {[
            { eyebrow: "Refinancing", text: "Lenders base the amount of their loans on the value of your property and usually allow you to borrow a maximum of 75% to 96.5% against your property. Knowing what your home is worth allows lenders to calculate your equity in the home. The more equity you have, the better terms you will receive on your refinance." },
            { eyebrow: "Home Improvements", text: "If you're doing home improvement projects to increase the resale value, you want to make sure you're not pricing it out of the market. When you get a valuation, you can see how your home compares with others in the neighborhood and let this guide your home improvement decisions." },
            { eyebrow: "Qualifying for Credit", text: "If you want to borrow cash against your home, getting a Home Equity Line of Credit (HELOC) could be a good option. To qualify, you must have a certain level of equity in your home. Most lenders require at least 20%. Getting a home valuation will help you determine if you qualify." },
            { eyebrow: "Planning", text: "Though it's not a necessity, simply knowing the value of your home is good information to have. It will help you plan for the future and deal with unforeseen circumstances when you might be in a position that requires extra money or a quick relocation." },
          ].map((item) => (
            <div key={item.eyebrow} className="py-10 border-t hairline first:border-t-0">
              <p className="eyebrow text-coral">{item.eyebrow}</p>
              <p className="mt-3 text-ink/70 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
