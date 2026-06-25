"use client";

import { useState } from "react";

import { useGoogleAnalyticsTab } from "../hooks/use-google-analytics-tab";
import { getGoogleAnalyticsMetrics } from "../services/mock-data";
import type { GoogleAnalyticsPeriod } from "../types";
import { GoogleAnalyticsTabContent } from "./google-analytics-tab-content";
import { GoogleAnalyticsTabs } from "./google-analytics-tabs";
import { GoogleAnalyticsToolbar } from "./google-analytics-toolbar";

type GoogleAnalyticsDashboardProps = {
  projectName: string;
  onDisconnect: () => void;
};

export function GoogleAnalyticsDashboard({
  projectName,
  onDisconnect,
}: GoogleAnalyticsDashboardProps) {
  const { tab, setTab } = useGoogleAnalyticsTab();
  const [period, setPeriod] = useState<GoogleAnalyticsPeriod>(30);
  const [refreshKey, setRefreshKey] = useState(0);
  const metrics = getGoogleAnalyticsMetrics(tab);

  function handleRefresh() {
    setRefreshKey((current) => current + 1);
  }

  return (
    <div className="flex flex-col gap-6">
      <GoogleAnalyticsToolbar
        projectName={projectName}
        period={period}
        onPeriodChange={setPeriod}
        onRefresh={handleRefresh}
        onDisconnect={onDisconnect}
      />

      <GoogleAnalyticsTabs activeTab={tab} onTabChange={setTab} />

      <div key={`${tab}-${refreshKey}`} role="tabpanel">
        <GoogleAnalyticsTabContent tab={tab} metrics={metrics} />
      </div>
    </div>
  );
}
