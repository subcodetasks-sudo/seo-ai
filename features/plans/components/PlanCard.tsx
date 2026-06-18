"use client";

import { Check, Sparkles, Star } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import type { PlanId } from "../types/types";

type PlanCardProps = {
  planId: PlanId;
  isSelected?: boolean;
  isPopular?: boolean;
  onSelect?: () => void;
  className?: string;
};

function PlanIcon({ planId }: { planId: PlanId }) {
  if (planId === "free") {
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
  planId,
  isSelected = false,
  isPopular = false,
  onSelect,
  className,
}: PlanCardProps) {
  const t = useTranslations("plans");
  const features = t.raw(`cards.${planId}.features`) as string[];

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

      <div className="flex flex-1 flex-col items-center gap-6 text-center">
        <PlanIcon planId={planId} />

        <div className="flex flex-col gap-1">
          <h2 className="text-h3 font-medium text-secondary-500">
            {t(`cards.${planId}.name`)}
          </h2>
          <p className="text-label-md text-neutral-500">
            {t(`cards.${planId}.description`)}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-semibold text-secondary-500">
              {t(`cards.${planId}.price`)}
            </span>
            <span className="text-label-md text-neutral-500">{t("perMonth")}</span>
          </div>
          <p className="text-label-md text-neutral-500">
            {t(`cards.${planId}.usage`)}
          </p>
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
