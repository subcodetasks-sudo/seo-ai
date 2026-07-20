'use client';

import { useTranslations } from 'next-intl';
import type { HeroPartner } from '@/features/landing/types/landing-api';

const FALLBACK_PLATFORMS = ['WordPress', 'Shopify', 'salla', 'zid'];

const KNOWN_PLATFORM_LOGOS: Record<string, string> = {
  WordPress: '/imgs/wordpress.png',
  Shopify: '/imgs/shopify.webp',
  salla: '/imgs/salla.svg',
  zid: '/imgs/zid.svg',
};

function PartnerItem({ partner }: { partner: HeroPartner | string }) {
  const name = typeof partner === 'string' ? partner : partner.name;
  const alt = typeof partner === 'object' ? (partner.alt || name) : name;
  const logo = (typeof partner === 'object' ? partner.logo : null) ?? KNOWN_PLATFORM_LOGOS[name];

  if (logo) {
    return (
      <div className='logo-item'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt={alt} className='h-8 w-auto object-contain opacity-60' />
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
        <rect x='6' y='8' width='20' height='16' rx='2' />
        <path d='M10 12h12M10 16h8' />
      </svg>
    </div>
  );
}

export function TrustedSection() {
  const t = useTranslations('landing');

  const items: (HeroPartner | string)[] = FALLBACK_PLATFORMS;

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
          <div className='marquee-track marquee-ltr' data-marquee-ready='true'>
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
