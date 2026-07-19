"use client";

import { useLocale } from "next-intl";

import { cn } from "@/lib/utils";

import type { CountryBreakdownItem, MetricTone, TrafficSourceBreakdownItem } from "../types";

const TONE_BAR_COLORS: Record<MetricTone, string> = {
  green: "#84CC16",
  gray: "#94A3B8",
  yellow: "#CA8A04",
  red: "#EF4444",
};

type CountryBreakdownRowProps = {
  item: CountryBreakdownItem;
};

export function CountryBreakdownRow({ item }: CountryBreakdownRowProps) {
  const locale = useLocale();
  const formatter = new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US");

  return (
    <div className="flex items-center gap-3">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 text-label-xs font-semibold text-neutral-500">
          {item.code}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-label-sm font-medium text-secondary-500">{item.label}</p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
            <div
              className="h-full rounded-full bg-primary-400"
              style={{ width: `${item.percentage}%` }}
            />
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-4 text-end">
        <span className="w-10 text-label-sm font-medium text-neutral-500">
          {item.percentage}%
        </span>
        <span className="w-16 text-label-sm font-semibold text-secondary-500">
          {formatter.format(item.visitors)}
        </span>
      </div>
    </div>
  );
}

type TrafficSourceBreakdownRowProps = {
  item: TrafficSourceBreakdownItem;
  maxVisitors: number;
};

export function TrafficSourceBreakdownRow({ item, maxVisitors }: TrafficSourceBreakdownRowProps) {
  const locale = useLocale();
  const formatter = new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US");
  const hasChange = typeof item.change === "number";
  const changePrefix = hasChange && item.change! > 0 ? "+" : "";
  const isPositive = hasChange && item.change! >= 0;
  const barColor = TONE_BAR_COLORS[item.tone];
  const barWidth = maxVisitors > 0 ? Math.min(100, (item.visitors / maxVisitors) * 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="truncate text-label-sm font-medium text-secondary-500">{item.label}</p>
        <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
          <div
            className="h-full rounded-full"
            style={{ width: `${barWidth}%`, backgroundColor: barColor }}
          />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-4 text-end">
        {hasChange ? (
          <span
            className={cn(
              "w-12 text-label-sm font-medium",
              isPositive ? "text-success-600" : "text-destructive",
            )}
          >
            {changePrefix}
            {item.change}%
          </span>
        ) : (
          <span className="w-12" />
        )}
        <span className="w-16 text-label-sm font-semibold text-secondary-500">
          {formatter.format(item.visitors)}
        </span>
      </div>
    </div>
  );
}
