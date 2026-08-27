"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { brand } from "@/lib/brand";

const LEFT = [
  { label: "About", href: "/about" },
  { label: "Areas", href: "/areas" },
];
const RIGHT = [
  { label: "Home Search", href: "/home-search" },
  { label: "Let's Connect", href: "/contact" },
];
const MOBILE = [
  ...LEFT,
  ...RIGHT,
  { label: "Home Valuation", href: "/valuation" },
  { label: "Guides", href: "/guides" },
  { label: "Instagram", href: brand.instagram, external: true },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur border-b hairline">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="relative grid grid-cols-[1fr_auto_1fr] items-center py-3">
          <nav className="hidden md:flex items-center justify-end gap-8">
            {LEFT.map((l) => (
              <Link key={l.href} href={l.href} className="eyebrow text-coral hover:text-coral-dark transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href="/" className="flex items-center justify-center px-4">
            <Image
              src="/images/logo-square.png"
              alt="Your Big Island Real Estate — Yordana Bolanos Salas, Hilo"
              width={128}
              height={128}
              className="w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 rounded-full object-cover"
              priority
            />
          </Link>
          <nav className="hidden md:flex items-center justify-start gap-8">
            {RIGHT.map((l) => (
              <Link key={l.href} href={l.href} className="eyebrow text-coral hover:text-coral-dark transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>
          <button aria-label="Toggle menu" className="md:hidden absolute right-0 flex flex-col gap-1.5 p-2" onClick={() => setOpen((v) => !v)}>
            <span className="block h-px w-6 bg-ink" />
            <span className="block h-px w-6 bg-ink" />
            <span className="block h-px w-6 bg-ink" />
          </button>
        </div>
      </div>
      {open && (
        <nav className="md:hidden border-t hairline px-6 py-4 flex flex-col gap-4 bg-paper">
          {MOBILE.map((l) =>
            "external" in l && l.external ? (
              <a
                key={l.href}
                href={l.href}
                className="eyebrow text-coral"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ) : (
              <Link key={l.href} href={l.href} className="eyebrow text-coral" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ),
          )}
        </nav>
      )}
    </header>
  );
}
