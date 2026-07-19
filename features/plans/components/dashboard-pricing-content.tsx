'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import { PricingPlanCard } from '@/features/landing/components/sections/pricing-plan-card';
import { pricingQueryOptions } from '@/features/landing/queries/queries';
import type { Pricing } from '@/features/landing/types/landing-api';
import { useStartPlanPayment } from '@/features/plans/hooks/use-start-plan-payment';
import {
  findPlanById,
  mapLandingPackagesToPlans,
} from '@/features/plans/services/landing-plans';
import { InvoiceHistoryCard } from '@/features/settings/components/invoice-history-card';
import {
  billingPlansQueryOptions,
  currentBillingQueryOptions,
} from '@/features/settings/queries/queries';
import { usePathname, useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

type StatusTone = 'active' | 'pending' | 'canceled' | 'past_due' | 'neutral';

function normalizeStatus(status: string | null | undefined): string | null {
  if (!status) return null;
  return status.toLowerCase().replace(/[\s-]+/g, '_');
}

function getStatusTone(status: string | null): StatusTone {
  switch (status) {
    case 'active':
      return 'active';
    case 'pending':
    case 'processing':
    case 'trialing':
      return 'pending';
    case 'canceled':
    case 'cancelled':
      return 'canceled';
    case 'past_due':
    case 'unpaid':
      return 'past_due';
    default:
      return 'neutral';
  }
}

function useSubscriptionStatusLabel(
  status: string | null,
  planName: string,
  tBilling: ReturnType<typeof useTranslations<'settings.billing'>>,
): string | undefined {
  if (status === 'active' || (!status && planName === 'free')) {
    return tBilling('subscriptionStatus.active');
  }
  if (!status) return undefined;

  const known = [
    'pending',
    'processing',
    'trialing',
    'canceled',
    'cancelled',
    'past_due',
    'unpaid',
  ] as const;

  if ((known as readonly string[]).includes(status)) {
    const key =
      status === 'cancelled'
        ? 'canceled'
        : status === 'processing' || status === 'trialing'
          ? 'pending'
          : status === 'unpaid'
            ? 'past_due'
            : status;
    return tBilling(`subscriptionStatus.${key}` as 'subscriptionStatus.pending');
  }

  return status;
}

export function DashboardPricingContent() {
  const t = useTranslations('plans');
  const tBilling = useTranslations('settings.billing');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const planIdParam = searchParams.get('planId');

  const { data: pricingRaw, isLoading: isPricingLoading } = useQuery(
    pricingQueryOptions(locale),
  );
  const { data: plansData, isLoading: isBillingPlansLoading } = useQuery(
    billingPlansQueryOptions(),
  );
  const { data: billingData, isLoading: isBillingLoading } = useQuery(
    currentBillingQueryOptions(),
  );

  const pricing = Array.isArray(pricingRaw)
    ? (pricingRaw as Pricing[])[0]
    : (pricingRaw as Pricing | undefined);
  const billingPlans = plansData?.data.plans ?? [];
  const currentBilling = billingData?.data;
  const currentPlanName = currentBilling?.plan_name?.toLowerCase() ?? '';
  const subscriptionStatus = normalizeStatus(currentBilling?.subscription_status);
  const activeTone = getStatusTone(
    subscriptionStatus ?? (currentPlanName === 'free' ? 'active' : null),
  );
  const statusLabel = useSubscriptionStatusLabel(
    subscriptionStatus,
    currentPlanName,
    tBilling,
  );

  const displayPlans = useMemo(
    () => mapLandingPackagesToPlans(pricing?.packages?.items, billingPlans),
    [pricing?.packages?.items, billingPlans],
  );

  const { startPayment, isPending } = useStartPlanPayment();
  const [busyPlanId, setBusyPlanId] = useState<string | null>(null);
  const autoStartedRef = useRef(false);

  const isLoading = isPricingLoading || isBillingPlansLoading || isBillingLoading;

  function clearPlanIdFromUrl() {
    if (!planIdParam) return;
    router.replace(pathname);
  }

  function beginPayment(billingPlanName: string | undefined, displayId: string) {
    if (!billingPlanName) return;
    setBusyPlanId(displayId);
    startPayment({
      billingPlanName,
      currentBilling,
      onStarted: () => setBusyPlanId(displayId),
    });
  }

  useEffect(() => {
    if (autoStartedRef.current || isLoading) return;
    if (!planIdParam) return;

    const plan = findPlanById(displayPlans, planIdParam);
    if (!plan?.billingPlanName) return;

    autoStartedRef.current = true;
    clearPlanIdFromUrl();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    beginPayment(plan.billingPlanName, plan.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, planIdParam, displayPlans, currentBilling]);

  if (isLoading) {
    return (
      <div className='flex flex-col gap-8 pb-10'>
        <div className='flex flex-col items-center gap-3 text-center'>
          <h1 className='text-h1 font-medium text-secondary-500'>{t('title')}</h1>
          <p className='max-w-2xl text-label-md leading-6 text-neutral-500'>{t('subtitle')}</p>
        </div>
        <div className='grid place-items-center py-16'>
          <div className='size-8 animate-spin rounded-full border-4 border-neutral-200 border-t-primary-300' />
        </div>
      </div>
    );
  }

  return (
    <div className='pricing-scope flex flex-col gap-8 pb-10 sm:gap-10'>
      <div className='flex flex-col items-center gap-3 px-1 text-center'>
        <h1 className='text-h2 font-medium text-secondary-500 sm:text-h1'>{t('title')}</h1>
        <p className='max-w-2xl text-label-md leading-6 text-neutral-500'>{t('subtitle')}</p>
        {currentBilling ? (
          <p className='text-sm font-semibold text-neutral-500'>
            {tBilling('currentPlan')}:{' '}
            <span className='capitalize text-secondary-500'>{currentBilling.plan_name}</span>
            {statusLabel ? (
              <span
                className={cn(
                  'ms-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold',
                  activeTone === 'active' && 'bg-primary-50 text-primary-700',
                  activeTone === 'pending' && 'bg-amber-100 text-amber-900',
                  activeTone === 'canceled' && 'bg-red-100 text-red-800',
                  activeTone === 'past_due' && 'bg-orange-100 text-orange-900',
                  activeTone === 'neutral' && 'bg-neutral-100 text-neutral-600',
                )}
              >
                {statusLabel}
              </span>
            ) : null}
          </p>
        ) : null}
      </div>

      {displayPlans.length > 0 ? (
        <div className='mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-1 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7 lg:px-2 lg:py-4'>
          {displayPlans.map((plan) => {
            const isActive =
              !!plan.billingPlanName &&
              plan.billingPlanName.toLowerCase() === currentPlanName;

            return (
              <div key={plan.id} className='relative flex min-h-0 flex-col'>
                <PricingPlanCard
                  plan={{
                    ...plan,
                    action: isActive ? tBilling('currentPlan') : plan.action,
                  }}
                  isFeatured={isActive}
                  badge={isActive ? tBilling('active') : undefined}
                  statusLabel={isActive ? statusLabel : undefined}
                  statusTone={isActive ? activeTone : 'neutral'}
                  isBusy={isPending && busyPlanId === plan.id}
                  onSubscribe={() => {
                    if (isActive) return;
                    beginPayment(plan.billingPlanName, plan.id);
                  }}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <p className='py-10 text-center text-label-md text-neutral-500'>{t('empty')}</p>
      )}

      <div className='mx-auto w-full max-w-6xl px-1'>
        <h2 className='mb-4 text-label-lg font-semibold text-secondary-500'>
          {tBilling('paymentStatuses')}
        </h2>
        <InvoiceHistoryCard />
      </div>
    </div>
  );
}
