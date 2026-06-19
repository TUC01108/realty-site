import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-evergreen text-paper">
      <div className="mx-auto max-w-6xl px-6 lg:px-8 py-16 grid gap-12 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl">[Agent Name]</p>
          <p className="mt-2 text-sm text-paper/70">[Brokerage Name]</p>
          <p className="mt-1 text-xs text-paper/50">DRE# [00000000]</p>
        </div>

        <div>
          <p className="eyebrow text-paper/60">Contact</p>
          <p className="mt-3 text-sm">
            <a href="tel:+10000000000" className="hover:text-brass">
              (000) 000-0000
            </a>
          </p>
          <p className="text-sm">
            <a href="mailto:agent@example.com" className="hover:text-brass">
              agent@example.com
            </a>
          </p>
          <p className="mt-3 text-sm text-paper/70">
            [Street Address]
            <br />
            [City, State ZIP]
          </p>
        </div>

        <div>
          <p className="eyebrow text-paper/60">Follow</p>
          <div className="mt-3 flex gap-4 text-sm">
            <Link href="#" className="hover:text-brass">
              Instagram
            </Link>
            <Link href="#" className="hover:text-brass">
              Facebook
            </Link>
            <Link href="#" className="hover:text-brass">
              LinkedIn
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-paper/15">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-paper/50">
          <p>© {new Date().getFullYear()} [Agent Name]. All rights reserved.</p>
          <p>Equal Housing Opportunity. [Brokerage] is independently owned and operated.</p>
        </div>
      </div>
    </footer>
  );
}
