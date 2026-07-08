import "../../landing.css";
import { connection } from "next/server";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { getLocaleDirection } from "@/i18n/routing";
import { LandingHeader } from "@/features/landing/components/LandingHeader";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { PricingPolicySection } from "@/features/landing/components/sections/PricingPolicySection";
import { GsapAnimations } from "@/components/motion/GsapAnimations";
import { pricingQueryOptions, settingsQueryOptions } from "@/features/landing/queries/queries";

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await connection();
  const { locale } = await params;

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery(pricingQueryOptions(locale)),
    queryClient.prefetchQuery(settingsQueryOptions(locale)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div id="landing-root" dir={getLocaleDirection(locale)}>
        <LandingHeader />
        <main>
          <PricingPolicySection />
        </main>
        <LandingFooter />
        <GsapAnimations />
      </div>
    </HydrationBoundary>
  );
}
