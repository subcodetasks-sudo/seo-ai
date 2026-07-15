import type { useTranslations } from "next-intl";

import type { Plan } from "../types/types";

type PlansTranslator = ReturnType<typeof useTranslations<"plans">>;

export function getPlanFeatures(plan: Plan, t: PlansTranslator): string[] {
  const features: string[] = [];

  if (plan.max_projects !== -1) {
    features.push(`${plan.max_projects} ${t("max_projects")}`);
  } else {
    features.push(`${t("unlimited")} ${t("max_projects")}`);
  }

  features.push(`${plan.max_pages_per_crawl} ${t("max_pages_per_crawl")}`);

  if (plan.max_crawls_per_month === -1) {
    features.push(`${t("unlimited")} ${t("max_crawls_per_month")}`);
  } else {
    features.push(`${plan.max_crawls_per_month} ${t("max_crawls_per_month")}`);
  }

  const scheduleLabel =
    plan.crawl_schedule.charAt(0).toUpperCase() + plan.crawl_schedule.slice(1);
  features.push(`${scheduleLabel} ${t("max_crawls_per_month")}`);

  if (plan.max_ai_pages_per_month === -1) {
    features.push(`${t("unlimited")} ${t("max_ai_pages_per_month")}`);
  } else {
    features.push(`${plan.max_ai_pages_per_month} ${t("max_ai_pages_per_month")}`);
  }

  return features;
}
