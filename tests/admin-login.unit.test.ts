import test from "node:test";
import assert from "node:assert/strict";
import { adminRequestOrigin, createAdminLoginHandler, safeAdminRedirect, type AdminLoginDependencies } from "../src/lib/admin-login";
const origin = "https://wajidali.dev";
const token = `1234567890000.${"a".repeat(64)}`;
function dependencies(change: Partial<AdminLoginDependencies> = {}): AdminLoginDependencies {
  return { secret: "a-strong-local-test-secret-32-characters", limited: async () => false, verifyPassword: (password) => password === "correct-test-password", createSessionToken: async () => token, secureCookie: true, ...change };
}
function request(values: Record<string, string> = {}, headers: Record<string, string> = {}) {
  return new Request(origin + "/api/admin/login", { method: "POST", headers: { origin, "content-type": "application/x-www-form-urlencoded", ...headers }, body: new URLSearchParams({ password: "correct-test-password", from: "/admin/leads", ...values }) });
}
test("admin redirects reject parser-normalized offsite paths and nonadmin destinations", () => {
  for (const input of ["/\\attacker.test", "/\n/attacker.test", "/\t/attacker.test", "//attacker.test", "https://attacker.test", "/services", "/admin-evil", "/admin/../services"]) assert.equal(safeAdminRedirect(input, origin), "/admin", JSON.stringify(input));
  assert.equal(safeAdminRedirect("/admin/leads?status=new", origin), "/admin/leads?status=new");
  assert.equal(adminRequestOrigin(new Request("http://localhost:3000/login", { headers: { host: "127.0.0.1:3000" } })), "http://127.0.0.1:3000");
});
test("login rejects cross-origin, wrong media, oversized and malformed requests before auth", async () => {
  let checked = 0;
  const handle = createAdminLoginHandler(dependencies({ verifyPassword: () => { checked++; return true; } }));
  assert.equal((await handle(request({}, { origin: "https://attacker.test" }))).status, 403);
  assert.equal((await handle(request({}, { "content-type": "application/json" }))).status, 415);
  assert.equal((await handle(request({}, { "content-length": "9000" }))).status, 413);
  assert.equal((await handle(request({ password: "a".repeat(5000) }))).status, 413);
  assert.equal((await handle(request({ password: "a".repeat(257) }))).status, 400);
  assert.equal(checked, 0);
});
test("login fails closed without secret or rate storage and limits before checking passwords", async () => {
  assert.equal((await createAdminLoginHandler(dependencies({ secret: undefined }))(request())).status, 503);
  assert.equal((await createAdminLoginHandler(dependencies({ limited: async () => { throw new Error("private connection details"); } }))(request())).status, 503);
  let checked = false;
  const limited = await createAdminLoginHandler(dependencies({ limited: async (keys) => { assert.equal(keys.length, 1); assert.match(keys[0], /^[a-f0-9]{64}$/); return true; }, verifyPassword: () => { checked = true; return true; } }))(request());
  assert.equal(limited.status, 429); assert.equal(checked, false); assert.equal(limited.headers.get("Retry-After"), "3600");
});
test("normal login uses secure private cookie and cannot redirect to an external origin", async () => {
  const success = await createAdminLoginHandler(dependencies())(request({ from: "/\\attacker.test" }));
  assert.equal(success.status, 303); assert.equal(success.headers.get("location"), origin + "/admin");
  assert.match(success.headers.get("set-cookie")!, /HttpOnly; SameSite=Lax; Max-Age=604800; Secure$/);
  assert.equal(success.headers.get("cache-control"), "private, no-store");
  const denied = await createAdminLoginHandler(dependencies())(request({ password: "wrong" }));
  assert.equal(denied.status, 303); assert.equal(denied.headers.get("set-cookie"), null);
  assert.equal(new URL(denied.headers.get("location")!).pathname, "/admin/login");
});
