import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/admin-auth";

/** Middleware is defense in depth. Every new private read/write/export checks
 * the signed cookie at the handler boundary as well. Fail closed on config errors. */
export async function isAdmin(): Promise<boolean> {
  try { return await verifySessionToken((await cookies()).get(ADMIN_COOKIE_NAME)?.value); }
  catch { return false; }
}
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new Error("Unauthorized");
}
