import { Resend } from "resend";
import { NEIGHBORHOODS } from "@/data/neighborhoods";
import type { ChatLead, ContactLead, ListingAlertLead, ValuationLead } from "@/lib/leads";
import { escapeHtml } from "@/lib/leads";

const FROM = "hello@mail.yourbigislandrealestate.com";
const TO = "yourbigislandrealestate@gmail.com";

// Day-3 valuation note links Yordana's seller post about getting ready to sell.
const SELLER_PREP_TITLE = "What No One Tells You Before Selling Your Home on Hawai'i's Big Island";
const SELLER_PREP_URL = "https://yourbigislandrealestate.blogspot.com/2026/07/what-no-one-tells-you-before-selling.html";

// Set VALUATION_FOLLOWUPS=false in Vercel to stop scheduling new day-3 and
// day-7 valuation emails. Emails already scheduled still send until they are
// cancelled in the Resend dashboard. No database or cron is required.
export function valuationFollowUpsEnabled(): boolean {
  const raw = process.env.VALUATION_FOLLOWUPS;
  if (raw == null || raw.trim() === "") return true;
  return !["0", "false", "off", "no"].includes(raw.trim().toLowerCase());
}

export function scheduledIsoDaysFromNow(days: number, now = Date.now()): string {
  return new Date(now + days * 24 * 60 * 60 * 1000).toISOString();
}

let client: Resend | null = null;

function resend(): Resend {
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

type Outbound = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  scheduledAt?: string;
};

async function deliver(message: Outbound, required: boolean): Promise<void> {
  const payload = {
    from: FROM,
    to: message.to,
    subject: message.subject,
    html: message.html,
    replyTo: message.replyTo,
    scheduledAt: message.scheduledAt,
  };

  if (!process.env.RESEND_API_KEY) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY is not set");
    }
    console.info(
      "[email mock]",
      JSON.stringify({
        to: payload.to,
        subject: payload.subject,
        replyTo: payload.replyTo ?? null,
        scheduledAt: payload.scheduledAt ?? null,
        html: payload.html,
      }),
    );
    return;
  }

  try {
    const { error } = await resend().emails.send(payload);
    if (error) throw new Error(error.message);
  } catch (err) {
    if (required) throw err;
    console.error("Optional email failed:", err);
  }
}

function firstName(name: string): string {
  return name.split(" ")[0] || "";
}

function shell(kicker: string, bodyHtml: string): string {
  return `<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;"><div style="background:#ff4c4c;padding:32px;text-align:center;"><p style="color:white;font-size:13px;letter-spacing:0.15em;text-transform:uppercase;margin:0;">${escapeHtml(kicker)}</p></div><div style="padding:40px 32px;">${bodyHtml}</div><div style="border-top:1px solid #e8e3dc;padding:24px 32px;font-size:11px;color:#999;text-align:center;">Yordana Bolanos Salas · RS-88323 · Coldwell Banker Island Properties</div></div>`;
}

function textParagraph(text: string): string {
  return `<p style="font-size:16px;line-height:1.7;margin:0 0 20px;">${escapeHtml(text)}</p>`;
}

function htmlParagraph(html: string): string {
  return `<p style="font-size:16px;line-height:1.7;margin:0 0 20px;">${html}</p>`;
}

function signoff(): string {
  return `<p style="font-size:16px;line-height:1.7;margin:0;">Mahalo nui,<br/><strong>Yordana</strong></p>`;
}

function display(value: string): string {
  return value.trim() ? value : "Not provided";
}

function notification(subject: string, fields: Record<string, string>, note?: string): string {
  const rows = Object.entries(fields)
    .map(([key, value]) => {
      const cell = escapeHtml(display(value)).replace(/\n/g, "<br/>");
      return `<tr><td style="padding:8px 12px;font-size:12px;text-transform:uppercase;color:#999;vertical-align:top;">${escapeHtml(key)}</td><td style="padding:8px 12px;font-size:14px;line-height:1.5;">${cell}</td></tr>`;
    })
    .join("");
  const noteHtml = note
    ? `<p style="font-size:14px;line-height:1.6;margin:24px 0 0;">${escapeHtml(note)}</p>`
    : "";
  return `<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;"><div style="background:#ff4c4c;padding:24px 32px;"><p style="color:white;font-size:18px;margin:0;">${escapeHtml(subject)}</p></div><div style="padding:32px;"><table style="width:100%;border-collapse:collapse;">${rows}</table>${noteHtml}</div></div>`;
}

function contactAutoReply(name: string): string {
  const first = firstName(name);
  return shell(
    "Your Big Island Real Estate",
    [
      textParagraph(`Aloha${first ? ` ${first}` : ""},`),
      textParagraph("Thank you for trusting me to help you on your real estate journey. I'm currently reviewing all the information you shared and will be in touch with you soon."),
      htmlParagraph(
        `In the meantime, feel free to follow me on social media <a href="https://www.instagram.com/yourbigislandrealestate" style="color:#ff4c4c;">@yourbigislandrealestate</a>.`,
      ),
      signoff(),
    ].join(""),
  );
}

function valuationAutoReply(lead: ValuationLead): string {
  const first = firstName(lead.name);
  const addressLine = lead.address ? `You asked about ${lead.address}. ` : "";
  return shell(
    "Your Big Island Real Estate",
    [
      textParagraph(`Aloha${first ? ` ${first}` : ""},`),
      textParagraph(
        `${addressLine}Thank you for asking about your home. I will review it myself and email you a personal valuation within 24 hours. This is not an instant estimate.`,
      ),
      textParagraph("If you want to talk sooner, call or text me at 808.642.4933."),
      htmlParagraph(
        `In the meantime, feel free to follow me on social media <a href="https://www.instagram.com/yourbigislandrealestate" style="color:#ff4c4c;">@yourbigislandrealestate</a>.`,
      ),
      signoff(),
    ].join(""),
  );
}

function valuationFollowUp(lead: ValuationLead, which: "day3" | "day7"): { subject: string; html: string } {
  const first = firstName(lead.name);
  const greeting = textParagraph(`Aloha${first ? ` ${first}` : ""},`);
  if (which === "day3") {
    const addressLine = lead.address ? ` I have your note for ${lead.address}.` : "";
    return {
      subject: "Preparing to sell on the Big Island",
      html: shell(
        "Your Big Island Real Estate",
        [
          greeting,
          textParagraph(
            `I am putting together your personal home valuation.${addressLine} If you are getting ready to sell, this is a post I wrote for Big Island owners:`,
          ),
          htmlParagraph(
            `<a href="${SELLER_PREP_URL}" style="color:#ff4c4c;">${escapeHtml(SELLER_PREP_TITLE)}</a>`,
          ),
          textParagraph("Read it only if it is useful. You do not need to reply."),
          signoff(),
        ].join(""),
      ),
    };
  }
  return {
    subject: "Want a walkthrough?",
    html: shell(
      "Your Big Island Real Estate",
      [
        greeting,
        textParagraph(
          lead.address
            ? `It has been about a week since you asked what ${lead.address} is worth. If you would like, I can walk the property with you and talk through what buyers tend to notice.`
            : "It has been about a week since you asked what your home is worth. If you would like, I can walk the property with you and talk through what buyers tend to notice.",
        ),
        textParagraph("Reply to this email or call me at 808.642.4933. If now is not the right time, you can ignore this note."),
        signoff(),
      ].join(""),
    ),
  };
}

function listingAutoReply(name: string): string {
  const first = firstName(name);
  return shell(
    "Your Big Island Real Estate",
    [
      textParagraph(`Aloha${first ? ` ${first}` : ""},`),
      textParagraph("I received what you are looking for. I will email you when I have listings that fit."),
      textParagraph("If you want to talk sooner, call or text me at 808.642.4933."),
      signoff(),
    ].join(""),
  );
}

function chatAutoReply(name: string): string {
  const first = firstName(name);
  return shell(
    "Your Big Island Real Estate",
    [
      textParagraph(`Aloha${first ? ` ${first}` : ""},`),
      textParagraph("I have your note from the website chat, along with the conversation, and I will follow up with you."),
      textParagraph("You can also reach me at 808.642.4933."),
      signoff(),
    ].join(""),
  );
}

function transcriptText(lead: ChatLead): string {
  return lead.transcript
    .map((turn) => `${turn.role === "user" ? "Visitor" : "Assistant"}: ${turn.content}`)
    .join("\n\n");
}

function districtLabel(slugs: string[]): string {
  return slugs
    .map((slug) => NEIGHBORHOODS.find((area) => area.slug === slug)?.name ?? slug)
    .join(", ");
}

export async function sendContactEmails(lead: ContactLead): Promise<void> {
  await deliver(
    {
      to: TO,
      replyTo: lead.email,
      subject: `New contact from ${lead.name}`,
      html: notification("New Contact Submission", {
        Name: lead.name,
        Email: lead.email,
        Phone: lead.phone,
        Message: lead.message,
      }),
    },
    true,
  );
  await deliver(
    {
      to: lead.email,
      replyTo: TO,
      subject: "Aloha! Thank you for reaching out — Your Big Island Real Estate",
      html: contactAutoReply(lead.name),
    },
    false,
  );
}

export async function sendValuationEmails(lead: ValuationLead): Promise<void> {
  await deliver(
    {
      to: TO,
      replyTo: lead.email,
      subject: `New valuation request from ${lead.name}`,
      html: notification(
        "New Home Valuation Request",
        {
          Name: lead.name,
          Email: lead.email,
          Phone: lead.phone,
          "Property Address": lead.address,
          "Property Type": lead.propertyType,
          Notes: lead.notes,
        },
        "This visitor was told you will email a personal valuation within 24 hours. The site no longer promises an instant number.",
      ),
    },
    true,
  );
  await deliver(
    {
      to: lead.email,
      replyTo: TO,
      subject: "Aloha! Your personal home valuation is on the way",
      html: valuationAutoReply(lead),
    },
    false,
  );

  if (!valuationFollowUpsEnabled()) {
    console.info("Valuation follow-ups skipped because VALUATION_FOLLOWUPS is off.");
    return;
  }

  const day3 = valuationFollowUp(lead, "day3");
  const day7 = valuationFollowUp(lead, "day7");
  await deliver(
    { to: lead.email, replyTo: TO, subject: day3.subject, html: day3.html, scheduledAt: scheduledIsoDaysFromNow(3) },
    false,
  );
  await deliver(
    { to: lead.email, replyTo: TO, subject: day7.subject, html: day7.html, scheduledAt: scheduledIsoDaysFromNow(7) },
    false,
  );
}

export async function sendChatLeadEmails(lead: ChatLead): Promise<void> {
  await deliver(
    {
      to: TO,
      replyTo: lead.email || undefined,
      subject: `Chat follow-up from ${lead.name}`,
      html: notification(
        "Chat Follow-up Request",
        {
          Name: lead.name,
          Email: lead.email,
          Phone: lead.phone,
          Page: lead.page,
          Transcript: transcriptText(lead),
        },
        "They asked you to follow up on this chat. Reply to them directly. The chat itself does not contact them again.",
      ),
    },
    true,
  );
  if (!lead.email) return;
  await deliver(
    {
      to: lead.email,
      replyTo: TO,
      subject: "Aloha! Yordana will follow up on your chat",
      html: chatAutoReply(lead.name),
    },
    false,
  );
}

export async function sendListingAlertEmails(lead: ListingAlertLead): Promise<void> {
  await deliver(
    {
      to: TO,
      replyTo: lead.email,
      subject: `Listing request from ${lead.name}`,
      html: notification(
        "New Listing Request",
        {
          Name: lead.name,
          Email: lead.email,
          Phone: lead.phone,
          Districts: districtLabel(lead.areas),
          Budget: lead.budget,
          "Property Type": lead.propertyType,
          Bedrooms: lead.bedrooms,
          "Lava Zone": lead.lavaZone,
          "Catchment Water OK": lead.catchment,
          Timeline: lead.timeline,
          Notes: lead.notes,
        },
        "They asked you to send matching listings. Nothing is emailed to them automatically when a home is listed.",
      ),
    },
    true,
  );
  await deliver(
    {
      to: lead.email,
      replyTo: TO,
      subject: "Aloha! I received what you are looking for",
      html: listingAutoReply(lead.name),
    },
    false,
  );
}
