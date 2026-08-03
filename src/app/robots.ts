import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

// AI/answer-engine crawlers explicitly allowed (GEO requirement) — left
// off the default allowlist by most sites, called out here on purpose so
// this profile is findable by AI-based recommendation tools, not just
// classic search.
const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "PerplexityBot",
  "Google-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
