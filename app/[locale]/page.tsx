import "../landing.css";
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

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
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
  );
}
