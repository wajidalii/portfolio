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
      name: "AI / LLM Engineering",
      glyph: "◇",
      depth: "primary",
      sortOrder: 1,
      items: [
        "RAG pipelines",
        "Vector search",
        "Prompt architecture",
        "Structured outputs",
        "Eval harnesses",
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
