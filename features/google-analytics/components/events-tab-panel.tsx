"use client";

import { useQuery } from "@tanstack/react-query";
import { Zap } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { googleAnalyticsEventsQueryOptions } from "../queries/queries";
import type { GoogleAnalyticsPeriod } from "../types";

type EventsTabPanelProps = {
  projectId: string;
  period: GoogleAnalyticsPeriod;
};

export function EventsTabPanel({ projectId, period }: EventsTabPanelProps) {
  const t = useTranslations("googleAnalytics.eventsDashboard");
  const tCommon = useTranslations("common.state");
  const locale = useLocale();
  const formatter = new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US");

  const { data, isLoading, isError, refetch } = useQuery(googleAnalyticsEventsQueryOptions(projectId, period));

  if (isLoading) return <LoadingState fullPage={false} />;

  if (isError || !data) {
    return (
      <ErrorState
        title={tCommon("errorTitle")}
        retryLabel={tCommon("retry")}
        onRetry={() => refetch()}
        fullPage={false}
      />
    );
  }

  const items = [...data.items].sort((a, b) => b.eventCount - a.eventCount);

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-5">
      <h3 className="mb-4 text-start text-h4 font-semibold text-secondary-500">{t("title")}</h3>

      {items.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon" className="size-16">
              <Zap className="size-8" aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle className="text-lg">{t("empty")}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-start text-label-sm text-neutral-500">{t("table.event")}</TableHead>
              <TableHead className="text-end text-label-sm text-neutral-500">{t("table.count")}</TableHead>
              <TableHead className="text-end text-label-sm text-neutral-500">{t("table.users")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="py-4 text-start text-label-sm font-medium text-secondary-500">
                  {item.eventName}
                </TableCell>
                <TableCell className="py-4 text-end text-label-sm text-secondary-500">
                  {formatter.format(item.eventCount)}
                </TableCell>
                <TableCell className="py-4 text-end text-label-sm text-secondary-500">
                  {formatter.format(item.users)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  );
}
