'use client';

import parse from 'html-react-parser';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import type { BillingPeriod, PricingDisplayPlan } from '@/features/plans/services/public-plan-display';
import {
  formatPlanPrice,
  isCustomPricing,
  priceForPeriod,
  shouldShowDiscount,
} from '@/features/plans/services/public-plan-display';

import { PricingFeatureList } from './pricing-feature-list';

type PricingPlanCardProps = {
  plan: PricingDisplayPlan;
  billingPeriod: BillingPeriod;
  isFeatured: boolean;
  /** Whole-card click (e.g. carousel focus). */
  onSelect?: () => void;
  /** Subscribe CTA click — payment / auth / contact flow. */
  onSubscribe?: () => void;
  badge?: string;
  statusLabel?: string;
  statusTone?: 'active' | 'pending' | 'canceled' | 'past_due' | 'neutral';
  isBusy?: boolean;
  className?: string;
  /** Override CTA label (e.g. current plan). */
  actionLabel?: string;
};

const STATUS_CLASS: Record<NonNullable<PricingPlanCardProps['statusTone']>, string> = {
  active: 'bg-ink/10 text-ink',
  pending: 'bg-amber-100 text-amber-900',
  canceled: 'bg-red-100 text-red-800',
  past_due: 'bg-orange-100 text-orange-900',
  neutral: 'bg-neutral-100 text-neutral-600',
};

function highlightParenthetical(html: string) {
  return html.replace(
    /\(([^()]*)\)/g,
    '<span class="font-semibold text-black underline">($1)</span>',
  );
}

export function PricingPlanCard({
  plan,
  billingPeriod,
  isFeatured,
  onSelect,
  onSubscribe,
  badge,
  statusLabel,
  statusTone = 'neutral',
  isBusy = false,
  className,
  actionLabel,
}: PricingPlanCardProps) {
  const t = useTranslations('landing');
  const tPlans = useTranslations('plans');
  const custom = isCustomPricing(plan, billingPeriod);
  const amount = priceForPeriod(plan, billingPeriod);
  const priceLabel = custom
    ? tPlans('customPricing')
    : amount === 0
      ? tPlans('free')
      : formatPlanPrice(amount);
  const showDiscount = shouldShowDiscount(plan, billingPeriod);
  const cta =
    actionLabel ??
    (custom ? tPlans('contactUs') : plan.priceMonthly === 0 && billingPeriod === 'month'
      ? t('pricing.subscribeBtn')
      : t('pricing.subscribeBtn'));

  function discountLabel(): string | null {
    if (!showDiscount || plan.discountValue == null) return null;
    if (plan.discountType === 'percent') {
      return tPlans('discountPercent', { value: plan.discountValue });
    }
    if (plan.discountType === 'fixed') {
      return tPlans('discountFixed', { value: plan.discountValue });
    }
    return null;
  }

  const discount = discountLabel();

  function handleCardActivate() {
    onSelect?.();
  }

  return (
    <article
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      aria-pressed={onSelect ? isFeatured : undefined}
      onClick={onSelect ? handleCardActivate : undefined}
      onKeyDown={
        onSelect
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleCardActivate();
              }
            }
          : undefined
      }
      className={cn(
        'pricing-card-v2 group relative flex h-full flex-1 flex-col overflow-hidden text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        isFeatured
          ? 'pricing-card-v2-featured p-6 sm:p-8 lg:p-10'
          : 'bg-white p-6 sm:p-7',
        onSelect || onSubscribe ? 'cursor-pointer' : 'cursor-default',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn('absolute inset-x-0 top-0 h-1.5 bg-linear-to-r', plan.barClass)}
      />

      <div className='absolute inset-e-3 top-3 z-10 flex flex-col items-end gap-1 sm:inset-e-4 sm:top-4'>
        {badge ? (
          <span className='rounded-full bg-ink/10 px-3 py-1 text-xs font-bold text-ink'>
            {badge}
          </span>
        ) : null}
        {discount ? (
          <span className='rounded-full bg-primary-100 px-3 py-1 text-xs font-bold text-primary-800'>
            {discount}
          </span>
        ) : null}
        {statusLabel ? (
          <span
            className={cn(
              'rounded-full px-3 py-1 text-xs font-bold capitalize',
              STATUS_CLASS[statusTone],
            )}
          >
            {statusLabel}
          </span>
        ) : null}
      </div>

      <div className='pricing-card-v2__head'>
        <h3 className='text-xl font-extrabold text-ink sm:text-2xl'>{parse(plan.name)}</h3>
        {plan.description ? (
          <div
            className={cn(
              'mt-1 text-sm font-semibold sm:text-base',
              isFeatured ? 'text-primary-900/65' : 'text-neutral-400',
            )}
          >
            {parse(highlightParenthetical(plan.description))}
          </div>
        ) : null}
      </div>

      <div className='mt-6 flex items-end justify-center gap-2 text-center sm:mt-9'>
        <span
          className={cn(
            'font-black leading-none text-ink',
            isFeatured
              ? 'text-[2.85rem] sm:text-[3rem] lg:text-[4.3rem]'
              : 'text-[2.4rem] sm:text-[2.9rem] lg:text-[3.25rem]',
            custom && 'text-[1.75rem] sm:text-[2rem] lg:text-[2.25rem]',
          )}
        >
          {priceLabel}
        </span>
        {!custom && amount !== 0 ? (
          <span
            className={cn(
              'mb-2 text-lg font-extrabold sm:mb-3 sm:text-2xl',
              isFeatured ? 'text-primary-900/55' : 'text-neutral-400',
            )}
          >
            {t('pricing.currency')}{' '}
            <span>
              {billingPeriod === 'year' ? t('pricing.perYear') : t('pricing.perMonth')}
            </span>
          </span>
        ) : null}
      </div>

      <button
        type='button'
        disabled={isBusy}
        onClick={(event) => {
          event.stopPropagation();
          onSubscribe?.();
        }}
        className={cn(
          'btn mt-8 w-full transition-transform duration-200 sm:mt-12',
          !isBusy && 'group-hover:scale-[1.02]',
          isFeatured
            ? 'pricing-main-cta-featured py-4 text-lg sm:py-5 sm:text-xl'
            : 'btn-ghost py-3.5 text-base sm:py-4 sm:text-lg',
          isBusy && 'pointer-events-none opacity-70',
        )}
      >
        {isBusy ? t('pricing.processing') : cta}
      </button>

      <PricingFeatureList
        planName={plan.name}
        features={plan.features}
        isActive={isFeatured}
        barClass={plan.barClass}
      />
    </article>
  );
}
