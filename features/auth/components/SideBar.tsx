"use client";

import {
  AlertTriangle,
  BarChart3,
  ChevronDown,
  Clock,
  Home,
  Link2Off,
  List,
  PanelRightClose,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import Logo from "@/components/Logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sidebar as UiSidebar, useSidebar } from "@/components/ui/sidebar";
import {
  getSidebarContainerVariants,
  getSidebarItemVariants,
  getSidebarLogoVariants,
  type SidebarSide,
  useSidebarMotion,
} from "@/hooks/use-sidebar-motion";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", labelKey: "overview", icon: Home },
  { href: "/problems", labelKey: "problemList", icon: List },
  { href: "/ai-suggestions", labelKey: "aiSuggestions", icon: AlertTriangle },
  { href: "/404-problems", labelKey: "notFoundProblems", icon: Link2Off },
  { href: "/reports", labelKey: "reports", icon: BarChart3 },
  { href: "/changelog", labelKey: "changelog", icon: Clock },
] as const;

type SidebarMotionItemProps = {
  children: ReactNode;
  className?: string;
  side: SidebarSide;
};

function SidebarMotionItem({ children, className, side }: SidebarMotionItemProps) {
  return (
    <motion.div
      variants={getSidebarItemVariants(side)}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function SideBar() {
  const t = useTranslations("sidebar");
  const pathname = usePathname();
  const { setOpen, isMobile, setOpenMobile } = useSidebar();
  const { side, isOpen } = useSidebarMotion();

  const closeSidebar = () => {
    if (isMobile) {
      setOpenMobile(false);
      return;
    }
    setOpen(false);
  };

  return (
    <UiSidebar
      side={side}
      collapsible="offcanvas"
      className="border-neutral-200 bg-white"
    >
      <motion.div
        className="flex h-full flex-col px-5 py-6"
        initial={false}
        animate={isOpen ? "visible" : "hidden"}
        variants={getSidebarContainerVariants()}
      >
        <div className="mb-6 flex items-center justify-between gap-3">
          <motion.div
            variants={getSidebarLogoVariants(side)}
            className="min-w-0"
          >
            <Logo />
          </motion.div>
          <SidebarMotionItem side={side}>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={closeSidebar}
              aria-label={t("close")}
              className="shrink-0 text-secondary-300 hover:text-secondary-400"
            >
              <PanelRightClose
                className={cn("size-5", side === "left" && "rotate-180")}
                aria-hidden="true"
              />
            </Button>
          </SidebarMotionItem>
        </div>

        <SidebarMotionItem side={side} className="mb-6">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-start transition-colors hover:bg-neutral-50"
          >
            <div className="min-w-0">
              <p className="font-semibold text-secondary-500">{t("store")}</p>
              <p className="truncate text-sm text-secondary-200">
                www.luxuryperfumes.com
              </p>
            </div>
            <ChevronDown
              className="size-4 shrink-0 text-primary-400"
              aria-hidden="true"
            />
          </button>
        </SidebarMotionItem>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map(({ href, labelKey, icon: Icon }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);

            return (
              <SidebarMotionItem key={href} side={side}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-75 text-secondary-500"
                      : "text-secondary-400 hover:bg-neutral-50 hover:text-secondary-500",
                  )}
                >
                  <Icon className="size-5 shrink-0" aria-hidden="true" />
                  <span>{t(labelKey)}</span>
                </Link>
              </SidebarMotionItem>
            );
          })}
        </nav>

        <SidebarMotionItem side={side} className="mt-6">
          <div className="flex items-center gap-3 border-t border-neutral-200 pt-5">
            <Avatar size="lg">
              <AvatarFallback className="bg-primary-75 text-sm font-semibold text-secondary-500">
                {t("userInitials")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-semibold text-secondary-500">
                {t("userName")}
              </p>
              <p className="truncate text-sm text-secondary-200">
                {t("userPlan")}
              </p>
            </div>
          </div>
        </SidebarMotionItem>
      </motion.div>
    </UiSidebar>
  );
}
