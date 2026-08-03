import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // A stray lockfile in the user's home directory otherwise makes Next.js
  // misdetect the workspace root.
  outputFileTracingRoot: path.join(__dirname),
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
