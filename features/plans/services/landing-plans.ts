import { stripHtml } from "@/lib/strip-html";

import type { PricingPackageItem } from "@/features/landing/types/landing-api";
import type { Plan as PricingDisplayPlan } from "@/features/landing/components/sections/PricingCards";
import type { Plan as BillingPlan } from "@/features/plans/types/types";

export const PLAN_BAR_CLASSES = [
  "from-[#caa24a] via-[#5d7a2c] to-[#14210a]",
  "from-[#9ed25a] to-[#3f6e1f]",
  "from-[#dbe7c8] to-[#a9c787]",
  "from-[#5d7a2c] via-[#9ed25a] to-[#dbe7c8]",
];

const PLAN_NAME_ALIASES: Record<string, string[]> = {
  free: ["free", "مجاني", "gratis"],
  starter: ["starter", "basic", "أساسي", "basic plan"],
  pro: ["pro", "professional", "احترافي", "growth"],
  agency: ["agency", "enterprise", "وكالة", "business"],
};

export function getStablePlanId(planId: string): string {
  return planId.replace(/-loop-\d+$/, "");
}

function parsePriceNumber(price: string): number | null {
  const cleaned = stripHtml(price).toLowerCase().replace(/,/g, "").trim();
  if (!cleaned) return null;
  if (/^(free|مجاني|gratis)$/i.test(cleaned)) return 0;
  const numeric = parseFloat(cleaned.replace(/[^\d.]/g, ""));
  return Number.isNaN(numeric) ? null : numeric;
}

function isFreePrice(price: string): boolean {
  const numeric = parsePriceNumber(price);
  return numeric === 0;
}

function hasMeaningfulText(value: string | null | undefined): boolean {
  return stripHtml(value).length > 0;
}

export function filterPackageFeatures(features: string[] | undefined): string[] {
  return (features ?? []).filter(hasMeaningfulText);
}

/** Map a CMS package title/price to a billing API `plan.name` slug. */
export function resolveBillingPlanName(
  item: Pick<PricingPackageItem, "title" | "price" | "plan_name" | "slug">,
  index: number,
  billingPlans: BillingPlan[],
): string | null {
  if (!billingPlans.length) return null;

  const explicit = (item.plan_name || item.slug || "").trim().toLowerCase();
  if (explicit) {
    const match = billingPlans.find((p) => p.name.toLowerCase() === explicit);
    if (match) return match.name;
  }

  if (isFreePrice(item.price ?? "")) {
    const free = billingPlans.find((p) => p.name.toLowerCase() === "free");
    if (free) return free.name;
  }

  const title = stripHtml(item.title).toLowerCase();
  for (const plan of billingPlans) {
    const name = plan.name.toLowerCase();
    if (title.includes(name)) return plan.name;
    const aliases = PLAN_NAME_ALIASES[name] ?? [];
    if (aliases.some((alias) => title.includes(alias))) return plan.name;
  }

  const cmsPrice = parsePriceNumber(item.price ?? "");
  if (cmsPrice != null) {
    let closest: BillingPlan | null = null;
    let closestDiff = Number.POSITIVE_INFINITY;
    for (const plan of billingPlans) {
      const usd = parseFloat(plan.price_monthly_usd);
      const sar = parseFloat(plan.price_monthly_sar);
      for (const candidate of [usd, sar]) {
        if (Number.isNaN(candidate)) continue;
        const diff = Math.abs(candidate - cmsPrice);
        if (diff < closestDiff) {
          closestDiff = diff;
          closest = plan;
        }
      }
    }
    // Accept close numeric match (CMS may show rounded figures).
    if (closest && closestDiff <= Math.max(5, cmsPrice * 0.15)) {
      return closest.name;
    }
  }

  const sorted = [...billingPlans].sort(
    (a, b) => parseFloat(a.price_monthly_usd) - parseFloat(b.price_monthly_usd),
  );
  return sorted[Math.min(index, sorted.length - 1)]?.name ?? null;
}

export function mapLandingPackagesToPlans(
  items: PricingPackageItem[] | undefined,
  billingPlans: BillingPlan[] = [],
): PricingDisplayPlan[] {
  return (items ?? []).map((item, index) => {
    const billingPlanName = resolveBillingPlanName(item, index, billingPlans) ?? undefined;
    return {
      id: String(index),
      name: item.title,
      description: item.description,
      monthly: stripHtml(item.price),
      features: filterPackageFeatures(item.features),
      action: item.button_text,
      barClass: PLAN_BAR_CLASSES[index % PLAN_BAR_CLASSES.length],
      billingPlanName,
    };
  });
}

export function enrichPlansWithBillingNames(
  plans: PricingDisplayPlan[],
  billingPlans: BillingPlan[],
): PricingDisplayPlan[] {
  if (!billingPlans.length) return plans;
  return plans.map((plan) => {
    if (plan.billingPlanName) return plan;
    const index = Number.parseInt(getStablePlanId(plan.id), 10);
    const billingPlanName =
      resolveBillingPlanName(
        { title: plan.name, price: plan.monthly },
        Number.isNaN(index) ? 0 : index,
        billingPlans,
      ) ?? undefined;
    return { ...plan, billingPlanName };
  });
}

export function findPlanById(
  plans: PricingDisplayPlan[],
  planId: string | null | undefined,
): PricingDisplayPlan | undefined {
  if (!planId) return undefined;
  const stable = getStablePlanId(planId);
  return plans.find((plan) => getStablePlanId(plan.id) === stable);
}
