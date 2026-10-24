// Shared by API routes and the listing form. Keep this file free of
// server-only imports so client components can use the option lists.

import { NEIGHBORHOODS } from "@/data/neighborhoods";

export const HONEYPOT_FIELD = "fax_number";

export const BUDGETS = [
  "Under $400,000",
  "$400,000 to $700,000",
  "$700,000 to $1,000,000",
  "$1,000,000 to $1,500,000",
  "$1,500,000 to $2,500,000",
  "$2,500,000 or more",
  "Not sure",
] as const;

export const PROPERTY_TYPES = ["House", "Condo", "Land", "Multi-family", "Not sure"] as const;

export const BEDROOMS = ["Any", "Studio", "1", "2", "3", "4", "5 or more"] as const;

export const LAVA_PREFERENCES = [
  "Zones 3 to 9 are fine",
  "Please avoid zones 1 and 2",
  "Not sure",
] as const;

export const CATCHMENT_OPTIONS = ["Yes", "No", "Not sure"] as const;

export const TIMELINES = [
  "As soon as possible",
  "1 to 3 months",
  "3 to 6 months",
  "6 to 12 months",
  "Just looking",
] as const;

export type ContactLead = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export type ValuationLead = {
  name: string;
  email: string;
  phone: string;
  address: string;
  propertyType: string;
  notes: string;
};

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

export type ChatLead = {
  name: string;
  email: string;
  phone: string;
  page: string;
  transcript: ChatTurn[];
};

export type ListingAlertLead = {
  name: string;
  email: string;
  phone: string;
  areas: string[];
  budget: (typeof BUDGETS)[number];
  propertyType: (typeof PROPERTY_TYPES)[number];
  bedrooms: (typeof BEDROOMS)[number];
  lavaZone: (typeof LAVA_PREFERENCES)[number];
  catchment: (typeof CATCHMENT_OPTIONS)[number];
  timeline: (typeof TIMELINES)[number];
  notes: string;
};

export type ParseResult<T> =
  | { ok: true; spam: true }
  | { ok: true; spam: false; data: T }
  | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function cleanLine(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u001F\u007F]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function cleanBlock(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function honeypotTripped(body: Record<string, unknown>): boolean {
  const value = body[HONEYPOT_FIELD];
  if (value == null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
}

function isEmail(value: string): boolean {
  return value.length <= 254 && EMAIL_RE.test(value);
}

function isPhone(value: string): boolean {
  if (!/^[0-9+().\-\s]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, "").length;
  return digits >= 7 && digits <= 15;
}

function requiredName(value: unknown): { ok: true; value: string } | { ok: false; error: string } {
  const name = cleanLine(value, 80);
  if (name.length < 2) return { ok: false, error: "Please add your name." };
  return { ok: true, value: name };
}

function requiredEmail(value: unknown): { ok: true; value: string } | { ok: false; error: string } {
  const email = cleanLine(value, 254).toLowerCase();
  if (!isEmail(email)) return { ok: false, error: "Please add a valid email." };
  return { ok: true, value: email };
}

function optionalEmail(value: unknown): { ok: true; value: string } | { ok: false; error: string } {
  const email = cleanLine(value, 254).toLowerCase();
  if (!email) return { ok: true, value: "" };
  if (!isEmail(email)) return { ok: false, error: "Please add a valid email." };
  return { ok: true, value: email };
}

function requiredPhone(value: unknown): { ok: true; value: string } | { ok: false; error: string } {
  const phone = cleanLine(value, 40);
  if (!phone) return { ok: false, error: "Please add a phone number." };
  if (!isPhone(phone)) return { ok: false, error: "Please add a valid phone number." };
  return { ok: true, value: phone };
}

function optionalPhone(value: unknown): { ok: true; value: string } | { ok: false; error: string } {
  const phone = cleanLine(value, 40);
  if (!phone) return { ok: true, value: "" };
  if (!isPhone(phone)) return { ok: false, error: "Please add a valid phone number." };
  return { ok: true, value: phone };
}

function oneOf<T extends string>(
  value: unknown,
  options: readonly T[],
  label: string,
): { ok: true; value: T } | { ok: false; error: string } {
  if (typeof value === "string" && (options as readonly string[]).includes(value)) {
    return { ok: true, value: value as T };
  }
  return { ok: false, error: `Please choose a ${label}.` };
}

function optionalPath(value: unknown): string {
  const path = cleanLine(value, 200);
  if (!path.startsWith("/") || path.startsWith("//")) return "";
  return path;
}

export function parseContact(body: Record<string, unknown>): ParseResult<ContactLead> {
  if (honeypotTripped(body)) return { ok: true, spam: true };
  const name = requiredName(body.name);
  if (!name.ok) return name;
  const email = requiredEmail(body.email);
  if (!email.ok) return email;
  const phone = requiredPhone(body.phone);
  if (!phone.ok) return phone;
  return {
    ok: true,
    spam: false,
    data: {
      name: name.value,
      email: email.value,
      phone: phone.value,
      message: cleanBlock(body.message, 4000),
    },
  };
}

export function parseValuation(body: Record<string, unknown>): ParseResult<ValuationLead> {
  if (honeypotTripped(body)) return { ok: true, spam: true };
  const name = requiredName(body.name);
  if (!name.ok) return name;
  const email = requiredEmail(body.email);
  if (!email.ok) return email;
  const phone = requiredPhone(body.phone);
  if (!phone.ok) return phone;
  return {
    ok: true,
    spam: false,
    data: {
      name: name.value,
      email: email.value,
      phone: phone.value,
      address: cleanLine(body.address, 200),
      propertyType: cleanLine(body.propertyType, 80) || "Not specified",
      notes: cleanBlock(body.notes, 2000),
    },
  };
}

export function parseChatLead(body: Record<string, unknown>): ParseResult<ChatLead> {
  if (honeypotTripped(body)) return { ok: true, spam: true };
  const name = requiredName(body.name);
  if (!name.ok) return name;
  const email = optionalEmail(body.email);
  if (!email.ok) return email;
  const phone = optionalPhone(body.phone);
  if (!phone.ok) return phone;
  if (!email.value && !phone.value) {
    return { ok: false, error: "Please add a phone number, an email, or both." };
  }
  if (!Array.isArray(body.transcript)) {
    return { ok: false, error: "Please check the form and try again." };
  }

  const transcript: ChatTurn[] = [];
  for (const item of body.transcript.slice(-20)) {
    if (!item || typeof item !== "object") continue;
    const role = (item as { role?: unknown }).role;
    const content = cleanBlock((item as { content?: unknown }).content, 2000);
    if ((role !== "user" && role !== "assistant") || !content) continue;
    transcript.push({ role, content });
  }
  if (!transcript.some((turn) => turn.role === "user")) {
    return { ok: false, error: "Please check the form and try again." };
  }

  return {
    ok: true,
    spam: false,
    data: {
      name: name.value,
      email: email.value,
      phone: phone.value,
      page: optionalPath(body.page),
      transcript,
    },
  };
}

export function parseListingAlert(body: Record<string, unknown>): ParseResult<ListingAlertLead> {
  if (honeypotTripped(body)) return { ok: true, spam: true };
  const name = requiredName(body.name);
  if (!name.ok) return name;
  const email = requiredEmail(body.email);
  if (!email.ok) return email;
  const phone = optionalPhone(body.phone);
  if (!phone.ok) return phone;

  if (!Array.isArray(body.areas) || body.areas.some((area) => typeof area !== "string")) {
    return { ok: false, error: "Please choose at least one district." };
  }
  const areas = [...new Set(body.areas as string[])];
  const known = new Set(NEIGHBORHOODS.map((area) => area.slug));
  if (areas.length === 0 || areas.length > NEIGHBORHOODS.length || areas.some((area) => !known.has(area))) {
    return { ok: false, error: "Please choose at least one district." };
  }

  const budget = oneOf(body.budget, BUDGETS, "budget range");
  if (!budget.ok) return budget;
  const propertyType = oneOf(body.propertyType, PROPERTY_TYPES, "property type");
  if (!propertyType.ok) return propertyType;
  const bedrooms = oneOf(body.bedrooms, BEDROOMS, "number of bedrooms");
  if (!bedrooms.ok) return bedrooms;
  const lavaZone = oneOf(body.lavaZone, LAVA_PREFERENCES, "lava zone preference");
  if (!lavaZone.ok) return lavaZone;
  const catchment = oneOf(body.catchment, CATCHMENT_OPTIONS, "catchment answer");
  if (!catchment.ok) return catchment;
  const timeline = oneOf(body.timeline, TIMELINES, "timeline");
  if (!timeline.ok) return timeline;
  if (body.consent !== true) {
    return { ok: false, error: "Please agree to be contacted so Yordana can send listings." };
  }

  return {
    ok: true,
    spam: false,
    data: {
      name: name.value,
      email: email.value,
      phone: phone.value,
      areas,
      budget: budget.value,
      propertyType: propertyType.value,
      bedrooms: bedrooms.value,
      lavaZone: lavaZone.value,
      catchment: catchment.value,
      timeline: timeline.value,
      notes: cleanBlock(body.notes, 4000),
    },
  };
}
