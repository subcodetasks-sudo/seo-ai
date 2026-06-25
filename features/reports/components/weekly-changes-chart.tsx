"use client";

import { useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartPoint } from "../types";

const WEEKLY_CHANGES_COLOR = "#22C55E";

const chartConfig = {
  value: {
    label: "Changes",
    color: WEEKLY_CHANGES_COLOR,
  },
};

type WeeklyChangesChartProps = {
  data: ChartPoint[];
};

export function WeeklyChangesChart({ data }: WeeklyChangesChartProps) {
  const t = useTranslations("reports.charts");

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5">
      <h3 className="text-start text-h4 font-semibold text-secondary-500">
        {t("weeklyChanges")}
      </h3>
      <ChartContainer config={chartConfig} className="aspect-[2/1] h-56 w-full">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[0, 8]} width={48} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="value"
            fill={WEEKLY_CHANGES_COLOR}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
