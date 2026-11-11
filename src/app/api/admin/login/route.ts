import { createSessionToken, verifyPassword } from "@/lib/admin-auth";
import { createAdminLoginHandler } from "@/lib/admin-login";
import { adminLoginLimited } from "@/lib/leads/login-rate";

export const runtime = "nodejs";
export async function POST(request: Request) {
  return createAdminLoginHandler({
    secret: process.env.INQUIRY_RATE_LIMIT_SECRET,
    trustedIpHeader: process.env.INQUIRY_TRUSTED_IP_HEADER,
    limited: adminLoginLimited,
    verifyPassword,
    createSessionToken,
    secureCookie: process.env.NODE_ENV === "production",
  })(request);
}
