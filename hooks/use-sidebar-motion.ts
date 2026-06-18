"use client";

import { useLocale } from "next-intl";
import type { Transition, Variants } from "motion/react";

import { useOptionalSidebar } from "@/components/ui/sidebar";

export type SidebarSide = "left" | "right";

export const SIDEBAR_TRANSITION: Transition = {
  duration: 0.3,
  ease: [0.22, 1, 0.36, 1],
};

export function getSidebarSide(locale: string): SidebarSide {
  return locale === "ar" ? "right" : "left";
}

function getSlideOffset(side: SidebarSide, distance: number) {
  return side === "left" ? -distance : distance;
}

export function getSidebarItemVariants(
  side: SidebarSide,
  distance = 24,
): Variants {
  const x = getSlideOffset(side, distance);

  return {
    hidden: { x, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: SIDEBAR_TRANSITION,
    },
  };
}

export function getSidebarLogoVariants(side: SidebarSide): Variants {
  return getSidebarItemVariants(side, 32);
}

export function getSidebarContainerVariants(): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.045,
        delayChildren: 0.06,
      },
    },
  };
}

export function getHeaderLogoVariants(side: SidebarSide): Variants {
  const x = getSlideOffset(side, 24);

  return {
    initial: { x, opacity: 0, scale: 0.95 },
    animate: { x: 0, opacity: 1, scale: 1 },
    exit: { x, opacity: 0, scale: 0.95 },
  };
}

export function useSidebarMotion() {
  const locale = useLocale();
  const side = getSidebarSide(locale);
  const sidebar = useOptionalSidebar();

  const isOpen = sidebar
    ? sidebar.isMobile
      ? sidebar.openMobile
      : sidebar.open
    : false;

  return {
    side,
    isOpen,
    sidebar,
  };
}
