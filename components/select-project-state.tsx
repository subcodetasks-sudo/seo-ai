"use client";

import { FolderKanban } from "lucide-react";
import { useTranslations } from "next-intl";

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { cn } from "@/lib/utils";

type SelectProjectStateProps = {
  className?: string;
  fullPage?: boolean;
};

export default function SelectProjectState({ className, fullPage = true }: SelectProjectStateProps) {
  const t = useTranslations("common.state");

  return (
    <Empty className={cn(fullPage && "flex-1 py-16", className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon" className="size-16">
          <FolderKanban className="size-8" aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle className="text-lg">{t("selectProjectTitle")}</EmptyTitle>
        <EmptyDescription className="text-base">{t("selectProjectDescription")}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
