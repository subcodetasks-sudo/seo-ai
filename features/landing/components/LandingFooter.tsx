import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { apiFetch } from '@/lib/landing-api';
import type { Settings } from '@/features/landing/types/landing-api';

const PHONE_ICON = (
  <svg className='h-4 w-4 shrink-0 text-primary' viewBox='0 0 24 24' fill='currentColor'>
    <path d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z' />
  </svg>
);

const LOCATION_ICON = (
  <svg className='mt-0.5 h-4 w-4 shrink-0 text-primary' viewBox='0 0 24 24' fill='currentColor'>
    <path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' />
  </svg>
);

export async function LandingFooter() {
  const t = await getTranslations('landing');

  let settings: Settings | null = null;
  try {
    settings = await apiFetch<Settings>('/api/v1/auth/settings');
  } catch {
    // render with fallbacks
  }

  const cta = settings?.footer_cta;
  const phones = settings?.contact?.phones ?? ['(+90) 536 031 67 75', '(+968) 4555 9520', '(+968) 1971 9525'];
  const offices = settings?.offices ?? [
    { name: t('footer.office0Name'), address: t('footer.office0Address') },
    { name: t('footer.office1Name'), address: t('footer.office1Address') },
  ];
  const copyright = settings?.copyright ?? t('footer.copyright');

  return (
    <footer className='relative overflow-hidden bg-ink text-white'>
      <div className='swirl-watermark -left-20 -top-20 h-[520px] w-[520px]' style={{ opacity: '0.04' }} />

      <div className='relative border-b border-white/10'>
        <div className='glow left-1/2 -top-40 h-[520px] w-[520px] -translate-x-1/2 opacity-40' />

        <div
          className='layer-content mx-auto max-w-7xl px-4 py-12 text-center sm:px-5 sm:py-14 lg:px-8 lg:py-20'
          data-anim='fade-up'
        >
          <h2 className='text-2xl font-extrabold leading-[1.4] sm:text-4xl lg:text-5xl'>
            {cta?.title ?? t('footer.cta')}
          </h2>
          <p className='mx-auto mt-4 max-w-2xl text-base text-white/70 sm:text-lg'>
            {cta?.description ?? t('footer.subtitle')}
          </p>
          <a
            href={cta?.button_url ?? '#pricing'}
            className='btn btn-primary cta-pulse mt-8 w-full px-8 py-4 text-base sm:mt-9 sm:w-auto sm:px-10 sm:text-lg'
          >
            {cta?.button_text ?? t('footer.ctaButton')}
          </a>
        </div>
      </div>

      <div className='relative border-t border-white/10'>
        <div className='mx-auto max-w-7xl px-4 py-10 sm:px-5 lg:px-8'>
          <div className='grid grid-cols-1 gap-10 text-center md:grid-cols-3 md:text-start lg:gap-12'>
            <div className='order-1 flex flex-col items-center text-center md:order-2'>
              <div className='inline-flex rounded-2xl bg-white p-3'>
                <Image
                  src='/ministry-commerce-certification 1.png'
                  alt={t('footer.certifiedAlt')}
                  width={200}
                  height={100}
                  className='h-12 w-auto sm:h-16'
                />
              </div>
              <p className='mt-3 text-sm font-semibold text-white/65'>
                {t('footer.certified')}
              </p>
            </div>

            <div className='order-2 text-center md:order-3 md:text-left' dir='ltr'>
              <h5 className='mb-4 text-base font-extrabold text-white' dir='rtl'>
                {t('footer.phonesTitle')}
              </h5>
              <div className='space-y-3 text-sm text-white/65'>
                {phones.map((phone, i) => (
                  <p key={i} className='flex items-center justify-center gap-2.5 md:justify-start'>
                    {PHONE_ICON}
                    <span className='whitespace-nowrap'>{phone}</span>
                  </p>
                ))}
              </div>
            </div>

            <div className='order-3 text-center md:order-1 md:text-right'>
              <h5 className='mb-4 text-base font-extrabold text-white'>{t('footer.officesTitle')}</h5>
              <div className='space-y-3 text-sm text-white/65'>
                {offices.map((office, i) => (
                  <p key={i} className='flex items-start justify-center gap-2.5 md:justify-start'>
                    {LOCATION_ICON}
                    <span>
                      {(office.name || office.country) && (
                        <strong className='font-bold text-white/90'>
                          {office.name ?? office.country}:
                        </strong>
                      )}{' '}
                      {office.address ?? office.location ?? ''}
                    </span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className='border-t border-white/10 bg-black/20 px-4 py-5 text-center'>
          <p className='text-sm font-semibold text-white/60'>{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
