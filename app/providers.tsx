"use client";

import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

import { Toaster } from "@/components/ui/sonner";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Prevent immediate re-fetch right after hydration.
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position="bottom-center" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
