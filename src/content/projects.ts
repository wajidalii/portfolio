// Real projects — static, owner-curated (see ARCHITECTURE.md content model).
// Live/public projects get a thum.io screenshot; private/pre-launch ones
// show a placeholder card instead. Shots are 800×500: the card frame is
// 16:10 and at most ~400 CSS px wide, so this covers 2× screens.

export type Project = {
  name: string;
  kind: string;
  tag: "SaaS" | "AI" | "Enterprise";
  href: string;
  hrefLabel: string;
  figureLabel: string;
  figureAlt: string;
  problem: string;
  role: string;
  outcome: string;
  highlights?: string[];
  stack: string[];
  glyph: string;
  hasShot: boolean;
};

function shotUrl(url: string): string {
  return `https://image.thum.io/get/width/800/crop/500/noanimate/${url}`;
}

const raw: Omit<Project, "hasShot">[] = [
  {
    name: "ReelBridge",
    kind: "Building now",
    tag: "SaaS",
    glyph: "▷",
    href: "#contact",
    hrefLabel: "early access",
    figureLabel: "product screenshot — scheduler + metrics dashboard",
    figureAlt: "Placeholder for a ReelBridge scheduling and analytics dashboard screenshot",
    problem:
      "Creators re-upload the same video to Facebook, Instagram and YouTube by hand, one platform at a time, then check three dashboards to see how it performed.",
    role: "Founder & engineer — monorepo architecture, platform adapter interface, OAuth token handling, job pipeline.",
    outcome:
      "One-click publish and scheduling to all connected accounts, with engagement metrics unified in a single dashboard.",
    stack: ["TypeScript", "React (Vite)", "Express", "BullMQ", "Redis", "Zod", "OAuth 2.0", "Meta Graph API", "YouTube Data API"],
  },
  {
    name: "Multi-tenant SaaS HRMS",
    kind: "SaaS",
    tag: "SaaS",
    glyph: "◰",
    href: "https://mt.wajidali.dev",
    hrefLabel: "mt.wajidali.dev",
    figureLabel: "product screenshot — platform console + tenant dashboard",
    figureAlt: "Screenshot of the multi-tenant SaaS HRMS",
    problem:
      "A single-company HR / payroll / fleet ERP had to serve many companies, each with its own data, administrators, branding and seats, without forking the codebase.",
    role: "Solo engineer — tenancy design, control plane, platform console, AI assistant, Task Manager and deployment.",
    outcome:
      "One codebase serving isolated tenants, provisioned from a platform console and deployed publicly on AWS with automatic TLS.",
    highlights: [
      "Control-plane database with a company registry, its own migration runner and organization-scoped login.",
      "Lazy, bounded per-tenant connection pools: at most 20 Prisma clients open at once, with LRU eviction and idle connections closed after 60 s.",
      "Platform admins with TOTP 2FA, automated tenant provisioning, seats, enable/disable, role catalog and server-driven branding.",
      "AI HR assistant: RAG with hybrid lexical + vector retrieval, allow-listed read-only SQL tools, SSE streaming and citations, tested against a prompt-injection corpus and tenant/IDOR isolation suites.",
      "Task Manager product: recurring tasks, groups, attachments, direct and group chat, and real-time notifications over Server-Sent Events.",
      "Containerized (API + nginx images, Compose) and deployed on AWS EC2 behind Caddy with automatic TLS.",
    ],
    stack: ["React 18", "Vite 6", "TanStack Query", "Node 22", "Express 5", "Prisma", "MySQL", "TOTP 2FA", "RAG", "SSE", "Docker", "AWS EC2", "Caddy"],
  },
  {
    name: "HRMS — Bin Delamah Contracting Co.",
    kind: "Enterprise",
    tag: "Enterprise",
    glyph: "◫",
    href: "#contact",
    hrefLabel: "private — walkthrough on request",
    figureLabel: "module map / architecture diagram",
    figureAlt: "Placeholder for the HRMS module map diagram",
    problem:
      "A Saudi contracting company ran HR, payroll for 2,000+ employees and its vehicle fleet on a legacy ERP with critical security holes, 10–16 s screens and no tests.",
    role: "Lead engineer — security hardening, backend re-architecture, performance, payroll engine and full UI redesign (315 merged PRs).",
    outcome:
      "A secure, tested, modular system: the heaviest screens went from 10–16 s and 5+ MB per response to 1–2 s and 2–4 KB.",
    highlights: [
      "Closed 20+ critical vulnerabilities, including remote-code-execution and command-injection routes, SQL injection and plaintext passwords.",
      "Split a monolithic Express app into 41 feature modules on Prisma (strangler-fig), with characterization tests keeping behaviour identical.",
      "Moved payroll to the server with zero-difference parity on real months; salary sheet for 2,303 employees went from 11 s to 0.3 s.",
      "Cut the JavaScript entry bundle from 3.4 MB to ~500 KB with route-level code splitting into 122 chunks.",
      "Built a Saudi Labor Law (Art. 84/85) End-of-Service engine with settlement workflow, bulk approval and CSV export.",
      "Redesigned 60+ screens on a design system with light/dark themes, responsive down to 375 px.",
    ],
    stack: ["React 18", "Vite 6", "TanStack Query", "Zustand", "Express 5", "Prisma", "MySQL", "Vitest", "Playwright", "GitHub Actions"],
  },
  {
    name: "Beam AI",
    kind: "AI / Agents",
    tag: "AI",
    glyph: "◇",
    href: "https://beam.ai/",
    hrefLabel: "beam.ai",
    figureLabel: "product screenshot — agent workflow builder",
    figureAlt: "Placeholder for a Beam AI product screenshot",
    problem:
      "Enterprise teams needed AI agents that execute real back-office workflows, not chat demos — reliably, with human oversight.",
    role: "Engineer — agent workflow surfaces plus the integration layer wiring LLM steps to business systems via Nango, n8n and similar integration platforms.",
    outcome: "Production agentic workflows with inspectable steps and human-in-the-loop checkpoints.",
    stack: ["TypeScript", "Next.js", "NestJS", "Nango", "n8n", "LLM APIs", "Workflow orchestration", "REST/webhooks"],
  },
  {
    name: "ENBIOSIS",
    kind: "AI / Health",
    tag: "AI",
    glyph: "◈",
    href: "https://enbiosis.com/",
    hrefLabel: "enbiosis.com",
    figureLabel: "product screenshot — microbiome report UI",
    figureAlt: "Placeholder for an ENBIOSIS microbiome report screenshot",
    problem:
      "Microbiome sequencing produces dense biological data that has to become a personalised, readable nutrition plan for non-technical users.",
    role: "Engineer — data-driven report interfaces and the services delivering personalised results.",
    outcome: "AI-generated personalised nutrition reports delivered to consumers and clinicians.",
    stack: ["TypeScript", "React", "Node.js", "PostgreSQL", "Data pipelines", "AWS"],
  },
  {
    name: "AfterSchool HQ",
    kind: "SaaS",
    tag: "SaaS",
    glyph: "◱",
    href: "https://afterschoolhq.com/login",
    hrefLabel: "afterschoolhq.com",
    figureLabel: "product screenshot — programme management dashboard",
    figureAlt: "Placeholder for an AfterSchool HQ dashboard screenshot",
    problem:
      "After-school programme operators juggled enrolment, rosters, payments and parent communication across tools that didn't talk to each other.",
    role: "Engineer — multi-role SaaS features across admin, staff and parent surfaces.",
    outcome: "One platform for enrolment, scheduling, billing and parent communication.",
    stack: ["C#", ".NET", "ASP.NET Core", "SQL Server", "React", "TypeScript", "Stripe", "REST APIs"],
  },
  {
    name: "iHorizons",
    kind: "Enterprise",
    tag: "Enterprise",
    glyph: "⌗",
    href: "https://www.ihorizons.com/",
    hrefLabel: "ihorizons.com",
    figureLabel: "screenshot — enterprise digital platform",
    figureAlt: "Placeholder for an iHorizons platform screenshot",
    problem:
      "Regional enterprise and government clients needed large-scale digital platforms built to strict performance, security and accessibility requirements.",
    role: "Engineer — client-facing platform delivery within an enterprise engineering team.",
    outcome: "Shipped enterprise-grade digital products for clients across the Gulf region.",
    stack: ["C#", ".NET", "ASP.NET Core", "SQL Server", "JavaScript/TypeScript", "CI/CD", "Cloud hosting"],
  },
];

export const projects: Project[] = raw.map((p) => ({
  ...p,
  hasShot: p.href.startsWith("http"),
}));

export const projectFilters = ["All", "SaaS", "AI", "Enterprise"] as const;

export function shotSrc(p: Project): string {
  return shotUrl(p.href);
}
