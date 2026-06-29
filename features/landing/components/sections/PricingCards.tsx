'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export interface Plan {
  id: string;
  name: string;
  description: string;
  monthly: string;
  annual: string;
  features: string[];
  action: string;
  barClass: string;
}

interface Props {
  plans: Plan[];
  title: string;
}

export function PricingCards({ plans, title }: Props) {
  const t = useTranslations('landing');
  const [isAnnual, setIsAnnual] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(
    Math.min(1, plans.length - 1),
  );

  const featuredId = plans[featuredIndex]?.id ?? plans[0]?.id;

  const others = plans.filter((p) => p.id !== featuredId);
  const featured = plans.find((p) => p.id === featuredId) ?? plans[0];
  const ordered =
    others.length >= 2
      ? [others[0], featured, others[1]]
      : plans;

  const PLAN_BAR_CLASSES = [
    'from-[#caa24a] via-[#5d7a2c] to-[#14210a]',
    'from-[#9ed25a] to-[#3f6e1f]',
    'from-[#dbe7c8] to-[#a9c787]',
  ];

  return (
    <section
      id='pricing'
      className='pricing-section bg-pattern relative overflow-hidden py-16 lg:py-24'
    >
      <div className='glow pricing-glow h-[560px] w-[560px] -bottom-40 left-1/2 opacity-60'></div>

      <div className='layer-content mx-auto max-w-7xl px-5 lg:px-8'>
        <div className='mx-auto max-w-2xl text-center' data-anim='fade-up'>
          <div className='eyebrow mb-5'>{t('pricing.eyebrow')}</div>
          <h2 className='text-3xl font-extrabold leading-[1.25] text-ink sm:text-4xl lg:text-[2.7rem]'>
            {title}
          </h2>
          <p className='mt-4 text-lg text-ink-soft'>
            {t('pricing.subtitle')}
          </p>

          <div className='pricing-toggle-wrap mt-7 inline-flex items-center justify-center'>
            <span
              className={`text-base font-extrabold ${isAnnual ? 'text-neutral-400' : 'text-ink'}`}
            >
              {t('pricing.monthly')}
            </span>
            <button
              type='button'
              className={`toggle-track mx-2 ${isAnnual ? 'on' : ''}`}
              role='switch'
              aria-checked={isAnnual}
              onClick={() => setIsAnnual((v) => !v)}
            >
              <span className='toggle-thumb'></span>
            </button>
            <span
              className={`annual-label inline-flex items-center gap-3 text-base font-bold ${isAnnual ? 'text-ink' : 'text-neutral-400'}`}
            >
              <span>{t('pricing.yearly')}</span>
              <span className='discount-badge rounded-full bg-primary/15 px-2.5 py-1 text-xs font-bold text-primary-700'>
                {t('pricing.saveBadge')}
              </span>
            </span>
          </div>

          <p className='mt-4 text-sm font-bold text-neutral-400'>
            {t('pricing.clickHint')}
          </p>
        </div>

        <div className='pricing-grid mt-12 grid items-stretch gap-6 lg:grid-cols-[0.92fr_1.24fr_0.92fr] lg:gap-5'>
          {ordered.map((plan, slotIndex) => {
            const isFeatured = plan.id === featuredId;
            const planIndex = plans.findIndex((p) => p.id === plan.id);
            const barClass =
              plan.barClass || PLAN_BAR_CLASSES[slotIndex % PLAN_BAR_CLASSES.length];

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col transition-all duration-300 ${isFeatured ? 'lg:-translate-y-6 lg:scale-[1.02]' : ''}`}
                data-anim='fade-up'
              >
                {isFeatured && (
                  <div className='absolute -top-3.5 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-4 py-1.5 text-xs font-extrabold text-primary shadow-sm'>
                    {t('pricing.mostPopular')}
                  </div>
                )}
                <article
                  role='button'
                  tabIndex={0}
                  aria-pressed={isFeatured}
                  onClick={() => setFeaturedIndex(planIndex)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setFeaturedIndex(planIndex);
                    }
                  }}
                  className={`pricing-card-v2 group relative flex flex-1 flex-col overflow-hidden text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    isFeatured
                      ? 'pricing-card-v2-featured cursor-pointer p-8 shadow-[0_30px_70px_-25px_rgba(20,33,10,0.35)] ring-1 ring-ink/10 lg:p-10'
                      : 'cursor-pointer bg-white p-7 hover:-translate-y-1 hover:shadow-xl'
                  }`}
                >
                  <span
                    aria-hidden
                    className={`absolute inset-x-0 top-0 h-1.5 bg-linear-to-r ${barClass}`}
                  ></span>

                  <div className='pricing-card-v2__head'>
                    <h3
                      className={`text-2xl font-extrabold ${isFeatured ? 'text-ink' : 'text-ink'}`}
                    >
                      {plan.name}
                    </h3>
                    {plan.description && (
                      <p
                        className={`mt-1 text-base font-semibold ${isFeatured ? 'text-primary-900/65' : 'text-neutral-400'}`}
                      >
                        {plan.description}
                      </p>
                    )}
                  </div>

                  <div
                    className='mt-9 flex items-end justify-center gap-2 text-center'
                    dir='rtl'
                  >
                    <span
                      className={`${isFeatured ? 'text-[4.8rem]' : 'text-[3.6rem]'} font-black leading-none text-ink`}
                    >
                      {isAnnual ? plan.annual : plan.monthly}
                    </span>
                    <span
                      className={`mb-3 text-2xl font-extrabold ${isFeatured ? 'text-primary-900/55' : 'text-neutral-400'}`}
                    >
                      {t('pricing.currency')} <span>{isAnnual ? t('pricing.perYear') : t('pricing.perMonth')}</span>
                    </span>
                  </div>

                  <span
                    className={`btn mt-9 w-full transition-transform duration-200 group-hover:scale-[1.02] ${isFeatured ? 'pricing-main-cta-featured py-5 text-xl' : 'btn-ghost py-4 text-lg'}`}
                  >
                    {plan.action}
                  </span>

                  <ul
                    className={`mt-9 space-y-4 text-lg font-semibold leading-7 ${isFeatured ? 'text-ink/80' : 'text-ink-soft'}`}
                  >
                    {plan.features.map((feature, fi) => (
                      <li className='flex items-center gap-3' key={fi}>
                        <span className='check pricing-check'></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
