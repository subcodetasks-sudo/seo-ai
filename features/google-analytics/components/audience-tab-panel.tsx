"use client";

import { useTranslations } from "next-intl";

import { getAudienceTabData } from "../services/mock-data";
import { BreakdownCard } from "./breakdown-card";
import { CountryBreakdownRow } from "./breakdown-progress-row";
import { TrafficDistributionChart } from "./traffic-distribution-chart";

export function AudienceTabPanel() {
  const t = useTranslations("googleAnalytics.audience");
  const { countries, distribution } = getAudienceTabData();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <BreakdownCard title={t("countries")}>
        {countries.map((country) => (
          <CountryBreakdownRow key={country.code} item={country} />
        ))}
      </BreakdownCard>

      <TrafficDistributionChart segments={distribution} />
    </div>
  );
}
