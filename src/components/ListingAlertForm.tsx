"use client";

import { useState, type ReactNode } from "react";
import Honeypot from "@/components/Honeypot";
import { NEIGHBORHOODS } from "@/data/neighborhoods";
import {
  BEDROOMS,
  BUDGETS,
  CATCHMENT_OPTIONS,
  HONEYPOT_FIELD,
  LAVA_PREFERENCES,
  PROPERTY_TYPES,
  TIMELINES,
} from "@/lib/leads";

type FormState = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "border-b border-ink/30 bg-transparent pb-2 text-sm focus:outline-none focus:border-coral transition-colors";

export default function ListingAlertForm() {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const [areas, setAreas] = useState<string[]>([]);

  function toggleArea(slug: string) {
    setAreas((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug],
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (areas.length === 0) {
      setState("error");
      setError("Please choose at least one district.");
      return;
    }
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      areas,
      budget: (form.elements.namedItem("budget") as HTMLSelectElement).value,
      propertyType: (form.elements.namedItem("propertyType") as HTMLSelectElement).value,
      bedrooms: (form.elements.namedItem("bedrooms") as HTMLSelectElement).value,
      lavaZone: (form.elements.namedItem("lavaZone") as HTMLSelectElement).value,
      catchment: (form.elements.namedItem("catchment") as HTMLSelectElement).value,
      timeline: (form.elements.namedItem("timeline") as HTMLSelectElement).value,
      notes: (form.elements.namedItem("notes") as HTMLTextAreaElement).value,
      consent: (form.elements.namedItem("consent") as HTMLInputElement).checked,
      [HONEYPOT_FIELD]: (form.elements.namedItem(HONEYPOT_FIELD) as HTMLInputElement | null)?.value ?? "",
    };
    setState("submitting");
    try {
      const res = await fetch("/api/listing-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState("error");
        setError(body.error || "Something went wrong. Please try again.");
        return;
      }
      setState("success");
    } catch {
      setState("error");
      setError("Something went wrong. Please try again.");
    }
  }

  if (state === "success") {
    return (
      <div className="mt-10 rounded-sm border border-coral/30 bg-coral/10 p-8">
        <p className="font-display text-2xl text-coral">Mahalo!</p>
        <p className="mt-2 text-ink/70">
          Yordana has what you are looking for and will email you when a listing fits. A short confirmation is on its way to your inbox.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative mt-8 grid gap-6">
      <Honeypot />
      <div className="flex flex-col gap-1.5">
        <label className="eyebrow text-ink/60" htmlFor="listing-name">Full name *</label>
        <input id="listing-name" required name="name" type="text" autoComplete="name" className={fieldClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="eyebrow text-ink/60" htmlFor="listing-email">Email *</label>
        <input id="listing-email" required name="email" type="email" autoComplete="email" className={fieldClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="eyebrow text-ink/60" htmlFor="listing-phone">Phone</label>
        <input id="listing-phone" name="phone" type="tel" autoComplete="tel" placeholder="Optional" className={fieldClass} />
      </div>
      <fieldset>
        <legend className="eyebrow text-ink/60">Areas / districts *</legend>
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
          {NEIGHBORHOODS.map((area) => (
            <label key={area.slug} className="flex items-center gap-2 text-sm text-ink/80">
              <input
                type="checkbox"
                checked={areas.includes(area.slug)}
                onChange={() => toggleArea(area.slug)}
                className="accent-coral"
              />
              {area.name}
            </label>
          ))}
        </div>
      </fieldset>
      <SelectField id="listing-budget" name="budget" label="Budget range *">
        {BUDGETS.map((option) => <option key={option}>{option}</option>)}
      </SelectField>
      <SelectField id="listing-type" name="propertyType" label="Property type *">
        {PROPERTY_TYPES.map((option) => <option key={option}>{option}</option>)}
      </SelectField>
      <SelectField id="listing-beds" name="bedrooms" label="Bedrooms *">
        {BEDROOMS.map((option) => <option key={option}>{option}</option>)}
      </SelectField>
      <SelectField id="listing-lava" name="lavaZone" label="Lava zone preference *">
        {LAVA_PREFERENCES.map((option) => <option key={option}>{option}</option>)}
      </SelectField>
      <SelectField id="listing-water" name="catchment" label="Catchment water OK? *">
        {CATCHMENT_OPTIONS.map((option) => <option key={option}>{option}</option>)}
      </SelectField>
      <SelectField id="listing-when" name="timeline" label="Timeline *">
        {TIMELINES.map((option) => <option key={option}>{option}</option>)}
      </SelectField>
      <div className="flex flex-col gap-1.5">
        <label className="eyebrow text-ink/60" htmlFor="listing-notes">Notes</label>
        <textarea id="listing-notes" name="notes" rows={4} placeholder="Optional. Anything else that matters." className={fieldClass} />
      </div>
      <div className="flex items-start gap-3">
        <input required type="checkbox" name="consent" id="listing-consent" className="mt-1 accent-coral" />
        <label htmlFor="listing-consent" className="text-xs leading-relaxed text-ink/50">
          I agree to be contacted by Yordana Bolanos Salas via call, email, and text for real estate services. To opt out, reply &lsquo;stop&rsquo; at any time.
        </label>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={state === "submitting"}
        className="rounded-sm bg-coral px-6 py-3 text-sm font-medium uppercase tracking-widest text-paper transition-colors hover:bg-coral-dark disabled:opacity-60"
      >
        {state === "submitting" ? "Sending…" : "Send My Request"}
      </button>
    </form>
  );
}

function SelectField({
  id,
  name,
  label,
  children,
}: {
  id: string;
  name: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="eyebrow text-ink/60" htmlFor={id}>{label}</label>
      <select id={id} name={name} required defaultValue="" className={fieldClass}>
        <option value="" disabled>Select one</option>
        {children}
      </select>
    </div>
  );
}
