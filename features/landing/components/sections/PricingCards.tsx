'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { useFadeUpReveal } from '@/components/motion/scroll-reveal';
import { useAuth } from '@/features/auth/context/auth-context';
import { useStartPlanPayment } from '@/features/plans/hooks/use-start-plan-payment';
import { getStablePlanId } from '@/features/plans/services/landing-plans';
import type {
  BillingPeriod,
  PricingDisplayPlan,
} from '@/features/plans/services/public-plan-display';
import { isCustomPricing, priceForPeriod } from '@/features/plans/services/public-plan-display';
import { currentBillingQueryOptions } from '@/features/settings/queries/queries';
import { withCallbackUrl } from '@/lib/callback-url';
import { useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

import { PricingPlanCard } from './pricing-plan-card';

interface Props {
  plans: PricingDisplayPlan[];
}

const PLAN_BAR_CLASSES = [
  'from-[#caa24a] via-[#5d7a2c] to-[#14210a]',
  'from-[#9ed25a] to-[#3f6e1f]',
  'from-[#dbe7c8] to-[#a9c787]',
];

const AUTOPLAY_MS = 4500;
const MIN_LOOP_SLIDES = 6;

export function PricingCards({ plans }: Props) {
  const t = useTranslations('landing');
  const tPlans = useTranslations('plans');
  const locale = useLocale();
  const router = useRouter();
  const { user } = useAuth();
  const direction = locale === 'ar' ? 'rtl' : 'ltr';
  const isAuthenticated = !!user;
  const fadeUpRef = useFadeUpReveal<HTMLDivElement>();
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('month');

  const { data: billingData } = useQuery({
    ...currentBillingQueryOptions(),
    enabled: isAuthenticated,
  });

  const currentBilling = billingData?.data;
  const { startPayment, isPending } = useStartPlanPayment();
  const [busyPlanId, setBusyPlanId] = useState<string | null>(null);

  const loopPlans = useMemo(() => {
    if (plans.length === 0) return [];
    if (plans.length >= MIN_LOOP_SLIDES) return plans;
    const copies = Math.ceil(MIN_LOOP_SLIDES / plans.length);
    return Array.from({ length: copies }, (_, copy) =>
      plans.map((plan, index) => ({
        ...plan,
        id: `${plan.id}-loop-${copy}`,
        barClass: plan.barClass || PLAN_BAR_CLASSES[index % PLAN_BAR_CLASSES.length],
      })),
    ).flat();
  }, [plans]);

  const defaultIndex = Math.min(1, Math.max(0, loopPlans.length - 1));
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(defaultIndex);
  const isPausedRef = useRef(false);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    onSelect();
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || loopPlans.length < 2) return;

    const timer = setInterval(() => {
      if (isPausedRef.current) return;
      api.scrollNext();
    }, AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, [api, loopPlans.length]);

  function handleSubscribe(plan: PricingDisplayPlan) {
    const planId = getStablePlanId(plan.id);
    const pricingPath = `/dashboard/pricing?planId=${encodeURIComponent(plan.billingPlanName || planId)}`;

    if (isCustomPricing(plan, billingPeriod)) {
      const footer = document.getElementById('landing-footer');
      footer?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (isAuthenticated) {
      setBusyPlanId(planId);
      startPayment({
        billingPlanName: plan.billingPlanName,
        currentBilling,
        isFree: priceForPeriod(plan, billingPeriod) === 0,
        onStarted: () => setBusyPlanId(planId),
      });
      return;
    }

    router.push(withCallbackUrl('/login', pricingPath));
  }

  if (!plans.length) {
    return (
      <section
        id='pricing'
        className='pricing-section bg-pattern relative overflow-hidden py-16 lg:py-24'
      >
        <div className='layer-content mx-auto max-w-7xl px-5 text-center lg:px-8'>
          <div className='eyebrow mb-5'>{t('pricing.eyebrow')}</div>
          <h2 className='text-3xl font-extrabold text-ink sm:text-4xl'>
            {t('pricing.defaultTitle')}
          </h2>
          <p className='mt-4 text-lg text-ink-soft'>{tPlans('comingSoon')}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id='pricing'
      className='pricing-section bg-pattern relative overflow-hidden py-16 lg:py-24'
    >
      <div className='glow pricing-glow h-[560px] w-[560px] -bottom-40 left-1/2 opacity-60'></div>

      <div className='layer-content mx-auto max-w-7xl px-5 lg:px-8'>
        <div className='mx-auto max-w-2xl text-center' data-anim='fade-up' ref={fadeUpRef}>
          <div className='eyebrow mb-5'>{t('pricing.eyebrow')}</div>
          <h2 className='text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-[2.7rem]'>
            {t('pricing.defaultTitle')}
          </h2>
          <div className='mt-4 text-lg text-ink-soft'>{t('pricing.subtitle')}</div>

          <div className='mt-8 inline-flex rounded-full bg-white/80 p-1 shadow-sm ring-1 ring-black/5'>
            <button
              type='button'
              onClick={() => setBillingPeriod('month')}
              className={cn(
                'rounded-full px-5 py-2 text-sm font-bold transition-colors',
                billingPeriod === 'month'
                  ? 'bg-ink text-white'
                  : 'text-neutral-500 hover:text-ink',
              )}
            >
              {t('pricing.monthly')}
            </button>
            <button
              type='button'
              onClick={() => setBillingPeriod('year')}
              className={cn(
                'rounded-full px-5 py-2 text-sm font-bold transition-colors',
                billingPeriod === 'year'
                  ? 'bg-ink text-white'
                  : 'text-neutral-500 hover:text-ink',
              )}
            >
              {t('pricing.yearly')}
            </button>
          </div>

          <p className='mt-7 text-sm font-bold text-neutral-400'>{t('pricing.clickHint')}</p>
        </div>

        <div
          onMouseEnter={() => {
            isPausedRef.current = true;
          }}
          onMouseLeave={() => {
            isPausedRef.current = false;
          }}
          onFocusCapture={() => {
            isPausedRef.current = true;
          }}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              isPausedRef.current = false;
            }
          }}
        >
          <Carousel
            opts={{
              align: 'center',
              startIndex: defaultIndex,
              containScroll: false,
              direction,
              loop: true,
            }}
            setApi={setApi}
            className='pricing-slider mt-10'
          >
            <CarouselContent className='-ml-6 items-stretch py-4'>
              {loopPlans.map((plan, index) => {
                const isActive = index === selected;
                const stableId = getStablePlanId(plan.id);

                return (
                  <CarouselItem
                    key={plan.id}
                    className='basis-full pl-6 sm:basis-1/2 lg:basis-1/3'
                  >
                    <div
                      className={`relative flex h-full flex-col transition-all duration-300 ${
                        isActive ? '' : 'md:translate-y-5'
                      }`}
                    >
                      <PricingPlanCard
                        plan={plan}
                        billingPeriod={billingPeriod}
                        isFeatured={isActive}
                        isBusy={isPending && busyPlanId === stableId}
                        onSelect={() => {
                          setSelected(index);
                          api?.scrollTo(index);
                        }}
                        onSubscribe={() => handleSubscribe(plan)}
                      />
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            {loopPlans.length > 1 && (
              <>
                <CarouselPrevious className='left-0 size-10 lg:-left-20' />
                <CarouselNext className='right-0 size-10 lg:-right-20' />
              </>
            )}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
