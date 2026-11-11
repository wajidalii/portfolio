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
