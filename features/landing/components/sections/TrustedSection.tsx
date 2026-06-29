import { getTranslations } from 'next-intl/server';
import { apiFetch } from '@/lib/landing-api';
import type { Hero, HeroPartner } from '@/features/landing/types/landing-api';

const FALLBACK_PLATFORMS = ['WordPress', 'Shopify', 'سلة', 'زد'];

function PartnerItem({ partner }: { partner: HeroPartner | string }) {
  const name = typeof partner === 'string' ? partner : partner.name;
  const logo = typeof partner === 'object' ? partner.logo : null;

  if (logo) {
    return (
      <div className='logo-item'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt={typeof partner === 'object' ? (partner.alt || name) : name} className='h-7 w-auto object-contain opacity-60' />
      </div>
    );
  }

  return (
    <div className='logo-item'>
      <svg
        viewBox='0 0 32 32'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.6'
        strokeLinecap='round'
        strokeLinejoin='round'
        aria-label={name}
        aria-hidden='true'
      >
        {name === 'WordPress' ? (
          <>
            <circle cx='16' cy='16' r='13' />
            <path d='M8 11 L10.5 22 L14 14 L17.5 22 L20 11' />
          </>
        ) : name === 'Shopify' ? (
          <>
            <path d='M9 11h14l-1.3 14a2 2 0 0 1-2 1.8H12.3a2 2 0 0 1-2-1.8z' />
            <path d='M12.5 11V9.5a3.5 3.5 0 0 1 7 0V11' />
          </>
        ) : name === 'سلة' ? (
          <>
            <path d='M7 13h18l-2 11.5a2 2 0 0 1-2 1.7H11a2 2 0 0 1-2-1.7z' />
            <path d='M11 13l3-6M21 13l-3-6' />
            <path d='M13.5 17.5v5M18.5 17.5v5' />
          </>
        ) : name === 'زد' ? (
          <>
            <path d='M6 13l1.8-5h16.4L26 13' />
            <path d='M7.5 13v11.5h17V13' />
            <path d='M13 24.5V18h6v6.5' />
            <path d='M6 13a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0' />
          </>
        ) : (
          <>
            <rect x='6' y='8' width='20' height='16' rx='2' />
            <path d='M10 12h12M10 16h8' />
          </>
        )}
      </svg>
    </div>
  );
}

export async function TrustedSection() {
  const t = await getTranslations('landing');
  const heroes = await apiFetch<Hero[]>('/api/v1/heroes?lang=ar');
  const apiPartners = heroes?.[0]?.partners ?? [];

  const items: (HeroPartner | string)[] =
    apiPartners.length > 0 ? apiPartners : FALLBACK_PLATFORMS;

  const repeated = Array.from({ length: 5 }, () => items).flat();

  return (
    <section
      id='trusted'
      className='bg-pattern relative overflow-hidden py-14 lg:py-16 border-y border-primary-line'
    >
      <div className='layer-content'>
        <p
          className='trusted-title text-center text-sm sm:text-base font-bold text-neutral-400 mb-9 px-5'
          data-anim='fade-up'
        >
          {t('trusted.subtitle')}
        </p>
        <div className='marquee mb-4'>
          <div className='marquee-track marquee-ltr' data-marquee>
            <div className='marquee-group'>
              {repeated.map((item, index) => (
                <PartnerItem key={index} partner={item} />
              ))}
            </div>
            <div className='marquee-group' aria-hidden='true'>
              {repeated.map((item, index) => (
                <PartnerItem key={index} partner={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
