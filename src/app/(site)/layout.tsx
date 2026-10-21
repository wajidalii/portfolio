import { SkipLink } from "@/components/skip-link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MotionProvider } from "@/components/motion/motion-provider";
import { Stage } from "@/components/stage/stage";
import { StationRail } from "@/components/stage/station-rail";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SkipLink />
      <Stage />
      <SiteHeader />
      <StationRail />
      <main id="main" className="relative z-10">
        {children}
      </main>
      <SiteFooter />
      <MotionProvider />
    </>
  );
}
