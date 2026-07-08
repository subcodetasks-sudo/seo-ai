"use client";
import { useTranslations } from 'next-intl';

export function PricingPolicySection() {
  const t = useTranslations('pricingPolicy');
  const section1Paragraphs = t.raw('section1.paragraphs') as string[];
  const section2Conditions = t.raw('section2.conditions') as string[];

  return (
    <section className='bg-pattern relative overflow-hidden py-14 lg:py-20'>
      <div className='glow -top-20 left-1/2 h-[440px] w-[440px] -translate-x-1/2 opacity-40' />

      <div className='layer-content mx-auto max-w-4xl px-5 lg:px-8'>
        <div className='mb-10 text-center' data-anim='fade-up'>
          <div className='eyebrow mb-5'>{t('eyebrow')}</div>
          <h2 className='text-3xl font-extrabold leading-[1.25] text-ink sm:text-4xl lg:text-[2.7rem]'>
            {t('title')}
          </h2>
        </div>

        <div className='surface pattern-card relative overflow-hidden p-6 sm:p-10' data-anim='fade-up'>
          <div className='swirl-watermark inset-0 bg-center' style={{ opacity: '0.04' }} />
          <div className='legal-prose relative'>
            <p>{t('intro')}</p>

            <h2>{t('section1.title')}</h2>
            {section1Paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}

            <h2>{t('section2.title')}</h2>
            <p>{t('section2.intro')}</p>
            <ul>
              {section2Conditions.map((condition, i) => (
                <li key={i}>{condition}</li>
              ))}
            </ul>
            <p>{t('section2.note')}</p>
            <p>{t('section2.review')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
