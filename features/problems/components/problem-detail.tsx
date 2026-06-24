"use client";

import { useState } from "react";
import { ArrowRight, ExternalLink, Sparkles, TriangleAlert } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
import { crawlPagesQueryOptions } from "../queries/queries";
import { useGenerateSuggestionsForLinks } from "../queries/mutations";

const PAGE_SIZE = 20;

type ProblemDetailProps = {
  crawlId: string;
  type: string;
  severity?: string;
};

export function ProblemDetail({ crawlId, type, severity }: ProblemDetailProps) {
  const t = useTranslations("problems");
  const dir = useDirection();
  const { selectedProjectId } = useSelectedProject();
  const [page, setPage] = useState(1);

  const generateMutation = useGenerateSuggestionsForLinks();

  const { data, isLoading, isError } = useQuery(
    crawlPagesQueryOptions({
      projectId: selectedProjectId ?? "",
      crawlId,
      page,
      pageSize: PAGE_SIZE,
      severity,
      issueType: type,
    }),
  );

  const title = t.has(`problemTypes.${type}`) ? t(`problemTypes.${type}`) : type;
  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.total_pages ?? 1;

  function handleFixAll() {
    if (!selectedProjectId || items.length === 0 || generateMutation.isPending) return;
    const pageUrls = items.map((item) => item.url);
    generateMutation.mutate(
      { projectId: selectedProjectId, suggestionType: type, pageUrls },
      {
        onSuccess: () => toast.success(t("detail.fixSuccess", { count: pageUrls.length })),
        onError: () => toast.error(t("detail.fixError")),
      },
    );
  }

  if (!selectedProjectId) {
    return (
      <div className="flex flex-1 items-center justify-center bg-neutral-75 px-6 py-8 lg:px-10">
        <p className="text-label-md text-neutral-500">{t("noProject")}</p>
      </div>
    );
  }

  return (
    <div dir={dir} className="flex flex-1 flex-col bg-neutral-75 px-6 py-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col items-end gap-1 text-end">
            <div className="flex items-center gap-2">
              <h1 className="text-h2 font-semibold text-secondary-500">{title}</h1>
              <TriangleAlert className="size-5 text-warning-500 shrink-0" aria-hidden="true" />
            </div>
            <p className="text-label-sm text-neutral-500">
              {t("detail.affectedPagesCount", { count: total })}
            </p>
          </div>
          {severity && (
            <span className="inline-flex shrink-0 rounded-full bg-error-50 px-3 py-1 text-label-xs font-medium text-error-600">
              {t("detail.priorityBadge", { severity: t(`severity.${severity}`) })}
            </span>
          )}
        </div>

        {/* Why this matters */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 text-end">
          <h2 className="mb-3 text-label-lg font-semibold text-secondary-500">
            {t("detail.whyTitle")}
          </h2>
          <p className="text-label-sm leading-relaxed text-neutral-600">
            {t("detail.whyBody")}
          </p>
        </div>

        {/* Affected links */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-end text-label-lg font-semibold text-secondary-500">
            {t("detail.affectedLinks")}
          </h2>

          {isLoading ? (
            <p className="py-6 text-center text-label-md text-neutral-500">{t("loading")}</p>
          ) : isError ? (
            <p className="py-6 text-center text-label-md text-error-500">{t("error")}</p>
          ) : items.length === 0 ? (
            <p className="py-6 text-center text-label-md text-neutral-500">
              {t("detail.noLinks")}
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-neutral-100">
              {items.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 py-3">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-neutral-400 hover:text-neutral-600"
                    aria-label={item.url}
                  >
                    <ExternalLink className="size-4" aria-hidden="true" />
                  </a>
                  <span className="truncate text-label-sm text-error-500" dir="ltr">
                    {item.url}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {total > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-label-sm text-neutral-500">
                {t("detail.showingLinks", { shown: items.length, total })}
              </p>
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
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-4">
          <Button
            type="button"
            size="lg"
            onClick={handleFixAll}
            disabled={items.length === 0 || generateMutation.isPending}
            className="gap-2 bg-primary-500 text-white hover:bg-primary-500/90 disabled:opacity-50 text-label-md font-medium"
          >
            <Sparkles className="size-4" aria-hidden="true" />
            {generateMutation.isPending ? t("detail.fixing") : t("detail.fixAllAi")}
          </Button>
          <Link
            href="/dashboard/problems"
            className="inline-flex items-center gap-1.5 text-label-sm text-neutral-500 hover:text-neutral-700"
          >
            {t("detail.backToList")}
            <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
