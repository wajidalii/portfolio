import { lt, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { inquiryRateLimits } from "@/db/schema";

/** The existing database stores HMAC hashes only. The global60/hour cap is a
 * backstop for this single-owner login; trusted-IP buckets add10/10min when
 * hosting strips/replaces the configured header. No password is stored. */
export async function adminLoginLimited(keys: string[], now = new Date()): Promise<boolean> {
  return db.transaction(async (tx) => {
    await tx.delete(inquiryRateLimits).where(lt(inquiryRateLimits.expiresAt, now));
    for (let i = 0; i < keys.length; i++) {
      const windowMs = i === 0 ? 3600000 : 600000;
      const slot = Math.floor(now.getTime() / windowMs);
      const key = `${keys[i]}:login:${slot}`;
      const [row] = await tx.insert(inquiryRateLimits).values({ bucketKey: key, count: 1, expiresAt: new Date((slot + 1) * windowMs) })
        .onConflictDoUpdate({ target: inquiryRateLimits.bucketKey, set: { count: sql`${inquiryRateLimits.count} + 1` } })
        .returning({ count: inquiryRateLimits.count });
      if (row.count > (i === 0 ? 60 : 10)) return true;
    }
    return false;
  });
}
