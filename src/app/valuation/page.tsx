"use client";
import Image from "next/image";
import { useState, useRef } from "react";
type FormState = "idle"|"submitting"|"success"|"error";
export default function ValuationPage() {
  const [address, setAddress] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const formRef = useRef<HTMLDivElement>(null);
  function handleAddressSubmit(e: React.FormEvent) { e.preventDefault(); formRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }); }
  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setState("submitting");
    const form = e.currentTarget;
    const data = { name:(form.elements.namedItem("name") as HTMLInputElement).value, email:(form.elements.namedItem("email") as HTMLInputElement).value, phone:(form.elements.namedItem("phone") as HTMLInputElement).value, address, propertyType:"Not specified", notes:"" };
    try { const res = await fetch("/api/valuation",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)}); setState(res.ok?"success":"error"); }
    catch { setState("error"); }
  }
  return (
    <>
      <section className="relative h-56 sm:h-72 flex items-center justify-center">
        <Image src="/images/valuation-hero.jpeg" alt="Aerial view of Hawai'i Island coastline" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-ink/35" />
        <div className="relative text-center text-paper px-6">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl uppercase tracking-wide">How Much Is Your Home Worth?</h1>
          <p className="mt-3 text-sm sm:text-base text-paper/85">Instant property valuation&nbsp;&nbsp;|&nbsp;&nbsp;Trusted guidance&nbsp;&nbsp;|&nbsp;&nbsp;Maximize Value</p>
        </div>
      </section>
      <section className="bg-sand mt-6 lg:mt-8 py-12 lg:py-14">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <p className="eyebrow text-coral text-center mb-6">Enter Your Address to Get Started</p>
          <form onSubmit={handleAddressSubmit} className="flex items-stretch max-w-2xl mx-auto border border-coral rounded-sm overflow-hidden">
            <div className="flex items-center pl-4 text-coral/60 shrink-0"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
            <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Enter your home address…" className="flex-1 px-3 py-4 text-sm text-ink bg-transparent placeholder:text-ink/40 focus:outline-none" />
            <button type="submit" className="bg-coral text-paper px-6 py-4 text-xs font-medium eyebrow hover:bg-coral-dark transition-colors shrink-0">Get Free Valuation</button>
          </form>
        </div>
      </section>
      <section ref={formRef} className="bg-sand py-16 lg:py-20 border-t hairline">
        <div className="mx-auto max-w-xl px-6 lg:px-8">
          <p className="eyebrow text-ink/60">Free Home Valuation</p>
          <h2 className="font-display text-2xl lg:text-3xl mt-2">Get Your Instant Home Valuation</h2>
          <p className="text-ink/60 mt-2 text-sm">Enter your details to see how much your home is worth.</p>
          {state==="success" ? (
            <div className="mt-10 rounded-sm bg-coral/10 border border-coral/30 p-8"><p className="font-display text-2xl text-coral">Thank you!</p><p className="mt-2 text-ink/70">Yordana will be in touch within 24 hours with your home valuation.</p></div>
          ) : (
            <form onSubmit={handleFormSubmit} className="mt-8 grid gap-6">
              <div className="flex flex-col gap-1.5"><label className="eyebrow text-ink/60">Full Name *</label><input required name="name" type="text" className="border-b border-ink/30 bg-transparent pb-2 text-sm focus:outline-none focus:border-coral transition-colors" /></div>
              <div className="flex flex-col gap-1.5"><label className="eyebrow text-ink/60">Email *</label><input required name="email" type="email" className="border-b border-ink/30 bg-transparent pb-2 text-sm focus:outline-none focus:border-coral transition-colors" /></div>
              <div className="flex flex-col gap-1.5"><label className="eyebrow text-ink/60">Phone *</label><input required name="phone" type="tel" className="border-b border-ink/30 bg-transparent pb-2 text-sm focus:outline-none focus:border-coral transition-colors" /></div>
              {address && (<div className="flex flex-col gap-1.5"><label className="eyebrow text-ink/60">Property Address</label><p className="border-b border-ink/20 pb-2 text-sm text-ink/70">{address}</p></div>)}
              <div className="flex items-start gap-3"><input required type="checkbox" name="consent" id="consent" className="mt-1 accent-coral" /><label htmlFor="consent" className="text-xs text-ink/50 leading-relaxed">I agree to be contacted by Yordana Bolanos Salas via call, email, and text for real estate services. To opt out, reply &lsquo;stop&rsquo; at any time.</label></div>
              {state==="error" && <p className="text-sm text-red-600">Something went wrong — please email <a href="mailto:yourbigislandrealestate@gmail.com" className="underline">yourbigislandrealestate@gmail.com</a></p>}
              <button type="submit" disabled={state==="submitting"} className="rounded-sm bg-coral px-6 py-3 text-sm font-medium text-paper hover:bg-coral-dark disabled:opacity-60 transition-colors uppercase tracking-widest">{state==="submitting"?"Submitting…":"Unlock Your Free Valuation"}</button>
              <div className="flex flex-wrap gap-6 text-xs text-ink/50">{["Instant result","Sell for more","Get expert advice"].map(item => (<span key={item} className="flex items-center gap-1.5"><span className="text-coral">✓</span> {item}</span>))}</div>
            </form>
          )}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 lg:px-8 py-16 lg:py-24 grid gap-12 lg:grid-cols-2 items-start">
        <div>
          <h2 className="font-display text-coral text-3xl lg:text-5xl leading-tight">What&apos;s Your Property Worth?</h2>
          <p className="mt-6 text-ink/70 leading-relaxed">Home valuations give you valuable knowledge that can help you plan for the future and make smart decisions. It&apos;s good practice to stay informed about how much equity you have in your home and how much you may be able to borrow against it or sell it for.</p>
          <p className="mt-4 text-ink/70 leading-relaxed">Our tool provides a more robust, accurate assessment than you&apos;ll get from the major real estate portals. For the most precise valuation, reach out to discuss a customized Comparative Market Analysis or an appraisal.</p>
        </div>
        <div className="relative aspect-[4/3] rounded-sm overflow-hidden"><Image src="/images/valuation-pool.png" alt="Luxury Hawai'i property with pool" fill className="object-cover" /></div>
      </section>
      <section className="bg-coral text-paper">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-16 lg:py-24">
          <h2 className="font-display text-3xl lg:text-5xl leading-tight">How Is a Valuation Performed?</h2>
          <p className="mt-2 text-paper/80 text-sm">Two Accurate Ways to Perform Home Valuations</p>
          <div className="mt-12 grid gap-0 lg:grid-cols-2 relative">
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-paper/20" />
            <div className="lg:pr-16 pb-12 lg:pb-0">
              <h3 className="font-display text-2xl lg:text-right">Comparative Market Analysis</h3>
              <p className="mt-3 text-paper/80 text-sm leading-relaxed lg:text-right">A CMA evaluates similar homes that have recently sold in the same area, analyzing differences to determine what your home would sell for in the current market.</p>
            </div>
            <div className="lg:pl-16 border-t border-paper/20 lg:border-t-0 pt-12 lg:pt-0">
              <h3 className="font-display text-2xl">Based on a Professional&apos;s Opinion</h3>
              <p className="eyebrow text-paper/70 mt-1">Professional Appraisal</p>
              <p className="mt-3 text-paper/80 text-sm leading-relaxed">An unbiased valuation by a licensed appraiser, typically ordered by lenders. Includes a full inspection, recent comparable sales, and a detailed report.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 lg:px-8 py-16 lg:py-24">
        <h2 className="font-display text-coral text-3xl lg:text-5xl leading-tight">Why Is a Valuation Important?</h2>
        <p className="mt-2 text-ink/60 text-sm">Situations When a Home Valuation May Be Necessary</p>
        <div className="mt-12 grid gap-0 lg:grid-cols-2 relative">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-line" />
          {[
            { eyebrow:"Refinancing", text:"Lenders base loan amounts on your property's value, typically allowing you to borrow 75%–96.5% against it. The more equity you have, the better terms you'll receive." },
            { eyebrow:"Home Improvements", text:"Before investing in upgrades, a valuation shows how your home compares to others nearby — preventing over-improving beyond what the market will support." },
            { eyebrow:"Qualifying for Credit", text:"A HELOC requires a minimum equity level, usually 20%. A home valuation determines if you qualify and gives lenders the data they need to approve your loan." },
            { eyebrow:"Planning", text:"Knowing your home's value helps you plan for the future — whether that's an unexpected relocation, accessing equity, or simply staying informed about your largest asset." },
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
