"use client";

import { CheckCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type NotificationsHeaderProps = {
  unreadCount: number;
  isLoading: boolean;
  onMarkAllRead: () => void;
  isPending: boolean;
};

export function NotificationsHeader({
  unreadCount,
  isLoading,
  onMarkAllRead,
  isPending,
}: NotificationsHeaderProps) {
  const t = useTranslations("notifications");

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1 text-start">
        <div className="flex items-center gap-2.5">
          <h1 className="text-h1 font-semibold text-secondary-500">{t("title")}</h1>
          {!isLoading && unreadCount > 0 && (
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary-300 px-2 text-label-sm font-semibold text-secondary-500">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
        {isLoading ? (
          <Skeleton className="h-4 w-40" />
        ) : (
          <p className="text-label-md text-neutral-500">
            {unreadCount > 0 ? t("unread", { count: unreadCount }) : t("allCaughtUp")}
          </p>
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={onMarkAllRead}
        disabled={isPending || isLoading || unreadCount === 0}
        className="gap-2 self-start sm:self-auto"
      >
        <CheckCheck className="size-4" aria-hidden="true" />
        {t("markAllRead")}
      </Button>
    </div>
  );
}
