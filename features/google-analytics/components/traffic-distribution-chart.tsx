"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Cell, Pie, PieChart } from "recharts";

import { ChartContainer } from "@/components/ui/chart";

import type { TrafficDistributionSegment } from "../types";

type TrafficDistributionChartProps = {
  segments: TrafficDistributionSegment[];
};

export function TrafficDistributionChart({ segments }: TrafficDistributionChartProps) {
  const t = useTranslations("googleAnalytics.charts");

  const chartConfig = useMemo(
    () =>
      Object.fromEntries(
        segments.map((segment) => [segment.id, { label: segment.label, color: segment.color }]),
      ),
    [segments],
  );

  const chartData = segments.map((segment) => ({
    id: segment.id,
    value: segment.percentage,
    fill: segment.color,
  }));

  return (
    <section className="flex flex-col gap-5 rounded-xl border border-neutral-200 bg-white p-5">
      <h3 className="text-center text-h4 font-semibold text-secondary-500">
        {t("trafficDistribution")}
      </h3>

      <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-center">
        <ul className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-44">
          {segments.map((segment) => (
            <li key={segment.id} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: segment.color }}
                  aria-hidden="true"
                />
                <span className="text-label-sm text-neutral-600">{segment.label}</span>
              </div>
              <span className="text-label-sm font-semibold text-secondary-500">
                {segment.percentage}%
              </span>
            </li>
          ))}
        </ul>

        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-52 w-52 max-w-full"
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="id"
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={88}
              paddingAngle={2}
              strokeWidth={0}
            >
              {chartData.map((entry) => (
                <Cell key={entry.id} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>
    </section>
  );
}
