"use client";
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { settingsQueryOptions } from '../queries/queries';
import Link from 'next/link';

const LinkedinIcon = () => (
  <svg viewBox='0 0 24 24' fill='currentColor' className='h-[18px] w-[18px]'>
    <path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z' />
    <rect width='4' height='12' x='2' y='9' />
    <circle cx='4' cy='4' r='2' />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox='0 0 24 24' fill='currentColor' className='h-[18px] w-[18px]'>
    <path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='h-[18px] w-[18px]'>
    <rect width='20' height='20' x='2' y='2' rx='5' ry='5' />
    <path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' />
    <line x1='17.5' x2='17.51' y1='6.5' y2='6.5' />
  </svg>
);

const XIcon = () => (
  <svg viewBox='0 0 24 24' fill='currentColor' className='h-[18px] w-[18px]'>
    <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
  </svg>
);

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

export function LandingFooter() {
  const t = useTranslations('landing');
  const locale = useLocale();
  const { data: settings } = useQuery(settingsQueryOptions(locale));

  const cta = settings?.footer_cta;
  const phones = settings?.contact?.phones ?? ['(+90) 536 031 67 75'];
  const offices = settings?.offices ?? [
    { title: t('footer.office0Name'), address: t('footer.office0Address') },
    { title: t('footer.office1Name'), address: t('footer.office1Address') },
  ];
  const copyright = settings?.copyright ?? t('footer.copyright');
  const platform = settings?.footer_links?.platform ?? [];
  const company = settings?.footer_links?.company ?? [];
  const legal = settings?.footer_links?.legal?.length
    ? settings.footer_links.legal
    : [
        { label: t('footer.termsLabel'), url: '/terms-of-use' },
        { label: t('footer.privacyLabel'), url: '/privacy-policy' },
      ];
  const social = settings?.social;
  const hasSocial = social && Object.values(social).some(Boolean);

  return (
    <footer className='relative overflow-hidden bg-white text-ink'>
      <div className='swirl-watermark -left-20 -top-20 h-[520px] w-[520px]' style={{ opacity: '0.04' }} />

      {/* CTA banner */}
      <div className='relative border-b border-ink/10'>
        <div className='glow left-1/2 -top-40 h-[520px] w-[520px] -translate-x-1/2 opacity-40' />
        <div
          className='layer-content mx-auto max-w-7xl px-4 py-12 text-center sm:px-5 sm:py-14 lg:px-8 lg:py-20'
          data-anim='fade-up'
        >
          <h2 className='text-2xl font-extrabold leading-[1.4] sm:text-4xl lg:text-5xl'>
            {cta?.title ?? t('footer.cta')}
          </h2>
          <p className='mx-auto mt-4 max-w-2xl text-base text-ink-muted sm:text-lg'>
            {cta?.description ?? t('footer.subtitle')}
          </p>
          <Link
            href="/dashboard"
            className='btn btn-primary cta-pulse mt-8 w-full px-8 py-4 text-base sm:mt-9 sm:w-auto sm:px-10 sm:text-lg'
          >
            {cta?.button_text ?? t('footer.ctaButton')}
          </Link>
        </div>
      </div>

      {/* Footer links + contact */}
      <div className='relative '>
        <div className='mx-auto max-w-7xl px-4 py-10 sm:px-5 lg:px-8'>
          <div className='grid grid-cols-2 gap-10 md:grid-cols-3 lg:gap-12'>

            <div className='space-y-8'>
              <div>
                <Image
                  src='/logo.webp'
                  alt='Howyah Logo'
                  width={100}
                  height={40}
                  className='h-14 w-auto sm:h-20'
                />
              </div>
              {hasSocial && (
                <div className='flex items-center gap-4'>
                  {social?.linkedin && (
                    <a href={social.linkedin} target='_blank' rel='noreferrer' className='text-white/60 transition-colors hover:text-white'>
                      <LinkedinIcon />
                    </a>
                  )}
                  {social?.facebook && (
                    <a href={social.facebook} target='_blank' rel='noreferrer' className='text-white/60 transition-colors hover:text-white'>
                      <FacebookIcon />
                    </a>
                  )}
                  {social?.instagram && (
                    <a href={social.instagram} target='_blank' rel='noreferrer' className='text-white/60 transition-colors hover:text-white'>
                      <InstagramIcon />
                    </a>
                  )}
                  {social?.x && (
                    <a href={social.x} target='_blank' rel='noreferrer' className='text-white/60 transition-colors hover:text-white'>
                      <XIcon />
                    </a>
                  )}
                </div>
              )}
            </div>

            {platform.length > 0 && (
              <div className='md:justify-self-center'>
                <h5 className='mb-4 text-base font-extrabold text-ink'>{t('footer.platformTitle')}</h5>
                <ul className='space-y-2 text-sm text-ink-muted'>
                  {platform.map((link) => (
                    <li key={link.url}>
                      <a href={link.url} className='transition-colors hover:text-ink'>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {company.length > 0 && (
              <div className='md:justify-self-end'>
                <h5 className='mb-4 text-base font-extrabold text-ink'>{t('footer.quickLinksTitle')}</h5>
                <ul className='space-y-2 text-sm text-ink-muted'>
                  {company.map((link) => (
                    <li key={link.url}>
                      <a href={link.url} className='transition-colors hover:text-ink'>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Certification + social + legal */}
      <div className='relative'>
        <div className='mx-auto max-w-7xl px-4 py-8 sm:px-5 lg:px-8'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-0'>

            <div className='w-fit'>
              <h5 className='mb-4 text-base font-extrabold text-ink'>{t('footer.officesTitle')}</h5>
              <div className='space-y-3 text-sm text-ink-muted'>
                {offices.map((office, i) => (
                  <div key={i} className='flex items-start gap-2.5 w-fit'>
                    {LOCATION_ICON}
                    <span>
                      {office.title && (
                        <strong className='font-bold text-ink'>{office.title}:</strong>
                      )}{' '}
                      <div>
                        {office.address}
                      </ div>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className='flex flex-col items-center gap-2 flex-1 md:justify-self-center'>
              <div className='inline-flex'>
                <Image
                  src='/ministry-commerce-certification 1.png'
                  alt={t('footer.certifiedAlt')}
                  width={300}
                  height={200}
                  className='h-14 w-auto sm:h-30'
                />
              </div>
              <p className='text-sm font-semibold text-ink-muted'>{t('footer.certified')}</p>
            </div>

            <div className='md:justify-self-end'>
              <h5 className='mb-4 text-base font-extrabold text-ink' dir='rtl'>{t('footer.phonesTitle')}</h5>
              <div className='space-y-3 text-sm text-ink-muted'>
                {phones.map((phone, i) => (
                  <p key={i} className='flex items-center gap-2.5'>
                    {PHONE_ICON}
                    <span className='whitespace-nowrap' dir='ltr'>
                      {phone}
                    </span>
                  </p>
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className='border-t flex items-center justify-evenly gap-4 border-ink/10 bg-ink/5 px-4 py-5 text-center'>

          {legal.length > 0 && (
            <div className='flex  items-center gap-2 text-xs text-ink-muted'>
              {legal.map((link) => (
                <a key={link.url} href={link.url} className='transition-colors hover:text-ink'>
                  {link.label}
                </a>
              ))}
            </div>
          )}

          <p className='text-xs  text-ink-muted'>{copyright}</p>


          <div>
            <Image
              src='/imgs/payments.webp'
              alt={"payment methods"}
              width={150}
              height={30}
              className='w-auto h-4'
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
