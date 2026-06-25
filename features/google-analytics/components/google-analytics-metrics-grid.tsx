"use client";

import type { GoogleAnalyticsMetric } from "../types";
import { GoogleAnalyticsMetricCard } from "./google-analytics-metric-card";

type GoogleAnalyticsMetricsGridProps = {
  metrics: GoogleAnalyticsMetric[];
};

export function GoogleAnalyticsMetricsGrid({ metrics }: GoogleAnalyticsMetricsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {metrics.map((metric) => (
        <GoogleAnalyticsMetricCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
}
