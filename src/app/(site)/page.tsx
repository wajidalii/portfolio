import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { Testimonials } from "@/components/sections/testimonials";
import { UpcomingProjects } from "@/components/sections/upcoming-projects";
import { Faq } from "@/components/sections/faq";
import { Contact } from "@/components/sections/contact";
import { CtaBanner } from "@/components/sections/cta-banner";
import { faqs } from "@/content/faq";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, PERSON } from "@/lib/site-config";

const profilePageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: SITE_URL,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  mainEntity: {
    "@type": "Person",
    name: PERSON.name,
    jobTitle: PERSON.jobTitle,
    sameAs: [PERSON.linkedin, PERSON.github],
  },
};

const faqPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd) }}
      />
      <Hero />
      <Stats />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Testimonials />
      <UpcomingProjects />
      <Faq />
      <Contact />
      <CtaBanner />
    </>
  );
}
