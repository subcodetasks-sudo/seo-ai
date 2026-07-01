"use client";

import { ArrowRight, Calendar, FileText, Timer } from "lucide-react";
import { arSA, enUS } from "date-fns/locale";
import { formatDistanceToNow } from "date-fns";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { getCrawlStatusBadgeClassName } from "../services/page-status";
import type { CrawlListItem } from "../types";

type CrawlJobCardProps = {
  crawl: CrawlListItem;
};

export function CrawlJobCard({ crawl }: CrawlJobCardProps) {
  const t = useTranslations("crawlHistory");
  const locale = useLocale();
  const dateLocale = locale === "ar" ? arSA : enUS;
  const numberFormatter = new Intl.NumberFormat(locale);

  const isActive = crawl.status === "running" || crawl.status === "in_progress";
  const startedRelative = crawl.started_at
    ? formatDistanceToNow(new Date(crawl.started_at), { addSuffix: true, locale: dateLocale })
    : "—";

  const duration =
    crawl.started_at && crawl.finished_at
      ? Math.max(
          0,
          Math.round(
            (new Date(crawl.finished_at).getTime() - new Date(crawl.started_at).getTime()) / 1000,
          ),
        )
      : null;

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={getCrawlStatusBadgeClassName(crawl.status)}>
              {t(`status.${crawl.status}`)}
            </Badge>
            <Badge variant="outline" className="border-neutral-200 text-neutral-500 capitalize">
              {t.has(`trigger.${crawl.trigger}`) ? t(`trigger.${crawl.trigger}`) : crawl.trigger}
            </Badge>
          </div>

          <p className="flex items-center gap-1.5 text-label-sm text-neutral-400">
            <Calendar className="size-3.5 shrink-0" aria-hidden="true" />
            {t("startedAt", { time: startedRelative })}
          </p>
        </div>

        <Button
          asChild
          type="button"
          variant="outline"
          className="h-9 shrink-0 gap-2 border-neutral-200 text-secondary-500 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600"
        >
          <Link href={`/dashboard/crawl-history/${crawl.crawl_job_id}`}>
            {t("seeResults")}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </Button>
      </div>

      {isActive && (
        <div className="space-y-1.5">
          <Progress value={crawl.progress_pct} />
          <p className="text-label-xs text-neutral-400">
            {t("progress", { percent: crawl.progress_pct })}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-2.5 rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2.5">
          <FileText className="size-4 shrink-0 text-neutral-400" aria-hidden="true" />
          <div className="flex min-w-0 flex-col">
            <span className="text-h4 font-semibold leading-tight text-secondary-500">
              {numberFormatter.format(crawl.pages_crawled)}
            </span>
            <span className="truncate text-label-sm text-neutral-500">{t("pagesCrawled")}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2.5">
          <FileText className="size-4 shrink-0 text-neutral-400" aria-hidden="true" />
          <div className="flex min-w-0 flex-col">
            <span className="text-h4 font-semibold leading-tight text-secondary-500">
              {numberFormatter.format(crawl.pages_total_est)}
            </span>
            <span className="truncate text-label-sm text-neutral-500">{t("pagesEstimated")}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2.5">
          <Timer className="size-4 shrink-0 text-neutral-400" aria-hidden="true" />
          <div className="flex min-w-0 flex-col">
            <span
              className={cn(
                "text-h4 font-semibold leading-tight text-secondary-500",
                duration === null && "text-neutral-400",
              )}
            >
              {duration !== null ? t("durationSeconds", { count: duration }) : "—"}
            </span>
            <span className="truncate text-label-sm text-neutral-500">{t("duration")}</span>
          </div>
        </div>
      </div>

      {crawl.status === "failed" && crawl.error_message && (
        <p className="rounded-lg border border-error-100 bg-error-50 px-3 py-2 text-label-sm text-error-600">
          {crawl.error_message}
        </p>
      )}
    </article>
  );
}
