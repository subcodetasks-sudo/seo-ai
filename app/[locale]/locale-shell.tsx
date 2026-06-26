"use client";

import type { ReactNode } from "react";

import { Header } from "@/components/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import SideBar from "@/features/auth/components/SideBar";
import { FcmInitializer } from "@/features/notifications";
import { usePathname } from "@/i18n/navigation";

const SHELL_EXCLUDED_PREFIXES = [
  "/login",
  "/register",
  "/reset-password",
  "/plans",
];

function shouldShowShell(pathname: string) {
  return !SHELL_EXCLUDED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

type LocaleShellProps = {
  children: ReactNode;
};

export function LocaleShell({ children }: LocaleShellProps) {
  const pathname = usePathname();

  if (!shouldShowShell(pathname)) {
    return children;
  }

  return (
    <>
      <FcmInitializer />
      <SidebarProvider defaultOpen className="overflow-x-hidden">
        <SideBar />
        <SidebarInset className="min-h-svh overflow-x-hidden">
          <Header />
          <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
