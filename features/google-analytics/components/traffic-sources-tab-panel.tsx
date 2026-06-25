"use client";

import { useTranslations } from "next-intl";

import { getTrafficSourcesTabData } from "../services/mock-data";
import { BreakdownCard } from "./breakdown-card";
import { TrafficSourceBreakdownRow } from "./breakdown-progress-row";
import { TrafficDistributionChart } from "./traffic-distribution-chart";

export function TrafficSourcesTabPanel() {
  const t = useTranslations("googleAnalytics.trafficSources");
  const { sources, distribution } = getTrafficSourcesTabData();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <BreakdownCard title={t("title")} subtitle={t("visitorsSuccess")}>
        {sources.map((source) => (
          <TrafficSourceBreakdownRow key={source.id} item={source} />
        ))}
      </BreakdownCard>

      <TrafficDistributionChart segments={distribution} />
    </div>
  );
}
