"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type FilterTabProps = {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  icon?: LucideIcon;
  activeClassName: string;
};

export function FilterTab({ active, onClick, label, count, icon: Icon, activeClassName }: FilterTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-label-md font-medium transition-colors",
        active ? activeClassName : "text-neutral-500 hover:bg-white hover:text-secondary-500",
      )}
    >
      {Icon && <Icon className="size-4" aria-hidden="true" />}
      {label}
      <span
        className={cn(
          "min-w-5 rounded-full px-1.5 py-0.5 text-center text-label-sm font-semibold leading-tight",
          active ? "bg-white/25 text-white" : "bg-neutral-200 text-neutral-500",
        )}
      >
        {count}
      </span>
    </button>
  );
}

type FilterTabsGroupProps = {
  label: string;
  className?: string;
  children: ReactNode;
};

export function FilterTabsGroup({ label, className, children }: FilterTabsGroupProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex w-fit flex-wrap items-center gap-1 rounded-xl border border-neutral-200 bg-neutral-50 p-1",
        className,
      )}
    >
      {children}
    </div>
  );
}
