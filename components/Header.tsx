"use client";

import { Bell, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { LanguageSelector } from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type HeaderProps = {
  className?: string;
};

type HeaderIconButtonProps = {
  label: string;
  children: ReactNode;
};

const iconButtonClassName =
  "size-10 rounded-lg border-neutral-200 bg-white text-secondary-300 hover:bg-neutral-50 hover:text-secondary-400";

function HeaderIconButton({ label, children }: HeaderIconButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={iconButtonClassName}
          aria-label={label}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}

export function Header({ className }: HeaderProps) {
  const t = useTranslations("common.header");

  return (
    <header
      className={cn(
        "flex items-center justify-end gap-2 border-b border-neutral-200 px-6 py-4 lg:px-10",
        className,
      )}
    >
      <TooltipProvider>
        <LanguageSelector />
        <HeaderIconButton label={t("settings")}>
          <Settings className="size-5" aria-hidden="true" />
        </HeaderIconButton>
        <HeaderIconButton label={t("notifications")}>
          <Bell className="size-5" aria-hidden="true" />
        </HeaderIconButton>
      </TooltipProvider>
    </header>
  );
}
