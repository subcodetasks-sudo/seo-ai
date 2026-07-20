"use client";

import { CalendarDays, Link2Off, RefreshCw, Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { SEARCH_CONSOLE_PERIODS, type SearchConsolePeriod } from "../types";

type SearchConsoleToolbarProps = {
  projectName: string;
  siteUrl?: string | null;
  period: SearchConsolePeriod;
  onPeriodChange: (period: SearchConsolePeriod) => void;
  onRefresh: () => void;
  onDisconnect: () => void;
};

export function SearchConsoleToolbar({
  projectName,
  siteUrl,
  period,
  onPeriodChange,
  onRefresh,
  onDisconnect,
}: SearchConsoleToolbarProps) {
  const t = useTranslations("searchConsole.toolbar");

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex items-start gap-3 text-start">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white">
          <Search className="size-6 text-[#4285F4]" aria-hidden="true" />
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <p className="text-label-md font-semibold text-secondary-500">{projectName}</p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-success-50 text-success-700 hover:bg-success-50">{t("connected")}</Badge>
            {siteUrl ? (
              <span className="truncate text-label-sm text-neutral-400" dir="ltr">
                {siteUrl}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={String(period)} onValueChange={(value) => onPeriodChange(Number(value) as SearchConsolePeriod)}>
          <SelectTrigger className="h-10 min-w-36 gap-2 border-neutral-200 bg-white">
            <CalendarDays className="size-4 shrink-0 text-neutral-400" aria-hidden="true" />
            <SelectValue placeholder={t("period", { days: period })} />
          </SelectTrigger>
          <SelectContent>
            {SEARCH_CONSOLE_PERIODS.map((days) => (
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
