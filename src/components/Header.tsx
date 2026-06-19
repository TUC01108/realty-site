"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Areas", href: "/areas" },
  { label: "Home Search", href: "/home-search" },
  { label: "Home Valuation", href: "/valuation" },
  { label: "Let's Connect", href: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur border-b hairline">
      <div className="mx-auto max-w-6xl px-6 lg:px-8 h-24 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Your Big Island Real Estate"
            width={56}
            height={56}
            className="rounded-full"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="eyebrow text-coral hover:text-coral-dark transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block h-px w-6 bg-ink" />
          <span className="block h-px w-6 bg-ink" />
          <span className="block h-px w-6 bg-ink" />
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t hairline px-6 py-4 flex flex-col gap-4 bg-paper">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="eyebrow text-coral"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
