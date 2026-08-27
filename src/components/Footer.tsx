import Image from "next/image";
import Link from "next/link";
import Testimonials from "@/components/Testimonials";
import { brand } from "@/lib/brand";
import { NEIGHBORHOODS } from "@/data/neighborhoods";
import { GUIDES } from "@/data/guides";

export default function Footer() {
  return (
    <footer>
      <div className="bg-coral text-paper">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-16 grid gap-10 md:grid-cols-2 items-stretch">
          <div className="flex gap-8">
            <div>
              <p className="font-display text-3xl">Contact Details</p>
              <p className="mt-4 text-sm">{brand.agentName}</p>
              <p className="text-sm text-paper/80">{brand.license}</p>
              <p className="text-sm text-paper/80 mt-1">{brand.jobTitle} · {brand.brokerage}</p>
              <p className="eyebrow text-paper/80 mt-6">Phone</p>
              <p className="text-sm mt-1">
                <a href={brand.phoneHref} className="hover:underline">
                  {brand.phone}
                </a>
              </p>
              <p className="eyebrow text-paper/80 mt-6">Email</p>
              <p className="text-sm mt-1">
                <a href={`mailto:${brand.email}`} className="hover:underline">
                  {brand.email}
                </a>
              </p>
              <p className="eyebrow text-paper/80 mt-6">Office</p>
              <p className="text-sm mt-1 text-paper/90">
                {brand.streetAddress}
                <br />
                {brand.addressLocality}, {brand.addressRegion} {brand.postalCode}
              </p>
            </div>
            <div className="w-px bg-paper/30" />
          </div>
          <div className="relative min-h-[260px] rounded-sm overflow-hidden">
            <Image src="/images/contact-wave.jpeg" alt="Ocean waves on a Big Island black sand beach" fill className="object-cover" />
          </div>
        </div>
      </div>

      <Testimonials />

      <div className="bg-paper">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-16 grid gap-12 lg:grid-cols-3">
          <div>
            <p className="font-display text-coral text-3xl">Follow</p>
            <a
              href={brand.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block eyebrow text-coral border-b border-coral pb-0.5 hover:text-coral-dark"
            >
              Instagram {brand.instagramHandle}
            </a>
            <div className="mt-8 flex items-center gap-10 flex-wrap">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                <Image src="/images/qr-code.png" alt="QR code to follow Your Big Island Real Estate" fill className="object-contain" />
              </div>
              <Image
                src="/images/logo-square.png"
                alt="Your Big Island Real Estate"
                width={112}
                height={112}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover"
              />
            </div>
          </div>
          <div>
            <p className="font-display text-coral text-2xl">About &amp; districts</p>
            <ul className="mt-4 grid gap-2 text-sm">
              <li>
                <Link href="/about" className="text-ink/70 hover:text-coral">
                  Meet Yordana
                </Link>
              </li>
              <li>
                <Link href="/areas" className="text-ink/70 hover:text-coral">
                  All nine districts
                </Link>
              </li>
              {NEIGHBORHOODS.map((n) => (
                <li key={n.slug}>
                  <Link href={`/areas/${n.slug}`} className="text-ink/70 hover:text-coral">
                    {n.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-display text-coral text-2xl">Guides</p>
            <ul className="mt-4 grid gap-2 text-sm">
              {GUIDES.map((g) => (
                <li key={g.slug}>
                  <Link href={`/guides/${g.slug}`} className="text-ink/70 hover:text-coral">
                    {g.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/guides" className="text-ink/70 hover:text-coral">
                  All guides
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-ink text-paper/70">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between gap-2 text-xs">
          <p>
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>
              {brand.agentName}, {brand.license}. {brand.brokerage}. Equal Housing Opportunity.
            </span>
            <Link href="/desk/login" className="text-paper/40 hover:text-paper/80">
              Agent desk
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
