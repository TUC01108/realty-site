import Image from "next/image";

export default function Footer() {
  return (
    <footer>
      {/* Contact Details — coral block, text + divider on the left, wave photo on the right */}
      <div className="bg-coral text-paper">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-16 grid gap-10 md:grid-cols-2 items-stretch">
          <div className="flex gap-8">
            <div>
              <p className="font-display text-3xl">Contact Details</p>
              <p className="mt-4 text-sm">Yordana Bolanos Salas</p>
              <p className="text-sm text-paper/80">RS - 88323</p>

              <p className="eyebrow text-paper/80 mt-6">Phone</p>
              <p className="text-sm mt-1">
                <a href="tel:+18086424933" className="hover:underline">
                  808.642.4933
                </a>
              </p>

              <p className="eyebrow text-paper/80 mt-6">Email</p>
              <p className="text-sm mt-1">
                <a
                  href="mailto:yourbigislandrealestate@gmail.com"
                  className="hover:underline"
                >
                  yourbigislandrealestate@gmail.com
                </a>
              </p>

              <p className="eyebrow text-paper/80 mt-6">Address</p>
              <p className="text-sm mt-1 text-paper/90">
                101 Hualalai Street
                <br />
                Hilo, Hawaii 96720
              </p>
            </div>
            <div className="w-px bg-paper/30" />
          </div>

          <div className="relative min-h-[260px] rounded-sm overflow-hidden">
            <Image
              src="/images/contact-wave.png"
              alt="Ocean waves on a Big Island black sand beach"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Follow for Updates — QR code, logo, handle */}
      <div className="bg-paper">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-16">
          <p className="font-display text-coral text-3xl">Follow for Updates</p>

          <div className="mt-8 flex items-center gap-10 flex-wrap">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40">
              <Image
                src="/images/qr-code.png"
                alt="QR code to follow Your Big Island Real Estate"
                fill
                className="object-contain"
              />
            </div>

            <Image
              src="/images/logo-square.png"
              alt="Your Big Island Real Estate"
              width={112}
              height={112}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover"
            />
          </div>

          <p className="mt-6 eyebrow text-coral">
            @yourbigislandrealestate
          </p>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="bg-ink text-paper/70">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between gap-2 text-xs">
          <p>© {new Date().getFullYear()} Your Big Island Real Estate. All rights reserved.</p>
          <p>Coldwell Banker Island Properties. Equal Housing Opportunity.</p>
        </div>
      </div>
    </footer>
  );
}
