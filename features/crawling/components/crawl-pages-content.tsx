"use client";

import { useState } from "react";
import { ArrowRight, FileStack, FileText, Link2, TriangleAlert } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";

import EmptyState from "@/components/empty-state";
import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { useDirection } from "@/components/ui/direction";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Link } from "@/i18n/navigation";
import { useSelectedProject } from "@/features/home";
import { CrawlPageCard } from "./crawl-page-card";
import { PageLinksSheet } from "./page-links-sheet";
import { crawlPagesQueryOptions } from "../queries/queries";
import type { CrawlPageItem } from "../types";

const PAGE_SIZE = 10;

type CrawlPagesContentProps = {
  crawlId: string;
};

type LinksSheetState = {
  page: CrawlPageItem;
  tab: "internal" | "external";
} | null;

function SummaryStat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof FileText;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-neutral-200 bg-white px-4 py-3">
      <Icon className="size-4 shrink-0 text-neutral-400" aria-hidden="true" />
      <div className="flex min-w-0 flex-col">
        <span className="text-h4 font-semibold leading-tight text-secondary-500">{value}</span>
        <span className="truncate text-label-sm text-neutral-500">{label}</span>
      </div>
    </div>
  );
}

export function CrawlPagesContent({ crawlId }: CrawlPagesContentProps) {
  const t = useTranslations("crawlHistory.pages");
  const tCommon = useTranslations("common.state");
  const dir = useDirection();
  const locale = useLocale();
  const numberFormatter = new Intl.NumberFormat(locale);
  const { selectedProjectId } = useSelectedProject();
  const [page, setPage] = useState(1);
  const [linksSheet, setLinksSheet] = useState<LinksSheetState>(null);

  const { data, isLoading, isError, refetch } = useQuery(
    crawlPagesQueryOptions(selectedProjectId ?? "", crawlId, page, PAGE_SIZE),
  );

  const items = data?.items ?? [];
  const totalPages = data?.total_pages ?? 1;

  if (!selectedProjectId) {
    return (
      <div className="flex flex-1 items-center justify-center bg-neutral-75 px-6 py-8 lg:px-10">
        <p className="text-label-md text-neutral-500">{t("noProject")}</p>
      </div>
    );
  }

  return (
    <div dir={dir} className="flex flex-1 flex-col bg-neutral-75 px-6 py-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6">
        <div className="flex flex-col gap-1 text-start">
          <h1 className="text-h1 font-semibold text-secondary-500">{t("title")}</h1>
          <p className="text-label-md text-neutral-500">{t("subtitle", { count: data?.total ?? 0 })}</p>
        </div>

        {data && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryStat
              icon={FileText}
              value={numberFormatter.format(data.total_pages)}
              label={t("metrics.pages")}
            />
            <SummaryStat
              icon={FileStack}
              value={numberFormatter.format(data.total_basic)}
              label={t("metrics.basic")}
            />
            <SummaryStat
              icon={Link2}
              value={numberFormatter.format(data.total_internal)}
              label={t("metrics.internal")}
            />
            <SummaryStat
              icon={TriangleAlert}
              value={numberFormatter.format(data.total_issues)}
              label={t("metrics.issues")}
            />
          </div>
        )}

        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState
            title={t("error")}
            retryLabel={tCommon("retry")}
            onRetry={() => refetch()}
          />
        ) : items.length === 0 ? (
          <EmptyState title={t("empty")} />
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <CrawlPageCard
                key={item.id}
                page={item}
                onViewLinks={(pageItem, tab) => setLinksSheet({ page: pageItem, tab })}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    isActive={p === page}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(p);
                    }}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) setPage(page + 1);
                  }}
                  className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        <Link
          href="/dashboard/crawl-history"
          className="inline-flex w-fit items-center gap-1.5 text-label-sm text-neutral-500 hover:text-neutral-700"
        >
          <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden="true" />
          {t("backToList")}
        </Link>
      </div>

      <PageLinksSheet
        page={linksSheet?.page ?? null}
        defaultTab={linksSheet?.tab ?? "internal"}
        onOpenChange={(open) => {
          if (!open) setLinksSheet(null);
        }}
      />
    </div>
  );
}
