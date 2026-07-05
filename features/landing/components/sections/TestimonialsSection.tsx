"use client";
import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { testimonialsQueryOptions } from '../../queries/queries';

const PORTRAIT_COLORS = [
  'var(--primary-300)',
  'var(--primary-600)',
  'var(--primary-200)',
  'var(--primary-300)',
  'var(--primary-400)',
];

export function TestimonialsSection() {
  const t = useTranslations('landing');
  const local = useLocale();
  const { data } = useQuery(testimonialsQueryOptions(local));
  const [activeIdx, setActiveIdx] = useState(0);

  const testimonials = data?.testimonials ?? [];
  const total = testimonials.length;

  // auto-advance every 6 s, resets when total changes (data loads)
  useEffect(() => {
    if (total < 2) return;
    const timer = setInterval(() => setActiveIdx(i => (i + 1) % total), 6000);
    return () => clearInterval(timer);
  }, [total]);

  const safeIdx = total > 0 ? Math.min(activeIdx, total - 1) : 0;
  const active = testimonials[safeIdx];
  const portraitInitial = active?.content.name?.[0] ?? 'ع';
  const portraitColor = PORTRAIT_COLORS[safeIdx % PORTRAIT_COLORS.length];

  const goPrev = () => setActiveIdx(i => (i - 1 + total) % total);
  const goNext = () => setActiveIdx(i => (i + 1) % total);

  return (
    <section
      id='testimonials'
      className='bg-pattern relative overflow-hidden py-14 lg:py-20'
    >
      <div className='glow w-[420px] h-[420px] top-10 -right-28 opacity-50'></div>

      <div className='layer-content mx-auto max-w-7xl px-5 lg:px-8'>
        <div className='grid lg:grid-cols-[40%_60%] gap-10 lg:gap-16 items-center'>

          {/* Portrait */}
          <div className='flex justify-center lg:justify-start' data-anim='zoom'>
            <div className='relative'>
              <div className='absolute -inset-4 rounded-full bg-primary/15 blur-2xl'></div>
              <div
                className='testimonial-portrait relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden flex items-end justify-center shadow-[0_40px_80px_-30px_rgba(160,205,57,0.6)] transition-colors duration-500'
                style={{ background: portraitColor }}
              >
                <svg viewBox='0 0 200 200' className='w-[88%] h-[88%]' aria-hidden='true'>
                  <defs>
                    <clipPath id='pc'>
                      <circle cx='100' cy='110' r='100' />
                    </clipPath>
                  </defs>
                  <g clipPath='url(#pc)'>
                    <circle cx='100' cy='78' r='42' fill='#ffffff' opacity='0.92' />
                    <path d='M28 210 C28 150 60 132 100 132 C140 132 172 150 172 210 Z' fill='#ffffff' opacity='0.92' />
                  </g>
                  <text
                    x='100'
                    y='92'
                    textAnchor='middle'
                    dominantBaseline='middle'
                    fill='var(--primary-700)'
                    fontSize='46'
                    fontWeight='900'
                  >
                    {portraitInitial}
                  </text>
                </svg>
              </div>
            </div>
          </div>

          {/* Slide content */}
          <div data-anim='fade-up'>
            <svg className='w-16 h-16 text-primary-line' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
              <path d='M9.5 6C6.5 7.5 5 10.5 5 14v4h6v-6H8c0-2 .7-3.6 2.5-4.5L9.5 6zm9 0C15.5 7.5 14 10.5 14 14v4h6v-6h-3c0-2 .7-3.6 2.5-4.5L18.5 6z' />
            </svg>

            {active && (
              <div key={safeIdx} className='animate-in fade-in slide-in-from-bottom-3 duration-500'>
                <div className='text-2xl sm:text-[1.7rem] font-bold text-ink leading-[1.6]'>
                  {parse(active.content.content)}
                </div>
                <div className='mt-7 flex items-center gap-4'>
                  <div className='w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center font-extrabold text-primary-700'>
                    {portraitInitial}
                  </div>
                  <div>
                    <div className='font-extrabold text-ink'>{parse(active.content.name)}</div>
                    <div className='text-sm text-neutral-400'>{parse(active.content.job_title)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className='mt-9 flex items-center gap-3'>
              <button onClick={goPrev} className='t-control' aria-label={t('testimonials.prev')}>
                <svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round'>
                  <polyline points='15 18 9 12 15 6' />
                </svg>
              </button>
              <button onClick={goNext} className='t-control' aria-label={t('testimonials.next')}>
                <svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round'>
                  <polyline points='9 18 15 12 9 6' />
                </svg>
              </button>
              <div className='flex items-center gap-2 mr-3'>
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    onPointerEnter={() => setActiveIdx(i)}
                    aria-label={t('a11y.slide', { n: i + 1 })}
                    className='h-2.5 rounded-full transition-all duration-300'
                    style={{
                      backgroundColor: i === safeIdx ? 'var(--primary-300)' : 'var(--neutral-300)',
                      width: i === safeIdx ? '22px' : '10px',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
