import { createInquiryHandler } from "@/lib/leads/handler";
import { receiveInquiry } from "@/lib/leads/repository";
import { notifyLead } from "@/lib/leads/notifications";

export const runtime = "nodejs";
export async function POST(request: Request) {
  return createInquiryHandler({
    secret: process.env.INQUIRY_RATE_LIMIT_SECRET,
    trustedIpHeader: process.env.INQUIRY_TRUSTED_IP_HEADER,
    receive: receiveInquiry,
    notify: (lead) => notifyLead(lead.id),
  })(request);
}
