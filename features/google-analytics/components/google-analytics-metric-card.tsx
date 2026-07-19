"use client";

import { useMemo } from "react";
import {
  ArrowUpRight,
  Clock,
  DollarSign,
  Download,
  Eye,
  FileText,
  Globe,
  Layout,
  Link2,
  Mail,
  MousePointer,
  Package,
  Share2,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  TrendingDown,
  TrendingUp,
  User,
  UserCheck,
  UserPlus,
  Users,
  Video,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import type { GoogleAnalyticsMetric, MetricIcon, MetricTone } from "../types";

const ICON_MAP: Record<MetricIcon, LucideIcon> = {
  users: Users,
  userPlus: UserPlus,
  userCheck: UserCheck,
  user: User,
  trendingUp: TrendingUp,
  trendingDown: TrendingDown,
  clock: Clock,
  zap: Zap,
  sparkles: Sparkles,
  mousePointer: MousePointer,
  video: Video,
  download: Download,
  fileText: FileText,
  shoppingCart: ShoppingCart,
  dollarSign: DollarSign,
  globe: Globe,
  layout: Layout,
  link: Link2,
  arrowUpRight: ArrowUpRight,
  eye: Eye,
  share2: Share2,
  mail: Mail,
  package: Package,
  shoppingBag: ShoppingBag,
};

const TONE_STYLES: Record<MetricTone, { icon: string; change: string }> = {
  green: {
    icon: "bg-success-50 text-success-600",
    change: "text-success-600",
  },
  gray: {
    icon: "bg-neutral-100 text-neutral-500",
    change: "text-success-600",
  },
  yellow: {
    icon: "bg-[#FEF3E2] text-[#D97706]",
    change: "text-[#D97706]",
  },
  red: {
    icon: "bg-destructive/10 text-destructive",
    change: "text-destructive",
  },
};

function formatDurationSeconds(seconds: number) {
  const total = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(total / 60);
  const remainingSeconds = total % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

type GoogleAnalyticsMetricCardProps = {
  metric: GoogleAnalyticsMetric;
  labelNamespace?: string;
  valueSuffix?: string;
};

export function GoogleAnalyticsMetricCard({
  metric,
  labelNamespace = "googleAnalytics.metrics",
  valueSuffix,
}: GoogleAnalyticsMetricCardProps) {
  const t = useTranslations(labelNamespace);
  const locale = useLocale();
  const formatter = useMemo(() => new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US"), [locale]);
  const Icon = ICON_MAP[metric.icon];
  const toneStyles = TONE_STYLES[metric.tone];

  const formattedValue =
    metric.format === "duration"
      ? formatDurationSeconds(metric.value)
      : metric.format === "percent"
        ? `${formatter.format(Math.round(metric.value * 10) / 10)}%`
        : formatter.format(Math.round(metric.value));

  const hasChange = typeof metric.change === "number" && metric.trend;
  const changePrefix = hasChange && metric.change! > 0 ? "+" : "";
  const changeLabel = hasChange ? `${changePrefix}${metric.change}%` : null;

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-label-sm font-medium text-neutral-500">{t(metric.labelKey)}</p>
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full",
            toneStyles.icon,
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </div>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-2">
          <p className="text-h2 font-semibold text-secondary-500">
            {formattedValue}
            {valueSuffix ? (
              <span className="ms-1 text-label-md font-medium text-neutral-400">{valueSuffix}</span>
            ) : null}
          </p>
          {changeLabel ? (
            <p className={cn("flex items-center gap-1 text-label-sm font-medium", toneStyles.change)}>
              <span aria-hidden="true">{metric.trend === "up" ? "↑" : "↓"}</span>
              <span>{changeLabel}</span>
            </p>
          ) : null}
        </div>
      </div>

      <p className="text-label-xs text-neutral-400">
        {labelNamespace === "googleAnalytics.metrics" ? t("footer") : null}
      </p>
    </article>
  );
}
