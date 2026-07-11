"use client";

import {
  AlertTriangle,
  BarChart3,
  Clock,
  FolderOpen,
  Home,
  Link2Off,
  LogOut,
  PanelRightClose,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import React, { type ReactNode } from "react";

import Logo from "@/components/Logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sidebar as UiSidebar, useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useAuth } from "@/features/auth/context/auth-context";
import { useLogout } from "@/features/auth/queries/mutations";
import { useAllProjects, useSelectedProject } from "@/features/home";
import { useQueryClient } from "@tanstack/react-query";
import {
  getSidebarContainerVariants,
  getSidebarItemVariants,
  getSidebarLogoVariants,
  type SidebarSide,
  useSidebarMotion,
} from "@/hooks/use-sidebar-motion";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type NavItem =
  | { href: string; labelKey: string; icon: LucideIcon; exact: boolean }
  | { href: string; labelKey: string; imageSrc: string; exact: boolean };

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", labelKey: "projects", icon: FolderOpen, exact: true },
  { href: "/dashboard/overview", labelKey: "overview", icon: Home, exact: true },
  { href: "/dashboard/ai-suggestions", labelKey: "aiSuggestions", icon: AlertTriangle, exact: false },
  { href: "/dashboard/404-problems", labelKey: "notFoundProblems", icon: Link2Off, exact: false },
  { href: "/dashboard/reports", labelKey: "reports", icon: BarChart3, exact: false },
  {
    href: "/dashboard/google-analytics",
    labelKey: "googleAnalytics",
    imageSrc: "/imgs/google_analytics_logo.webp",
    exact: false,
  },
  
  { href: "/dashboard/ai-insights", labelKey: "aiInsights", icon: Sparkles, exact: false },
  { href: "/dashboard/changelog", labelKey: "changelog", icon: Clock, exact: false },
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

const KNOWN_PLANS = new Set(["free", "starter", "pro", "agency"]);

export default function SideBar() {
  const t = useTranslations("sidebar");
  const tPlans = useTranslations("sidebar.plans");
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser, isLoading: isAuthLoading } = useAuth();
  const queryClient = useQueryClient();
  const { setOpen, isMobile, setOpenMobile } = useSidebar();
  const { side, isOpen } = useSidebarMotion();
  const { mutate: logout } = useLogout();
  const { data: projectsData, isLoading: isProjectsLoading } = useAllProjects();
  const { selectedProjectId, setSelectedProjectId, clearSelectedProject } = useSelectedProject();

  const projects = React.useMemo(
    () => projectsData?.data?.items ?? [],
    [projectsData]
  );

  // Reset selection if it belongs to a different account or doesn't exist yet
  React.useEffect(() => {
    if (projects.length === 0) return;
    const isValid = projects.some((p) => p.id === selectedProjectId);
    if (!isValid) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId, setSelectedProjectId]);

  const selectedProject = projects.find((p) => p.id === selectedProjectId) ?? projects[0];

  const closeSidebar = () => {
    if (isMobile) {
      setOpenMobile(false);
      return;
    }
    setOpen(false);
  };

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        // access_token/refresh_token cookies are cleared server-side by /api/auth/logout.
        clearSelectedProject();
        setUser(null);
        localStorage.clear();
        queryClient.clear();
        router.push("/login");
      },
    });
  };

  return (
    <UiSidebar
      side={side}
      collapsible="offcanvas"
      className="border-neutral-200"
    >
      <motion.div
        className="flex h-full flex-col px-5 py-4 bg-white border-e border-neutral-200"
        initial={false}
        animate={isOpen ? "visible" : "hidden"}
        variants={getSidebarContainerVariants()}
      >
        <div className="mb-3 flex items-center justify-between gap-3">
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
          {isProjectsLoading ? (
            <Skeleton className="h-13.5 w-full rounded-lg" />
          ) : projects.length > 0 && selectedProject ? (
            <Select value={selectedProject.id} onValueChange={setSelectedProjectId}>
              <SelectTrigger className="h-auto! w-full items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 hover:border-neutral-300 transition-colors">
                <div className="flex min-w-0 flex-1 flex-col items-start">
                  <p className="w-full truncate text-sm font-semibold text-secondary-500">
                    {selectedProject.name}
                  </p>
                </div>
              </SelectTrigger>
              <SelectContent
                position="popper"
                sideOffset={4}
                className="max-h-[40vh] w-(--radix-select-trigger-width) p-1"
              >
                {projects.map((project) => (
                  <SelectItem
                    key={project.id}
                    value={project.id}
                    className="rounded-md px-3 py-2.5 pe-8 data-[state=checked]:bg-success-75"
                  >
                    <div className="flex min-w-0 flex-1 flex-col items-start">
                      <p className="w-full truncate text-sm font-medium text-secondary-500">
                        {project.name}
                      </p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5">
              <p className="text-sm font-semibold text-secondary-400">{t("store")}</p>
              <p className="mt-1 text-xs text-secondary-300">{t("selectProject")}</p>
            </div>
          )}
        </SidebarMotionItem>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const { href, labelKey, exact } = item;
            const isActive = exact ? pathname === href : pathname.startsWith(href);

            return (
              <SidebarMotionItem key={href} side={side}>
                <Link
                  href={href}
                  onClick={handleNavClick}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-75 text-secondary-500"
                      : "text-secondary-400 hover:bg-neutral-50 hover:text-secondary-500",
                  )}
                >
                  {"icon" in item ? (
                    <item.icon className="size-5 shrink-0" aria-hidden="true" />
                  ) : (
                    <Image
                      src={item.imageSrc}
                      alt=""
                      width={20}
                      height={20}
                      className="size-5 shrink-0 object-contain"
                      aria-hidden="true"
                    />
                  )}
                  <span>{t(labelKey)}</span>
                </Link>
              </SidebarMotionItem>
            );
          })}
        </nav>

        <SidebarMotionItem side={side} className="mt-6">
          <div className="border-t border-neutral-200 pt-5">
            {isAuthLoading && !user ? (
              <div className="mb-3 flex items-center gap-3">
                <Skeleton className="size-10 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ) : (
              <div className="mb-3 flex items-center gap-3">
                <Avatar size="lg">
                  <AvatarFallback className="bg-primary-75 text-sm font-semibold text-secondary-500">
                    {user?.initials || t("userInitials")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-secondary-500">
                    {user?.display_name || t("userName")}
                  </p>
                  <p className="truncate text-sm text-secondary-200">
                    {user?.plan
                      ? KNOWN_PLANS.has(user.plan)
                        ? tPlans(user.plan as Parameters<typeof tPlans>[0])
                        : user.plan
                      : user?.plan}
                  </p>
                </div>
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full gap-2"
            >
              <LogOut className="size-4" />
              {t("logout")}
            </Button>
          </div>
        </SidebarMotionItem>
      </motion.div>
    </UiSidebar>
  );
}
