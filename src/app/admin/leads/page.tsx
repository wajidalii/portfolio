import type { Metadata } from "next";
import Link from "next/link";
import { count, desc, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { serviceLeads } from "@/db/schema";
import { isAdmin } from "@/lib/require-admin";
import { budgetOptions, leadStatuses, serviceOptions, sourceOptions } from "@/lib/leads/validation";
import { filtersQuery, LEADS_EXPORT_LIMIT, LEADS_PAGE_SIZE, parseLeadFilters, statusLabels } from "@/lib/leads/admin";
import { leadWhere } from "@/lib/leads/admin-data";
import { saveLead, retryLeadNotification, deleteLead } from "./actions";

export const metadata: Metadata = { title: "Services Leads", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
const notices: Record<string, string> = {
  saved: "Lead updated.", deleted: "Lead permanently deleted.", invalid: "The update was not saved. Check the status, notes and date, then try again.",
  notification: "Notification delivery attempted. Review the delivery state below.", unavailable: "The operation is temporarily unavailable. Please try again.",
};
const labels: Record<string, string> = { website: "Website", saas: "SaaS", automation: "Automation", "not-sure": "Help choosing", "under-45000": "Below PKR 45,000", "45000-95000": "PKR 45,000–95,000", "95000-175000": "PKR 95,000–175,000", "175000-plus": "PKR 175,000+", discuss: "Discuss scope" };
function options(values: readonly string[]) { return values.map((value) => <option key={value} value={value}>{labels[value] ?? value}</option>); }

export default async function LeadsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (!(await isAdmin())) redirect("/admin/login?from=%2Fadmin%2Fleads");
  const params = await searchParams;
  const filters = parseLeadFilters(params);
  let items: typeof serviceLeads.$inferSelect[] = [];
  let total = 0;
  let pipeline: { status: typeof serviceLeads.$inferSelect.status; total: number }[] = [];
  let followUps = 0;
  let unavailable = false;
  try {
    const [rows, totals, counts, due] = await Promise.all([
      db.select().from(serviceLeads).where(leadWhere(filters)).orderBy(desc(serviceLeads.createdAt)).limit(LEADS_PAGE_SIZE).offset((filters.page - 1) * LEADS_PAGE_SIZE),
      db.select({ total: count() }).from(serviceLeads).where(leadWhere(filters)),
      db.select({ status: serviceLeads.status, total: count() }).from(serviceLeads).groupBy(serviceLeads.status),
      db.select({ total: count() }).from(serviceLeads).where(sql`${serviceLeads.followUpDate} <= ${new Date().toISOString().slice(0, 10)} and ${serviceLeads.status} not in ('won', 'lost')`),
    ]);
    items = rows; total = totals[0].total; pipeline = counts; followUps = due[0].total;
  } catch { unavailable = true; }
  const notice = typeof params.notice === "string" ? notices[params.notice] : undefined;
  const currentUrl = `/admin/leads${filtersQuery(filters) ? `?${filtersQuery(filters)}` : ""}`;
  return <main className="min-h-screen px-4 sm:px-6 py-12 max-w-6xl mx-auto">
    <Link href="/admin" className="inline-flex min-h-11 items-center text-muted text-sm">← Admin</Link>
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8"><div><p className="label-mono mb-2">Private operations</p><h1 className="text-3xl font-wide font-extrabold">Services leads</h1><p className="text-muted mt-3 max-w-2xl">Qualified project inquiries and follow-ups. Customer details are private. Export only when necessary and store exports securely.</p></div><Link href={`/admin/leads/export?${filtersQuery(filters)}`} className="min-h-11 inline-flex items-center border border-border rounded-md px-4 font-semibold">Export filtered CSV</Link></div>
    {notice && <p role="status" className="border border-border bg-surface rounded-lg p-4 mb-6">{notice}</p>}
    {unavailable && <p role="alert" className="border border-border bg-surface rounded-lg p-4 mb-6">Lead data is temporarily unavailable. Confirm the services migration has been applied and database access is healthy, then retry.</p>}
    <section aria-labelledby="pipeline-heading" className="mb-8"><h2 id="pipeline-heading" className="text-xl font-bold mb-4">Pipeline overview</h2><dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">{leadStatuses.map((status) => <div key={status} className="border border-border rounded-lg bg-surface p-3"><dt className="text-sm text-muted">{statusLabels[status]}</dt><dd className="text-2xl font-bold mt-1">{pipeline.find((item) => item.status === status)?.total ?? 0}</dd></div>)}</dl><p className="mt-3 text-sm text-muted">{followUps} active lead{followUps === 1 ? "" : "s"} with follow-up due today or earlier (UTC). Counts cover all leads; filters apply to the list below.</p></section>
    <form method="GET" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border border-border rounded-lg p-4 mb-6" aria-label="Filter leads">
      <label className="grid gap-2 text-sm font-semibold">Search name, email or company<input className="field min-w-0" type="search" name="q" defaultValue={filters.q} maxLength={100} /></label>
      <label className="grid gap-2 text-sm font-semibold">Status<select className="field" name="status" defaultValue={filters.status}><option value="">All statuses</option>{leadStatuses.map((value) => <option key={value} value={value}>{statusLabels[value]}</option>)}</select></label>
      <label className="grid gap-2 text-sm font-semibold">Service<select className="field" name="service" defaultValue={filters.service}><option value="">All services</option>{options(serviceOptions)}</select></label>
      <label className="grid gap-2 text-sm font-semibold">Lead source<select className="field" name="source" defaultValue={filters.source}><option value="">All sources</option>{options(sourceOptions)}</select></label>
      <label className="grid gap-2 text-sm font-semibold">Budget<select className="field" name="budget" defaultValue={filters.budget}><option value="">All budgets</option>{options(budgetOptions)}</select></label>
      <div className="flex items-end gap-3"><button className="min-h-11 border border-border bg-accent text-on-accent rounded-md px-4 font-bold" type="submit">Apply filters</button><Link className="min-h-11 inline-flex items-center underline" href="/admin/leads">Reset</Link></div>
    </form>
    <p className="text-sm text-muted mb-4">{total} matching lead{total === 1 ? "" : "s"} · page {filters.page} · exports include up to {LEADS_EXPORT_LIMIT} newest matching leads.</p>
    <div className="grid gap-5">{items.map((lead) => <article key={lead.id} className="border border-border rounded-xl p-4 sm:p-6 bg-surface min-w-0 break-words">
      <div className="flex flex-wrap justify-between gap-3"><div><h2 className="text-xl font-bold">{lead.fullName}</h2><p className="text-muted text-sm mt-1">{lead.company} · {lead.country}</p><a className="text-accent-fg underline block min-h-11 py-3 break-all" href={`mailto:${lead.email}`}>{lead.email}</a></div><div className="text-sm text-muted"><p>{new Date(lead.createdAt).toISOString().replace("T", " ").slice(0, 16)} UTC</p><p className="mt-1">{labels[lead.service] ?? lead.service} · {labels[lead.budget] ?? lead.budget}</p></div></div>
      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-sm"><div><dt className="text-muted">Timeline</dt><dd>{lead.timeline}</dd></div><div><dt className="text-muted">Preferred contact</dt><dd>{lead.contactMethod}</dd></div><div><dt className="text-muted">Source</dt><dd>{lead.source}</dd></div></dl>
      {lead.website && <p className="mt-3 text-sm">Website: <a href={lead.website} target="_blank" rel="noopener noreferrer" className="underline">{lead.website}</a></p>}
      <p className="whitespace-pre-wrap text-sm leading-relaxed my-5">{lead.description}</p>
      <form action={saveLead.bind(null, lead.id)} className="grid gap-4 border-t border-border pt-5">
        <div className="grid sm:grid-cols-2 gap-4"><label className="grid gap-2 text-sm font-semibold" htmlFor={`status-${lead.id}`}>Lead status<select className="field" id={`status-${lead.id}`} name="status" defaultValue={lead.status}>{leadStatuses.map((value) => <option key={value} value={value}>{statusLabels[value]}</option>)}</select></label><label className="grid gap-2 text-sm font-semibold" htmlFor={`followup-${lead.id}`}>Follow-up date (UTC)<input className="field min-w-0" id={`followup-${lead.id}`} name="followUpDate" type="date" min="1900-01-01" defaultValue={lead.followUpDate ?? ""} /></label></div>
        <label className="grid gap-2 text-sm font-semibold" htmlFor={`notes-${lead.id}`}>Internal notes<textarea className="field" id={`notes-${lead.id}`} name="internalNotes" rows={3} maxLength={10000} defaultValue={lead.internalNotes} /></label>
        <button className="justify-self-start min-h-11 px-4 rounded-md bg-accent text-on-accent font-bold" type="submit">Save lead</button>
      </form>
      <div className="border-t border-border mt-5 pt-4 flex flex-wrap items-center justify-between gap-3 text-sm"><p className="text-muted">Owner notification: <strong className="text-text">{lead.notificationStatus}</strong> ({lead.notificationAttempts} attempt{lead.notificationAttempts === 1 ? "" : "s"}) · acknowledgment: {lead.acknowledgmentStatus}</p><form action={retryLeadNotification.bind(null, lead.id)}><button type="submit" className="min-h-11 underline">Retry pending / failed email</button></form></div>
      <details className="mt-4 text-sm"><summary className="cursor-pointer min-h-11 flex items-center text-muted">Privacy and retention controls</summary><p className="text-muted mt-2">Consent recorded {new Date(lead.consentAt).toISOString()} · notice {lead.consentVersion}. Delete only after verifying the request and retention obligations. This removes the inquiry and internal notes permanently.</p><form action={deleteLead.bind(null, lead.id)} className="flex flex-wrap gap-3 items-center mt-3"><label className="inline-flex items-center gap-2 min-h-11"><input type="checkbox" name="confirm" value="delete" required /> Confirm permanent deletion</label><button type="submit" className="min-h-11 px-3 border border-border rounded text-danger">Delete lead</button></form></details>
    </article>)}{!items.length && !unavailable && <p className="text-muted py-8">No matching leads yet.</p>}</div>
    <nav aria-label="Lead pages" className="flex gap-4 mt-6">{filters.page > 1 && <Link className="min-h-11 inline-flex items-center underline" href={`${currentUrl.split("?")[0]}?${filtersQuery(filters, filters.page - 1)}`}>Previous page</Link>}{filters.page * LEADS_PAGE_SIZE < total && filters.page < 1000 && <Link className="min-h-11 inline-flex items-center underline" href={`/admin/leads?${filtersQuery(filters, filters.page + 1)}`}>Next page</Link>}</nav>
  </main>;
}
