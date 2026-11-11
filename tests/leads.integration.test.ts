import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { validateInquiry } from "../src/lib/leads/validation";

test("real PostgreSQL inquiry persistence, concurrent idempotency, durable limits and mocked delivery", { skip: !process.env.TEST_DATABASE_URL }, async (t) => {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
  const { db } = await import("../src/db/client");
  const { serviceLeads, inquiryRateLimits } = await import("../src/db/schema");
  const { receiveInquiry } = await import("../src/lib/leads/repository");
  const { notifyLead } = await import("../src/lib/leads/notifications");
  const { eq, like } = await import("drizzle-orm");
  const prefix = `test-${randomUUID()}`;
  const ids: string[] = [];
  const data = () => validateInquiry({ fullName: "Integration Prospect", email: `${prefix}@example.com`, company: "Test Company", website: "", country: "Pakistan", service: "website", budget: "discuss", timeline: "flexible", description: "A project inquiry used only for isolated integration verification.", contactMethod: "email", consent: true, acknowledgmentConsent: false, submissionId: randomUUID(), source: "services", websiteConfirmation: "" }).data!;
  try {
    await t.test("concurrent repeated submission creates a single private row", async () => {
      const lead = data();
      const results = await Promise.all(Array.from({ length: 3 }, () => receiveInquiry(lead, "stable-test-hash", [`${prefix}-global`, `${prefix}-email`])));
      assert.equal(results.filter((result) => result.kind === "created").length, 1);
      assert.equal(results.filter((result) => result.kind === "duplicate").length, 2);
      const created = results.find((result) => result.kind === "created")!;
      if (created.kind !== "created") throw new Error("Missing row"); ids.push(created.lead.id);
      assert.equal((await receiveInquiry(lead, "changed-hash", [`${prefix}-global`, `${prefix}-email`])).kind, "conflict");
      const [row] = await db.select().from(serviceLeads).where(eq(serviceLeads.id, created.lead.id));
      assert.equal(row.status, "new"); assert.equal(row.consentVersion, "services-2026-11-11"); assert.equal(row.email, lead.email);
      let sent = 0;
      await notifyLead(created.lead.id, async (email, key) => { sent++; assert(email.text.includes(lead.company)); assert.equal(key, `inquiry-owner:${created.lead.id}`); });
      await notifyLead(created.lead.id, async () => { sent++; });
      assert.equal(sent, 1);
      const [updated] = await db.select().from(serviceLeads).where(eq(serviceLeads.id, created.lead.id)); assert.equal(updated.notificationStatus, "sent");
    });
    await t.test("email failure remains persisted and provider delivery can be retried idempotently", async () => {
      const result = await receiveInquiry(data(), "email-failure-hash", [`${prefix}-failure-global`, `${prefix}-failure-email`]);
      if (result.kind !== "created") throw new Error("Missing row"); ids.push(result.lead.id);
      await notifyLead(result.lead.id, async () => { throw new Error("mock failure"); });
      const [failed] = await db.select().from(serviceLeads).where(eq(serviceLeads.id, result.lead.id)); assert.equal(failed.notificationStatus, "failed");
      await notifyLead(result.lead.id, async () => {});
      const [sent] = await db.select().from(serviceLeads).where(eq(serviceLeads.id, result.lead.id)); assert.equal(sent.notificationStatus, "sent"); assert.equal(sent.notificationAttempts, 2);
    });
    await t.test("rate counters persist across distinct requests and reject the sixth email inquiry", async () => {
      for (let i = 0; i < 6; i++) {
        const result = await receiveInquiry(data(), `rate-test-hash-${i}`, [`${prefix}-rate-global`, `${prefix}-rate-email`]);
        assert.equal(result.kind, i < 5 ? "created" : "limited"); if (result.kind === "created") ids.push(result.lead.id);
      }
    });
  } finally {
    for (const id of ids) await db.delete(serviceLeads).where(eq(serviceLeads.id, id));
    await db.delete(inquiryRateLimits).where(like(inquiryRateLimits.bucketKey, `${prefix}%`));
    await db.$client.end();
  }
});
