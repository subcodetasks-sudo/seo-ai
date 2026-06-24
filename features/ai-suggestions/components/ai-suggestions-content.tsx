"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelectedProject } from "@/features/home";
import { AiSuggestionsTable } from "./ai-suggestions-table";
import { aiSuggestionsQueryOptions } from "../queries/queries";
import { useApproveSuggestion, useApproveSuggestionBatch } from "../queries/mutations";
import type { SuggestionStatus, SuggestionType } from "../types";

const PAGE_SIZE = 20;

const SUGGESTION_TYPES: SuggestionType[] = [
  "meta",
  "og_title",
  "og_description",
  "schema",
  "faq",
  "redirect",
  "alt_text",
  "internal_link",
];

const SUGGESTION_STATUSES: SuggestionStatus[] = [
  "pending",
  "approved",
  "rejected",
  "applied",
  "failed",
];

export function AiSuggestionsContent() {
  const t = useTranslations("aiSuggestions");
  const dir = useDirection();
  const { selectedProjectId } = useSelectedProject();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  const approveMutation = useApproveSuggestion();
  const approveBatchMutation = useApproveSuggestionBatch();

  const { data, isLoading, isError } = useQuery(
    aiSuggestionsQueryOptions({
      projectId: selectedProjectId ?? "",
      page,
      perPage: PAGE_SIZE,
      type: typeFilter,
      status: statusFilter,
    }),
  );

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const selectionCount = selectedIds.size;

  function handleToggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleToggleSelectAll() {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((i) => i.id)));
    }
  }

  function handleBulkApprove() {
    if (!selectedProjectId || selectedIds.size === 0) return;
    approveBatchMutation.mutate(
      { projectId: selectedProjectId, ids: Array.from(selectedIds) },
      { onSuccess: () => setSelectedIds(new Set()) },
    );
  }

  function handleBulkReject() {
    setSelectedIds(new Set());
  }

  function handleApprove(id: string) {
    if (!selectedProjectId) return;
    approveMutation.mutate({ projectId: selectedProjectId, suggestionId: id });
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function handleFilterChange<T extends string>(setter: (v: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
      setSelectedIds(new Set());
    };
  }

  async function handleExport() {
    if (!selectedProjectId || isExporting) return;
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (typeFilter !== "all") params.set("type", typeFilter);
      const query = params.toString();
      const url = `/api/projects/${selectedProjectId}/ai/suggestions/export${query ? `?${query}` : ""}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Export failed");

      const csv = await res.text();
      const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "ai-suggestions.csv";
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      // global error handler via QueryCache/MutationCache shows the toast
    } finally {
      setIsExporting(false);
    }
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
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 text-start">
            <h1 className="text-h1 font-semibold text-secondary-500">{t("title")}</h1>
            <p className="text-label-md text-neutral-500">
              {t("subtitle", { count: total })}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
            className="shrink-0 gap-1.5 border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 text-label-sm"
          >
            <Download className="size-3.5" aria-hidden="true" />
            {isExporting ? t("exporting") : t("exportCsv")}
          </Button>
        </div>

        {/* Filter + bulk-action bar */}
        <div className="flex flex-wrap items-center gap-2">
          <Select value={typeFilter} onValueChange={handleFilterChange(setTypeFilter)}>
            <SelectTrigger className="h-9 w-auto gap-1 border-neutral-200 bg-white px-3 text-label-sm text-secondary-500">
              <SelectValue placeholder={t("filters.allTypes")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.allTypes")}</SelectItem>
              {SUGGESTION_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {t(`types.${type}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={handleFilterChange(setStatusFilter)}>
            <SelectTrigger className="h-9 w-auto gap-1 border-neutral-200 bg-white px-3 text-label-sm text-secondary-500">
              <SelectValue placeholder={t("filters.allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.allStatuses")}</SelectItem>
              {SUGGESTION_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {t(`status.${status}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="ms-auto flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              disabled={selectionCount === 0}
              onClick={handleBulkReject}
              className="gap-1 bg-error-500 text-white hover:bg-error-600 disabled:opacity-40 text-label-sm font-medium"
            >
              {t("reject")}({selectionCount})
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={selectionCount === 0 || approveBatchMutation.isPending}
              onClick={handleBulkApprove}
              className="gap-1 bg-primary-300 text-secondary-500 hover:bg-primary-400 disabled:opacity-40 text-label-sm font-medium"
            >
              {approveBatchMutation.isPending ? t("approving") : `${t("approve")}(${selectionCount})`}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
            <p className="text-label-md text-neutral-500">{t("loading")}</p>
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
            <p className="text-label-md text-error-500">{t("error")}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
            <p className="text-label-md text-neutral-500">{t("empty")}</p>
          </div>
        ) : (
          <AiSuggestionsTable
            items={items}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onApprove={handleApprove}
          />
        )}

        {total > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-label-sm text-neutral-500">
              {t("pagination.showing", { shown: items.length, total })}
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
    </div>
  );
}
