"use client";

import { useState } from "react";

import { useSearchConsoleTab } from "../hooks/use-search-console-tab";
import type { SearchConsolePeriod } from "../types";
import { SearchConsoleTabContent } from "./search-console-tab-content";
import { SearchConsoleTabs } from "./search-console-tabs";
import { SearchConsoleToolbar } from "./search-console-toolbar";

type SearchConsoleDashboardProps = {
  projectId: string;
  projectName: string;
  siteUrl?: string | null;
  onDisconnect: () => void;
};

export function SearchConsoleDashboard({ projectId, projectName, siteUrl, onDisconnect }: SearchConsoleDashboardProps) {
  const { tab, setTab } = useSearchConsoleTab();
  const [period, setPeriod] = useState<SearchConsolePeriod>(30);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleRefresh() {
    setRefreshKey((current) => current + 1);
  }

  return (
    <div className="flex flex-col gap-6">
      <SearchConsoleToolbar
        projectName={projectName}
        siteUrl={siteUrl}
        period={period}
        onPeriodChange={setPeriod}
        onRefresh={handleRefresh}
        onDisconnect={onDisconnect}
      />

      <SearchConsoleTabs activeTab={tab} onTabChange={setTab} />

      <div key={`${tab}-${refreshKey}`} role="tabpanel">
        <SearchConsoleTabContent tab={tab} projectId={projectId} period={period} />
      </div>
    </div>
  );
}
