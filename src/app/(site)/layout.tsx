import { SkipLink } from "@/components/skip-link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MotionProvider } from "@/components/motion/motion-provider";
import { Cursor } from "@/components/motion/cursor";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      <MotionProvider />
      <Cursor />
    </>
  );
}
