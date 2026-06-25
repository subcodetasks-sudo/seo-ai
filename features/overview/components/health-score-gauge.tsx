"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

type HealthScoreGaugeProps = {
  score: number;
  max?: number;
  className?: string;
};

export function HealthScoreGauge({
  score,
  max = 100,
  className,
}: HealthScoreGaugeProps) {
  const t = useTranslations("overview");
  const percentage = Math.min(Math.max((score / max) * 100, 0), 100);
  const radius = 54;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={cn("relative flex size-36 items-center justify-center", className)}
      role="img"
      aria-label={`${t("healthIndicator")}: ${score} / ${max}`}
    >
      <svg
        width={radius * 2}
        height={radius * 2}
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-neutral-100"
        />
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          className="text-primary-400 transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-h2 font-semibold tabular-nums text-secondary-500">
          {score}
        </span>
        <span className="text-label-sm text-neutral-400">/ {max}</span>
      </div>
    </div>
  );
}
