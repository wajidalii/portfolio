import type { Metadata } from "next";
import Link from "next/link";
import { getRoles, getSkillGroups, getUpcomingProjects } from "@/db/queries";
import { PERSON, SITE_URL } from "@/lib/site-config";

const title = "About — Wajid Ali, Software Engineer & Product Builder";
const description =
  "Meet Wajid Ali: software engineer and product builder working across full-stack applications, SaaS architecture, deployment, user experience and automation.";
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/about`,
    images: [{ url: "/services/social-card" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/services/social-card"],
  },
};

const placeholder = /\b(sample|placeholder|lorem ipsum)\b/i;
/** The admin owns this optional link. Only ordinary, credential-free public URLs render. */
function publicProjectLink(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}

export default async function AboutPage() {
  const [roles, skills, projects] = await Promise.all([
    getRoles(),
    getSkillGroups(),
    getUpcomingProjects(),
  ]);
  const publicRoles = roles.filter(
    (item) => !placeholder.test(`${item.title} ${item.company}`),
  );
  const publicSkills = skills.filter((item) => !placeholder.test(item.name));
  const publicProjects = projects.filter(
    (item) =>
      !placeholder.test(
        `${item.title} ${item.description} ${item.tags.join(" ")}`,
      ),
  );
  return (
    <div className="atelier-container">
      <nav aria-label="Breadcrumb" className="atelier-breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden>/</span>
        <span aria-current="page">About</span>
      </nav>
      <section
        className="atelier-section grid gap-10 lg:grid-cols-[1.3fr_.7fr] lg:gap-20"
        aria-labelledby="about-title"
      >
        <div>
          <p className="atelier-eyebrow">Software Engineer & Product Builder</p>
          <h1 id="about-title" className="atelier-title">
            Thoughtful products.
            <br />
            Solid engineering.
          </h1>
          <p className="atelier-lede">
            I’m Wajid Ali. I connect product thinking with hands-on engineering
            to turn complex requirements into useful software.
          </p>
          <p className="mt-6 max-w-[64ch] text-base leading-relaxed text-muted">
            My work spans full-stack applications, multi-tenant SaaS, business
            systems, and automation. I care about the whole product: the user
            experience, the architecture behind it, and the deployment that
            keeps it available.
          </p>
          <p className="mt-5 max-w-[64ch] text-base leading-relaxed text-muted">
            I prefer clear scope, small reviewable changes, and written
            decisions. Good engineering should make a product easier to use
            today and easier to maintain tomorrow.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/services#inquiry"
              className="atelier-button"
              data-conversion="proposal_requested"
              data-source="about"
            >
              Discuss Your Project <span aria-hidden>↗</span>
            </Link>
            <a
              href={PERSON.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="atelier-button atelier-button-secondary"
            >
              View LinkedIn
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
        <aside
          className="atelier-card self-start p-6 sm:p-8"
          aria-labelledby="working-style"
        >
          <p className="atelier-eyebrow">A practical approach</p>
          <h2
            id="working-style"
            className="mt-4 font-display text-2xl font-bold"
          >
            The details add up.
          </h2>
          <ul className="mb-0 mt-6 grid gap-5 pl-5 text-muted">
            <li className="leading-relaxed">
              Understand the user before choosing the technology.
            </li>
            <li className="leading-relaxed">
              Make trade-offs explicit and keep the scope visible.
            </li>
            <li className="leading-relaxed">
              Treat accessibility, security, and performance as product
              qualities.
            </li>
            <li className="leading-relaxed">
              Document what the next engineer needs to know.
            </li>
          </ul>
        </aside>
      </section>

      <div id="experience">
        {publicRoles.length === 0 && (
          <p className="atelier-lede py-10">
            Contact me for current experience details.
          </p>
        )}
        {publicRoles.length > 0 && (
          <section
            className="atelier-section border-t border-border"
            aria-labelledby="experience-title"
          >
            <p className="atelier-eyebrow">Professional experience</p>
            <h2 id="experience-title" className="atelier-title">
              A career in building software.
            </h2>
            <p className="atelier-lede">
              A concise career timeline. Personal products and independent
              demonstrations are documented separately in selected work.
            </p>
            <ol className="atelier-timeline mt-10 list-none p-0">
              {publicRoles.map((role) => (
                <li
                  key={role.id}
                  className="grid gap-4 border-t border-border py-7 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
                >
                  <p className="m-0 font-mono text-sm text-accent-fg">
                    {role.period}
                  </p>
                  <div>
                    <h3 className="m-0 font-display text-xl font-bold">
                      {role.title}
                    </h3>
                    <p className="mb-0 mt-2 text-base text-text">
                      {role.company}
                    </p>
                    <p className="mb-0 mt-2 text-sm text-muted">
                      {role.location}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              Dates and role details are maintained by the portfolio owner.
              Overlapping dates reflect the supplied career history; they do not
              imply exclusive employment.
            </p>
          </section>
        )}
      </div>

      {publicSkills.length > 0 && (
        <section
          id="skills"
          className="atelier-section border-t border-border"
          aria-labelledby="skills-title"
        >
          <p className="atelier-eyebrow">Engineering capabilities</p>
          <h2 id="skills-title" className="atelier-title">
            Across the product lifecycle.
          </h2>
          <p className="atelier-lede">
            The tools matter when they serve the problem. These are the areas
            represented in my engineering work.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {publicSkills.map((group) => (
              <article key={group.id} className="atelier-card p-6">
                <h3 className="m-0 font-display text-lg font-bold">
                  {group.name}
                </h3>
                <ul className="mb-0 mt-5 grid gap-2 pl-5 text-sm leading-relaxed text-muted">
                  {group.items
                    .filter((item) => !placeholder.test(item))
                    .map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}

      {publicProjects.length > 0 && (
        <section
          id="upcoming-projects"
          className="atelier-section border-t border-border"
          aria-labelledby="upcoming-title"
        >
          <p className="atelier-eyebrow">In progress</p>
          <h2 id="upcoming-title" className="atelier-title">
            What’s taking shape.
          </h2>
          <p className="atelier-lede">
            Owner-maintained work in progress, with status and scope kept
            distinct from shipped results.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {publicProjects.map((project) => {
              const href = publicProjectLink(project.link);
              return (
                <article key={project.id} className="atelier-card p-6">
                  <p className="atelier-eyebrow">
                    {project.status.replaceAll("_", " ")}
                  </p>
                  <h3 className="mt-4 font-display text-xl font-bold">
                    {project.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {project.description}
                  </p>
                  {project.expectedDate && (
                    <p className="mt-4 text-sm text-muted">
                      Planning estimate: {project.expectedDate}
                    </p>
                  )}
                  <ul
                    aria-label="Project technologies"
                    className="atelier-tags mt-5"
                  >
                    {project.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  {href && (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-accent-fg"
                    >
                      Explore project{" "}
                      <span aria-hidden className="ml-2">
                        ↗
                      </span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      <section
        className="atelier-section border-t border-border"
        aria-labelledby="about-contact"
      >
        <p className="atelier-eyebrow">Projects & professional conversations</p>
        <h2 id="about-contact" className="atelier-title">
          Let’s find the right fit.
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="atelier-card p-6 sm:p-8">
            <h3 className="m-0 font-display text-xl font-bold">
              Building something for your business?
            </h3>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Explore focused website engagements, custom software, and
              automation projects.
            </p>
            <Link
              href="/services#inquiry"
              className="atelier-button mt-3"
              data-conversion="proposal_requested"
              data-source="about"
            >
              Start a Project <span aria-hidden>↗</span>
            </Link>
          </div>
          <div className="atelier-card p-6 sm:p-8">
            <h3 className="m-0 font-display text-xl font-bold">
              Hiring for an engineering role?
            </h3>
            <p className="mt-4 text-base leading-relaxed text-muted">
              For a full-time or contract role, send the role details and team
              context. We can discuss fit and current availability.
            </p>
            <a
              href={`mailto:${PERSON.email}?subject=Engineering%20role%20inquiry`}
              className="atelier-button atelier-button-secondary mt-3"
            >
              Discuss an Engineering Role <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
