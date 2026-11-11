import { desc } from "drizzle-orm";
import { db } from "@/db/client";
import { serviceLeads } from "@/db/schema";
import { isAdmin } from "@/lib/require-admin";
import { leadsCsv, LEADS_EXPORT_LIMIT, parseLeadFilters } from "@/lib/leads/admin";
import { leadWhere } from "@/lib/leads/admin-data";

export const dynamic = "force-dynamic";
const privateHeaders = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };
export async function GET(request: Request) {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401, headers: privateHeaders });
  const filters = parseLeadFilters(Object.fromEntries(new URL(request.url).searchParams));
  try {
    const rows = await db.select().from(serviceLeads).where(leadWhere(filters)).orderBy(desc(serviceLeads.createdAt)).limit(LEADS_EXPORT_LIMIT);
    return new Response(leadsCsv(rows), { headers: { ...privateHeaders, "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="services-leads-${new Date().toISOString().slice(0, 10)}.csv"` } });
  } catch { return new Response("Export is temporarily unavailable. Please try again.", { status: 503, headers: privateHeaders }); }
}
