"use client";

import { useTranslations } from 'next-intl';

type LegalSectionItem = {
  label?: string;
  text: string;
};

type LegalSection = {
  heading: string;
  intro?: string;
  paragraphs?: string[];
  items?: LegalSectionItem[];
};

export function LegalContent({ namespace }: { namespace: 'termsOfUse' | 'privacyPolicy' }) {
  const t = useTranslations(`legal.${namespace}`);
  const sections = t.raw('sections') as LegalSection[];

  return (
    <section className='bg-pattern relative overflow-hidden pt-32 pb-14 lg:pb-20 lg:pt-40'>
      <div className='glow -top-20 left-1/2 h-[440px] w-[440px] -translate-x-1/2 opacity-40' />

      <div className='layer-content mx-auto max-w-4xl px-5 lg:px-8'>
        <div className='mb-10 text-center' data-anim='fade-up'>
          <div className='eyebrow mb-5'>{t('eyebrow')}</div>
          <h1 className='text-3xl font-extrabold leading-[1.25] text-ink sm:text-4xl lg:text-[2.7rem]'>
            {t('title')}
          </h1>
        </div>

        <div className='surface pattern-card relative overflow-hidden p-6 sm:p-10' data-anim='fade-up'>
          <div className='swirl-watermark inset-0 bg-center' style={{ opacity: '0.04' }} />
          <div className='relative space-y-10'>
            <p className='text-lg leading-relaxed text-ink-soft'>{t('intro')}</p>

            {sections.map((section, i) => (
              <div key={i}>
                <h2 className='text-xl font-extrabold text-ink'>{section.heading}</h2>

                {section.intro && (
                  <p className='mt-3 leading-relaxed text-ink-soft'>{section.intro}</p>
                )}

                {section.paragraphs?.map((paragraph, j) => (
                  <p key={j} className='mt-3 leading-relaxed text-ink-soft'>{paragraph}</p>
                ))}

                {section.items && (
                  <ul className='mt-3 space-y-2.5'>
                    {section.items.map((item, k) => (
                      <li key={k} className='flex items-start gap-2.5 leading-relaxed text-ink-soft'>
                        <span className='mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary' />
                        <span>
                          {item.label && (
                            <strong className='font-bold text-ink'>{item.label}: </strong>
                          )}
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            <p className='leading-relaxed text-ink-soft'>{t('closing')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
