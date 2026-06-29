"use client";

import { useTranslations } from "next-intl";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartPoint } from "../types";

const HEALTH_SCORE_COLOR = "#7C7BE6";

type HealthScoreTrendChartProps = {
  data: ChartPoint[];
};

export function HealthScoreTrendChart({ data }: HealthScoreTrendChartProps) {
  const t = useTranslations("reports.charts");

  const chartConfig = {
    value: {
      label: t("healthScoreLabel"),
      color: HEALTH_SCORE_COLOR,
    },
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5">
      <h3 className="text-start text-h4 font-semibold text-secondary-500">
        {t("healthTrend")}
      </h3>
      <ChartContainer config={chartConfig} className="aspect-[2/1] h-56 w-full">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="reportsHealthScoreFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={HEALTH_SCORE_COLOR} stopOpacity={0.35} />
              <stop offset="100%" stopColor={HEALTH_SCORE_COLOR} stopOpacity={0.05} />
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
            width={48}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={HEALTH_SCORE_COLOR}
            strokeWidth={2}
            fill="url(#reportsHealthScoreFill)"
            dot={false}
            activeDot={{ r: 4, fill: HEALTH_SCORE_COLOR }}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
