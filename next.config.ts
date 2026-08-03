import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
