"use client";

import { useState, useRef, useEffect } from "react";
import Honeypot from "@/components/Honeypot";
import { HONEYPOT_FIELD } from "@/lib/leads";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type LeadStatus = "hidden" | "offer" | "form" | "sending" | "sent" | "declined";

const WELCOME = "Aloha! I'm Yordana's AI assistant. I can answer questions about the Big Island's nine districts, the buying and selling process, home valuations, and more. What would you like to know?";

const SUGGESTIONS = [
  "What districts are most affordable?",
  "How do I get a free home valuation?",
  "What are lava zones?",
  "How do I schedule a showing?",
];

// Buying or selling intent opens the follow-up offer on the first reply.
// Everyone else sees it after two messages. Declining never blocks the chat.
const BUY_SELL_INTENT =
  /\b(buy(?:ing|ers?|er)?|sell(?:ing|ers?|er)?|for sale|listings?|showings?|valuation|appraisal|cma|pre-?approv\w*|mortgage|relocat\w*|invest(?:ing|or|ment|ors)?|budget|looking to (?:buy|sell|move)|looking for (?:a |an )?(?:home|house|condo|property|lot|land)|want to (?:buy|sell)|home worth)\b/i;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [leadChoice, setLeadChoice] = useState<"pending" | "form" | "sending" | "sent" | "declined">("pending");
  const [leadError, setLeadError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const userMessages = messages.filter((message) => message.role === "user");
  const offerReady =
    userMessages.length >= 2 ||
    (userMessages.length >= 1 &&
      BUY_SELL_INTENT.test(userMessages.map((message) => message.content).join("\n")));
  const leadStatus: LeadStatus = leadChoice === "pending" ? (offerReady ? "offer" : "hidden") : leadChoice;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, leadStatus]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: Message = { role: "user", content };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.message || data.error }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Sorry, something went wrong. Please try again or call Yordana at 808.642.4933." }]);
    } finally {
      setLoading(false);
    }
  }

  async function submitLead(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
    const fax = (form.elements.namedItem(HONEYPOT_FIELD) as HTMLInputElement | null)?.value ?? "";
    if (!name.trim()) {
      setLeadError("Please add your name.");
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setLeadError("Add a phone number, an email, or both.");
      return;
    }
    setLeadError("");
    setLeadChoice("sending");
    try {
      const res = await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          page: window.location.pathname,
          transcript: messages,
          [HONEYPOT_FIELD]: fax,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setLeadChoice("form");
        setLeadError(data.error || "Something went wrong. Please try again, or call 808.642.4933.");
        return;
      }
      setLeadChoice("sent");
    } catch {
      setLeadChoice("form");
      setLeadError("Something went wrong. Please try again, or call 808.642.4933.");
    }
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex max-h-[min(640px,calc(100vh-8rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-sm border border-line bg-paper shadow-2xl">
          <div className="flex shrink-0 items-center justify-between bg-coral px-4 py-3 text-paper">
            <div>
              <p className="font-display text-base leading-tight">Ask Yordana&apos;s Assistant</p>
              <p className="mt-0.5 text-xs text-paper/75">AI-powered · Answers about the Big Island</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="ml-4 shrink-0 text-paper/80 transition-colors hover:text-paper"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="min-h-[200px] flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-sm px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-coral text-paper"
                      : "border border-line bg-sand text-ink"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-sm border border-line bg-sand px-3 py-2">
                  <span className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-coral/60"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {messages.length === 1 && leadStatus === "hidden" && (
            <div className="flex flex-wrap gap-1.5 px-4 pb-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-sm border border-coral px-2 py-1 text-xs text-coral transition-colors hover:bg-coral hover:text-paper"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {leadStatus === "offer" && (
            <div className="shrink-0 border-t hairline bg-sand/70 px-4 py-3">
              <p className="text-sm font-medium text-ink">Want Yordana to follow up?</p>
              <p className="mt-1 text-xs leading-relaxed text-ink/70">
                If you would like her to pick this up with you, leave your name and a phone or email. If not, keep chatting.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLeadError("");
                    setLeadChoice("form");
                  }}
                  className="rounded-sm bg-coral px-3 py-1.5 text-xs text-paper transition-colors hover:bg-coral-dark"
                >
                  Yes, please
                </button>
                <button
                  type="button"
                  onClick={() => setLeadChoice("declined")}
                  className="rounded-sm border border-line px-3 py-1.5 text-xs text-ink/70 transition-colors hover:border-coral hover:text-coral"
                >
                  No thanks
                </button>
              </div>
            </div>
          )}

          {(leadStatus === "form" || leadStatus === "sending") && (
            <form onSubmit={submitLead} className="relative shrink-0 space-y-2 border-t hairline bg-sand/70 px-4 py-3">
              <Honeypot />
              <p className="text-sm font-medium text-ink">Want Yordana to follow up?</p>
              <p className="text-xs leading-relaxed text-ink/70">A phone, an email, or both is enough.</p>
              <input
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                disabled={leadStatus === "sending"}
                className="w-full rounded-sm border border-line bg-paper px-2 py-1.5 text-sm focus:border-coral focus:outline-none disabled:opacity-60"
              />
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email"
                disabled={leadStatus === "sending"}
                className="w-full rounded-sm border border-line bg-paper px-2 py-1.5 text-sm focus:border-coral focus:outline-none disabled:opacity-60"
              />
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="Phone"
                disabled={leadStatus === "sending"}
                className="w-full rounded-sm border border-line bg-paper px-2 py-1.5 text-sm focus:border-coral focus:outline-none disabled:opacity-60"
              />
              {leadError && <p className="text-xs text-red-600">{leadError}</p>}
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={leadStatus === "sending"}
                  className="rounded-sm bg-coral px-3 py-1.5 text-xs text-paper transition-colors hover:bg-coral-dark disabled:opacity-60"
                >
                  {leadStatus === "sending" ? "Sending…" : "Send to Yordana"}
                </button>
                <button
                  type="button"
                  onClick={() => setLeadChoice("declined")}
                  disabled={leadStatus === "sending"}
                  className="rounded-sm border border-line px-3 py-1.5 text-xs text-ink/70 transition-colors hover:border-coral hover:text-coral disabled:opacity-60"
                >
                  Never mind
                </button>
              </div>
            </form>
          )}

          {leadStatus === "sent" && (
            <div className="shrink-0 border-t hairline bg-sand/70 px-4 py-3">
              <p className="text-sm text-ink">Mahalo. Yordana has your details and this conversation. You can keep chatting.</p>
            </div>
          )}

          <div className="flex shrink-0 items-center gap-2 border-t hairline px-3 py-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask a question…"
              disabled={loading}
              className="flex-1 bg-transparent text-sm placeholder:text-ink/40 focus:outline-none disabled:opacity-50"
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              aria-label="Send"
              className="shrink-0 text-coral transition-colors hover:text-coral-dark disabled:opacity-30"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>

          {leadStatus === "declined" ? (
            <p className="px-3 pb-2 text-center text-[10px] text-ink/40">
              <button type="button" onClick={() => { setLeadError(""); setLeadChoice("form"); }} className="underline">
                Want Yordana to follow up?
              </button>
              {" · "}
              <a href="tel:+18086424933" className="underline">808.642.4933</a>
            </p>
          ) : (
            <p className="px-3 pb-2 text-center text-[10px] text-ink/40">
              AI assistant · For specific advice contact{" "}
              <a href="tel:+18086424933" className="underline">808.642.4933</a>
            </p>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat assistant"}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-coral text-paper shadow-lg transition-colors hover:bg-coral-dark"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    </>
  );
}
