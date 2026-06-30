"use client"
import { useLocale, useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { aboutUsQueryOptions } from '../../queries/queries';
import parse from 'html-react-parser';

export function AboutSection() {
  const t = useTranslations('landing');
  const locale = useLocale();
  const { data: about } = useQuery(aboutUsQueryOptions(locale));
  const highlights = about?.highlights.items || [];
  return (
    <section
      id='about'
      className='bg-pattern relative overflow-hidden py-14 lg:py-20'
    >
      <div className='glow w-[440px] h-[440px] bottom-0 -right-32 opacity-50'></div>

      <div className='layer-content mx-auto max-w-7xl px-5 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
        <div data-anim='fade-up'>
          <div className='eyebrow mb-6'>{t('about.eyebrow')}</div>
          <h2 className='text-3xl sm:text-4xl lg:text-[2.7rem] font-extrabold leading-[1.25] text-ink'>
            {about?.title ? parse(about.title) : t('about.defaultTitle')}
          </h2>
          <div
            className='mt-5 text-lg text-ink-soft leading-relaxed'
          >
            {
              about?.description ? parse(about.description) : parse(t('about.defaultDesc'))
            }
          </div>
          <a
            href='#testimonials'
            className='btn btn-ghost px-7 py-4 mt-8 text-lg'
          >
            {t('about.cta')}
            <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
              <line x1='19' y1='12' x2='5' y2='12' />
              <polyline points='12 19 5 12 12 5' />
            </svg>
          </a>
        </div>

        <div className='relative' data-anim='zoom'>
          <div className='absolute inset-8 rounded-[2.5rem] bg-primary/10 blur-3xl'></div>
          <div className='surface pattern-card relative p-8 sm:p-10 text-center overflow-hidden'>
            <div
              className='swirl-watermark inset-0 bg-center'
              style={{ opacity: '0.06' }}
            ></div>
            <div className='relative'>
              <div className='mt-6 text-xl font-bold text-ink leading-relaxed'>
                {about?.highlights.title
                  ? parse(about?.highlights.title)
                  : t('about.defaultQuote')}
              </div>

              {highlights.length > 0 ? (
                <div className={`mt-8 grid gap-4 grid-cols-${Math.min(highlights.length, 3)}`}>
                  {highlights.slice(0, 3).map((item, i) => (
                    <div key={i} className='rounded-2xl bg-primary-surface border border-primary-line p-4'>
                      <div className='text-sm font-extrabold text-primary-700 leading-snug'>{parse(item.number)}</div>
                      <div className='text-[11px] font-bold text-neutral-400 mt-1 leading-relaxed'>{parse(item.text)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='mt-8 grid grid-cols-3 gap-4'>
                  <div className='rounded-2xl bg-primary-surface border border-primary-line p-4'>
                    <div className='text-2xl font-extrabold text-primary-700' data-counter data-target='2018' data-plain>0</div>
                    <div className='text-[11px] font-bold text-neutral-400 mt-1'>{t('about.foundedYear')}</div>
                  </div>
                  <div className='rounded-2xl bg-primary-surface border border-primary-line p-4'>
                    <div className='text-2xl font-extrabold text-primary-700'>
                      <span data-counter data-target='40'>0</span>+
                    </div>
                    <div className='text-[11px] font-bold text-neutral-400 mt-1'>{t('about.teamExperts')}</div>
                  </div>
                  <div className='rounded-2xl bg-primary-surface border border-primary-line p-4'>
                    <div className='text-2xl font-extrabold text-primary-700'>
                      <span data-counter data-target='6'>0</span>
                    </div>
                    <div className='text-[11px] font-bold text-neutral-400 mt-1'>{t('about.countriesServed')}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
