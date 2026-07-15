"use client";

import { Loader2, Play } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useContinueCrawl } from "@/features/home/queries/mutations";
import type { CrawlGuardError } from "@/features/home/services/crawl-guard";

type CrawlGuardDialogProps = {
  projectId: string;
  guard: CrawlGuardError | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinued?: (crawlJobId: string) => void;
};

export default function CrawlGuardDialog({
  projectId,
  guard,
  open,
  onOpenChange,
  onContinued,
}: CrawlGuardDialogProps) {
  const t = useTranslations("home.projects.crawl.guard");
  const { mutate: continueCrawl, isPending } = useContinueCrawl();

  const canContinue =
    guard?.code === "crawl_not_finished" &&
    guard.canContinue &&
    !!guard.crawlJobId;

  function handleContinue() {
    if (!guard?.crawlJobId || isPending) return;
    continueCrawl(
      { projectId, crawlJobId: guard.crawlJobId },
      {
        onSuccess: (response) => {
          onOpenChange(false);
          onContinued?.(response.data.crawl_job_id);
        },
      },
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {guard?.code === "crawl_in_progress"
              ? t("inProgressTitle")
              : t("notFinishedTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {guard?.code === "crawl_in_progress"
              ? t("inProgressDescription")
              : t("notFinishedDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{t("dismiss")}</AlertDialogCancel>
          {canContinue && (
            <AlertDialogAction
              disabled={isPending}
              onClick={(event) => {
                event.preventDefault();
                handleContinue();
              }}
              className="gap-2 bg-primary-300 text-secondary-500 hover:bg-primary-400"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Play className="size-4" aria-hidden="true" />
              )}
              {isPending ? t("continuing") : t("continue")}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
