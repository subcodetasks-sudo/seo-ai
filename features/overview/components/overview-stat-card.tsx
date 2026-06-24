"use client";

import type { LucideIcon } from "lucide-react";
import { ExternalLink } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type OverviewStatCardProps = {
  href: string;
  icon: LucideIcon;
  count: number;
  label: string;
  iconClassName?: string;
  locale: string;
};

export function OverviewStatCard({
  href,
  icon: Icon,
  count,
  label,
  iconClassName,
  locale,
}: OverviewStatCardProps) {
  const formattedCount = new Intl.NumberFormat(locale).format(count);

  return (
    <Link
      href={href}
      className="group flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5 transition-colors hover:border-primary-200 hover:bg-primary-50/30"
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-lg bg-neutral-50",
            iconClassName,
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <ExternalLink
          className="size-4 text-neutral-300 transition-colors group-hover:text-primary-400"
          aria-hidden="true"
        />
      </div>
      <div className="flex flex-col gap-1 text-start">
        <span className="text-h3 font-semibold tabular-nums text-secondary-500">
          {formattedCount}
        </span>
        <span className="text-label-md text-neutral-500">{label}</span>
      </div>
    </Link>
  );
}
