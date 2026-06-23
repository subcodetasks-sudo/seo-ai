import { setRequestLocale } from "next-intl/server";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { DashboardContent } from "./dashboard-content";
import { allProjectsQueryOptions } from "@/features/home";
import { AddProjectProvider } from "@/features/home/components/add-project/add-project-provider";

type DashboardPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(allProjectsQueryOptions());

  return (
    <AddProjectProvider>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DashboardContent />
      </HydrationBoundary>
    </AddProjectProvider>
  );
}
