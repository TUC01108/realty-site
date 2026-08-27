"use client";

import { useState } from "react";
import { areaOptions } from "@/lib/areas";

type FormState = "idle" | "submitting" | "success" | "error";

export default function BuyerMatchForm() {
  const [state, setState] = useState<FormState>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      areaSlug: (form.elements.namedItem("areaSlug") as HTMLSelectElement).value,
      timeline: (form.elements.namedItem("timeline") as HTMLSelectElement).value,
      financing: (form.elements.namedItem("financing") as HTMLSelectElement).value,
      propertyUse: (form.elements.namedItem("propertyUse") as HTMLSelectElement).value,
      budgetMax: (form.elements.namedItem("budgetMax") as HTMLInputElement).value,
      relocatingFrom: (form.elements.namedItem("relocatingFrom") as HTMLInputElement).value,
      motivation: (form.elements.namedItem("motivation") as HTMLTextAreaElement).value,
    };
    try {
      const res = await fetch("/api/buyers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setState(res.ok ? "success" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-sm bg-coral/10 border border-coral/30 p-8">
        <p className="font-display text-2xl text-coral">Mahalo!</p>
        <p className="mt-2 text-ink/70">
          Yordana will review what you are looking for and follow up personally — usually the same day if you are ready to move soon.
        </p>
      </div>
    );
  }

  const field =
    "border-b border-ink/30 bg-transparent pb-2 text-sm focus:outline-none focus:border-coral transition-colors";

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="eyebrow text-ink/60">Full name *</span>
          <input required name="name" type="text" className={field} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="eyebrow text-ink/60">Phone *</span>
          <input required name="phone" type="tel" className={field} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="eyebrow text-ink/60">Email</span>
          <input name="email" type="email" className={field} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="eyebrow text-ink/60">Preferred district</span>
          <select name="areaSlug" defaultValue="island" className={field}>
            {areaOptions.map((o) => (
              <option key={o.slug} value={o.slug}>
                {o.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="eyebrow text-ink/60">Timeline</span>
          <select name="timeline" defaultValue="90_days" className={field}>
            <option value="asap">Ready now</option>
            <option value="30_days">Within 30 days</option>
            <option value="90_days">Within 90 days</option>
            <option value="6_months">This year</option>
            <option value="browsing">Just looking</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="eyebrow text-ink/60">Financing</span>
          <select name="financing" defaultValue="not_yet" className={field}>
            <option value="cash">Cash</option>
            <option value="pre_approved">Pre-approved</option>
            <option value="pre_qualified">Pre-qualified</option>
            <option value="not_yet">Not yet</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="eyebrow text-ink/60">How will you use it?</span>
          <select name="propertyUse" defaultValue="unknown" className={field}>
            <option value="primary">Primary home</option>
            <option value="second_home">Second home</option>
            <option value="investment">Investment</option>
            <option value="land">Land</option>
            <option value="unknown">Not sure yet</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="eyebrow text-ink/60">Budget (max)</span>
          <input name="budgetMax" type="text" inputMode="numeric" placeholder="$650,000" className={field} />
        </label>
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="eyebrow text-ink/60">Relocating from</span>
          <input name="relocatingFrom" type="text" placeholder="Hilo, Bay Area, already on island…" className={field} />
        </label>
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="eyebrow text-ink/60">What should she look for?</span>
          <textarea name="motivation" rows={3} placeholder="Lock-and-leave in Waikoloa, catchment ok, need to be in before school starts…" className={`${field} placeholder:text-ink/40`} />
        </label>
      </div>
      {state === "error" ? (
        <p className="text-sm text-red-600">
          Something went wrong — please email{" "}
          <a href="mailto:yourbigislandrealestate@gmail.com" className="underline">
            yourbigislandrealestate@gmail.com
          </a>
        </p>
      ) : null}
      <button
        type="submit"
        disabled={state === "submitting"}
        className="rounded-sm bg-coral px-6 py-3 text-sm font-medium text-paper hover:bg-coral-dark disabled:opacity-60 transition-colors uppercase tracking-widest"
      >
        {state === "submitting" ? "Sending…" : "Tell Yordana what you need"}
      </button>
    </form>
  );
}
