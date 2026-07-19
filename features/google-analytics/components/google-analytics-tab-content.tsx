"use client";

import type { GoogleAnalyticsPeriod, GoogleAnalyticsTab } from "../types";
import { AudienceTabPanel } from "./audience-tab-panel";
import { ConversionsTabPanel } from "./conversions-tab-panel";
import { EcommerceTabPanel } from "./ecommerce-tab-panel";
import { EventsTabPanel } from "./events-tab-panel";
import { OverviewTabPanel } from "./overview-tab-panel";
import { PagesTabPanel } from "./pages-tab-panel";
import { TrafficSourcesTabPanel } from "./traffic-sources-tab-panel";

type GoogleAnalyticsTabContentProps = {
  tab: GoogleAnalyticsTab;
  projectId: string;
  period: GoogleAnalyticsPeriod;
};

export function GoogleAnalyticsTabContent({ tab, projectId, period }: GoogleAnalyticsTabContentProps) {
  switch (tab) {
    case "audience":
      return <AudienceTabPanel projectId={projectId} period={period} />;
    case "ecommerce":
      return <EcommerceTabPanel projectId={projectId} period={period} />;
    case "pages":
      return <PagesTabPanel projectId={projectId} period={period} />;
    case "traffic-sources":
      return <TrafficSourcesTabPanel projectId={projectId} period={period} />;
    case "conversions":
      return <ConversionsTabPanel projectId={projectId} period={period} />;
    case "events":
      return <EventsTabPanel projectId={projectId} period={period} />;
    default:
      return <OverviewTabPanel projectId={projectId} period={period} />;
  }
}
