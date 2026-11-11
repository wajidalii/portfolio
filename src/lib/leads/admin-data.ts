import { and, eq, ilike, or } from "drizzle-orm";
import { serviceLeads } from "@/db/schema";
import { escapeLike, type LeadFilters } from "./admin";

/** Bound parameters only; wildcard characters in search are literal. */
export function leadWhere(filters: LeadFilters) {
  const clauses = [];
  if (filters.q) {
    const pattern = `%${escapeLike(filters.q)}%`;
    clauses.push(or(ilike(serviceLeads.fullName, pattern), ilike(serviceLeads.email, pattern), ilike(serviceLeads.company, pattern)));
  }
  if (filters.status) clauses.push(eq(serviceLeads.status, filters.status as typeof serviceLeads.$inferSelect.status));
  if (filters.service) clauses.push(eq(serviceLeads.service, filters.service));
  if (filters.source) clauses.push(eq(serviceLeads.source, filters.source));
  if (filters.budget) clauses.push(eq(serviceLeads.budget, filters.budget));
  return and(...clauses);
}
