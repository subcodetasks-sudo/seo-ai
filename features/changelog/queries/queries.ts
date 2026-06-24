import { queryOptions } from "@tanstack/react-query";

import type { ChangelogEntry, ChangelogPeriod } from "../types";
import { changelogKeys } from "./query-keys";

const MOCK_CHANGELOG: ChangelogEntry[] = [
  { id: "1", date: "2026-05-31", url: "/about-us", field: "Meta Title", old_value: "About Us", new_value: "Experts Since 2015 | TechCorp", status: "applied" },
  { id: "2", date: "2026-05-24", url: "/blog/ai-solutions", field: "Meta Description", old_value: "45 chars — AI blog post", new_value: "Experts Since 2015: Leading AI solutions for Saudi businesses. Discover our enterprise-grade tools.", status: "applied" },
  { id: "3", date: "2026-05-17", url: "/products/cloud", field: "OG Title", old_value: "Cloud Solutions", new_value: "Experts Since 2015 | Cloud Solutions for Modern Businesses | TechCorp", status: "applied" },
  { id: "4", date: "2026-05-10", url: "/services", field: "Meta Title", old_value: "Our Services", new_value: "Experts Since 2015 — AI, Cloud & Digital Transformation", status: "applied" },
  { id: "5", date: "2026-05-03", url: "/blog/seo-tips", field: "Redirect", old_value: "/blog/seo-tips", new_value: "Experts Since 2015 | /blog/seo-best-practices-2024", status: "applied" },
  { id: "6", date: "2026-05-03", url: "/pricing", field: "Alt Text", old_value: "pricing-table.png", new_value: "Experts Since 2015 pricing plans — Starter, Professional, Enterprise", status: "applied" },
  { id: "7", date: "2026-05-03", url: "/blog/web-dev", field: "OG Description", old_value: "Web tips.", new_value: "Experts Since 2015: Latest web development trends, frameworks, and best practices for 2024.", status: "applied" },
];

export function changelogQueryOptions(projectId: string, period: ChangelogPeriod) {
  return queryOptions<ChangelogEntry[]>({
    queryKey: changelogKeys.list(projectId, period),
    queryFn: () => Promise.resolve(MOCK_CHANGELOG),
    staleTime: 1000 * 60 * 5,
  });
}
