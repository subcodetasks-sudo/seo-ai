"use client";

import { Check, Sparkles, Star } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import {
  formatPlanPrice,
  getPublicPlanFeatureBullets,
} from "../services/public-plan-display";
import type { PublicPlan } from "../types/types";

type PlanCardProps = {
  plan: PublicPlan;
  isSelected?: boolean;
  isPopular?: boolean;
  onSelect?: () => void;
  className?: string;
};

function PlanIcon({ planName }: { planName: string }) {
  if (planName.toLowerCase() === "free") {
    return (
      <div
        className="flex size-14 items-center justify-center rounded-full bg-neutral-200 sm:size-16"
        aria-hidden
      >
        <Sparkles className="size-6 text-secondary-300 sm:size-7" />
      </div>
    );
  }

  return (
    <div
      className="flex size-14 items-center justify-center rounded-full bg-warning-300 sm:size-16"
      aria-hidden
    >
      <Star className="size-6 fill-white text-white sm:size-7" />
    </div>
  );
}

export function PlanCard({
  plan,
  isSelected = false,
  isPopular = false,
  onSelect,
  className,
}: PlanCardProps) {
  const t = useTranslations("plans");
  const features = getPublicPlanFeatureBullets(plan, t);
  const priceLabel =
    plan.price_monthly == null
      ? t("customPricing")
      : plan.price_monthly === 0
        ? t("free")
        : formatPlanPrice(plan.price_monthly);
  const title =
    typeof plan.features?.display_name === "string" && plan.features.display_name.trim()
      ? plan.features.display_name.trim()
      : plan.name;

  return (
    <article
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={
        onSelect
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect();
              }
            }
          : undefined
      }
      className={cn(
        "relative flex h-full flex-col rounded-2xl border-2 bg-white px-6 py-8 transition-colors sm:px-8 sm:py-10",
        isSelected ? "border-primary-200" : "border-secondary-50",
        onSelect && "cursor-pointer hover:bg-neutral-50/50",
        className,
      )}
    >
      {isPopular ? (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary-300 px-4 py-1 text-label-sm font-semibold whitespace-nowrap text-secondary-500">
          {t("mostPopular")}
        </span>
      ) : null}

      {plan.discount_type && plan.discount_value != null ? (
        <span className="absolute -top-3.5 end-4 rounded-full bg-primary-50 px-3 py-1 text-label-sm font-semibold text-primary-700">
          {plan.discount_type === "percent"
            ? t("discountPercent", { value: plan.discount_value })
            : t("discountFixed", { value: plan.discount_value })}
        </span>
      ) : null}

      <div className="flex flex-1 flex-col items-center gap-6 text-center">
        <PlanIcon planName={plan.name} />

        <div className="flex flex-col gap-1">
          <h2 className="text-h3 font-medium capitalize text-secondary-500">{title}</h2>
          {plan.description ? (
            <p className="text-label-md text-neutral-500">{plan.description}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-semibold text-secondary-500">{priceLabel}</span>
            {plan.price_monthly != null && plan.price_monthly > 0 ? (
              <span className="text-label-md text-neutral-500">{t("perMonth")}</span>
            ) : null}
          </div>
        </div>

        <ul className="flex w-full flex-1 flex-col gap-3 text-start">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5">
              <Check
                className="mt-0.5 size-4 shrink-0 text-primary-300"
                strokeWidth={2.5}
                aria-hidden
              />
              <span className="text-label-md text-secondary-400">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
