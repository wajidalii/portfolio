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
        "Control-plane / per-tenant DBs",
        "Tenant provisioning",
        "TOTP 2FA",
        "Strangler-fig migration",
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
        "Hybrid retrieval (lexical + vector)",
        "SSE streaming",
        "Prompt-injection testing",
      ],
    },
    {
      name: "Full-stack (React + Node)",
      glyph: "◰",
      depth: "primary",
      sortOrder: 3,
      items: [
        "React 18",
        "Vite 6",
        "React Router 7",
        "TanStack Query",
        "Zustand",
        "Node 22",
        "Express 5",
        "Prisma",
        "MySQL (mysql2)",
        "Server-Sent Events",
      ],
    },
    {
      name: "Testing & Quality",
      glyph: "✓",
      depth: "strong",
      sortOrder: 4,
      items: [
        "Vitest + supertest",
        "React Testing Library",
        "Playwright visual regression",
        "Characterization tests",
        "Security & IDOR sweeps",
        "gitleaks",
      ],
    },
    {
      name: "Cloud & Infrastructure",
      glyph: "☁",
      depth: "strong",
      sortOrder: 5,
      items: [
        "AWS",
        "AWS EC2",
        "Docker & Compose",
        "Caddy (auto-TLS)",
        "GitHub Actions",
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
      sortOrder: 6,
      items: ["TypeScript", "C# / .NET", "Go", "Python", "Node.js", "SQL", "Bash"],
    },
    {
      name: "Product & Leadership",
      glyph: "△",
      depth: "working",
      sortOrder: 7,
      items: [
        "Tech leadership",
        "ADRs & design docs",
        "Code review culture",
        "Mentoring",
        "Roadmap scoping",
        "Async collaboration",
      ],
    },
    {
      name: "Portfolio Engineering (This Site)",
      glyph: "▣",
      depth: "primary",
      sortOrder: 8,
      items: [
        "Next.js 15 (App Router)",
        "React 19 Server Components",
        "TypeScript",
        "Tailwind CSS v4",
        "Drizzle ORM",
        "Neon serverless Postgres",
        "Server Actions",
        "Custom HMAC session auth",
        "Resend (transactional email)",
        "JSON-LD / dynamic OG / SEO-GEO",
        "Netlify CI/CD",
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
        "Led the end-to-end modernization of a legacy HR / payroll / fleet ERP, shipping 315 merged PRs across security hardening, backend re-architecture, a full UI redesign and multi-tenant SaaS conversion.",
        "Closed 20+ critical security vulnerabilities, including remote-code-execution and command-injection endpoints, SQL injection hotspots, unauthenticated table CRUD and plaintext password storage.",
        "Re-architected a monolithic Express app into 41 layered feature modules on Prisma using the strangler-fig pattern, protected by characterization tests so behaviour stayed identical.",
        "Converted the single-company app into a multi-tenant SaaS (live at mt.wajidali.dev): control-plane database, lazy per-tenant connection pools, automated tenant provisioning and TOTP-secured platform admins.",
        "Built an AI HR assistant: RAG with hybrid lexical + vector retrieval, allow-listed read-only SQL tools, SSE streaming and citations, with prompt-injection and data-isolation test suites.",
        "Cut the slowest APIs from 10–16 s and 5+ MB per response to 1–2 s and 2–4 KB; the Employees list went from 4.3 MB to ~2 KB and the salary sheet for 2,303 employees from 11 s to 0.3 s.",
        "Moved payroll for 2,000+ employees from the browser to the server with zero-difference parity on real months, backed by property-style tests over 3,000 generated months.",
        "Cut the initial JavaScript bundle from 3.4 MB to ~500 KB (≈85% smaller) with route-level code splitting, lazy-loaded modals and on-demand heavy libraries.",
        "Built a Task Manager product inside the app: recurring tasks, groups, attachments, direct and group chat, and real-time notifications over Server-Sent Events.",
        "Implemented a Saudi Labor Law (Art. 84/85) End-of-Service benefit engine with settlement workflow, bulk approval and CSV export.",
        "Built a safety net from zero (~1,100 client tests, ~700 server unit tests, 356 MySQL characterization tests, Playwright visual baselines at 3 viewports); automated QA sweeps found and fixed 107 hostile-input 500s and 28 ghost-delete audit bugs.",
        "Redesigned 60+ screens on a new design system (tokens, light/dark theme, shared DataTable / FormModal / FormField), responsive down to 375 px.",
        "Solo-built a separate ASP.NET Core + MSSQL stores and multi-site project management system covering inventory, material/cost/labor tracking, and reporting for engineers, surveyors, and contractors.",
        "Containerized the app (API + nginx images, Compose) and deployed it on AWS EC2 behind Caddy with automatic TLS; earlier led a Windows→Linux server migration with Nginx + PM2 and automated MySQL backups.",
      ],
      stack: [
        "React 18",
        "Vite 6",
        "TanStack Query",
        "Zustand",
        "Node 22",
        "Express 5",
        "Prisma",
        "MySQL",
        "Vitest",
        "Playwright",
        "Docker",
        "GitHub Actions",
        "AWS EC2",
        "Caddy",
        "ASP.NET Core",
        "MSSQL",
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
