"use client";

import type { SearchConsolePeriod, SearchConsoleTab } from "../types";
import { CountriesTabPanel } from "./countries-tab-panel";
import { DevicesTabPanel } from "./devices-tab-panel";
import { OverviewTabPanel } from "./overview-tab-panel";
import { PagesTabPanel } from "./pages-tab-panel";
import { QueriesTabPanel } from "./queries-tab-panel";
import { SitemapsTabPanel } from "./sitemaps-tab-panel";

type SearchConsoleTabContentProps = {
  tab: SearchConsoleTab;
  projectId: string;
  period: SearchConsolePeriod;
};

export function SearchConsoleTabContent({ tab, projectId, period }: SearchConsoleTabContentProps) {
  switch (tab) {
    case "queries":
      return <QueriesTabPanel projectId={projectId} period={period} />;
    case "pages":
      return <PagesTabPanel projectId={projectId} period={period} />;
    case "countries":
      return <CountriesTabPanel projectId={projectId} period={period} />;
    case "devices":
      return <DevicesTabPanel projectId={projectId} period={period} />;
    case "sitemaps":
      return <SitemapsTabPanel projectId={projectId} />;
    default:
      return <OverviewTabPanel projectId={projectId} period={period} />;
  }
}
