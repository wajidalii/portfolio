import { serviceCaseStudies, type ServiceCaseStudy } from "./service-case-studies";

/** Selected work reuses the reviewed evidence ledger instead of a second set of claims. */
export type AtelierWork = ServiceCaseStudy & { slug: string; summary: string };
const selectedIds = ["hrms", "knowledgecity", "mortgage", "cloudcard"] as const;
export const atelierWork: AtelierWork[] = selectedIds.map((id) => {
  const item = serviceCaseStudies.find((entry) => entry.id === id);
  if (!item) throw new Error(`Missing reviewed project: ${id}`);
  return { ...item, slug: item.id, summary: item.overview };
});

export function findAtelierWork(slug: string) {
  return atelierWork.find((item) => item.slug === slug);
}
