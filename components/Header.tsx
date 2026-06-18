"use client";

import { Bell, Settings } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { LanguageSelector } from "@/components/LanguageSelector";
import LogoIcon from "@/components/LogoIcon";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getHeaderLogoVariants,
  SIDEBAR_TRANSITION,
  useSidebarMotion,
} from "@/hooks/use-sidebar-motion";
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
  const tSidebar = useTranslations("sidebar");
  const { side, isOpen, sidebar } = useSidebarMotion();
  const showHeaderLogo = !isOpen;

  const openSidebar = () => {
    if (!sidebar) return;

    if (sidebar.isMobile) {
      sidebar.setOpenMobile(true);
      return;
    }
    sidebar.setOpen(true);
  };

  return (
    <header
      className={cn(
        "flex items-center gap-2 border-b border-neutral-200 px-6 py-4 lg:px-10 h-18.75",
        className,
      )}
    >
      {sidebar ? (
        <div className="flex min-w-0 flex-1 items-center">
          <AnimatePresence initial={false}>
            {showHeaderLogo ? (
              <motion.div
                key="header-logo"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 40, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={SIDEBAR_TRANSITION}
                className="overflow-hidden"
              >
                <motion.div
                  variants={getHeaderLogoVariants(side)}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={SIDEBAR_TRANSITION}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={openSidebar}
                    aria-label={tSidebar("open")}
                    className="size-10 rounded-lg hover:bg-neutral-50"
                  >
                    <LogoIcon />
                  </Button>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex-1" />
      )}
      <TooltipProvider>
        <div className="flex shrink-0 items-center gap-2">
          <LanguageSelector />
          <HeaderIconButton label={t("settings")}>
            <Settings className="size-5" aria-hidden="true" />
          </HeaderIconButton>
          <HeaderIconButton label={t("notifications")}>
            <Bell className="size-5" aria-hidden="true" />
          </HeaderIconButton>
        </div>
      </TooltipProvider>
    </header>
  );
}
