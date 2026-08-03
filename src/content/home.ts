// Static, owner-curated hero/stats copy — changes rarely, so it's a local
// data file rather than DB-backed (see ARCHITECTURE.md content model).

export const heroStack = [
  "TypeScript",
  "C# / .NET",
  "Go",
  "Python",
  "PostgreSQL",
  "Kafka",
  "Kubernetes",
  "AWS",
  "Claude / OpenAI APIs",
  "Terraform",
];

export const proofPoints = [
  {
    title: "Multi-tenant SaaS, end to end",
    body: "Three products taken from prototype to paying customers.",
  },
  {
    title: "Systems that survive growth",
    body: "Redesigned a monolith path into services at 40× traffic without downtime.",
  },
  {
    title: "LLM features in production",
    body: "RAG pipelines with evals in CI and per-request cost budgets.",
  },
  {
    title: "Senior by scope, not just title",
    body: "Led 3-6 engineers, owned on-call, wrote the ADRs and the runbooks.",
  },
];

export const stats = [
  { value: "4.5", suffix: "+", label: "Years building production systems" },
  { value: "99.98", suffix: "%", label: "Uptime held on services I owned" },
  { value: "40", suffix: "×", label: "Traffic growth absorbed without a rewrite" },
  { value: "12", suffix: "", label: "Engineers mentored or onboarded" },
];
