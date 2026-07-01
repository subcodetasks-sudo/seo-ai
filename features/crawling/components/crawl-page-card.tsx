"use client";

import { ExternalLink, Link2, TriangleAlert, type LucideIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, getDisplayPathname } from "@/lib/utils";
import { getHealthScoreBadgeClassName, getStatusCodeBadgeClassName } from "../services/page-status";
import type { CrawlPageItem } from "../types";

type CrawlPageCardProps = {
  page: CrawlPageItem;
  onViewLinks: (page: CrawlPageItem, tab: "internal" | "external") => void;
};

type PageStatProps = {
  icon: LucideIcon;
  value: number;
  label: string;
};

function PageStat({ icon: Icon, value, label }: PageStatProps) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2.5">
      <Icon className="size-4 shrink-0 text-neutral-400" aria-hidden="true" />
      <div className="flex min-w-0 flex-col">
        <span className="text-h4 font-semibold leading-tight text-secondary-500">{value}</span>
        <span className="truncate text-label-sm text-neutral-500">{label}</span>
      </div>
    </div>
  );
}

export function CrawlPageCard({ page, onViewLinks }: CrawlPageCardProps) {
  const t = useTranslations("crawlHistory.pageCard");
  const locale = useLocale();
  const numberFormatter = new Intl.NumberFormat(locale);

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={getStatusCodeBadgeClassName(page.status_code)}>
              {page.status_code}
            </Badge>
            {page.is_redirect && (
              <Badge variant="outline" className="border-neutral-200 text-neutral-500">
                {t("redirect")}
              </Badge>
            )}
          </div>
          <a
            href={page.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate text-label-md font-medium text-secondary-500 hover:text-primary-600"
            title={page.url}
          >
            <bdi dir="ltr">{getDisplayPathname(page.url)}</bdi>
          </a>
        </div>

        <Badge className={cn("shrink-0", getHealthScoreBadgeClassName(page.health_score))}>
          {t("score", { score: numberFormatter.format(page.health_score) })}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <PageStat icon={TriangleAlert} value={page.issues.length} label={t("issues")} />
        <PageStat icon={Link2} value={page.seo_data.internal_links} label={t("internalLinks")} />
        <PageStat
          icon={ExternalLink}
          value={page.seo_data.external_links}
          label={t("externalLinks")}
        />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={() => onViewLinks(page, "internal")}
        className="h-9 w-fit gap-2 border-neutral-200 text-secondary-500 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600"
      >
        <Link2 className="size-4" aria-hidden="true" />
        {t("viewLinks")}
      </Button>
    </article>
  );
}
