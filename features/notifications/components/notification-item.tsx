"use client";

import { formatDistanceToNow, type Locale } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import { getNotificationVisual } from "../services/notification-visual";
import type { AppNotification } from "../types";

type NotificationItemProps = {
  notification: AppNotification;
  selected: boolean;
  onSelectedChange: (checked: boolean) => void;
  onMarkRead: () => void;
  isMarkingRead: boolean;
};

function formatRelative(value: string | null, dateLocale: Locale): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return formatDistanceToNow(date, { addSuffix: true, locale: dateLocale });
}

export function NotificationItem({
  notification,
  selected,
  onSelectedChange,
  onMarkRead,
  isMarkingRead,
}: NotificationItemProps) {
  const t = useTranslations("notifications");
  const locale = useLocale();

  const { icon: Icon, iconClass, badgeClass } = getNotificationVisual(notification.type);
  const dateLocale = locale === "ar" ? arSA : enUS;
  const timeAgo = formatRelative(notification.created_at, dateLocale);
  const isUnread = !notification.is_read;

  return (
    <div
      className={cn(
        "group relative flex items-start gap-3 px-4 py-4 transition-colors sm:px-5",
        isUnread ? "bg-primary-50/40 hover:bg-primary-50/70" : "bg-white hover:bg-neutral-50",
      )}
    >
      <Checkbox
        checked={selected}
        onCheckedChange={(value) => onSelectedChange(value === true)}
        aria-label={t("selectItem")}
        className="mt-1.5"
      />

      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full",
          badgeClass,
        )}
      >
        <Icon className={cn("size-[18px]", iconClass)} aria-hidden="true" />
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <p
            className={cn(
              "text-label-md text-secondary-500",
              isUnread && "font-semibold",
            )}
          >
            {notification.title}
          </p>
          {isUnread && (
            <span
              className="mt-1.5 size-2 shrink-0 rounded-full bg-primary-300"
              aria-hidden="true"
            />
          )}
        </div>

        {notification.body && (
          <p className="text-label-sm leading-relaxed text-neutral-500">{notification.body}</p>
        )}

        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          {timeAgo && <span className="text-label-sm text-neutral-400">{timeAgo}</span>}
          {isUnread && (
            <button
              type="button"
              onClick={onMarkRead}
              disabled={isMarkingRead}
              className="cursor-pointer rounded-full border border-primary-200 bg-primary-50 px-2.5 py-0.5 text-label-sm font-medium text-primary-500 transition-colors hover:bg-primary-75 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t("markRead")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
