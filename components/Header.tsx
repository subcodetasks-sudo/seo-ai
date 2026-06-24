"use client";

import { Bell, Settings } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Fragment, type ReactNode } from "react";

import { LanguageSelector } from "@/components/LanguageSelector";
import LogoIcon from "@/components/LogoIcon";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type HeaderProps = {
  className?: string;
};

type HeaderIconButtonProps = {
  label: string;
  children: ReactNode;
  href?: string;
  isActive?: boolean;
};

type BreadcrumbItemData = {
  href?: string;
  label: string;
};

const DASHBOARD_PAGE_LABEL_KEYS: Record<string, string> = {
  overview: "overview",
  problems: "problemList",
  "ai-suggestions": "aiSuggestions",
  "404-problems": "notFoundProblems",
  reports: "reports",
  changelog: "changelog",
  settings: "settings",
};

const iconButtonClassName =
  "size-10 rounded-lg border-neutral-200 bg-white text-secondary-300 hover:bg-neutral-50 hover:text-secondary-400";

function HeaderIconButton({ label, children, href, isActive }: HeaderIconButtonProps) {
  const buttonClassName = cn(
    iconButtonClassName,
    isActive && "border-primary-200 bg-primary-50 text-primary-700 hover:bg-primary-50",
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {href ? (
          <Button
            asChild
            variant="outline"
            size="icon"
            className={buttonClassName}
            aria-label={label}
          >
            <Link href={href}>{children}</Link>
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={buttonClassName}
            aria-label={label}
          >
            {children}
          </Button>
        )}
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}

// Maps a parent segment to the label shown for its dynamic detail sub-route
const DASHBOARD_DETAIL_LABELS: Record<string, { ns: "aiSuggestions"; key: string }> = {
  "ai-suggestions": { ns: "aiSuggestions", key: "reviewPage.title" },
};

function useDashboardBreadcrumbs(): BreadcrumbItemData[] | null {
  const pathname = usePathname();
  const t = useTranslations("common.header");
  const tSidebar = useTranslations("sidebar");
  const tAiSuggestions = useTranslations("aiSuggestions");

  const nsTranslators: Record<string, (key: string) => string> = {
    aiSuggestions: tAiSuggestions as unknown as (key: string) => string,
  };

  if (!pathname.startsWith("/dashboard")) {
    return null;
  }

  const items: BreadcrumbItemData[] = [
    { href: "/dashboard", label: t("dashboard") },
  ];

  if (pathname === "/dashboard") {
    items.push({ label: t("home") });
    return items;
  }

  const parts = pathname.replace(/^\/dashboard\/?/, "").split("/").filter(Boolean);

  if (parts.length === 0) {
    items.push({ label: t("home") });
    return items;
  }

  const firstPart = parts[0];
  const labelKey = DASHBOARD_PAGE_LABEL_KEYS[firstPart];
  const firstLabel = labelKey ? tSidebar(labelKey) : firstPart;

  if (parts.length === 1) {
    items.push({ label: firstLabel });
  } else {
    // Has a dynamic sub-route — show parent as a link, replace the raw ID with a known label
    items.push({ href: `/dashboard/${firstPart}`, label: firstLabel });
    const detail = DASHBOARD_DETAIL_LABELS[firstPart];
    if (detail) {
      items.push({ label: nsTranslators[detail.ns](detail.key) });
    }
  }

  return items;
}

function DashboardBreadcrumbs() {
  const items = useDashboardBreadcrumbs();

  if (!items) {
    return null;
  }

  return (
    <Breadcrumb className="hidden min-w-0 md:block">
      <BreadcrumbList className="text-label-md text-neutral-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 ? (
                <BreadcrumbSeparator className="text-neutral-400">
                  <span aria-hidden="true">&gt;</span>
                </BreadcrumbSeparator>
              ) : null}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="font-semibold text-secondary-500">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={item.href!}
                      className="text-neutral-500 hover:text-secondary-500"
                    >
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function Header({ className }: HeaderProps) {
  const t = useTranslations("common.header");
  const tSidebar = useTranslations("sidebar");
  const pathname = usePathname();
  const { side, isOpen, sidebar } = useSidebarMotion();
  const isSettingsActive = pathname.startsWith("/dashboard/settings");
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
        "flex items-center justify-between gap-4 border-b border-neutral-200 bg-white px-6 py-4 lg:px-10 h-18.75",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {sidebar ? (
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
        ) : null}

        <DashboardBreadcrumbs />
      </div>

      <TooltipProvider>
        <div className="flex shrink-0 items-center gap-2">
          <LanguageSelector />
          <HeaderIconButton
            label={t("settings")}
            href="/dashboard/settings"
            isActive={isSettingsActive}
          >
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
