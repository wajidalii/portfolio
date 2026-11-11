import { randomUUID } from "node:crypto";
import { eq, lt, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { inquiryRateLimits, serviceLeads } from "@/db/schema";
import { CONSENT_VERSION, type Inquiry } from "./validation";
import type { ReceivedLead, ReceiveResult } from "./handler";

export function asReceivedLead(row: typeof serviceLeads.$inferSelect): ReceivedLead {
  return { ...row, service: row.service as Inquiry["service"], budget: row.budget as Inquiry["budget"], timeline: row.timeline as Inquiry["timeline"], contactMethod: row.contactMethod as Inquiry["contactMethod"], source: row.source as Inquiry["source"], consent: true };
}

/** Transaction + advisory key lock ensure concurrent retries create one lead. */
export async function receiveInquiry(data: Inquiry, payloadHash: string, rateKeys: string[], now = new Date()): Promise<ReceiveResult> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${data.submissionId}, 0))`);
    const [existing] = await tx.select().from(serviceLeads).where(eq(serviceLeads.submissionId, data.submissionId)).limit(1);
    if (existing) return { kind: existing.payloadHash === payloadHash ? "duplicate" : "conflict" };
    // Expired counters contain keyed hashes only. Keeping them bounded avoids
    // retaining linkable abuse identifiers beyond the one-hour window.
    await tx.delete(inquiryRateLimits).where(lt(inquiryRateLimits.expiresAt, now));
    const hour = Math.floor(now.getTime() / 3600000);
    const expiresAt = new Date((hour + 1) * 3600000);
    for (let i = 0; i < rateKeys.length; i++) {
      const bucketKey = `${rateKeys[i]}:${hour}`;
      const limit = i === 0 ? 120 : 5;
      const [counter] = await tx.insert(inquiryRateLimits).values({ bucketKey, count: 1, expiresAt })
        .onConflictDoUpdate({ target: inquiryRateLimits.bucketKey, set: { count: sql`${inquiryRateLimits.count} + 1` } })
        .returning({ count: inquiryRateLimits.count });
      if (counter.count > limit) return { kind: "limited" };
    }
    const [lead] = await tx.insert(serviceLeads).values({
      ...data, id: randomUUID(), payloadHash,
      consentVersion: CONSENT_VERSION, consentAt: now,
      acknowledgmentStatus: data.acknowledgmentConsent ? "pending" : "not_requested",
      createdAt: now, updatedAt: now,
    }).returning();
    return { kind: "created", lead: asReceivedLead(lead) };
  });
}
