"use client";

import {
  isServer,
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { ThemeProvider } from "next-themes";

import { AuthProvider } from "@/features/auth/context/auth-context";
import { SelectedProjectProvider } from "@/features/home";
import { Toaster } from "@/components/ui/sonner";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Prevent immediate re-fetch right after hydration.
        staleTime: 60 * 1000,
      },
    },
    mutationCache: new MutationCache({
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : "Something went wrong");
      },
    }),
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
        <AuthProvider>
          <SelectedProjectProvider>
            {children}
            <Toaster position="bottom-center" />
          </SelectedProjectProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
