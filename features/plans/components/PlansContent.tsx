"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getLocaleDirection } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import { getPlans } from "../services/api";
import type { Plan } from "../types/types";
import { PlanCard } from "./PlanCard";

export function PlansContent() {
  const t = useTranslations("plans");
  const locale = useLocale();
  const direction = getLocaleDirection(locale);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const ContinueArrow = direction === "rtl" ? ArrowLeft : ArrowRight;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const fetchedPlans = await getPlans();
        setPlans(fetchedPlans);
        if (fetchedPlans.length > 0) {
          setSelectedPlanId(fetchedPlans[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId);
  const selectedIndex = plans.findIndex((plan) => plan.id === selectedPlanId);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 pb-10 sm:gap-10 lg:gap-12">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-h1 font-medium text-secondary-500">{t("title")}</h1>
          <p className="max-w-2xl text-label-md leading-6 text-neutral-500">
            {t("subtitle")}
          </p>
        </div>
        <div className="grid place-items-center">
          <div className="size-8 animate-spin rounded-full border-4 border-neutral-200 border-t-primary-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-10 sm:gap-10 lg:gap-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-h1 font-medium text-secondary-500">{t("title")}</h1>
        <p className="max-w-2xl text-label-md leading-6 text-neutral-500">
          {t("subtitle")}
        </p>
      </div>

      {plans.length > 0 && (
        <>
          <div className="relative mx-auto flex w-full max-w-full rounded-2xl bg-neutral-100 p-1 lg:hidden">
            <span
              aria-hidden
              className="absolute top-1 bottom-1 rounded-xl bg-primary-100 transition-[inset-inline-start] duration-300 ease-out"
              style={{
                width: `calc((100% - ${(plans.length - 1) * 0.25}rem) / ${plans.length})`,
                insetInlineStart: `calc(0.25rem + ${selectedIndex} * ((100% - ${(plans.length - 1) * 0.25}rem) / ${plans.length}))`,
              }}
            />
            {plans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlanId(plan.id)}
                className={cn(
                  "relative z-10 flex-1 rounded-xl px-3 py-2.5 text-label-md font-medium transition-colors duration-300",
                  selectedPlanId === plan.id
                    ? "text-secondary-500"
                    : "text-neutral-500 hover:text-secondary-400",
                )}
              >
                {plan.name}
              </button>
            ))}
          </div>

          <div className="lg:hidden">
            {selectedPlan && (
              <PlanCard
                plan={selectedPlan}
                isSelected
                isPopular={selectedPlan.name.toLowerCase() === "pro"}
              />
            )}
          </div>

          <div className={cn("hidden gap-6 lg:grid lg:items-stretch", {
            "lg:grid-cols-2": plans.length === 2,
            "lg:grid-cols-3": plans.length === 3,
            "lg:grid-cols-4": plans.length >= 4,
          })}>
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isSelected={selectedPlanId === plan.id}
                isPopular={plan.name.toLowerCase() === "pro"}
                onSelect={() => setSelectedPlanId(plan.id)}
              />
            ))}
          </div>
        </>
      )}

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
