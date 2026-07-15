"use client";

import { useTranslations } from "next-intl";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import type { RevenueTrendPoint } from "../types";

type EcommerceRevenueChartProps = {
  data: RevenueTrendPoint[];
};

export function EcommerceRevenueChart({ data }: EcommerceRevenueChartProps) {
  const t = useTranslations("googleAnalytics.ecommerceDashboard");

  const chartConfig = {
    value: {
      label: t("revenue"),
      color: "#84CC16",
    },
  };

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex flex-col gap-1 text-start">
        <h3 className="text-h4 font-semibold text-secondary-500">{t("revenuePath")}</h3>
        <p className="text-label-sm text-neutral-400">{t("revenuePathSubtitle")}</p>
      </div>

      <ChartContainer config={chartConfig} className="aspect-[2.4/1] h-56 w-full">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="ecommerceRevenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#84CC16" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#84CC16" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} width={48} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#84CC16"
            strokeWidth={2}
            fill="url(#ecommerceRevenueFill)"
            dot={false}
            activeDot={{ r: 4, fill: "#84CC16" }}
          />
        </AreaChart>
      </ChartContainer>
    </section>
  );
}
