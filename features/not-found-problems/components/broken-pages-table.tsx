"use client";

import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { enUS } from "date-fns/locale";
import { Copy, ExternalLink, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useDirection } from "@/components/ui/direction";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@/i18n/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getDisplayPathname } from "@/lib/utils";
import type { BrokenPage } from "../types";

type BrokenPagesTableProps = {
  items: BrokenPage[];
  projectId: string;
  projectDomain: string;
};

function constructFullUrl(
  domain: string,
  referrerUrl: string | null,
  url: string,
): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  let fullDomain = domain;
  if (!fullDomain.startsWith("http://") && !fullDomain.startsWith("https://")) {
    fullDomain = `https://${fullDomain}`;
  }
  fullDomain = fullDomain.replace(/\/$/, "");

  let path = url;
  if (referrerUrl) {
    const referrerPath = referrerUrl.replace(/\/$/, "");
    path = `${referrerPath}${url}`;
  }

  return `${fullDomain}${path}`;
}

export function BrokenPagesTable({ items, projectId, projectDomain }: BrokenPagesTableProps) {
  const t = useTranslations("notFoundProblems.table");
  const locale = useLocale();
  const dir = useDirection();
  const dateLocale = locale === "ar" ? ar : enUS;
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleCopyUrl(url: string, itemId: string) {
    const fullUrl = constructFullUrl(projectDomain, null, url);
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(itemId);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function handleOpenUrl(referrerUrl: string | null, url: string) {
    const fullUrl = constructFullUrl(projectDomain, referrerUrl, url);
    window.open(fullUrl, "_blank", "noopener,noreferrer");
  }

  const ActionButtons = ({ item }: { item: BrokenPage }) => (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => handleCopyUrl(item.url, item.id)}
              aria-label={t("copyUrl")}
              className={`size-8 border-neutral-200 ${
                copiedId === item.id
                  ? "bg-success-50 text-success-600 border-success-200"
                  : "bg-white text-secondary-500 hover:bg-neutral-50"
              }`}
            >
              <Copy className="size-3.5" aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">{t("copyUrl")}</TooltipContent>
        </Tooltip>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => handleOpenUrl(item.referrer_url, item.url)}
              aria-label={t("openUrl")}
              className="size-8 border-neutral-200 bg-white text-secondary-500 hover:bg-neutral-50"
            >
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">{t("openUrl")}</TooltipContent>
        </Tooltip>
        <Button
          type="button"
          size="sm"
          asChild
          className="gap-1.5 bg-primary-300 text-secondary-500 hover:bg-primary-400 text-label-sm"
        >
          <Link href={`/dashboard/404-problems/ai-fix?pageId=${item.id}&projectId=${projectId}`}>
            <Sparkles className="size-3.5" aria-hidden="true" />
            {t("fixWithAi")}
          </Link>
        </Button>
      </div>
    </TooltipProvider>
  );

  return (
    <div dir={dir} className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
      {/* Mobile: card layout */}
      <div className="flex flex-col divide-y divide-neutral-200 md:hidden">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col gap-3 p-4">
            <div className="flex flex-col gap-1">
              <span className="text-label-xs text-neutral-400">{t("brokenUrl")}</span>
              <span className="text-label-sm font-medium text-error-500 truncate">
                <bdi dir="ltr">{getDisplayPathname(item.url)}</bdi>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-label-xs text-neutral-400">{t("source")}</span>
                <span className="text-label-sm text-neutral-600 truncate">
                  {item.referrer_url ? <bdi dir="ltr">{getDisplayPathname(item.referrer_url)}</bdi> : t("noReferrer")}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-label-xs text-neutral-400">{t("detectedAt")}</span>
                <span className="text-label-sm text-neutral-500">
                  {formatDistanceToNow(new Date(item.first_detected_at), {
                    addSuffix: true,
                    locale: dateLocale,
                  })}
                </span>
              </div>
            </div>
            <ActionButtons item={item} />
          </div>
        ))}
      </div>

      {/* Desktop: full table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="border-neutral-200 bg-neutral-50">
              <TableHead className="text-label-sm text-center font-medium text-neutral-500 py-3 px-4">
                {t("brokenUrl")}
              </TableHead>
              <TableHead className="text-label-sm text-center font-medium text-neutral-500 py-3 px-4">
                {t("source")}
              </TableHead>
              <TableHead className="text-label-sm text-center font-medium text-neutral-500 py-3 px-4">
                {t("detectedAt")}
              </TableHead>
              <TableHead className="text-label-sm text-center font-medium text-neutral-500 py-3 px-4">
                {t("action")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="border-neutral-200">
                <TableCell className="py-3 px-4 font-medium text-error-500 text-label-sm max-w-xs truncate">
                  <bdi dir="ltr">{getDisplayPathname(item.url)}</bdi>
                </TableCell>
                <TableCell className="py-3 px-4 text-label-sm text-neutral-600 max-w-xs truncate">
                  {item.referrer_url ? <bdi dir="ltr">{getDisplayPathname(item.referrer_url)}</bdi> : t("noReferrer")}
                </TableCell>
                <TableCell className="py-3 px-4 text-label-sm text-neutral-500">
                  {formatDistanceToNow(new Date(item.first_detected_at), {
                    addSuffix: true,
                    locale: dateLocale,
                  })}
                </TableCell>
                <TableCell className="py-3 px-4">
                  <ActionButtons item={item} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
