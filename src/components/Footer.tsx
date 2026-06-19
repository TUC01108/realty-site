import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-coral text-paper">
      <div className="mx-auto max-w-6xl px-6 lg:px-8 py-16 grid gap-12 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl">Contact Details</p>
          <p className="mt-3 text-sm">Yordana Bolanos Salas</p>
          <p className="text-sm text-paper/80">RS - 88323</p>
        </div>

        <div>
          <p className="eyebrow text-paper/80">Get in touch</p>
          <p className="mt-3 text-sm">
            <a href="tel:+18086424933" className="hover:underline">
              808.642.4933
            </a>
          </p>
          <p className="text-sm">
            <a
              href="mailto:yourbigislandrealestate@gmail.com"
              className="hover:underline"
            >
              yourbigislandrealestate@gmail.com
            </a>
          </p>
          <p className="mt-3 text-sm text-paper/80">
            101 Hualalai Street
            <br />
            Hilo, Hawaii 96720
          </p>
        </div>

        <div>
          <p className="eyebrow text-paper/80">Follow for updates</p>
          <p className="mt-3 text-sm">@yourbigislandrealestate</p>
          <Image
            src="/images/logo.png"
            alt="Your Big Island Real Estate"
            width={48}
            height={48}
            className="mt-4 rounded-full"
          />
        </div>
      </div>

      <div className="border-t border-paper/25">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-paper/80">
          <p>© {new Date().getFullYear()} Your Big Island Real Estate. All rights reserved.</p>
          <p>Coldwell Banker Island Properties. Equal Housing Opportunity.</p>
        </div>
      </div>
    </footer>
  );
}
