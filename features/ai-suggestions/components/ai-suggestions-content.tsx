"use client";

import { useState } from "react";
import { Check, Download, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
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
import {
  useApproveAllSuggestions,
  useApproveSuggestion,
  useApproveSuggestionBatch,
  useIgnoreSuggestion,
  useRejectAllSuggestions,
  useRejectSuggestion,
  useRejectSuggestionBatch,
} from "../queries/mutations";
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
  "queued",
  "approved",
  "rejected",
  "applied",
  "skipped",
  "ignored",
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
  const rejectMutation = useRejectSuggestion();
  const ignoreMutation = useIgnoreSuggestion();
  const approveBatchMutation = useApproveSuggestionBatch();
  const rejectBatchMutation = useRejectSuggestionBatch();
  const approveAllMutation = useApproveAllSuggestions();
  const rejectAllMutation = useRejectAllSuggestions();

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
    const selectableIds = items.filter((i) => i.status === "pending").map((i) => i.id);
    if (selectedIds.size === selectableIds.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(selectableIds));
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
    if (!selectedProjectId || selectedIds.size === 0) return;
    rejectBatchMutation.mutate(
      { projectId: selectedProjectId, ids: Array.from(selectedIds) },
      { onSuccess: () => setSelectedIds(new Set()) },
    );
  }

  function handleApproveAll() {
    if (!selectedProjectId) return;
    approveAllMutation.mutate(
      { projectId: selectedProjectId },
      { onSuccess: () => setSelectedIds(new Set()) },
    );
  }

  function handleRejectAll() {
    if (!selectedProjectId) return;
    rejectAllMutation.mutate(
      { projectId: selectedProjectId },
      { onSuccess: () => setSelectedIds(new Set()) },
    );
  }

  function removeFromSelection(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function handleApprove(id: string) {
    if (!selectedProjectId) return;
    approveMutation.mutate({ projectId: selectedProjectId, suggestionId: id });
    removeFromSelection(id);
  }

  function handleReject(id: string) {
    if (!selectedProjectId) return;
    rejectMutation.mutate({ projectId: selectedProjectId, suggestionId: id });
    removeFromSelection(id);
  }

  function handleIgnore(id: string) {
    if (!selectedProjectId) return;
    ignoreMutation.mutate({ projectId: selectedProjectId, suggestionId: id });
    removeFromSelection(id);
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
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 text-start">
            <h1 className="text-h1 font-semibold text-secondary-500">{t("title")}</h1>
            <p className="text-label-md text-neutral-500">
              {t("subtitle", { count: total })}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={total === 0 || approveAllMutation.isPending}
                  className="gap-1.5 border-primary-200 bg-white text-secondary-500 hover:bg-primary-50 text-label-sm"
                >
                  <Check className="size-3.5" aria-hidden="true" />
                  {t("approveAll")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("confirm.approveAllTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>{t("confirm.approveAllDescription")}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("confirm.cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleApproveAll}>
                    {t("confirm.approveAllAction")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={total === 0 || rejectAllMutation.isPending}
                  className="gap-1.5 border-error-200 bg-white text-error-700 hover:bg-error-50 text-label-sm"
                >
                  <X className="size-3.5" aria-hidden="true" />
                  {t("rejectAll")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("confirm.rejectAllTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>{t("confirm.rejectAllDescription")}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("confirm.cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleRejectAll} className="bg-error-600 hover:bg-error-700">
                    {t("confirm.rejectAllAction")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={isExporting}
              className="gap-1.5 border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 text-label-sm"
            >
              <Download className="size-3.5" aria-hidden="true" />
              {isExporting ? t("exporting") : t("exportCsv")}
            </Button>
          </div>
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={selectionCount === 0 || rejectBatchMutation.isPending}
                  className="gap-1 border-error-200 bg-error-50 text-error-700 hover:bg-error-100 disabled:opacity-40 text-label-sm font-medium"
                >
                  {rejectBatchMutation.isPending ? t("rejecting") : `${t("reject")}(${selectionCount})`}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("confirm.rejectSelectedTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("confirm.rejectSelectedDescription", { count: selectionCount })}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("confirm.cancel")}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleBulkReject}
                    className="bg-error-600 hover:bg-error-700"
                  >
                    {t("confirm.rejectSelectedAction")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
          <div className="flex flex-1 items-center justify-center py-16">
            <Spinner className="size-8 text-neutral-400" />
          </div>
        ) : isError ? (
          <div className="flex flex-1 items-center justify-center py-16">
            <p className="text-label-md text-error-500">{t("error")}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-16">
            <p className="text-label-md text-neutral-500">{t("empty")}</p>
          </div>
        ) : (
          <AiSuggestionsTable
            items={items}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onApprove={handleApprove}
            onReject={handleReject}
            onIgnore={handleIgnore}
          />
        )}

        {total > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-label-sm text-neutral-500">
              {t("pagination.showing", { shown: items.length, total })}
            </p>
            {totalPages > 1 && (
              <Pagination className="mx-0 w-full justify-center sm:w-auto sm:justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      text={t("pagination.previous")}
                      aria-label={t("pagination.previousPage")}
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
                      text={t("pagination.next")}
                      aria-label={t("pagination.nextPage")}
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
