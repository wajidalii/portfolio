import { and, eq, inArray, lt, or, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { serviceLeads } from "@/db/schema";
import { acknowledgmentConfigured, acknowledgmentEmail, ownerInquiryEmail, sendInquiryEmail, type InquiryEmailSender } from "./email";
import { asReceivedLead } from "./repository";

/** Claim, send and record durable status; provider receives stable retry keys. */
export async function notifyLead(id: string, send: InquiryEmailSender = sendInquiryEmail): Promise<void> {
  const stale = new Date(Date.now() - 10 * 60 * 1000);
  const [lead] = await db.update(serviceLeads).set({
    notificationStatus: "sending", notificationAttempts: sql`${serviceLeads.notificationAttempts} + 1`, updatedAt: new Date(),
  }).where(and(eq(serviceLeads.id, id), or(inArray(serviceLeads.notificationStatus, ["pending", "failed"]), and(eq(serviceLeads.notificationStatus, "sending"), lt(serviceLeads.updatedAt, stale))))).returning();
  if (lead) {
    try {
      await send(ownerInquiryEmail(asReceivedLead(lead)), `inquiry-owner:${id}`);
      await db.update(serviceLeads).set({ notificationStatus: "sent", updatedAt: new Date() }).where(eq(serviceLeads.id, id));
    } catch {
      await db.update(serviceLeads).set({ notificationStatus: "failed", updatedAt: new Date() }).where(eq(serviceLeads.id, id));
    }
  }
  // Acknowledgments are separate and never contain the submitted description.
  const [row] = await db.select().from(serviceLeads).where(eq(serviceLeads.id, id)).limit(1);
  if (!row?.acknowledgmentConsent) return;
  if (!acknowledgmentConfigured()) {
    await db.update(serviceLeads).set({ acknowledgmentStatus: "disabled" }).where(and(eq(serviceLeads.id, id), inArray(serviceLeads.acknowledgmentStatus, ["pending", "disabled"])));
    return;
  }
  const [claimed] = await db.update(serviceLeads).set({ acknowledgmentStatus: "sending", updatedAt: new Date() })
    .where(and(eq(serviceLeads.id, id), or(inArray(serviceLeads.acknowledgmentStatus, ["pending", "failed", "disabled"]), and(eq(serviceLeads.acknowledgmentStatus, "sending"), lt(serviceLeads.updatedAt, stale))))).returning();
  if (!claimed) return;
  try {
    await send(acknowledgmentEmail(asReceivedLead(claimed)), `inquiry-ack:${id}`);
    await db.update(serviceLeads).set({ acknowledgmentStatus: "sent", updatedAt: new Date() }).where(eq(serviceLeads.id, id));
  } catch {
    await db.update(serviceLeads).set({ acknowledgmentStatus: "failed", updatedAt: new Date() }).where(eq(serviceLeads.id, id));
  }
}
