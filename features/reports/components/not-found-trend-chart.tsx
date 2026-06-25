"use client";

import { useTranslations } from "next-intl";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartPoint } from "../types";

const NOT_FOUND_COLOR = "#EF4444";

const chartConfig = {
  value: {
    label: "404 Errors",
    color: NOT_FOUND_COLOR,
  },
};

type NotFoundTrendChartProps = {
  data: ChartPoint[];
};

export function NotFoundTrendChart({ data }: NotFoundTrendChartProps) {
  const t = useTranslations("reports.charts");

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5">
      <h3 className="text-start text-h4 font-semibold text-secondary-500">
        {t("notFoundTrend")}
      </h3>
      <ChartContainer config={chartConfig} className="aspect-[2/1] h-56 w-full">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
          <Line
            type="linear"
            dataKey="value"
            stroke={NOT_FOUND_COLOR}
            strokeWidth={2}
            dot={{ fill: NOT_FOUND_COLOR, r: 4 }}
            activeDot={{ r: 6, fill: NOT_FOUND_COLOR }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
