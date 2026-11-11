import { budgetOptions, leadStatuses, serviceOptions, sourceOptions } from "./validation";

export const LEADS_PAGE_SIZE = 25;
export const LEADS_EXPORT_LIMIT = 1000;
export const statusLabels: Record<(typeof leadStatuses)[number], string> = {
  new: "New", contacted: "Contacted", qualified: "Qualified", discovery_scheduled: "Discovery Scheduled",
  proposal_sent: "Proposal Sent", negotiating: "Negotiating", won: "Won", lost: "Lost",
};
export type LeadFilters = { q: string; status: string; service: string; source: string; budget: string; page: number };
export function parseLeadFilters(params: Record<string, string | string[] | undefined>): LeadFilters {
  const first = (key: string) => typeof params[key] === "string" ? params[key].trim() : "";
  const option = (key: string, options: readonly string[]) => options.includes(first(key)) ? first(key) : "";
  const rawPage = first("page");
  const page = /^\d{1,4}$/.test(rawPage) ? Math.max(1, Math.min(1000, Number(rawPage))) : 1;
  return { q: first("q").slice(0, 100), status: option("status", leadStatuses), service: option("service", serviceOptions), source: option("source", sourceOptions), budget: option("budget", budgetOptions), page };
}
export function escapeLike(value: string) { return value.replace(/[\\%_]/g, "\\$&"); }
export function filtersQuery(filters: LeadFilters, page?: number) {
  const query = new URLSearchParams();
  for (const key of ["q", "status", "service", "source", "budget"] as const) if (filters[key]) query.set(key, filters[key]);
  if (page && page > 1) query.set("page", String(page));
  return query.toString();
}
export function validLeadId(id: unknown): id is string { return typeof id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id); }
export function validFollowUpDate(value: string) {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value < "1900-01-01" || value > "9999-12-31") return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function parseLeadUpdate(data: FormData) {
  const status = data.get("status"), notes = data.get("internalNotes"), followUpDate = data.get("followUpDate");
  if (typeof status !== "string" || !(leadStatuses as readonly string[]).includes(status) || typeof notes !== "string" || notes.length > 10000 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(notes) || typeof followUpDate !== "string" || !validFollowUpDate(followUpDate)) return null;
  return { status: status as (typeof leadStatuses)[number], internalNotes: notes.trim(), followUpDate: followUpDate || null };
}
/** Neutralize spreadsheet formulas after leading whitespace/control characters. */
export function csvCell(raw: unknown): string {
  let value = raw instanceof Date ? raw.toISOString() : String(raw ?? "");
  if (/^[\s\u0000-\u001f]*[=+\-@]/.test(value)) value = `'${value}`;
  return `"${value.replaceAll('"', '""')}"`;
}
export function leadsCsv(rows: Record<string, unknown>[]) {
  const columns = ["id", "fullName", "email", "company", "website", "country", "service", "budget", "timeline", "description", "contactMethod", "source", "status", "internalNotes", "followUpDate", "consentVersion", "consentAt", "createdAt", "notificationStatus"];
  return [columns.map(csvCell).join(","), ...rows.map((row) => columns.map((key) => csvCell(row[key])).join(","))].join("\r\n") + "\r\n";
}
