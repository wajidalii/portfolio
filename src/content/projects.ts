// Real projects — static, owner-curated (see ARCHITECTURE.md content model).
// Live/public projects get a thum.io screenshot; private/pre-launch ones
// show a placeholder card instead.

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
  stack: string[];
  glyph: string;
  hasShot: boolean;
};

function shotUrl(url: string): string {
  return `https://image.thum.io/get/width/1200/crop/675/noanimate/${url}`;
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
    name: "HRMS — Bin Delamah Contracting Co.",
    kind: "Enterprise",
    tag: "Enterprise",
    glyph: "◫",
    href: "#contact",
    hrefLabel: "private — walkthrough on request",
    figureLabel: "module map / architecture diagram",
    figureAlt: "Placeholder for the HRMS module map diagram",
    problem:
      "A Saudi contracting enterprise (Ras Tanura / Dammam region) ran payroll, attendance, leave, recruitment and compliance across disconnected spreadsheets and legacy tools.",
    role: "Core engineer — module architecture, role-based access, data model across 30+ interdependent modules.",
    outcome:
      "A single HR system covering the full employee lifecycle, built for Saudi labour-law compliance and Arabic/English use.",
    stack: ["TypeScript", "Node.js", "PostgreSQL", "REST APIs", "RBAC", "Docker"],
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
