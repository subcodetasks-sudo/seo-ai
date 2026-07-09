'use client';
import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { useRouter } from '@/i18n/navigation';
import { storeCallbackUrlCookie } from '@/lib/callback-url';
import { PricingFeatureList } from './pricing-feature-list';

export interface Plan {
  id: string;
  name: string;
  description: string;
  monthly: string;
  // annual: string;
  features: string[];
  action: string;
  barClass: string;
  button_text?: string;
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

export function PricingCards({ plans, eyebrow, title, subtitle }: Props) {
  const t = useTranslations('landing');
  const locale = useLocale();
  const router = useRouter();
  const direction = locale === 'ar' ? 'rtl' : 'ltr';
  // const [isAnnual, setIsAnnual] = useState(false);

  const defaultIndex = Math.min(1, plans.length - 1);
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(defaultIndex);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

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
          <h2 className='text-3xl font-extrabold leading-[1.25] text-ink sm:text-4xl lg:text-[2.7rem]'>
            {title ? parse(title) : t('pricing.defaultTitle')}
          </h2>
          <div className='mt-4 text-lg text-ink-soft'>
            {subtitle ? parse(subtitle) : t('pricing.subtitle')}
          </div>

          <div className='pricing-toggle-wrap mt-7 inline-flex items-center justify-center'>
            {/* <span className={`text-base font-extrabold ${isAnnual ? 'text-neutral-400' : 'text-ink'}`}>
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
            </button> */}
            {/* <span className={`annual-label inline-flex items-center gap-3 text-base font-bold text-neutral-400`}>
              <span>{t('pricing.yearly')}</span>
              <span className='discount-badge rounded-full bg-primary/15 px-2.5 py-1 text-xs font-bold text-primary-700'>
                {t('pricing.saveBadge')}
              </span>
            </span> */}
          </div>

          <p className='mt-4 text-sm font-bold text-neutral-400'>
            {t('pricing.clickHint')}
          </p>
        </div>

        <Carousel
          opts={{ align: 'center', startIndex: defaultIndex, containScroll: false, direction }}
          setApi={setApi}
          className='pricing-slider mt-10'
        >
          <CarouselContent className='-ml-6 items-stretch py-4'>
            {plans.map((plan, index) => {
              const isActive = index === selected;
              const barClass = plan.barClass || PLAN_BAR_CLASSES[index % PLAN_BAR_CLASSES.length];
              const select = () => {
                setSelected(index);
                api?.scrollTo(index);
                storeCallbackUrlCookie('/dashboard/settings?tab=billing');
                router.push('/dashboard/settings?tab=billing');
              };

              return (
                <CarouselItem key={plan.id} className='basis-full pl-6 sm:basis-1/2 lg:basis-1/3'>
                  <div
                    className={`relative flex h-full flex-col transition-all duration-300 ${isActive ? '' : 'md:translate-y-5'}`}
                  >
                    <article
                      role='button'
                      tabIndex={0}
                      aria-pressed={isActive}
                      onClick={select}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          select();
                        }
                      }}
                      className={`pricing-card-v2 group relative flex flex-1 flex-col overflow-hidden text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                        isActive
                          ? 'pricing-card-v2-featured cursor-pointer p-8 shadow-[0_30px_70px_-25px_rgba(20,33,10,0.35)] ring-1 ring-ink/10 lg:p-10'
                          : 'cursor-pointer bg-white p-7 hover:-translate-y-1 hover:shadow-xl'
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`absolute inset-x-0 top-0 h-1.5 bg-linear-to-r ${barClass}`}
                      ></span>

                      <div className='pricing-card-v2__head'>
                        <h3 className='text-2xl font-extrabold text-ink'>{parse(plan.name)}</h3>
                        {plan.description && (
                          <div className={`mt-1 text-base font-semibold ${isActive ? 'text-primary-900/65' : 'text-neutral-400'}`}>
                            {parse(plan.description)}
                          </div>
                        )}
                      </div>

                      <div className='mt-9 flex items-end justify-center gap-2 text-center' dir='rtl'>
                        <span className={`${isActive ? 'text-[4.8rem]' : 'text-[3.6rem]'} font-black leading-none text-ink`}>
                          {plan.monthly}
                        </span>
                        <span className={`mb-3 text-2xl font-extrabold ${isActive ? 'text-primary-900/55' : 'text-neutral-400'}`}>
                          {t('pricing.currency')}{' '}
                          <span>{t('pricing.perMonth')}</span>
                        </span>
                      </div>

                      <span className={`btn mt-9 w-full transition-transform duration-200 group-hover:scale-[1.02] ${isActive ? 'pricing-main-cta-featured py-5 text-xl' : 'btn-ghost py-4 text-lg'}`}>
                        {plan.action}
                        {/* {t('pricing.subscribeBtn')} */}
                      </span>

                      <PricingFeatureList
                        planName={plan.name}
                        features={plan.features}
                        isActive={isActive}
                        barClass={barClass}
                      />
                    </article>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {plans.length > 1 && (
            <>
              <CarouselPrevious className='left-0 lg:-left-20 size-10' />
              <CarouselNext className='right-0 lg:-right-20 size-10' />
            </>
          )}
        </Carousel>
      </div>
    </section>
  );
}
