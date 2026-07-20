"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { SEARCH_CONSOLE_TABS, type SearchConsoleTab } from "../types";

type SearchConsoleTabsProps = {
  activeTab: SearchConsoleTab;
  onTabChange: (tab: SearchConsoleTab) => void;
};

export function SearchConsoleTabs({ activeTab, onTabChange }: SearchConsoleTabsProps) {
  const t = useTranslations("searchConsole.tabs");

  return (
    <div className="border-b border-neutral-200">
      <div className="flex gap-6 overflow-x-auto pb-px" role="tablist" aria-label={t("label")}>
        {SEARCH_CONSOLE_TABS.map((tab) => {
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
