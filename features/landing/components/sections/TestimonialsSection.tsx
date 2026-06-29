import { apiFetch } from '@/lib/landing-api';
import type { TestimonialsData } from '@/features/landing/types/landing-api';

const PORTRAIT_COLORS = ['#a0cd39', '#8ab72e', '#bedc6f', '#c5d87a', '#9ed25a'];

export async function TestimonialsSection() {
  const data = await apiFetch<TestimonialsData>('/api/v1/testimonials/content');
  const testimonials = data?.testimonials ?? [];

  const firstInitial = testimonials[0]?.content.name?.[0] ?? 'ع';
  const firstColor = PORTRAIT_COLORS[0];

  return (
    <section
      id='testimonials'
      className='bg-pattern relative overflow-hidden py-14 lg:py-20'
    >
      <div className='glow w-[420px] h-[420px] top-10 -right-28 opacity-50'></div>

      <div className='layer-content mx-auto max-w-7xl px-5 lg:px-8'>
        <div className='grid lg:grid-cols-[40%_60%] gap-10 lg:gap-16 items-center'>
          <div className='flex justify-center lg:justify-start' data-anim='zoom'>
            <div className='relative'>
              <div className='absolute -inset-4 rounded-full bg-primary/15 blur-2xl'></div>
              <div
                id='t-portrait-wrap'
                className='testimonial-portrait relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden flex items-end justify-center shadow-[0_40px_80px_-30px_rgba(160,205,57,0.6)]'
                style={{ background: firstColor }}
              >
                <svg id='t-portrait' viewBox='0 0 200 200' className='w-[88%] h-[88%]' aria-hidden='true'>
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
                    id='t-portrait-initial'
                    x='100'
                    y='92'
                    textAnchor='middle'
                    dominantBaseline='middle'
                    fill='#5c7a20'
                    fontSize='46'
                    fontWeight='900'
                  >
                    {firstInitial}
                  </text>
                </svg>
              </div>
            </div>
          </div>

          <div data-anim='fade-up'>
            <svg className='w-16 h-16 text-[#eef2e6]' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
              <path d='M9.5 6C6.5 7.5 5 10.5 5 14v4h6v-6H8c0-2 .7-3.6 2.5-4.5L9.5 6zm9 0C15.5 7.5 14 10.5 14 14v4h6v-6h-3c0-2 .7-3.6 2.5-4.5L18.5 6z' />
            </svg>

            <div id='t-track'>
              {testimonials.map((testimonial, index) => {
                const initial = testimonial.content.name?.[0] ?? '؟';
                const color = PORTRAIT_COLORS[index % PORTRAIT_COLORS.length];
                return (
                  <div
                    key={testimonial.id}
                    className={`t-slide${index === 0 ? ' active' : ''}`}
                    data-portrait-initial={initial}
                    data-portrait-color={color}
                  >
                    <p className='text-2xl sm:text-[1.7rem] font-bold text-ink leading-[1.6]'>
                      {testimonial.content.content}
                    </p>
                    <div className='mt-7 flex items-center gap-4'>
                      <div className='w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center font-extrabold text-primary-700'>
                        {initial}
                      </div>
                      <div>
                        <div className='font-extrabold text-ink'>{testimonial.content.name}</div>
                        <div className='text-sm text-[#9aa49a]'>{testimonial.content.job_title}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className='mt-9 flex items-center gap-3'>
              <button id='t-prev' className='t-control' aria-label='السابق'>
                <svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round'>
                  <polyline points='15 18 9 12 15 6' />
                </svg>
              </button>
              <button id='t-next' className='t-control' aria-label='التالي'>
                <svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round'>
                  <polyline points='9 18 15 12 9 6' />
                </svg>
              </button>
              <div id='t-dots' className='flex items-center gap-2 mr-3'></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
