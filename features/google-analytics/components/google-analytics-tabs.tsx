"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { GOOGLE_ANALYTICS_TABS, type GoogleAnalyticsTab } from "../types";

type GoogleAnalyticsTabsProps = {
  activeTab: GoogleAnalyticsTab;
  onTabChange: (tab: GoogleAnalyticsTab) => void;
};

export function GoogleAnalyticsTabs({ activeTab, onTabChange }: GoogleAnalyticsTabsProps) {
  const t = useTranslations("googleAnalytics.tabs");

  return (
    <div className="border-b border-neutral-200">
      <div
        className="flex gap-6 overflow-x-auto pb-px"
        role="tablist"
        aria-label={t("label")}
      >
        {GOOGLE_ANALYTICS_TABS.map((tab) => {
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(tab)}
              className={cn(
                "shrink-0 border-b-2 pb-3 text-label-sm font-medium transition-colors",
                isActive
                  ? "border-primary-500 text-secondary-500"
                  : "border-transparent text-neutral-400 hover:text-neutral-600",
              )}
            >
              {t(tab)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
