"use client";

import { cn } from "@/lib/utils";
import { getHealthScoreRingClassName } from "../services/page-status";

type HealthScoreRingProps = {
  score: number | null;
  size?: number;
  stroke?: number;
  label?: string;
  className?: string;
  ringClassName?: string;
};

export function HealthScoreRing({
  score,
  size = 56,
  stroke = 5,
  label,
  className,
  ringClassName,
}: HealthScoreRingProps) {
  const hasScore = typeof score === "number" && Number.isFinite(score);
  const clamped = hasScore ? Math.min(Math.max(score, 0), 100) : 0;
  const radius = size / 2;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={label ?? (hasScore ? `${clamped} / 100` : "—")}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-neutral-100"
        />
        {hasScore && (
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
            className={cn(
              "transition-[stroke-dashoffset] duration-500",
              ringClassName ?? getHealthScoreRingClassName(clamped),
            )}
          />
        )}
      </svg>
      <span className="absolute text-label-sm font-semibold tabular-nums text-secondary-500">
        {hasScore ? Math.round(clamped) : "—"}
      </span>
    </div>
  );
}
