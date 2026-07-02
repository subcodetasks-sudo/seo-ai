"use client";

import { ArrowUpRight, ChevronLeft, ChevronRight, ExternalLink, Link2, TriangleAlert, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { useDirection } from "@/components/ui/direction";
import { Link } from "@/i18n/navigation";
import { cn, getDisplayPathname } from "@/lib/utils";
import { HealthScoreRing } from "./health-score-ring";
import {
  getStatusCodeBadgeClassName,
  getStatusCodeLabel,
  isNotFoundStatus,
} from "../services/page-status";
import type { CrawlPageItem } from "../types";

type CrawlPageCardProps = {
  page: CrawlPageItem;
  detailHref: (tab: "issues" | "internal" | "external") => string;
};

type PageStatLinkProps = {
  icon: LucideIcon;
  value: number;
  label: string;
  href: string;
  accentClassName?: string;
};

function PageStatLink({ icon: Icon, value, label, href, accentClassName }: PageStatLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2.5 transition-colors hover:border-primary-200 hover:bg-primary-50",
        accentClassName,
      )}
    >
      <Icon className="size-4 shrink-0 text-neutral-400" aria-hidden="true" />
      <div className="flex min-w-0 flex-col">
        <span className="text-h4 font-semibold leading-tight text-secondary-500">{value}</span>
        <span className="truncate text-label-sm text-neutral-500">{label}</span>
      </div>
    </Link>
  );
}

export function CrawlPageCard({ page, detailHref }: CrawlPageCardProps) {
  const t = useTranslations("crawlHistory.pageCard");
  const dir = useDirection();
  const notFound = isNotFoundStatus(page.status_code);
  const hasIssues = page.issues.length > 0;
  const ChevronIcon = dir === "rtl" ? ChevronLeft : ChevronRight;

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-xl border p-5 transition-shadow hover:shadow-sm",
        notFound ? "border-error-200 bg-error-50/40" : "border-neutral-200 bg-white",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={getStatusCodeBadgeClassName(page.status_code)}>
              {getStatusCodeLabel(page.status_code, t)}
            </Badge>
            {page.is_redirect && (
              <Badge variant="outline" className="border-neutral-200 text-neutral-500">
                {t("redirect")}
              </Badge>
            )}
            {hasIssues && (
              <Badge className="gap-1 border-warning-100 bg-warning-50 text-warning-600">
                <TriangleAlert className="size-3" aria-hidden="true" />
                {t("issuesCount", { count: page.issues.length })}
              </Badge>
            )}
          </div>
          <a
            href={page.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1 text-label-md font-medium text-secondary-500 hover:text-primary-600"
            title={page.url}
          >
            <bdi dir="ltr" className="truncate">
              {getDisplayPathname(page.url)}
            </bdi>
            <ArrowUpRight
              className="size-3.5 shrink-0 text-neutral-300 transition-colors group-hover:text-primary-500"
              aria-hidden="true"
            />
          </a>
        </div>

        <HealthScoreRing
          score={page.health_score}
          label={t("score", { score: page.health_score ?? "—" })}
          ringClassName={notFound ? "text-error-500" : undefined}
        />
      </div>

      <div className={cn("grid gap-3", notFound ? "grid-cols-1" : "grid-cols-3")}>
        <PageStatLink
          icon={TriangleAlert}
          value={page.issues.length}
          label={t("issues")}
          href={detailHref("issues")}
          accentClassName={hasIssues ? "border-warning-100 bg-warning-50/60" : undefined}
        />
        {!notFound && (
          <>
            <PageStatLink
              icon={Link2}
              value={page.seo_data?.internal_links ?? 0}
              label={t("internalLinks")}
              href={detailHref("internal")}
            />
            <PageStatLink
              icon={ExternalLink}
              value={page.seo_data?.external_links ?? 0}
              label={t("externalLinks")}
              href={detailHref("external")}
            />
          </>
        )}
      </div>

      <Link
        href={detailHref("issues")}
        className="flex h-9 w-fit items-center gap-1.5 rounded-lg border border-neutral-200 px-3.5 text-label-sm font-medium text-secondary-500 transition-colors hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600"
      >
        {t("viewDetails")}
        <ChevronIcon className="size-3.5" aria-hidden="true" />
      </Link>
    </article>
  );
}
