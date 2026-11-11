import { SkipLink } from "@/components/skip-link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ConversionEvents } from "@/components/services/conversion-events";

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return <><SkipLink /><SiteHeader /><main id="main" className="relative z-10">{children}</main><SiteFooter /><ConversionEvents /></>;
}
