'use client';

import parse from 'html-react-parser';
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
import { useAuth } from '@/features/auth/context/auth-context';
import { useStartPlanPayment } from '@/features/plans/hooks/use-start-plan-payment';
import {
  enrichPlansWithBillingNames,
  getStablePlanId,
} from '@/features/plans/services/landing-plans';
import {
  billingPlansQueryOptions,
  currentBillingQueryOptions,
} from '@/features/settings/queries/queries';
import { withCallbackUrl } from '@/lib/callback-url';
import { useRouter } from '@/i18n/navigation';

import { PricingPlanCard } from './pricing-plan-card';

export interface Plan {
  id: string;
  name: string;
  description: string;
  monthly: string;
  features: string[];
  action: string;
  barClass: string;
  button_text?: string;
  billingPlanName?: string;
}

interface Props {
  plans: Plan[];
  eyebrow: string;
  title: string;
  subtitle: string;
}

const PLAN_BAR_CLASSES = [
  'from-[#caa24a] via-[#5d7a2c] to-[#14210a]',
  'from-[#9ed25a] to-[#3f6e1f]',
  'from-[#dbe7c8] to-[#a9c787]',
];

const AUTOPLAY_MS = 4500;
const MIN_LOOP_SLIDES = 6;

export function PricingCards({ plans, eyebrow, title, subtitle }: Props) {
  const t = useTranslations('landing');
  const locale = useLocale();
  const router = useRouter();
  const { user } = useAuth();
  const direction = locale === 'ar' ? 'rtl' : 'ltr';
  const isAuthenticated = !!user;

  const { data: plansData } = useQuery({
    ...billingPlansQueryOptions(),
    enabled: isAuthenticated,
  });
  const { data: billingData } = useQuery({
    ...currentBillingQueryOptions(),
    enabled: isAuthenticated,
  });

  const billingPlans = plansData?.data.plans ?? [];
  const currentBilling = billingData?.data;
  const { startPayment, isPending } = useStartPlanPayment();
  const [busyPlanId, setBusyPlanId] = useState<string | null>(null);

  const enrichedPlans = useMemo(
    () => enrichPlansWithBillingNames(plans, billingPlans),
    [plans, billingPlans],
  );

  const loopPlans = useMemo(() => {
    if (enrichedPlans.length === 0) return [];
    if (enrichedPlans.length >= MIN_LOOP_SLIDES) return enrichedPlans;
    const copies = Math.ceil(MIN_LOOP_SLIDES / enrichedPlans.length);
    return Array.from({ length: copies }, (_, copy) =>
      enrichedPlans.map((plan, index) => ({
        ...plan,
        id: `${plan.id}-loop-${copy}`,
        barClass: plan.barClass || PLAN_BAR_CLASSES[index % PLAN_BAR_CLASSES.length],
      })),
    ).flat();
  }, [enrichedPlans]);

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

  function handleSubscribe(plan: Plan) {
    const planId = getStablePlanId(plan.id);
    const pricingPath = `/dashboard/pricing?planId=${encodeURIComponent(planId)}`;

    if (isAuthenticated) {
      if (plan.billingPlanName) {
        setBusyPlanId(planId);
        startPayment({
          billingPlanName: plan.billingPlanName,
          currentBilling,
          onStarted: () => setBusyPlanId(planId),
        });
        return;
      }
      // Billing names not ready yet — complete payment on the pricing page.
      router.push(pricingPath);
      return;
    }

    router.push(withCallbackUrl('/login', pricingPath));
  }

  if (!plans.length) return null;

  return (
    <section
      id='pricing'
      className='pricing-section bg-pattern relative overflow-hidden py-16 lg:py-24'
    >
      <div className='glow pricing-glow h-[560px] w-[560px] -bottom-40 left-1/2 opacity-60'></div>

      <div className='layer-content mx-auto max-w-7xl px-5 lg:px-8'>
        <div className='mx-auto max-w-2xl text-center' data-anim='fade-up'>
          <div className='eyebrow mb-5'>{parse(eyebrow) ?? t('pricing.eyebrow')}</div>
          <h2 className='text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-[2.7rem]'>
            {title ? parse(title) : t('pricing.defaultTitle')}
          </h2>
          <div className='mt-4 text-lg text-ink-soft'>
            {subtitle ? parse(subtitle) : t('pricing.subtitle')}
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
