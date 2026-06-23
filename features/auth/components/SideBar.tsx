"use client";

import {
  AlertTriangle,
  BarChart3,
  Clock,
  Home,
  Link2Off,
  List,
  LogOut,
  PanelRightClose,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import React, { type ReactNode } from "react";

import Logo from "@/components/Logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sidebar as UiSidebar, useSidebar } from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useAuth } from "@/features/auth/context/auth-context";
import { useLogout } from "@/features/auth/queries/mutations";
import { useAllProjects, useSelectedProject } from "@/features/home";
import {
  getSidebarContainerVariants,
  getSidebarItemVariants,
  getSidebarLogoVariants,
  type SidebarSide,
  useSidebarMotion,
} from "@/hooks/use-sidebar-motion";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard/overview", labelKey: "overview", icon: Home },
  { href: "/dashboard/problems", labelKey: "problemList", icon: List },
  { href: "/dashboard/ai-suggestions", labelKey: "aiSuggestions", icon: AlertTriangle },
  { href: "/dashboard/404-problems", labelKey: "notFoundProblems", icon: Link2Off },
  { href: "/dashboard/reports", labelKey: "reports", icon: BarChart3 },
  { href: "/dashboard/changelog", labelKey: "changelog", icon: Clock },
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
  const router = useRouter();
  const { user } = useAuth();
  const { setUser } = useAuth();
  const { setOpen, isMobile, setOpenMobile } = useSidebar();
  const { side, isOpen } = useSidebarMotion();
  const { mutate: logout } = useLogout();
  const { data: projectsData } = useAllProjects();
  const { selectedProjectId, setSelectedProjectId, clearSelectedProject } = useSelectedProject();

  const projects = projectsData?.data?.items ?? [];

  // Set default to first project if no selection exists
  React.useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId, setSelectedProjectId]);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const closeSidebar = () => {
    if (isMobile) {
      setOpenMobile(false);
      return;
    }
    setOpen(false);
  };

  const handleLogout = () => {
    clearSelectedProject();
    logout(undefined, {
      onSuccess: () => {
        setUser(null);
        router.push("/login");
      },
    });
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
          {projects.length > 0 && selectedProject ? (
            <Select value={selectedProjectId || ""} onValueChange={setSelectedProjectId}>
              <SelectTrigger className="h-auto! w-full items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 hover:border-neutral-300 transition-colors">
                <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
                  <p className="truncate text-sm font-semibold text-secondary-500">
                    {selectedProject.name}
                  </p>
                  <p className="truncate text-xs text-secondary-300" dir="ltr">
                    {selectedProject.domain}
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
                    <div className="flex min-w-0 flex-col items-start gap-0.5">
                      <p className="truncate text-sm font-medium text-secondary-500">
                        {project.name}
                      </p>
                      <p className="truncate text-xs text-secondary-300" dir="ltr">
                        {project.domain}
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
          {NAV_ITEMS.map(({ href, labelKey, icon: Icon }) => {
            const isActive =
              href === "/dashboard/overview" ? pathname === "/dashboard/overview" : pathname.startsWith(href);

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
          <div className="border-t border-neutral-200 pt-5">
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
                  {user?.plan || t("userPlan")}
                </p>
              </div>
            </div>
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
