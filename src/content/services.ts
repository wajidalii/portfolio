/** Owner-approved starting prices from the services brief; final scope is quoted. */
export type ServiceId = "website" | "saas" | "automation";

export const websitePackages = [
  {
    id: "refresh",
    name: "Website Refresh",
    price: 45000,
    fit: "An existing website that needs a sharper first impression.",
    scope: "One existing page, using your current content and platform.",
    deliverables: ["Responsive UI and visual polish", "Basic accessibility improvements", "Core Web Vitals review", "Basic technical SEO"],
    revisions: "Two consolidated revision rounds within the agreed page scope.",
  },
  {
    id: "redesign",
    name: "Business Website Redesign",
    price: 95000,
    fit: "A business website that needs a clearer path from visit to inquiry.",
    scope: "Up to five marketing pages with an agreed content structure.",
    deliverables: ["Modern responsive interface", "Performance and accessibility improvements", "Technical SEO and analytics integration", "Contact and conversion improvements"],
    revisions: "Two consolidated revision rounds per agreed design milestone.",
  },
  {
    id: "premium",
    name: "Premium Website Development",
    price: 175000,
    fit: "A distinctive website with bespoke design and integration needs.",
    scope: "A scoped custom build; pages and integration complexity are agreed before work starts.",
    deliverables: ["Custom design system", "Scoped CMS or API integration", "Purposeful interactive experiences", "Performance engineering, testing and deployment assistance"],
    revisions: "Three consolidated design revision rounds; integration changes are separately scoped.",
  },
] as const;

export const services = [
  {
    id: "website" as const,
    number: "01",
    title: "Website Design, Redesign & Performance",
    shortTitle: "Websites that earn the next conversation.",
    summary: "Make the value of your business easier to understand, on a website that feels considered and works across devices.",
    audience: "Business owners and teams with an outdated site, a confusing customer journey, or a new offer to launch.",
    problems: ["An inconsistent first impression", "Slow or awkward mobile experiences", "Visitors unsure what to do next"],
    deliverables: ["A clear page and content structure", "Responsive, accessible interface implementation", "Technical SEO and performance review", "Tested inquiry paths and a documented handover"],
    workflow: "Audit → agree scope → design → implement → test → launch handover.",
    price: "Starting from PKR 45,000",
    cta: "Plan Your Website Project",
    evidence: ["knowledgecity", "cloudcard", "bao-fiaz"],
    faq: { q: "Can you improve my existing website rather than rebuild it?", a: "Yes. The first review identifies what can be retained. A refresh is appropriate when the existing structure and platform can support the required improvements; a rebuild is proposed only when the scope calls for it." },
  },
  {
    id: "saas" as const,
    number: "02",
    title: "Custom SaaS & Business Software",
    shortTitle: "Software shaped around your operations.",
    summary: "Turn disconnected tools and manual processes into a coherent product your team can maintain and build on.",
    audience: "Founders and operational teams building a new product, replacing spreadsheets, or modernizing an existing application.",
    problems: ["Information scattered across tools", "Processes that depend on manual handoffs", "A growing product that is difficult to extend"],
    deliverables: ["Discovery and a prioritized delivery plan", "Multi-tenant SaaS, HR/payroll or workflow systems", "Internal dashboards, portals and API integrations", "Maintainable architecture, scoped security checks and handover documentation"],
    workflow: "Understand the workflow → model data and access → deliver a thin working slice → iterate → test and hand over.",
    price: "Discovery-based quote",
    cta: "Discuss Your Software Project",
    evidence: ["hrms", "mortgage", "reelbridge"],
    faq: { q: "Can we start with one workflow instead of a large system?", a: "Yes. Discovery can isolate a small, valuable workflow or product slice. Its interfaces, acceptance criteria and next steps are agreed before implementation so the first delivery has a clear boundary." },
  },
  {
    id: "automation" as const,
    number: "03",
    title: "AI Automation & System Integration",
    shortTitle: "Less repetitive work. More control.",
    summary: "Connect business systems and apply AI where it serves a defined task, with clear failure paths and appropriate human oversight.",
    audience: "Teams repeating document, reporting, CRM or approval tasks across systems, and engineering teams improving delivery workflows.",
    problems: ["Repeated copying between tools", "Reports and approvals that stall", "AI experiments without a reliable workflow"],
    deliverables: ["Workflow mapping and integration design", "CRM, lead management and API orchestration", "AI-assisted documents, reporting or agent workflows", "Defined approval steps, error handling and operational documentation"],
    workflow: "Map the task → check data and access → prototype → evaluate failure cases → integrate with human review → hand over.",
    price: "Discovery-based quote",
    cta: "Explore Automation Opportunities",
    evidence: ["script-to-video", "reelbridge", "mcpof"],
    faq: { q: "Will an AI workflow run without human oversight?", a: "That depends on the risk of the task. Approval steps, permitted actions, evaluation criteria and fallback behavior are agreed during discovery. Sensitive or irreversible operations should retain appropriate human review." },
  },
] as const;

export const servicesFaqs = [
  { q: "What happens during the free consultation?", a: "We discuss your business problem, the current system, likely scope and a sensible next step. The intended service consultation is 20 minutes. If online scheduling is not configured, send a consultation request and we will agree a time by email." },
  { q: "Are the website prices fixed quotes?", a: "No. Prices are starting points in PKR for the stated package boundaries. Final pricing depends on requirements, content, integration complexity and delivery constraints. Hosting, third-party subscriptions, tax where applicable and out-of-scope changes are confirmed separately." },
  { q: "How long will my project take?", a: "A delivery schedule is proposed after requirements and dependencies are understood. Content readiness, stakeholder feedback, integrations and access all affect the timeline. No deadline is promised before scope is agreed." },
  { q: "Can you work with an existing engineering team?", a: "Yes. An engagement can cover a defined implementation, architecture review, integration or modernization effort alongside your team. Ownership, access and handover expectations are agreed up front." },
  { q: "Will I own the deliverables?", a: "Ownership, source-code delivery, third-party licenses, support and any continuing obligations are recorded in the written proposal and agreement. These terms are confirmed before the project begins." },
  { q: "What should I include in an inquiry?", a: "Describe the problem, the people who use the system, your target timeline and an indicative budget. Share a public website if useful. Please do not include passwords, financial account details or confidential customer data." },
] as const;
