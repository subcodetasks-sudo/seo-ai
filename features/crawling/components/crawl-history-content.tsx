"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import BackLink from "@/components/back-link";
import EmptyState from "@/components/empty-state";
import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import SelectProjectState from "@/components/select-project-state";
import { TablePagination } from "@/components/table-pagination";
import { useDirection } from "@/components/ui/direction";
import { useSelectedProject } from "@/features/home";
import { CrawlJobCard } from "./crawl-job-card";
import { crawlListQueryOptions } from "../queries/queries";

const PAGE_SIZE = 20;

export function CrawlHistoryContent() {
  const t = useTranslations("crawlHistory");
  const tCommon = useTranslations("common.state");
  const dir = useDirection();
  const { selectedProjectId } = useSelectedProject();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useQuery(
    crawlListQueryOptions(selectedProjectId ?? "", page, PAGE_SIZE),
  );

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.total_pages ?? 1;

  if (!selectedProjectId) {
    return (
      <div className="flex flex-1 items-center justify-center bg-neutral-75 px-6 py-8 lg:px-10">
        <SelectProjectState />
      </div>
    );
  }

  return (
    <div dir={dir} className="flex flex-1 flex-col bg-neutral-75 px-6 py-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6">
        <div className="flex flex-col gap-4 text-start">
          <BackLink href="/dashboard">{t("backToProjects")}</BackLink>

          <div className="flex flex-col gap-1">
            <h1 className="text-h1 font-semibold text-secondary-500">{t("title")}</h1>
            <p className="text-label-md text-neutral-500">{t("subtitle", { count: total })}</p>
          </div>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState
            title={t("error")}
            retryLabel={tCommon("retry")}
            onRetry={() => refetch()}
          />
        ) : items.length === 0 ? (
          <EmptyState
            title={t("empty")}
            fullPage={false}
            className="rounded-xl border border-neutral-200 bg-white p-10"
          />
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((crawl) => (
              <CrawlJobCard key={crawl.crawl_job_id} crawl={crawl} />
            ))}
          </div>
        )}

        {total > 0 && (
          <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />
        )}
      </div>
    </div>
  );
}
