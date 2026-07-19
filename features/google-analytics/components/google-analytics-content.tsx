"use client";

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import SelectProjectState from "@/components/select-project-state";
import { useDirection } from "@/components/ui/direction";
import { allProjectsQueryOptions, useSelectedProject } from "@/features/home";

import { useConnectGoogleAnalytics, useDisconnectGoogleAnalytics } from "../queries/mutations";
import { googleAnalyticsStatusQueryOptions } from "../queries/queries";
import { GoogleAnalyticsConnectCard } from "./google-analytics-connect-card";
import { GoogleAnalyticsDashboard } from "./google-analytics-dashboard";
import { GoogleAnalyticsPropertySetup } from "./google-analytics-property-setup";

export function GoogleAnalyticsContent() {
  const dir = useDirection();
  const t = useTranslations("googleAnalytics");
  const tCommon = useTranslations("common.state");
  const { selectedProjectId } = useSelectedProject();

  const { data: projectsResponse } = useQuery(allProjectsQueryOptions());
  const projects = projectsResponse?.data?.items ?? [];
  const selectedProject = projects.find((project) => project.id === selectedProjectId);
  const domain = selectedProject?.domain ?? selectedProject?.name ?? "—";
  const projectName = selectedProject?.name ?? domain;

  const {
    data: status,
    isLoading: isStatusLoading,
    isError: isStatusError,
    refetch: refetchStatus,
  } = useQuery(googleAnalyticsStatusQueryOptions(selectedProjectId ?? ""));

  const { mutate: connect, isPending: isConnecting } = useConnectGoogleAnalytics(selectedProjectId ?? "");
  const { mutate: disconnect } = useDisconnectGoogleAnalytics(selectedProjectId ?? "");

  function handleConnect() {
    connect(undefined, {
      onSuccess: (authUrl) => {
        window.location.href = authUrl;
      },
      onError: () => toast.error(t("connectError")),
    });
  }

  function handleDisconnect() {
    disconnect(undefined, {
      onError: () => toast.error(t("disconnectError")),
    });
  }

  if (!selectedProjectId) {
    return (
      <div className="flex flex-1 items-center justify-center bg-neutral-75 px-6 py-8 lg:px-10">
        <SelectProjectState />
      </div>
    );
  }

  return (
    <div dir={dir} className="flex flex-1 flex-col bg-neutral-75 px-6 py-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
        {isStatusLoading ? (
          <LoadingState />
        ) : isStatusError || !status ? (
          <ErrorState
            title={tCommon("errorTitle")}
            description={tCommon("errorDescription")}
            retryLabel={tCommon("retry")}
            onRetry={() => refetchStatus()}
          />
        ) : !status.connected ? (
          <div className="flex flex-1 items-center justify-center py-12">
            <GoogleAnalyticsConnectCard domain={domain} onConnect={handleConnect} isConnecting={isConnecting} />
          </div>
        ) : !status.propertyId ? (
          <div className="flex flex-1 items-center justify-center py-12">
            <GoogleAnalyticsPropertySetup projectId={selectedProjectId} />
          </div>
        ) : (
          <Suspense
            fallback={
              <div className="rounded-xl border border-neutral-200 bg-white p-8">
                <LoadingState fullPage={false} />
              </div>
            }
          >
            <GoogleAnalyticsDashboard
              projectId={selectedProjectId}
              projectName={projectName}
              propertyName={status.propertyName ?? projectName}
              onDisconnect={handleDisconnect}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}
