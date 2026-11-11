import type { ServiceId } from "./services";

export type ServiceCaseStudy = {
  id: string;
  name: string;
  category: string;
  service: ServiceId;
  overview: string;
  problem: string;
  solution: string;
  stack: string[];
  decisions: string;
  outcome: string;
  disclaimer: string;
  href: string;
  repository: string;
  repositoryPublic?: boolean;
  liveUnavailable?: boolean;
  evidencePath: string;
  image?: string;
  imageAlt?: string;
};

/** Facts are bounded by the evidence ledger, not extrapolated into client metrics. */
export const serviceCaseStudies: ServiceCaseStudy[] = [
  {
    image: "/services/cases/hrms.webp", imageAlt: "Public hrms website preview captured during the evidence review",
    id: "hrms", name: "Multi-Tenant HRMS", category: "Business software", service: "saas",
    overview: "Workforce, fleet and project-management software for organizations with subsidiary companies.",
    problem: "Company-specific workflows and information need a coherent application without losing organizational boundaries.",
    solution: "An HR platform with employee, vacation, salary, vehicle and task workflows, plus tenant administration surfaces.",
    stack: ["React", "TypeScript / JavaScript", "Express", "MySQL", "Prisma"],
    decisions: "The source separates a platform console from tenant-facing modules and includes tenant provisioning and authorization test suites. These are repository-visible engineering choices, not an independent security certification.",
    outcome: "A public marketing page and repository with multi-company modules, platform administration and automated test sources. Private HR workflows were not accessed during this audit.",
    disclaimer: "No employee information or private tenant screens are reproduced. Repository inspection does not establish production usage or client results.",
    href: "https://hr.wajidali.dev", repository: "https://github.com/wajidalii/bdcc-hr", evidencePath: "README.md · client/src/platform · server/test/platform",
  },
  {
    image: "/services/cases/knowledgecity.webp", imageAlt: "Public knowledgecity website preview captured during the evidence review",
    id: "knowledgecity", name: "KnowledgeCity Independent Redesign", category: "Independent demonstration", service: "website",
    overview: "An independent workforce-platform marketing redesign exploring clearer information hierarchy and interaction.",
    problem: "Explore how a complex learning and workforce offer can be presented in a more cohesive digital experience.",
    solution: "A Next.js marketing experience organized around platform capabilities, industries, integrations and demo requests.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    decisions: "Reusable section components, shared motion presets and a static fallback for deferred 3D are documented in the repository architecture. Public copy is distinct from the engineering demonstration.",
    outcome: "A publicly linked redesign and inspectable source. No independently verified before/after speed or conversion increase is claimed.",
    disclaimer: "Unofficial, independent demonstration. Not commissioned by, affiliated with or endorsed by KnowledgeCity. Brand names belong to their owners.",
    href: "https://kc.wajidali.dev", repository: "https://github.com/wajidalii/knowledgecity-clone", evidencePath: "package.json · docs/ARCHITECTURE.md",
  },
  {
    image: "/services/cases/mortgage.webp", imageAlt: "Public mortgage website preview captured during the evidence review",
    id: "mortgage", name: "Mortgage Calculator", category: "Technical assignment", service: "saas",
    overview: "A browser-based mortgage planning calculator built for a KnowledgeCity technical assignment.",
    problem: "A useful mortgage estimate needs more than principal and interest: assumptions, recurring costs and loan trade-offs must be explicit.",
    solution: "Purchase estimates, amortization, fixed/ARM comparisons, refinance break-even and printable planning reports share calculation logic.",
    stack: ["React", "TypeScript", "Vite", "Vitest"],
    decisions: "The source represents money in integer cents, keeps calculations in the browser and includes unit-test sources for amortization, ARM schedules and validation. Assumptions and hypothetical rates are labeled.",
    outcome: "Inspectable calculation and test sources and a public calculator demo. Repository tests were inspected, not re-run as part of the services-page build.",
    disclaimer: "Technical assignment, not a commissioned website redesign or an endorsed lender product. Outputs are planning estimates, not financial advice.",
    href: "https://arm.wajidali.dev", repository: "https://github.com/wajidalii/mortgage-calculator", repositoryPublic: true, evidencePath: "README.md · src/lib/money.ts · src/features/calculator/*.test.ts",
  },
  {
    image: "/services/cases/cloudcard.webp", imageAlt: "Public cloudcard website preview captured during the evidence review",
    id: "cloudcard", name: "CloudCard Independent Redesign", category: "Independent demonstration", service: "website",
    overview: "An unofficial fintech marketing-site redesign focused on structure, accessibility and purposeful interaction.",
    problem: "Demonstrate how a multi-page fintech offer can remain navigable and consistent across desktop and mobile.",
    solution: "A prerendered React experience with platform, solutions, careers and contact routes, supported by shared design tokens.",
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Playwright"],
    decisions: "The repository documents prerendered routes, rejects WebGL for this use case and contains accessibility, visual-regression and bundle-budget checks. Demo forms are simulated.",
    outcome: "A live public demonstration with source-backed quality gates. No paid-client relationship or measured commercial outcome is implied.",
    disclaimer: "Independent and unofficial. Not affiliated with, commissioned by or endorsed by CloudCard Inc. Demo forms do not send inquiries to CloudCard.",
    href: "https://cloudcard.wajidali.dev", repository: "https://github.com/wajidalii/cloudcard-redesign", evidencePath: "README.md · docs/architecture/adr-0001-prerender.md · docs/architecture/adr-0002-webgl-decision.md",
  },
  {
    image: "/services/cases/bao-fiaz.webp", imageAlt: "Public bao-fiaz website preview captured during the evidence review",
    id: "bao-fiaz", name: "Bao Fiaz Manufacturing", category: "Business website", service: "website",
    overview: "A manufacturing-business website built around product information and a request-for-quote journey.",
    problem: "Manufacturing buyers need a clear way to understand an offer and send a useful commercial inquiry.",
    solution: "A Next.js marketing rebuild with structured product content, responsive image components and an RFQ-to-email workflow.",
    stack: ["Next.js", "React", "TypeScript", "Resend"],
    decisions: "The source keeps catalogue data separate from UI and uses responsive images. The RFQ endpoint validates input and has a no-JavaScript submission path; delivery depends on configured email credentials.",
    outcome: "A live public business website and inspectable implementation. The inspected homepage visibly retained mill-data placeholders. No inquiry volume, conversion lift or live email-delivery result is claimed.",
    disclaimer: "Business-website authorship is supplied by the owner. The repository still documents content placeholders; commercial facts and production form configuration require business review.",
    href: "https://baofiazmanufacturing.com", repository: "https://github.com/wajidalii/baofiaz-nextjs", evidencePath: "README.md · components/RfqForm.tsx · app/api/rfq/route.ts",
  },
  {
    id: "script-to-video", liveUnavailable: true, name: "ScriptToVideo", category: "AI product demonstration", service: "automation",
    overview: "A software workflow for turning a topic or script into a narrated, editable explainer video.",
    problem: "Script preparation, narration, scene composition and rendering span multiple tools and long-running tasks.",
    solution: "A staged product workflow connects script generation, voiceover, scene editing, Remotion rendering and download.",
    stack: ["Next.js", "TypeScript", "Prisma", "Supabase", "Remotion"],
    decisions: "The source documents job status, rendering workers, a credit ledger and explicit third-party model/provider configuration. Its summary distinguishes implemented workflows from outstanding production setup.",
    outcome: "Repository-documented implementation. The supplied demo URL was unreachable from the audit environment; no live provider call or paid-client deployment was verified.",
    disclaimer: "Engineering demonstration. Generative-media delivery requires configured external services; availability at the demo URL does not prove every provider-backed path is enabled.",
    href: "https://stv.wajidali.dev", repository: "https://github.com/wajidalii/script-to-video", evidencePath: "README.md · docs/SUMMARY.md",
  },
  {
    id: "reelbridge", liveUnavailable: true, name: "ReelBridge", category: "Integration product", service: "automation",
    overview: "A multi-platform publishing product designed to schedule short-form video from a shared workflow.",
    problem: "Uploading and scheduling the same content across platforms creates repeated work and inconsistent state.",
    solution: "A TypeScript monorepo separates the API, job workers, client and platform adapters for Facebook, Instagram and YouTube.",
    stack: ["TypeScript", "React", "Express", "PostgreSQL", "BullMQ"],
    decisions: "Platform adapters express distinct publishing capabilities; workers handle queued tasks separately from the API. The source documents encrypted tokens, tenant ownership checks and provider approval gates.",
    outcome: "Inspectable adapter, scheduling and worker test sources. The supplied demo URL did not load in the audit environment; external platform approvals and configured accounts determine publishing availability.",
    disclaimer: "Product engineering work, not a claim of commercially deployed client automation. No customer count or publishing success rate is asserted.",
    href: "https://reelbridge.wajidali.dev", repository: "https://github.com/wajidalii/ReelBridge", repositoryPublic: true, evidencePath: "README.md · packages/platforms · packages/worker",
  },
  {
    image: "/services/cases/punjab-jobs.webp", imageAlt: "Public punjab-jobs website preview captured during the evidence review",
    id: "punjab-jobs", name: "Punjab Jobs Independent Redesign", category: "Independent demonstration", service: "saas",
    overview: "An independent jobs-portal redesign using fictional data and simulated communication.",
    problem: "Explore a clearer application journey for candidates and operational workflows for portal staff.",
    solution: "A Next.js and PostgreSQL demonstration with candidate and officer roles, a reproducible demo setup and documented flows.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Playwright"],
    decisions: "The repository explicitly separates fictional demo accounts and local email/SMS simulators from the real government portal. Unit, browser and accessibility tooling is present.",
    outcome: "A reproducible repository demonstration and supplied public demo link. No government commission, real applications or official integration is claimed.",
    disclaimer: "Independent demo, not the official Punjab Jobs portal. Fictional data only. Real applications belong at jobs.punjab.gov.pk.",
    href: "https://punjab-jobs.wajidali.dev", repository: "https://github.com/wajidalii/punjab-jobs-redesign", evidencePath: "README.md · docs/demo-script.md · docs/testing/test-strategy.md",
  },
  {
    id: "mcpof", name: "MCPOF", category: "Local engineering framework", service: "automation",
    overview: "An owner-described, locally running engineering framework for exploring automation capabilities.",
    problem: "Engineering automation needs a repeatable execution model before it can be proposed for a business workflow.",
    solution: "A local framework demonstration can be discussed in a walkthrough, with its scope and limitations made explicit.",
    stack: ["Implementation details pending evidence"],
    decisions: "The privately reviewed repository currently contains a minimal README only. No architecture, technology stack or runtime behavior is independently asserted here.",
    outcome: "A privately reviewed repository and owner-described local demonstration. Source-backed functionality and client deployment evidence remain pending.",
    disclaimer: "Local engineering framework, not a commercially deployed client solution. A walkthrough is required before evaluating fit for a paid engagement.",
    href: "/services?service=automation#inquiry", repository: "https://github.com/wajidalii/mcpof", evidencePath: "README.md (minimal) · owner-supplied brief",
  },
];
