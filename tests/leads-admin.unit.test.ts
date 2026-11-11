import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { csvCell, escapeLike, filtersQuery, leadsCsv, parseLeadFilters, parseLeadUpdate, validFollowUpDate, validLeadId } from "../src/lib/leads/admin";

test("lead search filters accept only bounded known values and cap pagination", () => {
  assert.deepEqual(parseLeadFilters({ q: "  Buyer  ", status: "qualified", service: "website", source: "header", budget: "discuss", page: "2" }), { q: "Buyer", status: "qualified", service: "website", source: "header", budget: "discuss", page: 2 });
  const rejected = parseLeadFilters({ q: "x".repeat(200), status: "hacked", service: "injection", source: "unknown", budget: "any", page: "9999" });
  assert.equal(rejected.q.length, 100); assert.equal(rejected.status, ""); assert.equal(rejected.service, ""); assert.equal(rejected.source, ""); assert.equal(rejected.budget, ""); assert.equal(rejected.page, 1000);
  assert.equal(parseLeadFilters({ page: "-1", status: ["qualified", "won"] }).page, 1);
  assert.equal(escapeLike("50%_\\"), "50\\%\\_\\\\");
  assert.equal(filtersQuery(parseLeadFilters({ q: "name@company.test", status: "new" }), 2), "q=name%40company.test&status=new&page=2");
});
test("lead updates require valid UUID, known status, bounded notes and real calendar date", () => {
  assert(validLeadId(randomUUID()));
  for (const value of ["1", "not-a-uuid", "../../admin", undefined]) assert.equal(validLeadId(value), false);
  assert(validFollowUpDate("2028-02-29")); assert(validFollowUpDate(""));
  for (const value of ["2026-02-29", "2026-04-31", "2026-13-01", "20-01-01", "2026-11-11T12:00:00Z", "0000-01-01"]) assert.equal(validFollowUpDate(value), false, value);
  const form = new FormData(); form.set("status", "qualified"); form.set("internalNotes", "  Agreed next steps.  "); form.set("followUpDate", "2026-12-01");
  assert.deepEqual(parseLeadUpdate(form), { status: "qualified", internalNotes: "Agreed next steps.", followUpDate: "2026-12-01" });
  form.set("internalNotes", "x".repeat(10001)); assert.equal(parseLeadUpdate(form), null);
  form.set("internalNotes", "normal"); form.set("status", "untrusted"); assert.equal(parseLeadUpdate(form), null);
});
test("CSV export escapes quotes/newlines and neutralizes spreadsheet formulas after whitespace/control", () => {
  assert.equal(csvCell('A "quoted" name\nwith a new line'), '"A ""quoted"" name\nwith a new line"');
  for (const value of ["=1+1", "+SUM(A1)", "-1+2", "@SUM(A1)", "  =1+1", "\t\r=cmd", "\u0000\t+formula"]) assert.equal(csvCell(value).startsWith('"\''), true, value);
  const csv = leadsCsv([{ fullName: "=formula", email: "test@example.test", internalNotes: 'Private "note"' }]);
  assert(csv.startsWith('"id","fullName","email"')); assert(csv.includes('"\'=formula"')); assert(csv.includes('"Private ""note"""')); assert(csv.endsWith("\r\n"));
});

test("private mutation POST verifies origin/session, validates updates and gives safe deterministic feedback", async () => {
  const { createLeadMutationHandler } = await import("../src/lib/leads/admin-handler");
  let authorized = false, saved = 0, deleted = 0;
  const handler = createLeadMutationHandler({ authorized: async () => authorized, save: async () => { saved++; }, remove: async () => { deleted++; }, retry: async () => {} });
  const send = (fields: Record<string, string>, origin = "https://example.com") => handler(new Request("https://example.com/admin/leads/mutate", { method: "POST", headers: { Origin: origin, "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(fields) }));
  const fields = { id: "bb9da9ea-3e86-4dc2-9e78-b9e837af3568", operation: "save", status: "qualified", internalNotes: "Private note", followUpDate: "2027-01-05" };
  assert.equal((await send(fields, "https://evil.test")).status, 403);
  assert.match((await send(fields)).headers.get("location")!, /\/admin\/login/);
  assert.equal(saved, 0); authorized = true;
  assert.match((await send({ ...fields, status: "invalid" })).headers.get("location")!, /notice=invalid/);
  assert.match((await send(fields)).headers.get("location")!, /notice=saved/); assert.equal(saved, 1);
  await send({ ...fields, operation: "delete" }); assert.equal(deleted, 0);
  assert.match((await send({ ...fields, operation: "delete", confirm: "delete" })).headers.get("location")!, /notice=deleted/); assert.equal(deleted, 1);
});
