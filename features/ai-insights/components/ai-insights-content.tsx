"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { useDirection } from "@/components/ui/direction";
import { useSelectedProject } from "@/features/home";
import { issueSummaryQueryOptions } from "../queries/queries";
import type { AiInsightsPeriod, AiInsightsTab } from "../types";
import { AiInsightsHeader } from "./ai-insights-header";
import { AiInsightsTabs } from "./ai-insights-tabs";
import { OverviewTab } from "./overview-tab";
import { PerformanceTab } from "./performance-tab";
import { RecommendationsTab } from "./recommendations-tab";

export function AiInsightsContent() {
  const t = useTranslations("aiInsights");
  const dir = useDirection();
  const { selectedProjectId } = useSelectedProject();

  const [tab, setTab] = useState<AiInsightsTab>("overview");
  const [period, setPeriod] = useState<AiInsightsPeriod>(30);

  const {
    data: summary,
    isLoading,
    isError,
  } = useQuery(issueSummaryQueryOptions(selectedProjectId ?? "", period));

  if (!selectedProjectId) {
    return (
      <div className="flex flex-1 items-center justify-center bg-neutral-75 px-6 py-8 lg:px-10">
        <p className="text-label-md text-neutral-500">{t("noProject")}</p>
      </div>
    );
  }

  return (
    <div dir={dir} className="flex flex-1 flex-col bg-neutral-75 px-6 py-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">
        <AiInsightsHeader period={period} onPeriodChange={setPeriod} />
        <AiInsightsTabs activeTab={tab} onTabChange={setTab} />

        <div role="tabpanel">
          {tab === "overview" && (
            <OverviewTab data={summary} isLoading={isLoading} isError={isError} />
          )}
          {tab === "recommendations" && (
            <RecommendationsTab
              data={summary}
              isLoading={isLoading}
              isError={isError}
              projectId={selectedProjectId}
            />
          )}
          {tab === "performance" && (
            <PerformanceTab projectId={selectedProjectId} period={period} />
          )}
        </div>
      </div>
    </div>
  );
}
