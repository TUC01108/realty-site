"use client";
import { useState } from "react";
type FormState = "idle"|"submitting"|"success"|"error";

export default function ContactCTA() {
  const [state, setState] = useState<FormState>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      message: String(fd.get("message") || ""),
      interest: String(fd.get("interest") || "buy"),
    };
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      setState(res.ok ? "success" : "error");
    } catch { setState("error"); }
  }

  return (
    <section className="bg-coral text-paper">
      <div className="mx-auto max-w-6xl px-6 lg:px-8 py-20 lg:py-28 grid gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow text-paper/80">Let&apos;s Connect</p>
          <h2 className="font-display text-3xl lg:text-4xl mt-3">Aloha! Let&apos;s start your Hawai&apos;i real estate journey</h2>
          <p className="mt-5 text-paper/85 max-w-md">Whether you&apos;re buying, selling, or just curious about the market, reach out and Yordana will follow up personally.</p>
        </div>
        <div>
          {state === "success" ? (
            <div className="rounded-sm bg-paper/10 border border-paper/30 p-8">
              <p className="font-display text-2xl">Mahalo!</p>
              <p className="mt-2 text-paper/85">Yordana will be in touch shortly. Check your inbox for a confirmation from hello@mail.yourbigislandrealestate.com</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="flex flex-wrap gap-5 text-sm">
                <label className="flex items-center gap-2">
                  <input type="radio" name="interest" value="buy" defaultChecked className="accent-paper" />
                  Buying
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="interest" value="sell" className="accent-paper" />
                  Selling
                </label>
              </div>
              <input required name="name" type="text" placeholder="Full name" className="rounded-sm bg-paper/10 border border-paper/30 px-4 py-3 text-sm placeholder:text-paper/60 focus:outline-none focus:border-paper transition-colors" />
              <input required name="email" type="email" placeholder="Email" className="rounded-sm bg-paper/10 border border-paper/30 px-4 py-3 text-sm placeholder:text-paper/60 focus:outline-none focus:border-paper transition-colors" />
              <input required name="phone" type="tel" placeholder="Phone" className="rounded-sm bg-paper/10 border border-paper/30 px-4 py-3 text-sm placeholder:text-paper/60 focus:outline-none focus:border-paper transition-colors" />
              <textarea name="message" placeholder="Tell us about your goals — buying, selling, timeline…" rows={4} className="rounded-sm bg-paper/10 border border-paper/30 px-4 py-3 text-sm placeholder:text-paper/60 focus:outline-none focus:border-paper transition-colors" />
              {state === "error" && <p className="text-sm text-paper/80">Something went wrong — please email <a href="mailto:yourbigislandrealestate@gmail.com" className="underline">yourbigislandrealestate@gmail.com</a></p>}
              <button type="submit" disabled={state==="submitting"} className="rounded-sm bg-paper border border-paper px-6 py-3 text-sm font-medium text-coral hover:bg-transparent hover:text-paper disabled:opacity-60 transition-colors">
                {state==="submitting" ? "Sending…" : "Submit"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
