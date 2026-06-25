"use client";

import { useTranslations } from "next-intl";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartPoint } from "../types";

const chartConfig = {
  value: {
    label: "Health Score",
    color: "hsl(var(--primary-400))",
  },
};

type HealthScoreTrendChartProps = {
  data: ChartPoint[];
};

export function HealthScoreTrendChart({ data }: HealthScoreTrendChartProps) {
  const t = useTranslations("reports.charts");

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5">
      <h3 className="text-start text-h4 font-semibold text-secondary-500">
        {t("healthTrend")}
      </h3>
      <ChartContainer config={chartConfig} className="aspect-[2/1] h-56 w-full">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="healthScoreFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-value)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--color-value)" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            domain={[0, 8]}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--color-value)"
            strokeWidth={2}
            fill="url(#healthScoreFill)"
            dot={{ fill: "var(--color-value)", r: 3 }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
