// Static, owner-curated About copy (see ARCHITECTURE.md content model).
// The "quick facts" list is mirrored into Person/JobTitle JSON-LD in the
// SEO phase so answer engines can quote it directly (GEO requirement).

export const aboutParagraphs = [
  "I started in web engineering and moved quickly toward the parts of the stack where correctness compounds: data models, service boundaries, queues, caches, and the observability that tells you the truth at 3am. Over 4.5+ years I've taken three SaaS products from prototype to paying, multi-tenant production.",
  {
    bold: "“Scalable systems”",
    rest: " in my work means capacity that is a config change rather than a rewrite: stateless services, idempotent workers, explicit backpressure, and load-tested assumptions written down as SLOs.",
  },
  {
    bold: "“AI-first”",
    rest: " means the LLM is a component with a contract, not a magic layer — retrieval you can inspect, evals in CI, structured outputs, cost and latency budgets per request, and graceful degradation when the model is wrong.",
  },
  "I work best with product-minded teams across time zones: written-first, small PRs, decisions in ADRs. Outside work I mentor junior engineers and rebuild my homelab more often than I should.",
] as const;

export const quickFacts = [
  { k: "role", v: "Senior Software Engineer" },
  { k: "exp", v: "4.5+ years" },
  { k: "focus", v: "Scalable systems · AI-first SaaS" },
  { k: "core", v: "TypeScript · Go · Python" },
  { k: "work", v: "Remote · Relocation" },
  { k: "lang", v: "English (professional), Urdu" },
];
