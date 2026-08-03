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

export default function Home() {
  return (
    <>
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
