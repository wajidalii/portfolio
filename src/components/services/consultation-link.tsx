import type { ReactNode } from "react";
import { consultationBookingUrl } from "@/lib/services/consultation";

export function ConsultationLink({ className, children, source = "services" }: {
  className?: string; children?: ReactNode; source?: string;
}) {
  const url = consultationBookingUrl();
  return <a href={url ?? "/services?contact=consultation#inquiry"}
    className={className} target={url ? "_blank" : undefined} rel={url ? "noopener noreferrer" : undefined}
    data-conversion={url ? "booking_cta_clicked" : "proposal_requested"} data-source={source}>
    {url ? (children ?? "Book a Free 20-Minute Consultation") : "Request a Free 20-Minute Consultation"}
    {url && <span className="sr-only"> (opens scheduling in a new tab)</span>}
  </a>;
}
