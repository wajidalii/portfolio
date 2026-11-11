import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { atelierWork } from "@/content/atelier-work";
import { SITE_URL } from "@/lib/site-config";

const title = "Selected Work — Software, Websites & Product Engineering";
const description =
  "Explore Wajid Ali’s multi-tenant HRMS, independent website redesigns and mortgage calculator, with the engineering decisions and evidence behind each project.";
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/work" },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/work`,
    images: [{ url: "/services/social-card" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/services/social-card"],
  },
};

export default function WorkPage() {
  return (
    <div className="atelier-container">
      <nav aria-label="Breadcrumb" className="atelier-breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden>/</span>
        <span aria-current="page">Work</span>
      </nav>
      <section className="atelier-section" aria-labelledby="work-title">
        <p className="atelier-eyebrow">Selected work</p>
        <h1 id="work-title" className="atelier-title">
          The work behind the words.
        </h1>
        <p className="atelier-lede">
          Business software, considered websites, and useful tools. Explore the
          problem, the decisions, and the evidence behind each build.
        </p>
        <div className="atelier-grid mt-12">
          {atelierWork.map((item) => (
            <article key={item.id} className="atelier-card overflow-hidden">
              <Link
                href={`/work/${item.slug}`}
                className="block overflow-hidden"
                data-conversion="project_case_study_clicked"
                data-source="work"
                aria-label={`Read ${item.name} case study`}
              >
                <Image
                  src={item.image!}
                  alt={item.imageAlt!}
                  width={960}
                  height={600}
                  sizes="(min-width: 1024px) 560px, (min-width: 768px) 45vw, 100vw"
                  loading="lazy"
                  className="atelier-case-image aspect-[8/5] w-full object-cover"
                />
              </Link>
              <div className="p-6 sm:p-8">
                <p className="atelier-eyebrow">{item.category}</p>
                <h2 className="mt-3 font-display text-2xl font-bold">
                  <Link
                    href={`/work/${item.slug}`}
                    data-conversion="project_case_study_clicked"
                    data-source="work"
                  >
                    {item.name}
                  </Link>
                </h2>
                <p className="mt-4 leading-relaxed text-muted">
                  {item.summary}
                </p>
                <ul aria-label="Technology stack" className="atelier-tags mt-5">
                  {item.stack.slice(0, 4).map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <p className="mt-5 text-sm leading-relaxed text-muted">
                  {item.id === "knowledgecity" || item.id === "cloudcard"
                    ? "Independent demonstration. Unofficial and not commissioned or endorsed by the named company."
                    : item.id === "mortgage"
                      ? "Built for a technical assignment; planning estimates, not financial advice."
                      : "Personal software product. Public preview contains no private employee data."}
                </p>
                <Link
                  href={`/work/${item.slug}`}
                  className="mt-4 inline-flex min-h-11 items-center font-semibold text-accent-fg"
                  data-conversion="project_case_study_clicked"
                  data-source="work"
                >
                  Read the case study{" "}
                  <span aria-hidden className="ml-2">
                    ↗
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section
        className="atelier-section border-t border-border"
        aria-labelledby="work-contact"
      >
        <p className="atelier-eyebrow">Your next product</p>
        <h2 id="work-contact" className="atelier-title">
          Have a similar challenge?
        </h2>
        <p className="atelier-lede">
          Let’s turn the problem into a clear scope and a practical next step.
        </p>
        <Link
          href="/services#inquiry"
          className="atelier-button mt-7"
          data-conversion="proposal_requested"
          data-source="work"
        >
          Start a Project <span aria-hidden>↗</span>
        </Link>
      </section>
    </div>
  );
}
