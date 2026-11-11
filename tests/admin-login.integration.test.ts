import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

test("admin login counters enforce durable global and trusted-IP windows", { skip: !process.env.TEST_DATABASE_URL }, async () => {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
  const { db } = await import("../src/db/client");
  const { inquiryRateLimits } = await import("../src/db/schema");
  const { like } = await import("drizzle-orm");
  const { adminLoginLimited } = await import("../src/lib/leads/login-rate");
  const prefix = `test-login-${randomUUID()}`;
  try {
    for (let i = 1; i <= 61; i++) assert.equal(await adminLoginLimited([`${prefix}-global`]), i > 60);
    for (let i = 1; i <= 11; i++) assert.equal(await adminLoginLimited([`${prefix}-global-ip-test`, `${prefix}-ip`]), i > 10);
  } finally {
    await db.delete(inquiryRateLimits).where(like(inquiryRateLimits.bucketKey, `${prefix}%`));
    await db.$client.end();
  }
});
