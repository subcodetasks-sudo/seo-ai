"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { publicPlansQueryOptions } from "@/features/plans/queries/queries";
import { mapPublicPlansToDisplay } from "@/features/plans/services/public-plan-display";

import { PricingCards } from "./PricingCards";

export function PricingSection() {
  const tPlans = useTranslations("plans");
  const { data: plans = [], isLoading, isError } = useQuery(publicPlansQueryOptions());

  const displayPlans = useMemo(
    () => mapPublicPlansToDisplay(plans, tPlans),
    [plans, tPlans],
  );

  if (isLoading) {
    return (
      <section id="pricing" className="pricing-section bg-pattern py-16 lg:py-24">
        <div className="grid place-items-center py-16">
          <div className="size-8 animate-spin rounded-full border-4 border-neutral-200 border-t-primary-300" />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section id="pricing" className="pricing-section bg-pattern py-16 lg:py-24">
        <p className="px-5 text-center text-lg text-ink-soft">{tPlans("comingSoon")}</p>
      </section>
    );
  }

  return <PricingCards plans={displayPlans} />;
}
