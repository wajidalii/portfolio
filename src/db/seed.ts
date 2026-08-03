// Seeds sample content so the Skills, Experience, and Upcoming Projects
// sections render before the real facts are entered via /admin. This data
// is clearly placeholder — not sourced from a resume — per the brief's
// "do not fabricate achievements or employers" rule.
import { db } from "./client";
import { skillGroups, roles, upcomingProjects } from "./schema";

async function seed() {
  await db.delete(skillGroups);
  await db.delete(roles);
  await db.delete(upcomingProjects);

  await db.insert(skillGroups).values([
    {
      name: "Backend & Systems Design",
      glyph: "⌗",
      depth: "primary",
      sortOrder: 0,
      items: [
        "Distributed systems",
        "Event-driven arch",
        "API design (REST/gRPC)",
        "Idempotency",
        "Caching strategy",
        "PostgreSQL tuning",
        "Queues & workers",
      ],
    },
    {
      name: "SaaS Architecture",
      glyph: "◫",
      depth: "primary",
      sortOrder: 1,
      items: [
        "Multi-tenancy",
        "RBAC & auth",
        "Usage metering",
        "Billing integration",
        "Feature flags",
        "Migrations at scale",
      ],
    },
    {
      name: "AI / LLM Engineering",
      glyph: "◇",
      depth: "primary",
      sortOrder: 2,
      items: [
        "RAG pipelines",
        "Vector search",
        "Prompt architecture",
        "Structured outputs",
        "Eval harnesses",
        "Cost & latency budgets",
        "Agentic workflows",
      ],
    },
    {
      name: "Cloud & Infrastructure",
      glyph: "☁",
      depth: "strong",
      sortOrder: 3,
      items: [
        "AWS",
        "Kubernetes",
        "Terraform",
        "CI/CD",
        "Observability",
        "Incident response",
        "Cost optimisation",
      ],
    },
    {
      name: "Languages & Runtimes",
      glyph: "λ",
      depth: "strong",
      sortOrder: 4,
      items: ["TypeScript", "C# / .NET", "Go", "Python", "Node.js", "SQL", "Bash"],
    },
    {
      name: "Product & Leadership",
      glyph: "△",
      depth: "working",
      sortOrder: 5,
      items: [
        "Tech leadership",
        "ADRs & design docs",
        "Code review culture",
        "Mentoring",
        "Roadmap scoping",
        "Async collaboration",
      ],
    },
  ]);

  await db.insert(roles).values([
    {
      period: "SAMPLE — edit in /admin/experience",
      location: "Remote",
      title: "Senior Software Engineer",
      company: "Company Name (placeholder — not a real employer)",
      scope: "Platform team",
      sortOrder: 0,
      wins: ["Replace with a real, quantified outcome from your resume."],
      stack: ["TypeScript", "PostgreSQL"],
    },
  ]);

  await db.insert(upcomingProjects).values([
    {
      title: "SAMPLE — edit or delete in /admin/upcoming-projects",
      description:
        "This is placeholder content so the section isn't empty. Replace it with a real upcoming project.",
      status: "planned",
      sortOrder: 0,
      tags: ["placeholder"],
    },
  ]);

  console.log("Seed complete.");
}

seed()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => process.exit());
