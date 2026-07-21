import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  title: string;
  description?: string;
  retryLabel?: string;
  onRetry?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  className?: string;
  fullPage?: boolean;
};

export default function ErrorState({
  title,
  description,
  retryLabel,
  onRetry,
  secondaryLabel,
  onSecondary,
  className,
  fullPage = true,
}: ErrorStateProps) {
  const hasActions = Boolean(onRetry || onSecondary);

  return (
    <Empty className={cn(fullPage && "flex-1 py-16", className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon" className="size-16 bg-error-50 text-error-500">
          <AlertTriangle className="size-8" aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle className="text-lg">{title}</EmptyTitle>
        {description && <EmptyDescription className="text-base">{description}</EmptyDescription>}
      </EmptyHeader>
      {hasActions && (
        <EmptyContent>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {onRetry && (
              <Button type="button" variant="outline" onClick={onRetry}>
                {retryLabel}
              </Button>
            )}
            {onSecondary && (
              <Button type="button" variant="outline" onClick={onSecondary}>
                {secondaryLabel}
              </Button>
            )}
          </div>
        </EmptyContent>
      )}
    </Empty>
  );
}
