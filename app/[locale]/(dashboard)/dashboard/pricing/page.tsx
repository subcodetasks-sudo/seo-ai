import { Suspense } from "react";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { setRequestLocale } from "next-intl/server";

import { DashboardPricingContent } from "@/features/plans";
import { pricingQueryOptions } from "@/features/landing/queries/queries";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPricingPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(pricingQueryOptions(locale));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <div className="grid place-items-center py-24">
            <div className="size-8 animate-spin rounded-full border-4 border-neutral-200 border-t-primary-300" />
          </div>
        }
      >
        <DashboardPricingContent />
      </Suspense>
    </HydrationBoundary>
  );
}
