"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { useTranslations } from "next-intl";

import { useDirection } from "@/components/ui/direction";
import { cn } from "@/lib/utils";

import { SETTINGS_TABS, type SettingsTab } from "../types";

type SettingsTabsProps = {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
};

type IndicatorStyle = {
  width: number;
  insetInlineStart: number;
};

function getInsetInlineStart(
  listRect: DOMRect,
  tabRect: DOMRect,
  direction: "ltr" | "rtl",
) {
  if (direction === "rtl") {
    return listRect.right - tabRect.right;
  }

  return tabRect.left - listRect.left;
}

export function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  const t = useTranslations("settings.tabs");
  const direction = useDirection();
  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Partial<Record<SettingsTab, HTMLButtonElement>>>({});
  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle | null>(null);

  useLayoutEffect(() => {
    function updateIndicator() {
      const list = listRef.current;
      const activeButton = tabRefs.current[activeTab];

      if (!list || !activeButton) {
        return;
      }

      const listRect = list.getBoundingClientRect();
      const tabRect = activeButton.getBoundingClientRect();

      setIndicatorStyle({
        width: tabRect.width,
        insetInlineStart: getInsetInlineStart(listRect, tabRect, direction),
      });
    }

    updateIndicator();
    window.addEventListener("resize", updateIndicator);

    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeTab, direction, t]);

  return (
    <div ref={listRef} className="settings-tabs-list">
      <span
        className="settings-tabs-indicator"
        aria-hidden="true"
        style={
          indicatorStyle
            ? ({
                width: indicatorStyle.width,
                insetInlineStart: indicatorStyle.insetInlineStart,
              } as CSSProperties)
            : undefined
        }
      />
      {SETTINGS_TABS.map((tab) => (
        <button
          key={tab}
          ref={(node) => {
            tabRefs.current[tab] = node ?? undefined;
          }}
          type="button"
          role="tab"
          aria-selected={activeTab === tab}
          onClick={() => onTabChange(tab)}
          className={cn(
            "settings-tab-trigger",
            activeTab === tab ? "text-primary-700" : "text-neutral-500",
          )}
        >
          {t(tab)}
        </button>
      ))}
    </div>
  );
}
