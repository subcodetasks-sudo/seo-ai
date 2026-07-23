import type { useTranslations } from "next-intl";

import { PLAN_BAR_CLASSES } from "./landing-plans";
import type { DiscountScope, PublicPlan } from "../types/types";

export type BillingPeriod = "month" | "year";

export type PricingDisplayPlan = {
  id: string;
  name: string;
  description: string;
  features: string[];
  barClass: string;
  /** Slug / name used by checkout / change-plan (`plan_name`). */
  billingPlanName: string;
  priceMonthly: number | null;
  priceYearly: number | null;
  discountType: PublicPlan["discount_type"];
  discountValue: number | null;
  discountScope: DiscountScope;
};

type PlansTranslator = ReturnType<typeof useTranslations<"plans">>;

function formatLimit(
  value: number | null | undefined,
  unlimitedLabel: string,
): string | null {
  if (value == null || value === -1) return unlimitedLabel;
  if (value === 0) return null;
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatPlanPrice(amount: number | null | undefined): string | null {
  if (amount == null) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function capitalizePlanName(name: string): string {
  if (!name) return name;
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function displayNameFor(plan: PublicPlan): string {
  const fromFeatures = plan.features?.display_name;
  if (typeof fromFeatures === "string" && fromFeatures.trim()) {
    return fromFeatures.trim();
  }
  return capitalizePlanName(plan.name);
}

export function getPublicPlanFeatureBullets(
  plan: PublicPlan,
  t: PlansTranslator,
): string[] {
  const highlights = plan.features?.highlights;
  if (Array.isArray(highlights) && highlights.length > 0) {
    return highlights
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  const bullets: string[] = [];
  const unlimited = t("unlimited");

  if (plan.max_projects === -1) {
    bullets.push(t("features.unlimitedProjects"));
  } else if (plan.max_projects > 0) {
    bullets.push(
      t("features.projects", {
        count: new Intl.NumberFormat("en-US").format(plan.max_projects),
      }),
    );
  }

  const features = plan.features;
  if (!features) return bullets;

  if ("requests_limit" in features) {
    const count = formatLimit(features.requests_limit, unlimited);
    if (count) bullets.push(t("features.requestsLimit", { count }));
  }

  if ("api_token_limit" in features) {
    const count = formatLimit(features.api_token_limit, unlimited);
    if (count) bullets.push(t("features.apiTokenLimit", { count }));
  }

  if ("max_websites" in features) {
    const count = formatLimit(features.max_websites, unlimited);
    if (count) bullets.push(t("features.maxWebsites", { count }));
  }

  if (features.crawling_enabled === true) {
    bullets.push(t("features.crawlingEnabled"));
  } else if (features.crawling_enabled === false) {
    bullets.push(t("features.crawlingDisabled"));
  }

  const priority = features.support_priority;
  if (priority === "email" || priority === "priority" || priority === "dedicated") {
    bullets.push(t(`features.support.${priority}`));
  } else if (typeof priority === "string" && priority.trim()) {
    // Unknown marketing labels (e.g. localized copy) — show as-is.
    bullets.push(priority.trim());
  }

  return bullets;
}

export function mapPublicPlansToDisplay(
  plans: PublicPlan[],
  t: PlansTranslator,
): PricingDisplayPlan[] {
  return plans.map((plan, index) => ({
    id: plan.id,
    name: displayNameFor(plan),
    description: plan.description?.trim() ?? "",
    features: getPublicPlanFeatureBullets(plan, t),
    barClass: PLAN_BAR_CLASSES[index % PLAN_BAR_CLASSES.length],
    billingPlanName: plan.name,
    priceMonthly: plan.price_monthly,
    priceYearly: plan.price_yearly,
    discountType: plan.discount_type,
    discountValue: plan.discount_value,
    discountScope: plan.discount_scope,
  }));
}

export function priceForPeriod(
  plan: Pick<PricingDisplayPlan, "priceMonthly" | "priceYearly">,
  period: BillingPeriod,
): number | null {
  return period === "year" ? plan.priceYearly : plan.priceMonthly;
}

export function isCustomPricing(
  plan: Pick<PricingDisplayPlan, "priceMonthly" | "priceYearly">,
  period: BillingPeriod,
): boolean {
  return priceForPeriod(plan, period) == null;
}

export function shouldShowDiscount(
  plan: Pick<PricingDisplayPlan, "discountType" | "discountScope">,
  period: BillingPeriod,
): boolean {
  if (!plan.discountType) return false;
  if (!plan.discountScope || plan.discountScope === "project") return true;
  return plan.discountScope === period;
}

export function findDisplayPlan(
  plans: PricingDisplayPlan[],
  planId: string | null | undefined,
): PricingDisplayPlan | undefined {
  if (!planId) return undefined;
  const needle = planId.toLowerCase();
  return plans.find(
    (plan) =>
      plan.id.toLowerCase() === needle ||
      plan.billingPlanName.toLowerCase() === needle,
  );
}
