import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { InquiryForm } from "@/components/services/inquiry-form";
import { ConsultationLink } from "@/components/services/consultation-link";
import { services, servicesFaqs, websitePackages } from "@/content/services";
import { serviceCaseStudies } from "@/content/service-case-studies";
import { acknowledgmentConfigured } from "@/lib/leads/email";
import { PERSON, SITE_URL } from "@/lib/site-config";

const title = "Software Engineering Services — Websites, SaaS & Automation";
const description = "Work directly with Wajid Ali on a faster business website, custom SaaS or thoughtful automation. Explore services, starting prices, genuine work and a clear path to a project quote.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: { type: "website", title, description, url: `${SITE_URL}/services`, images: [{ url: `${SITE_URL}/services/social-card`, width: 1200, height: 630, alt: "Wajid Ali — software engineering services" }] },
  twitter: { card: "summary_large_image", title, description, images: [`${SITE_URL}/services/social-card`] },
};

const primary = "inline-flex min-h-12 items-center justify-center rounded-md bg-accent px-5 py-3 text-center font-semibold text-on-accent shadow-[0_3px_0_var(--accent-deep)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5";
const secondary = "inline-flex min-h-12 items-center justify-center rounded-md border border-border bg-surface px-5 py-3 text-center font-semibold text-text transition-colors hover:border-accent";
const money = (price: number) => `PKR ${price.toLocaleString("en-PK")}`;
const inquiry = (service: string) => `/services?service=${service}#inquiry`;

function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return <p className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-accent-fg"><span aria-hidden className="h-px w-8 bg-accent" />{number} / {children}</p>;
}

function CheckList({ items }: { items: readonly string[] }) {
  return <ul className="m-0 grid list-none gap-3 p-0">{items.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed"><span aria-hidden className="text-accent-fg">↳</span><span>{item}</span></li>)}</ul>;
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebPage", "@id": `${SITE_URL}/services#page`, url: `${SITE_URL}/services`, name: title, description, about: { "@id": `${SITE_URL}/#person` } },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` }] },
    ...services.map((service) => ({ "@type": "Service", "@id": `${SITE_URL}/services#${service.id}`, name: service.title, description: service.summary, url: `${SITE_URL}/services#${service.id}`, provider: { "@id": `${SITE_URL}/#person`, "@type": "Person", name: PERSON.name }, serviceType: service.title, ...(service.id === "website" ? { hasOfferCatalog: { "@type": "OfferCatalog", name: "Website packages — starting prices", itemListElement: websitePackages.map((item) => ({ "@type": "Offer", name: `${item.name} — starting from`, url: `${SITE_URL}/services#packages`, priceCurrency: "PKR", priceSpecification: { "@type": "PriceSpecification", minPrice: item.price, priceCurrency: "PKR", description: `${item.scope} Final pricing depends on requirements.` }, itemOffered: { "@type": "Service", name: item.name } })) } } : {}) })),
  ],
};

export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <nav aria-label="Breadcrumb" className="pt-7 font-mono text-xs text-muted"><ol className="flex list-none gap-3 p-0"><li><Link href="/" className="inline-flex min-h-8 items-center hover:text-accent-fg">Home</Link></li><li aria-hidden>/</li><li aria-current="page" className="inline-flex min-h-8 items-center text-text">Services</li></ol></nav>

        <section aria-labelledby="services-heading" className="grid gap-10 pb-20 pt-10 lg:grid-cols-[1.2fr_.8fr] lg:gap-16 lg:pb-28 lg:pt-16">
          <div>
            <SectionLabel number="01">Independent engineering. Direct collaboration.</SectionLabel>
            <h1 id="services-heading" className="m-0 max-w-[16ch] font-display text-[clamp(2.25rem,5.6vw,5.25rem)] font-extrabold leading-[.98] tracking-[-.045em]">High-performance websites.<br /><span className="text-accent-fg">Custom SaaS.</span><br />Intelligent automation.</h1>
            <p className="mb-8 mt-7 max-w-[52ch] text-lg leading-relaxed text-muted">I help businesses build faster websites, streamline operations, and turn complex ideas into reliable software.</p>
            <div className="flex flex-wrap gap-3">
              <ConsultationLink source="services" className={primary} />
              <a href="#inquiry" className={secondary} data-conversion="proposal_requested">Get a Project Quote <span aria-hidden className="ml-2">↗</span></a>
            </div>
            <p className="mt-4 max-w-[56ch] text-sm leading-relaxed text-muted">A focused 20-minute conversation about your project. If online scheduling is unavailable, request a consultation below and we’ll agree a time by email.</p>
            <ul className="mt-7 flex list-none flex-wrap gap-x-5 gap-y-3 border-t border-border pt-5 font-mono text-xs text-muted">
              <li>Direct engineer access</li><li>Written scope before build</li><li>Source-backed portfolio</li>
            </ul>
          </div>
          <aside aria-label="Engagement approach" className="reg-marks self-end rounded-xl border border-border bg-surface p-6 sm:p-8">
            <div className="mb-8 flex items-center justify-between gap-4 border-b border-border pb-5"><span className="label-mono">The working agreement</span><span aria-hidden className="rounded border border-border px-2 py-1 font-mono text-xs text-accent-fg">WA / ENGINEERING</span></div>
            <p className="m-0 max-w-[17ch] font-semiwide text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">A clear problem.<br />A considered solution.<br /><span className="text-accent-fg">An accountable engineer.</span></p>
            <dl className="mb-0 mt-8 grid gap-5 text-sm">
              <div className="grid grid-cols-[4rem_1fr] gap-4"><dt className="font-mono text-xs text-muted">START</dt><dd className="m-0">Your business goal and the people it serves.</dd></div>
              <div className="grid grid-cols-[4rem_1fr] gap-4"><dt className="font-mono text-xs text-muted">BUILD</dt><dd className="m-0">Visible progress against an agreed scope.</dd></div>
              <div className="grid grid-cols-[4rem_1fr] gap-4"><dt className="font-mono text-xs text-muted">HANDOVER</dt><dd className="m-0">Documented decisions and a maintainable result.</dd></div>
            </dl>
            <a href="#work" className="mt-8 inline-flex min-h-11 items-center gap-3 font-semibold text-accent-fg">Inspect the work <span aria-hidden>↓</span></a>
          </aside>
        </section>

        <section aria-labelledby="offers-heading" className="services-section border-t border-border py-16 sm:py-20">
          <SectionLabel number="02">Three ways to move forward</SectionLabel>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5"><h2 id="offers-heading" className="m-0 max-w-[20ch] font-wide text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">Choose the right starting point.</h2><p className="m-0 max-w-[40ch] text-base leading-relaxed text-muted">A focused website engagement, a custom product, or a workflow worth automating.</p></div>
          <div className="grid gap-4 lg:grid-cols-3">
            {services.map((service) => <article key={service.id} className="group flex min-w-0 flex-col rounded-lg border border-border bg-surface p-6 transition-[transform,border-color] duration-200 hover:-translate-y-1 hover:border-accent">
              <div className="mb-8 flex justify-between font-mono text-xs text-muted"><span>{service.number} / SERVICE</span><span aria-hidden className="text-accent-fg">↗</span></div>
              <h3 className="m-0 font-semiwide text-2xl font-bold leading-tight tracking-tight"><a href={`#${service.id}`} className="hover:text-accent-fg">{service.shortTitle}</a></h3>
              <p className="mb-6 mt-4 text-sm leading-relaxed text-muted">{service.summary}</p>
              <p className="mt-auto border-t border-border pt-5 font-semibold text-accent-fg">{service.price}</p>
              <a href={`#${service.id}`} className="inline-flex min-h-11 items-center justify-between gap-4 text-sm font-semibold" data-source={service.id} data-conversion="service_cta_clicked">Explore this service <span aria-hidden>↓</span></a>
            </article>)}
          </div>
        </section>

        {services.map((service) => <section key={service.id} id={service.id} aria-labelledby={`${service.id}-heading`} className="services-section scroll-mt-24 border-t border-border py-16 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
            <div><SectionLabel number={service.number}>{service.title}</SectionLabel><h2 id={`${service.id}-heading`} className="m-0 max-w-[20ch] font-wide text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{service.shortTitle}</h2><p className="mt-5 text-base leading-relaxed text-muted"><strong className="font-semibold text-text">Who it’s for.</strong> {service.audience}</p><p className="mt-7 font-mono text-sm text-accent-fg">{service.price}</p><a href={inquiry(service.id)} className={`${primary} mt-2`} data-source={service.id} data-conversion="service_cta_clicked">{service.cta}</a></div>
            <div className="grid gap-7">
              <div className="grid gap-7 sm:grid-cols-2"><div><h3 className="mb-4 mt-0 font-semibold">The problems we address</h3><CheckList items={service.problems} /></div><div><h3 className="mb-4 mt-0 font-semibold">What you receive</h3><CheckList items={service.deliverables} /></div></div>
              <div className="rounded-md border border-border bg-surface p-5"><h3 className="mb-2 mt-0 font-mono text-xs uppercase tracking-wider text-muted">Typical project workflow</h3><p className="m-0 text-sm leading-relaxed">{service.workflow}</p></div>
              <div><h3 className="mb-2 mt-0 text-sm font-semibold">Relevant work</h3><div className="flex flex-wrap gap-x-5 gap-y-2">{service.evidence.map((id) => { const item = serviceCaseStudies.find((entry) => entry.id === id)!; return <a key={id} href={`#case-${id}`} className="inline-flex min-h-10 items-center text-sm text-accent-fg underline decoration-border underline-offset-4 hover:decoration-accent">{item.name} ↗</a>; })}</div></div>
              <details className="rounded-md border border-border bg-surface"><summary className="cursor-pointer px-5 py-4 text-sm font-semibold">{service.faq.q}</summary><p className="m-0 px-5 pb-5 text-sm leading-relaxed text-muted">{service.faq.a}</p></details>
            </div>
          </div>
        </section>)}

        <section id="packages" aria-labelledby="packages-heading" className="services-section scroll-mt-24 border-t border-border py-16 sm:py-20">
          <SectionLabel number="03">Website packages</SectionLabel><h2 id="packages-heading" className="m-0 font-wide text-3xl font-extrabold tracking-tight sm:text-4xl">Clear starting points. Thoughtful scope.</h2><p className="mb-9 mt-4 max-w-[68ch] text-base leading-relaxed text-muted">Choose the closest fit. We’ll confirm requirements, deliverables and a written quote before any work begins.</p>
          <div className="grid gap-4 lg:grid-cols-3">{websitePackages.map((item, index) => <article key={item.id} className={`flex min-w-0 flex-col rounded-lg border bg-surface p-6 ${index === 1 ? "border-accent" : "border-border"}`}>
            <p className="mb-5 mt-0 font-mono text-xs uppercase tracking-wider text-muted">{index === 1 ? "For a clearer customer journey" : index === 0 ? "Build on what you have" : "For a bespoke experience"}</p><h3 className="m-0 font-semiwide text-xl font-bold">{item.name}</h3><p className="mb-1 mt-6 text-sm text-muted">Starting from</p><p className="m-0 font-wide text-3xl font-bold tracking-tight">{money(item.price)}</p><p className="mb-5 mt-5 text-sm leading-relaxed text-muted">{item.fit}</p><p className="mb-5 border-b border-border pb-5 text-sm leading-relaxed">{item.scope}</p><CheckList items={item.deliverables} /><p className="mb-6 mt-5 text-xs leading-relaxed text-muted">{item.revisions}</p><a href={inquiry("website")} className={`${secondary} mt-auto`} data-source="website" data-conversion="service_cta_clicked">Discuss {item.name.toLowerCase()} <span aria-hidden className="ml-2">↗</span></a>
          </article>)}</div>
          <p className="mt-5 max-w-[90ch] text-sm leading-relaxed text-muted">Starting prices are in PKR, not unconditional fixed-price commitments. Final pricing depends on requirements. Content production, hosting, paid services, applicable taxes, additional revisions and changes outside the agreed scope are quoted separately. SaaS and automation projects are priced after discovery.</p>
        </section>

        <section id="work" aria-labelledby="work-heading" className="services-section scroll-mt-24 border-t border-border py-16 sm:py-20">
          <SectionLabel number="04">Evidence, not promises</SectionLabel><h2 id="work-heading" className="m-0 max-w-[22ch] font-wide text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">Real work. The context behind it.</h2><p className="mb-10 mt-4 max-w-[76ch] text-base leading-relaxed text-muted">Public products, business websites, independent redesigns and engineering demonstrations. Each record states what can be checked, what was built, and what has not been verified.</p>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{serviceCaseStudies.map((item) => <article key={item.id} id={`case-${item.id}`} aria-labelledby={`case-${item.id}-heading`} className="services-case min-w-0 scroll-mt-24 overflow-hidden rounded-lg border border-border bg-surface">
            <div className="relative aspect-[8/5] overflow-hidden border-b border-border bg-surface-2">{item.image ? <Image src={item.image} alt={item.imageAlt!} width={960} height={600} sizes="(min-width: 1280px) 380px, (min-width: 768px) 50vw, 100vw" loading="lazy" className="h-full w-full object-cover" /> : <div className="flex h-full flex-col justify-between p-6"><div className="flex items-center justify-between font-mono text-xs text-muted"><span>SOURCE PREVIEW</span><span aria-hidden>⌘</span></div><p className="m-0 font-semiwide text-2xl font-semibold text-accent-fg">{item.name}</p><p className="m-0 font-mono text-xs text-muted">{item.id === "mcpof" ? "Local framework · walkthrough on request" : "Repository evidence · live capture unavailable"}</p></div>}</div>
            <div className="p-5"><p className="mb-3 mt-0 font-mono text-xs text-accent-fg">{item.category}</p><h3 id={`case-${item.id}-heading`} className="m-0 font-semiwide text-xl font-bold leading-tight">{item.name}</h3><p className="mb-4 mt-3 text-sm leading-relaxed text-muted">{item.overview}</p><details className="border-t border-border"><summary className="cursor-pointer py-4 text-sm font-semibold">Explore the engineering <span aria-hidden>+</span></summary><dl className="mb-0 grid gap-4 text-sm leading-relaxed">{[["Problem / opportunity", item.problem], ["My solution", item.solution], ["Technology stack", item.stack.join(" · ")], ["Engineering decisions", item.decisions], ["Verified evidence / outcomes", item.outcome]].map(([label, text]) => <div key={label}><dt className="font-semibold">{label}</dt><dd className="m-0 mt-1 text-muted">{text}</dd></div>)}</dl><p className="mt-4 border-l-2 border-accent pl-3 text-xs leading-relaxed text-muted">{item.disclaimer}</p>{item.repositoryPublic ? <a href={item.repository} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm text-accent-fg underline underline-offset-4">Inspect public repository <span aria-hidden className="ml-1">↗</span></a> : <p className="mb-3 mt-4 text-xs leading-relaxed text-muted">Source reviewed privately. Implementation context can be discussed in a walkthrough.</p>}</details><div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 border-t border-border pt-3"><a href={item.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm font-semibold text-accent-fg">{item.id === "mcpof" ? "Request framework walkthrough" : item.liveUnavailable ? "Demo link (availability unverified)" : "Open public project"} <span aria-hidden className="ml-1">↗</span></a><a href={`${inquiry(item.service).replace("#inquiry", "")}&source=case-study#inquiry`} data-source="case-study" data-conversion="service_cta_clicked" className="inline-flex min-h-11 items-center text-sm text-text">Discuss similar work <span aria-hidden className="ml-1">→</span></a></div></div>
          </article>)}</div>
        </section>

        <section aria-labelledby="process-heading" className="services-section border-t border-border py-16 sm:py-20"><SectionLabel number="05">From first conversation to handover</SectionLabel><h2 id="process-heading" className="m-0 font-wide text-3xl font-extrabold tracking-tight sm:text-4xl">A process you can follow.</h2><ol className="mt-10 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">{[["01", "Understand", "Clarify the people, problem, constraints and outcome that matter."], ["02", "Agree", "Set a written scope, deliverables, milestones, price and acceptance criteria."], ["03", "Build", "Review working progress and resolve decisions while they are still small."], ["04", "Hand over", "Test the agreed paths, document the system and prepare a clear launch handover."]].map(([number, heading, text]) => <li key={number} className="border-t border-border pt-5"><span className="font-mono text-sm text-accent-fg">{number}</span><h3 className="mb-3 mt-5 text-lg font-bold">{heading}</h3><p className="m-0 text-sm leading-relaxed text-muted">{text}</p></li>)}</ol></section>

        <section aria-labelledby="services-faq-heading" className="services-section grid gap-8 border-t border-border py-16 sm:py-20 lg:grid-cols-[.7fr_1.3fr] lg:gap-16"><div><SectionLabel number="06">Before we talk</SectionLabel><h2 id="services-faq-heading" className="m-0 font-wide text-3xl font-extrabold tracking-tight sm:text-4xl">Good questions.<br />Clear answers.</h2></div><div className="grid gap-3">{servicesFaqs.map((faq) => <details key={faq.q} className="rounded-md border border-border bg-surface"><summary className="cursor-pointer px-5 py-4 font-semibold">{faq.q}</summary><p className="m-0 px-5 pb-5 text-sm leading-relaxed text-muted">{faq.a}</p></details>)}</div></section>

        <section id="inquiry" aria-labelledby="inquiry-heading" className="scroll-mt-24 border-t border-border py-16 sm:py-20"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16"><div><SectionLabel number="07">Your next useful step</SectionLabel><h2 id="inquiry-heading" className="m-0 max-w-[17ch] font-wide text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">Tell me what you’re trying to improve.</h2><p className="mt-5 text-base leading-relaxed text-muted">A new website, a product idea, or a workflow your team has outgrown. Share enough context to start a useful conversation.</p><div className="mt-7 rounded-lg border border-border bg-surface p-5"><h3 className="m-0 text-base font-semibold">What happens next?</h3><p className="mb-0 mt-3 text-sm leading-relaxed text-muted">I review the fit, clarify any gaps, then suggest a conversation or a scoped next step. Sending an inquiry does not commit you to a project.</p></div><p className="mt-5 text-sm leading-relaxed text-muted">Prefer a direct message? <a href={`mailto:${PERSON.email}`} className="break-all text-accent-fg underline underline-offset-4">{PERSON.email}</a></p></div><InquiryForm acknowledgmentAvailable={acknowledgmentConfigured()} /></div></section>
      </div>
      <aside aria-label="Project inquiry shortcut" className="sticky bottom-0 z-30 border-t border-border bg-bg/95 px-5 py-3 backdrop-blur-sm sm:hidden"><a href="#inquiry" className={`${primary} w-full`} data-conversion="proposal_requested">Let’s discuss your project <span aria-hidden className="ml-2">↗</span></a></aside>
    </>
  );
}
