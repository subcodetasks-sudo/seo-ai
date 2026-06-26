"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { useDirection } from "@/components/ui/direction";
import { Spinner } from "@/components/ui/spinner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projectQueryOptions, useSelectedProject } from "@/features/home";
import { brokenPagesQueryOptions } from "../queries/queries";
import type { BrokenPageStatus } from "../types";
import { BrokenPagesTable } from "./broken-pages-table";

const PAGE_SIZE = 20;
const STATUS_TABS: BrokenPageStatus[] = ["new", "resolved", "ignored"];

export function NotFoundProblemsContent() {
  const t = useTranslations("notFoundProblems");
  const dir = useDirection();
  const { selectedProjectId } = useSelectedProject();
  const [status, setStatus] = useState<BrokenPageStatus>("new");
  const [page, setPage] = useState(1);

  const projectQuery = useQuery({
    ...projectQueryOptions(selectedProjectId ?? ""),
    enabled: !!selectedProjectId,
  });

  const brokenPagesQuery = useQuery(
    brokenPagesQueryOptions(selectedProjectId ?? "", status, page, PAGE_SIZE),
  );

  const domain = projectQuery.data?.data?.domain ?? "";
  const data = brokenPagesQuery.data?.data;
  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.total_pages ?? 1;

  function handleStatusChange(value: string) {
    setStatus(value as BrokenPageStatus);
    setPage(1);
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
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">
        <div className="flex flex-col gap-1 text-start">
          <h1 className="text-h1 font-semibold text-secondary-500">{t("title")}</h1>
          {domain && (
            <p className="text-label-md text-neutral-500">
              {t("subtitle", { count: total, domain })}
            </p>
          )}
        </div>

        <Tabs value={status} onValueChange={handleStatusChange}>
          <TabsList>
            {STATUS_TABS.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {t(`tabs.${tab}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {brokenPagesQuery.isLoading ? (
          <div className="flex flex-1 items-center justify-center py-16">
            <Spinner className="size-8 text-neutral-400" />
          </div>
        ) : brokenPagesQuery.isError ? (
          <div className="flex flex-1 items-center justify-center py-16">
            <p className="text-label-md text-error-500">{t("error")}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-16">
            <p className="text-label-md text-neutral-500">{t("empty")}</p>
          </div>
        ) : (
          <BrokenPagesTable items={items} projectId={selectedProjectId} projectDomain={domain} />
        )}

        {totalPages > 1 || items.length > 0 ? (
          <div className="flex items-center justify-between">
            <p className="text-label-sm text-neutral-500">
              {t("pagination.showing", { shown: items.length, total })}
            </p>
            {totalPages > 1 && (
              <Pagination className="w-auto mx-0 justify-end">
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
        ) : null}
      </div>
    </div>
  );
}
