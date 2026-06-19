"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Buy", href: "/listings" },
  { label: "Sell", href: "/sell" },
  { label: "Neighborhoods", href: "/neighborhoods" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur border-b hairline">
      <div className="mx-auto max-w-6xl px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="font-display text-xl tracking-wide text-ink">
          [Agent Name]
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink/80 hover:text-evergreen transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a
            href="tel:+10000000000"
            className="text-sm font-medium text-ink/80 hover:text-evergreen"
          >
            (000) 000-0000
          </a>
          <Link
            href="/contact"
            className="rounded-sm bg-evergreen px-5 py-2.5 text-sm font-medium text-paper hover:bg-evergreen-light transition-colors"
          >
            Let&apos;s Connect
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block h-px w-6 bg-ink transition-transform" />
          <span className="block h-px w-6 bg-ink" />
          <span className="block h-px w-6 bg-ink transition-transform" />
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t hairline px-6 py-4 flex flex-col gap-4 bg-paper">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink/80"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded-sm bg-evergreen px-5 py-2.5 text-sm font-medium text-paper text-center"
            onClick={() => setOpen(false)}
          >
            Let&apos;s Connect
          </Link>
        </nav>
      )}
    </header>
  );
}
