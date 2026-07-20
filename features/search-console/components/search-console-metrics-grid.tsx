"use client";

import type { SearchConsoleMetric } from "../types";
import { SearchConsoleMetricCard } from "./search-console-metric-card";

type SearchConsoleMetricsGridProps = {
  metrics: SearchConsoleMetric[];
};

export function SearchConsoleMetricsGrid({ metrics }: SearchConsoleMetricsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <SearchConsoleMetricCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
}
