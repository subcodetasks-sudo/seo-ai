"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { FileWarning } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { Badge } from "@/components/ui/badge";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { searchConsoleSitemapsQueryOptions } from "../queries/queries";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return format(new Date(iso), "yyyy-MM-dd");
  } catch {
    return "—";
  }
}

type SitemapsTabPanelProps = {
  projectId: string;
};

export function SitemapsTabPanel({ projectId }: SitemapsTabPanelProps) {
  const t = useTranslations("searchConsole.sitemapsDashboard");
  const tCommon = useTranslations("common.state");
  const locale = useLocale();
  const formatter = new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US");

  const { data, isLoading, isError, refetch } = useQuery(searchConsoleSitemapsQueryOptions(projectId));

  if (isLoading) return <LoadingState fullPage={false} />;

  if (isError || !data) {
    return (
      <ErrorState title={tCommon("errorTitle")} retryLabel={tCommon("retry")} onRetry={() => refetch()} fullPage={false} />
    );
  }

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-5">
      <h3 className="mb-4 text-start text-h4 font-semibold text-secondary-500">{t("title")}</h3>

      {data.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon" className="size-16">
              <FileWarning className="size-8" aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle className="text-lg">{t("empty")}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-start text-label-sm text-neutral-500">{t("table.path")}</TableHead>
              <TableHead className="text-start text-label-sm text-neutral-500">{t("table.status")}</TableHead>
              <TableHead className="text-end text-label-sm text-neutral-500">{t("table.submitted")}</TableHead>
              <TableHead className="text-end text-label-sm text-neutral-500">{t("table.downloaded")}</TableHead>
              <TableHead className="text-end text-label-sm text-neutral-500">{t("table.urlsIndexed")}</TableHead>
              <TableHead className="text-end text-label-sm text-neutral-500">{t("table.warnings")}</TableHead>
              <TableHead className="text-end text-label-sm text-neutral-500">{t("table.errors")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="py-4 text-start text-label-sm font-medium text-secondary-500" dir="ltr">
                  {item.path}
                </TableCell>
                <TableCell className="py-4 text-start">
                  <Badge
                    className={cn(
                      item.isPending
                        ? "bg-warning-50 text-warning-700 hover:bg-warning-50"
                        : "bg-success-50 text-success-700 hover:bg-success-50",
                    )}
                  >
                    {item.isPending ? t("status.pending") : t("status.indexed")}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 text-end text-label-sm text-secondary-500">
                  {formatDate(item.lastSubmitted)}
                </TableCell>
                <TableCell className="py-4 text-end text-label-sm text-secondary-500">
                  {formatDate(item.lastDownloaded)}
                </TableCell>
                <TableCell className="py-4 text-end text-label-sm text-secondary-500">
                  {formatter.format(item.urlsIndexed)} / {formatter.format(item.urlsSubmitted)}
                </TableCell>
                <TableCell
                  className={cn(
                    "py-4 text-end text-label-sm font-medium",
                    item.warnings > 0 ? "text-[#D97706]" : "text-secondary-500",
                  )}
                >
                  {formatter.format(item.warnings)}
                </TableCell>
                <TableCell
                  className={cn(
                    "py-4 text-end text-label-sm font-medium",
                    item.errors > 0 ? "text-destructive" : "text-secondary-500",
                  )}
                >
                  {formatter.format(item.errors)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  );
}
