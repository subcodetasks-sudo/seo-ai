"use client";

import { Check, Sparkles, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { formatDistanceToNow, isValid } from "date-fns";
import { arSA, enUS } from "date-fns/locale";

import { Link } from "@/i18n/navigation";
import type { LastChange } from "../types";

type RecentChangesListProps = {
  items: LastChange[];
};

function getChangeIcon(changeType: string, status: string) {
  if (status === "failed") return X;
  if (changeType.toLowerCase().includes("redirect")) return Sparkles;
  return Check;
}

function getIconClassName(status: string) {
  if (status === "failed") return "bg-error-50 text-error-500";
  return "bg-success-50 text-success-500";
}

export function RecentChangesList({ items }: RecentChangesListProps) {
  const t = useTranslations("overview");
  const locale = useLocale();
  const dateLocale = locale === "ar" ? arSA : enUS;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-start text-h4 font-semibold text-secondary-500">
          {t("recentChanges")}
        </h3>
        <Link
          href="/dashboard/changelog"
          className="text-label-sm font-medium text-primary-500 hover:text-primary-600"
        >
          {t("viewAll")}
        </Link>
      </div>

      <ul className="flex flex-col divide-y divide-neutral-100">
        {items.map((entry, index) => {
          const Icon = getChangeIcon(entry.change_type, entry.status);
          const iconClass = getIconClassName(entry.status);
          const appliedAt = new Date(entry.applied_at);
          const relativeDate = isValid(appliedAt)
            ? formatDistanceToNow(appliedAt, { addSuffix: true, locale: dateLocale })
            : "—";

          return (
            <li
              key={`${entry.page_url}-${entry.change_type}-${index}`}
              className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full ${iconClass}`}
                >
                  <Icon className="size-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 text-start">
                  <p className="truncate text-label-md font-medium text-secondary-500">
                    {entry.change_type.replace(/_/g, " ")}
                  </p>
                  <p className="truncate text-label-sm text-neutral-400">{entry.page_url}</p>
                </div>
              </div>
              <span className="shrink-0 text-label-sm text-neutral-400">{relativeDate}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
