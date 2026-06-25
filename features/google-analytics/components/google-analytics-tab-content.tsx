"use client";

import type { GoogleAnalyticsMetric, GoogleAnalyticsTab } from "../types";
import { AudienceTabPanel } from "./audience-tab-panel";
import { EcommerceTabPanel } from "./ecommerce-tab-panel";
import { GoogleAnalyticsMetricsGrid } from "./google-analytics-metrics-grid";
import { PagesTabPanel } from "./pages-tab-panel";
import { TrafficSourcesTabPanel } from "./traffic-sources-tab-panel";

type GoogleAnalyticsTabContentProps = {
  tab: GoogleAnalyticsTab;
  metrics: GoogleAnalyticsMetric[];
};

export function GoogleAnalyticsTabContent({ tab, metrics }: GoogleAnalyticsTabContentProps) {
  switch (tab) {
    case "audience":
      return <AudienceTabPanel />;
    case "ecommerce":
      return <EcommerceTabPanel />;
    case "pages":
      return <PagesTabPanel />;
    case "traffic-sources":
      return <TrafficSourcesTabPanel />;
    default:
      return <GoogleAnalyticsMetricsGrid metrics={metrics} />;
  }
}
