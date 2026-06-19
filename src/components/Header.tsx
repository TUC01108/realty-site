"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const LEFT_LINKS = [
  { label: "Areas", href: "/areas" },
  { label: "Home Search", href: "/home-search" },
];

const RIGHT_LINKS = [
  { label: "Home Valuation", href: "/valuation" },
  { label: "Let's Connect", href: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur border-b hairline">
      {/*
        Logo sized to match the PDF's actual proportions: the logo circle
        there measures ~11.4% of the header bar's width. At this
        max-w-6xl (1152px) container that works out to ~128px (w-32/h-32).
        Scaled down on mobile for usability — a 128px logo would swallow
        a phone screen, so it steps down at the sm breakpoint.
      */}
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="relative grid grid-cols-[1fr_auto_1fr] items-center py-3">
          <nav className="hidden md:flex items-center justify-end gap-8">
            {LEFT_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="eyebrow text-coral hover:text-coral-dark transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link href="/" className="flex items-center justify-center px-4">
            <Image
              src="/images/logo.png"
              alt="Your Big Island Real Estate"
              width={128}
              height={160}
              className="w-16 sm:w-24 md:w-32 h-auto"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center justify-start gap-8">
            {RIGHT_LINKS.map((link) => (
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
            className="md:hidden absolute right-6 flex flex-col gap-1.5 p-2"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="block h-px w-6 bg-ink" />
            <span className="block h-px w-6 bg-ink" />
            <span className="block h-px w-6 bg-ink" />
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t hairline px-6 py-4 flex flex-col gap-4 bg-paper">
          {[...LEFT_LINKS, ...RIGHT_LINKS].map((link) => (
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
