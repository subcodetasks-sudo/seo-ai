"use client";

import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";

import { mapLandingPackagesToPlans } from "@/features/plans/services/landing-plans";
import { pricingQueryOptions } from "../../queries/queries";
import type { Pricing } from "../../types/landing-api";
import { PricingCards } from "./PricingCards";

export function PricingSection() {
  const locale = useLocale();
  const { data: raw } = useQuery(pricingQueryOptions(locale));
  const pricing = Array.isArray(raw) ? (raw as Pricing[])[0] : (raw as Pricing | undefined);
  const plans = mapLandingPackagesToPlans(pricing?.packages?.items);

  return (
    <PricingCards
      plans={plans}
      eyebrow={pricing?.content ?? ""}
      title={pricing?.title ?? ""}
      subtitle={pricing?.description ?? ""}
    />
  );
}
