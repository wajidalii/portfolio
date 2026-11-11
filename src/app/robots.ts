import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

// Named groups do not inherit wildcard rules: keep exclusions identical.
// Access is permission to crawl, not a guarantee of indexing or citation.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "Claude-SearchBot",
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
        disallow: ["/admin", "/api"],
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
