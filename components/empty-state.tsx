import { Inbox, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  fullPage?: boolean;
};

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
  fullPage = true,
}: EmptyStateProps) {
  return (
    <Empty className={cn(fullPage && "flex-1 py-16", className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon" className="size-16">
          <Icon className="size-8" aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle className="text-lg">{title}</EmptyTitle>
        {description && <EmptyDescription className="text-base">{description}</EmptyDescription>}
      </EmptyHeader>
      {action && <EmptyContent>{action}</EmptyContent>}
    </Empty>
  );
}
