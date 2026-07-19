"use client";

import Image from "next/image";
import { CalendarDays, Link2Off, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { GOOGLE_ANALYTICS_PERIODS, type GoogleAnalyticsPeriod } from "../types";

type GoogleAnalyticsToolbarProps = {
  projectName: string;
  propertyName?: string;
  period: GoogleAnalyticsPeriod;
  onPeriodChange: (period: GoogleAnalyticsPeriod) => void;
  onRefresh: () => void;
  onDisconnect: () => void;
};

export function GoogleAnalyticsToolbar({
  projectName,
  propertyName,
  period,
  onPeriodChange,
  onRefresh,
  onDisconnect,
}: GoogleAnalyticsToolbarProps) {
  const t = useTranslations("googleAnalytics.toolbar");

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex items-start gap-3 text-start">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white">
          <Image
            src="/imgs/google_analytics_page_icon.svg"
            alt=""
            width={28}
            height={28}
            className="size-7 object-contain"
            aria-hidden="true"
          />
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <p className="text-label-md font-semibold text-secondary-500">{projectName}</p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-success-50 text-success-700 hover:bg-success-50">
              {t("connected")}
            </Badge>
            {propertyName ? (
              <span className="text-label-sm text-neutral-400">{propertyName}</span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={String(period)}
          onValueChange={(value) => onPeriodChange(Number(value) as GoogleAnalyticsPeriod)}
        >
          <SelectTrigger className="h-10 min-w-36 gap-2 border-neutral-200 bg-white">
            <CalendarDays className="size-4 shrink-0 text-neutral-400" aria-hidden="true" />
            <SelectValue placeholder={t("period", { days: period })} />
          </SelectTrigger>
          <SelectContent>
            {GOOGLE_ANALYTICS_PERIODS.map((days) => (
              <SelectItem key={days} value={String(days)}>
                {t("period", { days })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onRefresh}
                aria-label={t("refresh")}
                className="size-10 border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50"
              >
                <RefreshCw className="size-4" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{t("refresh")}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button
          type="button"
          variant="outline"
          onClick={onDisconnect}
          className="h-10 gap-2 border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
        >
          <Link2Off className="size-4 shrink-0" aria-hidden="true" />
          {t("disconnect")}
        </Button>
      </div>
    </div>
  );
}
