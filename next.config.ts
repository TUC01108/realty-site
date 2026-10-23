import type { NextConfig } from "next";

// Report-only on purpose. After about a week with no browser console
// violations, rename the header key below to Content-Security-Policy.
//
// 'unsafe-inline' covers Next.js bootstrap scripts (self.__next_f) and
// style attributes from React / next/image. Nonces would force every page
// to render dynamically and drop the static cache this site uses today.
const isDev = process.env.NODE_ENV === "development";

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https://blogger.googleusercontent.com",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self'",
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
  "worker-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

// Camera, microphone, location, and similar sensors are unused.
// Accelerometer and gyroscope stay off while the welcome video is a
// placeholder; the YouTube embed path asks for them once a URL is set.
const permissionsPolicy = [
  "accelerometer=()",
  "camera=()",
  "display-capture=()",
  "geolocation=()",
  "gyroscope=()",
  "magnetometer=()",
  "microphone=()",
  "payment=()",
  "usb=()",
  "bluetooth=()",
  "browsing-topics=()",
].join(", ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Matches every route, including the homepage. This project has no
        // i18n locales, so '/(.*)' is not rewritten away from '/'.
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: permissionsPolicy },
          {
            key: "Content-Security-Policy-Report-Only",
            value: contentSecurityPolicy,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
