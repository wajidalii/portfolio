import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { parseLeadFilters, parseLeadUpdate, leadsCsv } from "../src/lib/leads/admin";

test("private lead query predicates and validated status/notes/follow-up persist in PostgreSQL", { skip: !process.env.TEST_DATABASE_URL }, async () => {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
  const { db } = await import("../src/db/client");
  const { serviceLeads } = await import("../src/db/schema");
  const { eq } = await import("drizzle-orm");
  const { leadWhere } = await import("../src/lib/leads/admin-data");
  const id = randomUUID();
  try {
    await db.insert(serviceLeads).values({ id, submissionId: randomUUID(), payloadHash: "admin-integration-only", fullName: "Admin Test Prospect", email: `${id}@example.test`, company: `Literal_%_${id}`, website: "", country: "Pakistan", service: "website", budget: "discuss", timeline: "flexible", description: "A disposable lead for validating private pipeline operations.", contactMethod: "email", source: "services", consentVersion: "services-2026-11-11" });
    const filters = parseLeadFilters({ q: `Literal_%_${id}`, status: "new", service: "website" });
    const rows = await db.select().from(serviceLeads).where(leadWhere(filters)); assert.equal(rows.length, 1); assert.equal(rows[0].id, id);
    assert.equal((await db.select().from(serviceLeads).where(leadWhere(parseLeadFilters({ q: `Literal_%_${id}`, status: "won" })))).length, 0);
    const form = new FormData(); form.set("status", "qualified"); form.set("internalNotes", "Follow up with the owner."); form.set("followUpDate", "2026-12-01"); const updated = parseLeadUpdate(form)!;
    await db.update(serviceLeads).set(updated).where(eq(serviceLeads.id, id));
    const [row] = await db.select().from(serviceLeads).where(eq(serviceLeads.id, id));
    assert.equal(row.status, "qualified"); assert.equal(row.internalNotes, "Follow up with the owner."); assert.equal(row.followUpDate, "2026-12-01");
    assert(leadsCsv([row]).includes('"qualified"'));
    await db.delete(serviceLeads).where(eq(serviceLeads.id, id));
    assert.equal((await db.select().from(serviceLeads).where(eq(serviceLeads.id, id))).length, 0);
  } finally { await db.delete(serviceLeads).where(eq(serviceLeads.id, id)); await db.$client.end(); }
});
