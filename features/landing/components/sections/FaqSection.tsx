"use client"
import parse from 'html-react-parser';
import { useLocale, useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { faqsQueryOptions } from '../../queries/queries';
import { Faq } from '../../types/landing-api';

export function FaqSection() {
  const t = useTranslations('landing');
  const local = useLocale();
  const { data: faqsArr } = useQuery(faqsQueryOptions(local));



  const faqs: Faq | null= faqsArr?.[0] ?? null;
  const items = faqsArr?.[0]?.items ?? [];
  const stats = faqsArr?.[0]?.statistics;
  return (
    <section id='faq' className='bg-pattern relative overflow-hidden py-14 lg:py-20'>
      <div className='glow w-[420px] h-[420px] bottom-0 left-1/4 opacity-45'></div>

      <div className='layer-content mx-auto max-w-7xl px-5 lg:px-8'>
        <div className='text-center mb-10' data-anim='fade-up'>
          <div className='eyebrow mb-5'>{t('faq.eyebrow')}</div>
          <h2 className='text-3xl sm:text-4xl lg:text-[2.7rem] font-extrabold leading-[1.25] text-ink'>
            {faqs?.title ? parse(faqs?.title) : t('faq.title')}
          </h2>
        </div>

        <div className='grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 items-center' dir='ltr'>
          <div className='faq-visual surface pattern-card relative overflow-hidden p-5 sm:p-6 order-2 lg:order-1' data-anim='fade-up' dir='rtl'>
            <div className='faq-browser rounded-[1.25rem] border border-primary-line bg-white p-5 shadow-[0_28px_70px_-45px_rgba(19,26,20,0.5)]'>
              <div className='flex items-center justify-between text-sm font-bold text-neutral-400'>
                <span>{t('faq.helpCenter')}</span>
                <div className='flex gap-2'>
                  <span className='h-3 w-3 rounded-full bg-[#ff5f57]'></span>
                  <span className='h-3 w-3 rounded-full bg-[#ffbd2e]'></span>
                  <span className='h-3 w-3 rounded-full bg-primary'></span>
                </div>
              </div>

              <div className='mt-8 space-y-4'>
                <div className='mr-auto max-w-[78%] rounded-2xl border border-primary-line bg-primary-surface px-4 py-3 text-sm text-ink-soft'>
                  {t('faq.sampleQuestion')}
                </div>
                <div className='flex items-start gap-3'>
                  <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-lg font-extrabold text-primary-700'>
                    +
                  </span>
                  <div className='rounded-2xl border border-primary/25 bg-white px-4 py-3 text-sm leading-relaxed text-ink-soft shadow-[0_18px_40px_-30px_rgba(160,205,57,0.55)]'>
                    {t('faq.sampleAnswer')}
                  </div>
                </div>
              </div>

              <div className='mt-7 grid grid-cols-2 gap-3'>
                {stats?.items?.slice(0, 2).map((item, i) => (
                  <div key={i} className='rounded-2xl border border-primary-line bg-white p-4 text-center'>
                    <div className='text-2xl font-extrabold text-primary-700'>{item.number}</div>
                    <div className='mt-1 text-xs font-bold text-neutral-400'>{item.label}</div>
                  </div>
                )) ?? (
                    <>
                      <div className='rounded-2xl border border-primary-line bg-white p-4 text-center'>
                        <div className='text-2xl font-extrabold text-primary-700'>24/7</div>
                        <div className='mt-1 text-xs font-bold text-neutral-400'>{t('faq.support247')}</div>
                      </div>
                      <div className='rounded-2xl border border-primary-line bg-white p-4 text-center'>
                        <div className='text-2xl font-extrabold text-ink'>{t('faq.avgResponse')}</div>
                        <div className='mt-1 text-xs font-bold text-neutral-400'>{t('faq.avgResponseLabel')}</div>
                      </div>
                    </>
                  )}
              </div>
            </div>
          </div>

          <div className='space-y-4 order-1 lg:order-2' id='faq-list' dir='rtl'>
            {items.map((faq, i) => (
              <div className='faq-item surface pattern-card overflow-hidden' data-anim='fade-up' key={i}>
                <button className='faq-head w-full flex items-center gap-4 text-right px-6 py-5'>
                  <span className='text-lg font-extrabold text-ink flex-1'>{faq.question}</span>
                  <span className='faq-icon w-9 h-9 shrink-0 rounded-full bg-primary-surface text-primary-700 flex items-center justify-center text-xl font-bold'>
                    +
                  </span>
                </button>
                <div className='faq-body'>
                  <div
                    className='px-6 pb-6 text-ink-soft leading-relaxed'
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
