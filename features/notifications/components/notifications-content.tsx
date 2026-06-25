"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, CheckCheck, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useDirection } from "@/components/ui/direction";
import { cn } from "@/lib/utils";

import { useMarkNotificationsRead } from "../queries/mutations";
import { notificationsQueryOptions, unreadCountQueryOptions } from "../queries/queries";
import type { NotificationsFilter } from "../types";
import { NotificationItem } from "./notification-item";
import { NotificationsHeader } from "./notifications-header";
import { NotificationsSkeleton } from "./notifications-skeleton";

const FILTERS: NotificationsFilter[] = ["all", "unread"];

export function NotificationsContent() {
  const t = useTranslations("notifications");
  const dir = useDirection();

  const { data: notifications = [], isLoading: isListLoading } = useQuery(notificationsQueryOptions());
  const { data: unreadCountData, isLoading: isCountLoading } = useQuery(unreadCountQueryOptions());
  const isLoading = isListLoading || isCountLoading;
  const { mutate: markRead, isPending, variables } = useMarkNotificationsRead();

  const [filter, setFilter] = useState<NotificationsFilter>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const unreadFromList = useMemo(
    () => notifications.filter((notification) => !notification.is_read).length,
    [notifications],
  );
  const unreadCount = unreadCountData ?? unreadFromList;

  const visible = useMemo(
    () =>
      filter === "unread"
        ? notifications.filter((notification) => !notification.is_read)
        : notifications,
    [filter, notifications],
  );

  const allVisibleSelected =
    visible.length > 0 && visible.every((notification) => selectedIds.has(notification.id));
  const selectedCount = selectedIds.size;

  // While a mark-read is in flight, `variables` holds the ids being updated so
  // individual rows can show a disabled state (null = "mark all").
  const pendingIds = isPending && Array.isArray(variables) ? new Set(variables) : null;

  function toggleOne(id: string, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function toggleAll(checked: boolean) {
    setSelectedIds(checked ? new Set(visible.map((notification) => notification.id)) : new Set());
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function handleMarkSelected() {
    const ids = [...selectedIds];
    if (ids.length === 0) return;
    markRead(ids, { onSuccess: clearSelection });
  }

  function handleMarkAll() {
    markRead(null, { onSuccess: clearSelection });
  }

  return (
    <div dir={dir} className="flex flex-1 flex-col bg-neutral-75 px-6 py-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <NotificationsHeader
          unreadCount={unreadCount}
          isLoading={isLoading}
          onMarkAllRead={handleMarkAll}
          isPending={isPending}
        />

        <div className="flex items-center gap-2">
          {FILTERS.map((key) => {
            const isActive = filter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-label-md font-medium transition-colors",
                  isActive
                    ? "bg-secondary-500 text-white"
                    : "border border-neutral-200 bg-white text-secondary-300 hover:text-secondary-500",
                )}
              >
                {t(key === "all" ? "filterAll" : "filterUnread")}
                {key === "unread" && unreadCount > 0 && (
                  <span className="ms-1.5 text-label-sm">{unreadCount}</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <div className={cn(
            "flex items-center justify-between gap-3 border-b border-neutral-200 px-4 py-3 sm:px-5",
            isLoading && "hidden",
          )}>
            <label className="flex cursor-pointer items-center gap-2.5 text-label-md text-secondary-400">
              <Checkbox
                checked={allVisibleSelected}
                onCheckedChange={(value) => toggleAll(value === true)}
                disabled={visible.length === 0}
                aria-label={t("selectAll")}
              />
              <span>
                {selectedCount > 0 ? t("selectedCount", { count: selectedCount }) : t("selectAll")}
              </span>
            </label>

            {selectedCount > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleMarkSelected}
                  disabled={isPending}
                  className="gap-1.5"
                >
                  <CheckCheck className="size-3.5" aria-hidden="true" />
                  {t("markRead")}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearSelection}
                  className="gap-1"
                >
                  <X className="size-3.5" aria-hidden="true" />
                  {t("clearSelection")}
                </Button>
              </div>
            )}
          </div>

          {isLoading ? (
            <NotificationsSkeleton />
          ) : visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-neutral-100">
                <Bell className="size-6 text-neutral-400" aria-hidden="true" />
              </span>
              <div className="flex max-w-xs flex-col gap-1">
                <p className="text-body font-semibold text-secondary-500">
                  {filter === "unread" ? t("emptyUnreadTitle") : t("emptyTitle")}
                </p>
                <p className="text-label-md text-neutral-500">
                  {filter === "unread" ? t("emptyUnreadDescription") : t("emptyDescription")}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-neutral-200">
              {visible.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  selected={selectedIds.has(notification.id)}
                  onSelectedChange={(checked) => toggleOne(notification.id, checked)}
                  onMarkRead={() => markRead([notification.id])}
                  isMarkingRead={Boolean(pendingIds?.has(notification.id))}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
