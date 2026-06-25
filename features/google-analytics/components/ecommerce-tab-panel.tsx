"use client";

import { useTranslations } from "next-intl";

import { getEcommerceTabData } from "../services/mock-data";
import { EcommerceProductsTable } from "./ecommerce-products-table";
import { EcommerceRevenueChart } from "./ecommerce-revenue-chart";
import { GoogleAnalyticsMetricCard } from "./google-analytics-metric-card";

export function EcommerceTabPanel() {
  const t = useTranslations("googleAnalytics.ecommerceDashboard");
  const { summary, revenueTrend, topProducts } = getEcommerceTabData();

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((metric) => (
          <GoogleAnalyticsMetricCard
            key={metric.id}
            metric={metric}
            labelNamespace="googleAnalytics.ecommerceDashboard"
            valueSuffix={
              metric.id === "revenue" || metric.id === "avgOrderValue"
                ? t("currency")
                : undefined
            }
          />
        ))}
      </div>

      <EcommerceRevenueChart data={revenueTrend} />
      <EcommerceProductsTable products={topProducts} />
    </div>
  );
}
