import "../landing.css";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { getLocaleDirection } from "@/i18n/routing";
import { LandingHeader } from "@/features/landing/components/LandingHeader";
import { HeroSection } from "@/features/landing/components/sections/HeroSection";
import { TrustedSection } from "@/features/landing/components/sections/TrustedSection";
import { UseCasesSection } from "@/features/landing/components/sections/UseCasesSection";
import { AboutSection } from "@/features/landing/components/sections/AboutSection";
import { StatsSection } from "@/features/landing/components/sections/StatsSection";
import { PricingSection } from "@/features/landing/components/sections/PricingSection";
import { TestimonialsSection } from "@/features/landing/components/sections/TestimonialsSection";
import { FaqSection } from "@/features/landing/components/sections/FaqSection";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { GsapAnimations } from "@/components/motion/GsapAnimations";
import {
  heroQueryOptions,
  aboutUsQueryOptions,
  statisticsQueryOptions,
  toolUsageQueryOptions,
  pricingQueryOptions,
  testimonialsQueryOptions,
  faqsQueryOptions,
  settingsQueryOptions,
} from "@/features/landing/queries/queries";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery(heroQueryOptions(locale)),
    queryClient.prefetchQuery(aboutUsQueryOptions(locale)),
    queryClient.prefetchQuery(statisticsQueryOptions(locale)),
    queryClient.prefetchQuery(toolUsageQueryOptions(locale)),
    queryClient.prefetchQuery(pricingQueryOptions(locale)),
    queryClient.prefetchQuery(testimonialsQueryOptions(locale)),
    queryClient.prefetchQuery(faqsQueryOptions(locale)),
    queryClient.prefetchQuery(settingsQueryOptions(locale)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div id="landing-root" dir={getLocaleDirection(locale)}>
        <LandingHeader />
        <main>
          <HeroSection />
          <TrustedSection />
          <UseCasesSection />
          <AboutSection />
          <StatsSection />
          <PricingSection />
          <TestimonialsSection />
          <FaqSection />
        </main>
        <LandingFooter />
        <GsapAnimations />
      </div>
    </HydrationBoundary>
  );
}
