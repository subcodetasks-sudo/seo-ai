import type { HealthStatus, HealthStatusLevel } from "../types";

const HEALTH_THRESHOLDS: { min: number; level: HealthStatusLevel; badgeClassName: string }[] = [
  {
    min: 80,
    level: "excellent",
    badgeClassName: "border-primary-100 bg-primary-50 text-primary-600",
  },
  {
    min: 60,
    level: "good",
    badgeClassName: "border-success-100 bg-success-50 text-success-600",
  },
  {
    min: 40,
    level: "fair",
    badgeClassName: "border-warning-100 bg-warning-50 text-warning-600",
  },
  {
    min: 0,
    level: "poor",
    badgeClassName: "border-error-100 bg-error-50 text-error-600",
  },
];

export function getHealthStatus(score: number): HealthStatus {
  const match =
    HEALTH_THRESHOLDS.find((threshold) => score >= threshold.min) ??
    HEALTH_THRESHOLDS[HEALTH_THRESHOLDS.length - 1];

  return {
    level: match.level,
    badgeClassName: match.badgeClassName,
  };
}
