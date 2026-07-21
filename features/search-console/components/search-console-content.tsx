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

import { useConnectSearchConsole, useDisconnectSearchConsole } from "../queries/mutations";
import { searchConsoleStatusQueryOptions } from "../queries/queries";
import { SearchConsoleConnectCard } from "./search-console-connect-card";
import { SearchConsoleDashboard } from "./search-console-dashboard";
import { SearchConsoleSiteSetup } from "./search-console-site-setup";

export function SearchConsoleContent() {
  const dir = useDirection();
  const t = useTranslations("searchConsole");
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
  } = useQuery(searchConsoleStatusQueryOptions(selectedProjectId ?? ""));

  const { mutate: connect, isPending: isConnecting } = useConnectSearchConsole(selectedProjectId ?? "");
  const { mutate: disconnect } = useDisconnectSearchConsole(selectedProjectId ?? "");

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
            <SearchConsoleConnectCard domain={domain} onConnect={handleConnect} isConnecting={isConnecting} />
          </div>
        ) : !status.siteUrl ? (
          <div className="flex flex-1 items-center justify-center py-12">
            <SearchConsoleSiteSetup projectId={selectedProjectId} onDisconnect={handleDisconnect} />
          </div>
        ) : (
          <Suspense
            fallback={
              <div className="rounded-xl border border-neutral-200 bg-white p-8">
                <LoadingState fullPage={false} />
              </div>
            }
          >
            <SearchConsoleDashboard
              projectId={selectedProjectId}
              projectName={projectName}
              siteUrl={status.siteUrl}
              onDisconnect={handleDisconnect}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}
