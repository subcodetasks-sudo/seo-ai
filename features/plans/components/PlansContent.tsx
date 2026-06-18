"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getLocaleDirection } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import { DEFAULT_PLAN_ID, PLAN_IDS, type PlanId } from "../types/types";
import { PlanCard } from "./PlanCard";

export function PlansContent() {
  const t = useTranslations("plans");
  const locale = useLocale();
  const direction = getLocaleDirection(locale);
  const [selectedPlan, setSelectedPlan] = useState<PlanId>(DEFAULT_PLAN_ID);
  const ContinueArrow = direction === "rtl" ? ArrowLeft : ArrowRight;
  const selectedIndex = PLAN_IDS.indexOf(selectedPlan);

  return (
    <div className="flex flex-col gap-8 pb-10 sm:gap-10 lg:gap-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-h1 font-medium text-secondary-500">{t("title")}</h1>
        <p className="max-w-2xl text-label-md leading-6 text-neutral-500">
          {t("subtitle")}
        </p>
      </div>

      <div className="relative mx-auto flex w-full max-w-md rounded-2xl bg-neutral-100 p-1 lg:hidden">
        <span
          aria-hidden
          className="absolute top-1 bottom-1 rounded-xl bg-primary-100 transition-[inset-inline-start] duration-300 ease-out"
          style={{
            width: `calc((100% - 0.5rem) / ${PLAN_IDS.length})`,
            insetInlineStart: `calc(0.25rem + ${selectedIndex} * ((100% - 0.5rem) / ${PLAN_IDS.length}))`,
          }}
        />
        {PLAN_IDS.map((planId) => (
          <button
            key={planId}
            type="button"
            onClick={() => setSelectedPlan(planId)}
            className={cn(
              "relative z-10 flex-1 rounded-xl px-3 py-2.5 text-label-md font-medium transition-colors duration-300",
              selectedPlan === planId
                ? "text-secondary-500"
                : "text-neutral-500 hover:text-secondary-400",
            )}
          >
            {t(`cards.${planId}.name`)}
          </button>
        ))}
      </div>

      <div className="lg:hidden">
        <PlanCard
          planId={selectedPlan}
          isSelected
          isPopular={selectedPlan === "premium"}
        />
      </div>

      <div className="hidden gap-6 lg:grid lg:grid-cols-3 lg:items-stretch">
        {PLAN_IDS.map((planId) => (
          <PlanCard
            key={planId}
            planId={planId}
            isSelected={selectedPlan === planId}
            isPopular={planId === "premium"}
            onSelect={() => setSelectedPlan(planId)}
          />
        ))}
      </div>

      <div className="flex justify-center px-4">
        <Button
          asChild
          className="h-12 w-full max-w-md rounded-xl bg-primary-300 text-base font-semibold text-secondary-500 hover:bg-primary-200"
        >
          <Link href="/">
            {t("continue")}
            <ContinueArrow className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
