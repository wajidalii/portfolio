import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { atelierWork, findAtelierWork } from "@/content/atelier-work";
import { PERSON, SITE_URL } from "@/lib/site-config";

export const dynamicParams = false;
export function generateStaticParams() { return atelierWork.map((item) => ({ slug: item.slug })); }
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = findAtelierWork((await params).slug);
  if (!item) notFound();
  return { title: `${item.name} — Engineering Case Study`, description: item.summary,
    alternates: { canonical: `/work/${item.slug}` },
    openGraph: { title: item.name, description: item.summary, url: `${SITE_URL}/work/${item.slug}`, images: [{ url: item.image!, width: 960, height: 600, alt: item.imageAlt! }] },
    twitter: { card: "summary_large_image", title: item.name, description: item.summary, images: [item.image!] },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const item = findAtelierWork((await params).slug);
  if (!item) notFound();
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "CreativeWork", "@id": `${SITE_URL}/work/${item.slug}#work`, name: item.name, description: item.summary, url: `${SITE_URL}/work/${item.slug}`, image: `${SITE_URL}${item.image}`, author: { "@type": "Person", "@id": `${SITE_URL}/#person`, name: PERSON.name }, about: item.stack },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Work", item: `${SITE_URL}/work` }, { "@type": "ListItem", position: 3, name: item.name, item: `${SITE_URL}/work/${item.slug}` }] },
  ] };
  return <div className="atelier-container">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    <nav aria-label="Breadcrumb" className="atelier-breadcrumb flex-wrap"><Link href="/">Home</Link><span aria-hidden>/</span><Link href="/work">Work</Link><span aria-hidden>/</span><span aria-current="page">{item.name}</span></nav>
    <article>
      <header className="atelier-section pb-8 sm:pb-12"><p className="atelier-eyebrow">{item.category} / Case study</p><h1 className="atelier-title max-w-[20ch]">{item.name}</h1><p className="atelier-lede">{item.summary}</p><ul aria-label="Technology stack" className="atelier-tags mt-7">{item.stack.map((tag) => <li key={tag}>{tag}</li>)}</ul><div className="mt-8 flex flex-wrap gap-3"><a href={item.href} target="_blank" rel="noopener noreferrer" className="atelier-button">Explore the live project <span aria-hidden>↗</span><span className="sr-only"> (opens in a new tab)</span></a><Link href={`/services?service=${item.service}&source=case-study#inquiry`} className="atelier-button atelier-button-secondary" data-conversion="service_cta_clicked" data-source="case-study">Discuss similar work</Link></div></header>
      <figure className="m-0 overflow-hidden rounded-2xl border border-border bg-surface"><Image src={item.image!} alt={item.imageAlt!} width={960} height={600} priority sizes="(min-width: 1280px) 1180px, 100vw" className="atelier-case-image aspect-[8/5] w-full object-cover" /><figcaption className="border-t border-border px-5 py-4 text-sm leading-relaxed text-muted">Public landing-page capture from the evidence review. {item.id === "hrms" ? "A marketing preview, not a private tenant dashboard." : "The preview is illustrative; the live site may change."}</figcaption></figure>
      <div className="atelier-section grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-20">
        <aside><p className="atelier-eyebrow">Context & ownership</p><p className="mt-4 text-sm leading-relaxed text-muted">{item.id === "hrms" ? "A personal multi-tenant software product, presented separately from employment history." : item.disclaimer}</p><h2 className="mt-8 font-display text-lg font-bold">Evidence reviewed</h2><p className="mt-3 text-sm leading-relaxed text-muted">Public-page observations and repository documentation inform this case study. They do not establish customer adoption, measured commercial results, or a security certification.</p>{item.repositoryPublic ? <a href={item.repository} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-accent-fg">View the public source <span aria-hidden className="ml-2">↗</span><span className="sr-only"> (opens in a new tab)</span></a> : <p className="mt-4 text-sm leading-relaxed text-muted">Source was reviewed privately. Implementation context can be discussed in a walkthrough.</p>}</aside>
        <div className="atelier-prose grid gap-10">{[["The problem", item.problem], ["The solution", item.solution], ["Engineering decisions", item.decisions], ["What can be verified", item.outcome]].map(([heading, text]) => <section key={heading}><h2 className="m-0 font-display text-2xl font-bold tracking-tight sm:text-3xl">{heading}</h2><p className="mb-0 mt-4 text-base leading-relaxed text-muted">{text}</p></section>)}<section className="rounded-xl border border-border bg-surface p-6"><h2 className="m-0 font-display text-xl font-bold">Scope of this demonstration</h2><p className="mb-0 mt-3 text-sm leading-relaxed text-muted">{item.disclaimer}</p></section></div>
      </div>
    </article>
    <section className="atelier-section border-t border-border" aria-labelledby="case-contact"><p className="atelier-eyebrow">From evidence to your next step</p><h2 id="case-contact" className="atelier-title">Let’s solve your version of this.</h2><p className="atelier-lede">Share the business goal, the constraints, and what needs to work better.</p><div className="mt-7 flex flex-wrap gap-3"><Link href={`/services?service=${item.service}&source=case-study#inquiry`} className="atelier-button" data-conversion="service_cta_clicked" data-source="case-study">Discuss Your Project <span aria-hidden>↗</span></Link><Link href="/work" className="atelier-button atelier-button-secondary">More selected work</Link></div></section>
  </div>;
}
