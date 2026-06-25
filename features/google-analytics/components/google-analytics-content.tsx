"use client";

import { Suspense, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { useDirection } from "@/components/ui/direction";
import { allProjectsQueryOptions, useSelectedProject } from "@/features/home";

import { GoogleAnalyticsConnectCard } from "./google-analytics-connect-card";
import { GoogleAnalyticsDashboard } from "./google-analytics-dashboard";

function GoogleAnalyticsDashboardPanel({
  projectName,
  onDisconnect,
}: {
  projectName: string;
  onDisconnect: () => void;
}) {
  return <GoogleAnalyticsDashboard projectName={projectName} onDisconnect={onDisconnect} />;
}

export function GoogleAnalyticsContent() {
  const t = useTranslations("googleAnalytics");
  const dir = useDirection();
  const { selectedProjectId } = useSelectedProject();
  const [isConnected, setIsConnected] = useState(true);

  const { data: projectsResponse } = useQuery(allProjectsQueryOptions());
  const projects = projectsResponse?.data?.items ?? [];
  const selectedProject = projects.find((project) => project.id === selectedProjectId);
  const domain = selectedProject?.domain ?? selectedProject?.name ?? "—";
  const projectName = selectedProject?.name ?? domain;

  if (!selectedProjectId) {
    return (
      <div className="flex flex-1 items-center justify-center bg-neutral-75 px-6 py-8 lg:px-10">
        <p className="text-label-md text-neutral-500">{t("noProject")}</p>
      </div>
    );
  }

  return (
    <div dir={dir} className="flex flex-1 flex-col bg-neutral-75 px-6 py-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
        {isConnected ? (
          <Suspense
            fallback={
              <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
                <p className="text-label-md text-neutral-400">{t("loading")}</p>
              </div>
            }
          >
            <GoogleAnalyticsDashboardPanel
              projectName={projectName}
              onDisconnect={() => setIsConnected(false)}
            />
          </Suspense>
        ) : (
          <div className="flex flex-1 items-center justify-center py-12">
            <GoogleAnalyticsConnectCard
              domain={domain}
              onConnect={() => setIsConnected(true)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
