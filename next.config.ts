import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // A stray lockfile in the user's home directory otherwise makes Next.js
  // misdetect the workspace root.
  outputFileTracingRoot: path.join(__dirname),
  async headers() {
    return [{ source: "/(.*)", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'" },
    ] }];
  },
  images: {
    // thum.io renders live-site screenshots for public projects in the
    // Projects section (see docs/design-reference/Portfolio.dc.html).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.thum.io",
      },
    ],
  },
};

export default nextConfig;
