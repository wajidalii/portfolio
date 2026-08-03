import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

// Baseline rules for search engines. The GEO phase (issue #14) adds
// explicit allow rules for AI/answer-engine crawlers (GPTBot, ClaudeBot,
// PerplexityBot, Google-Extended, CCBot) on top of this.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
