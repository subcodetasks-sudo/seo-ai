"use client";

import { useLocale } from "next-intl";

import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { LucideIcon } from "lucide-react";

import type { SearchConsoleItemRow } from "../types";

type SearchConsoleBreakdownTableProps = {
  title: string;
  rows: SearchConsoleItemRow[];
  labelHeader: string;
  clicksHeader: string;
  impressionsHeader: string;
  ctrHeader: string;
  avgPositionHeader: string;
  emptyLabel: string;
  emptyIcon: LucideIcon;
};

export function SearchConsoleBreakdownTable({
  title,
  rows,
  labelHeader,
  clicksHeader,
  impressionsHeader,
  ctrHeader,
  avgPositionHeader,
  emptyLabel,
  emptyIcon: EmptyIcon,
}: SearchConsoleBreakdownTableProps) {
  const locale = useLocale();
  const formatter = new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US");
  const sortedRows = [...rows].sort((a, b) => b.clicks - a.clicks);

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-5">
      <h3 className="mb-4 text-start text-h4 font-semibold text-secondary-500">{title}</h3>

      {sortedRows.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon" className="size-16">
              <EmptyIcon className="size-8" aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle className="text-lg">{emptyLabel}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-start text-label-sm text-neutral-500">{labelHeader}</TableHead>
              <TableHead className="text-end text-label-sm text-neutral-500">{clicksHeader}</TableHead>
              <TableHead className="text-end text-label-sm text-neutral-500">{impressionsHeader}</TableHead>
              <TableHead className="text-end text-label-sm text-neutral-500">{ctrHeader}</TableHead>
              <TableHead className="text-end text-label-sm text-neutral-500">{avgPositionHeader}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRows.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="py-4 text-start text-label-sm font-medium text-secondary-500">
                  {item.label}
                </TableCell>
                <TableCell className="py-4 text-end text-label-sm text-secondary-500">
                  {formatter.format(item.clicks)}
                </TableCell>
                <TableCell className="py-4 text-end text-label-sm text-secondary-500">
                  {formatter.format(item.impressions)}
                </TableCell>
                <TableCell className="py-4 text-end text-label-sm text-secondary-500">
                  {formatter.format(Math.round(item.ctr * 10) / 10)}%
                </TableCell>
                <TableCell className="py-4 text-end text-label-sm text-secondary-500">
                  {formatter.format(Math.round(item.avgPosition * 10) / 10)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  );
}
