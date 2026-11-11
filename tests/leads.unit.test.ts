import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createInquiryHandler, type InquiryDependencies, type ReceivedLead } from "../src/lib/leads/handler";
import { validateInquiry } from "../src/lib/leads/validation";
import { acknowledgmentConfigured, acknowledgmentEmail, ownerInquiryEmail } from "../src/lib/leads/email";

function inquiry(overrides: Record<string, unknown> = {}) {
  return { fullName: "Test Prospect", email: "test@example.com", company: "Test Company", website: "https://example.com", country: "Pakistan", service: "website", budget: "45000-95000", timeline: "1-3-months", description: "A responsive business website for our manufacturing operations.", contactMethod: "email", consent: true, acknowledgmentConsent: false, submissionId: randomUUID(), source: "services", websiteConfirmation: "", ...overrides };
}
function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request("https://wajidali.dev/api/inquiries", { method: "POST", headers: { origin: "https://wajidali.dev", "content-type": "application/json", ...headers }, body: JSON.stringify(body) });
}
function dependencies(overrides: Partial<InquiryDependencies> = {}): InquiryDependencies {
  return { secret: "unit-test-secret-at-least-32-characters", receive: async (data) => ({ kind: "created", lead: { ...data, id: randomUUID() } }), notify: async () => {}, ...overrides };
}
test("inquiry validation rejects missing, oversized, wrong-type, unknown and unsafe inputs", () => {
  assert(validateInquiry(inquiry()).data);
  for (const overrides of [{ email: "invalid" }, { fullName: "a" }, { description: "tiny" }, { description: "x".repeat(5001) }, { company: "two\nlines" }, { website: "javascript:alert(1)" }, { website: "https://user:pass@example.com" }, { consent: "true" }, { acknowledgmentConsent: "true" }, { budget: "free" }, { country: {} }, { submissionId: "x" }, { service: "unexpected" }, { internalNotes: "untrusted" }]) {
    assert.equal(validateInquiry(inquiry(overrides)).data, undefined, JSON.stringify(overrides).slice(0, 150));
  }
  assert.equal(validateInquiry(null).data, undefined);
  assert.equal(validateInquiry({}).spam, false);
  assert.equal(validateInquiry(inquiry({ websiteConfirmation: "bot" })).spam, true);
});
test("strict origin, request type, content limits and validation stop before persistence", async () => {
  let calls = 0;
  const handler = createInquiryHandler(dependencies({ receive: async () => { calls++; return { kind: "duplicate" }; } }));
  assert.equal((await handler(request(inquiry(), { origin: "https://evil.example" }))).status, 403);
  assert.equal((await handler(request(inquiry(), { "sec-fetch-site": "cross-site" }))).status, 403);
  assert.equal((await handler(request(inquiry(), { "content-type": "text/plain" }))).status, 415);
  assert.equal((await handler(request(inquiry(), { "content-length": "20000" }))).status, 413);
  assert.equal((await handler(request({ padding: "x".repeat(20000) }))).status, 413);
  assert.equal((await handler(request({}))).status, 422);
  assert.equal((await handler(request(inquiry({ websiteConfirmation: "bot" })))).status, 200);
  assert.equal(calls, 0);
});
test("missing strong rate secret fails closed; rate limits expose Retry-After but no PII", async () => {
  assert.equal((await createInquiryHandler(dependencies({ secret: undefined }))(request(inquiry()))).status, 503);
  const response = await createInquiryHandler(dependencies({ receive: async () => ({ kind: "limited" }) }))(request(inquiry()));
  assert.equal(response.status, 429); assert.equal(response.headers.get("retry-after"), "3600");
  assert(!JSON.stringify(await response.json()).includes("test@example.com"));
});
test("successful persistence precedes email; duplicate retries never send twice and conflict returns 409", async () => {
  const stages: string[] = []; const stored = new Map<string, string>();
  const handler = createInquiryHandler(dependencies({ receive: async (data, hash, keys) => {
    assert.equal(keys.length, 2); assert(keys.every((key) => /^[a-f0-9]{64}$/.test(key)));
    if (stored.has(data.submissionId)) return { kind: stored.get(data.submissionId) === hash ? "duplicate" : "conflict" };
    stored.set(data.submissionId, hash); stages.push("persist"); return { kind: "created", lead: { ...data, id: "private-id" } };
  }, notify: async () => { stages.push("email"); } }));
  const body = inquiry(); const response = await handler(request(body));
  assert.equal(response.status, 200); assert.deepEqual(stages, ["persist", "email"]);
  const publicBody = await response.json(); assert.equal(publicBody.ok, true); assert(!JSON.stringify(publicBody).includes("private-id"));
  assert.equal((await handler(request(body))).status, 200); assert.deepEqual(stages, ["persist", "email"]);
  assert.equal((await handler(request({ ...body, description: "A different project description with enough detail." }))).status, 409);
});
test("saved leads remain successful if email fails; persistence failure is generic and retryable", async () => {
  const result = await createInquiryHandler(dependencies({ notify: async () => { throw new Error("private provider details"); } }))(request(inquiry()));
  assert.equal(result.status, 200); assert.equal((await result.json()).ok, true);
  const failed = await createInquiryHandler(dependencies({ receive: async () => { throw new Error("postgres://secret"); } }))(request(inquiry()));
  assert.equal(failed.status, 503); assert(!(await failed.text()).includes("secret"));
});
test("email is text-only; acknowledgment requires separate consent and explicit configuration", () => {
  const lead = { ...validateInquiry(inquiry()).data!, id: randomUUID() } as ReceivedLead;
  const owner = ownerInquiryEmail(lead, {});
  assert.equal(owner.replyTo, lead.email); assert.equal("html" in owner, false);
  assert.equal(acknowledgmentConfigured({}), false);
  const env = { INQUIRY_ACKNOWLEDGMENTS_ENABLED: "true", RESEND_API_KEY: "unit-test-not-a-real-key", CONTACT_FROM_EMAIL: "Wajid <hi@example.com>" };
  assert.equal(acknowledgmentConfigured(env), true);
  assert.throws(() => acknowledgmentEmail(lead, env));
  const ack = acknowledgmentEmail({ ...lead, acknowledgmentConsent: true }, env);
  assert.equal(ack.to, lead.email); assert(!ack.text.includes(lead.description));
});

test("same-origin requests use actual Host when Next normalizes the internal URL", async () => {
  const handler = createInquiryHandler({ secret: "test-secret-that-is-at-least-32-characters", receive: async () => ({ kind: "duplicate" }), notify: async () => {} });
  const response = await handler(new Request("http://localhost:3000/api/inquiries", { method: "POST", headers: { host: "127.0.0.1:3000", origin: "http://127.0.0.1:3000", "content-type": "application/json" }, body: "{}" }));
  assert.equal(response.status, 422);
});
