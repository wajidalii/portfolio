// Seeds content for Skills, Experience, and Upcoming Projects. Experience
// (roles) is sourced from the real resume per the brief's "do not fabricate
// achievements or employers" rule. Upcoming Projects stays placeholder
// until real ones are added via /admin.
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
      period: "Sep 2023 — Present",
      location: "Dammam, Saudi Arabia",
      title: "Software Engineer",
      company: "BDCC (Bin Delamah Contracting Co.)",
      scope: "Solo engineer — multi-tenant HRMS & enterprise systems",
      sortOrder: 0,
      wins: [
        "Solo-architected, built, and deployed a multi-tenant HRMS serving 3,000+ employees across subsidiary companies — full ownership of schema design, API, frontend, and DevOps.",
        "Built an OpenAI-powered chatbot with live DB introspection: converts natural-language HR queries into validated SQL against the live schema and returns real employee data, production-running, not a prototype.",
        "Delivered 25+ integrated production modules — payroll, leave/vacation, clearance, iqama/visa, contracts, vehicle fleet, project BOQ, cashier, bank loans, audit logs.",
        "Solo-built a separate ASP.NET Core + MSSQL stores and multi-site project management system covering inventory, material/cost/labor tracking, and reporting for engineers, surveyors, and contractors.",
        "Owned the full DevOps lifecycle: led a Windows→Linux server migration, configured Nginx + PM2 for 99.9% uptime, automated MySQL backups via cron, and set up CI/CD with GitHub Actions.",
      ],
      stack: [
        "React 18",
        "Express.js",
        "MySQL",
        "Socket.IO",
        "OpenAI API",
        "ASP.NET Core",
        "MSSQL",
        "Nginx",
        "PM2",
      ],
    },
    {
      period: "May 2024 — Mar 2025",
      location: "Remote (USA)",
      title: "Software Engineer",
      company: "Beam.ai",
      scope: "AI automation platform — integrations & agent workflows",
      sortOrder: 1,
      wins: [
        "Built and maintained OAuth2-based Nango integration flows for Google Docs, Drive, Sheets, and Slack — handling token refresh and secure data sync.",
        "Built and maintained the core AI automation platform: a type-safe, modular NestJS backend and Next.js frontend for production agentic workflows.",
      ],
      stack: ["Next.js", "NestJS", "Nango", "OAuth2", "TypeScript"],
    },
    {
      period: "Oct 2021 — Aug 2023",
      location: "Lahore, Pakistan",
      title: "Software Engineer",
      company: "Devsinc",
      scope: "Enterprise .NET/Angular — AfterSchool HQ & iHorizons platforms",
      sortOrder: 2,
      wins: [
        "Built enterprise web applications in ASP.NET MVC, .NET Core Web API, and VB.NET for AfterSchool HQ and iHorizons, two multi-client enterprise platforms.",
        "Implemented OpenID Connect (OpenIDDict) for cross-application SSO; enforced RBAC, admin impersonation, and CORS-compliant REST APIs across services.",
        "Architected CQRS with Mediator, and Repository + Unit of Work patterns; set up global exception handling via Serilog.",
        "Worked directly within enterprise governance and compliance constraints typical of large, multi-stakeholder business applications.",
      ],
      stack: ["ASP.NET MVC", ".NET Core", "VB.NET", "Azure AD B2C", "CQRS", "Serilog"],
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
