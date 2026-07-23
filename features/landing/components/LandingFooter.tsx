"use client";
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { settingsQueryOptions } from '../queries/queries';
import Link from 'next/link';
import { BadgeCheck, ChevronRight, FileText, Mail, MapPin, Phone, ShieldCheck, Tag, type LucideIcon } from 'lucide-react';
import { useFadeUpReveal } from '@/components/motion/scroll-reveal';
import { LicensePreviewDialog } from './license-preview-dialog';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
} from '@/components/social-icons';

const legalIcons: Record<string, LucideIcon> = {
  '/terms-of-use': FileText,
  '/privacy-policy': ShieldCheck,
  '/pricing': Tag,
};

export function LandingFooter() {
  const t = useTranslations('landing');
  const locale = useLocale();
  const { data: settings } = useQuery(settingsQueryOptions(locale));
  const fadeUpRef = useFadeUpReveal<HTMLDivElement>();

  const cta = settings?.footer_cta;
  const phones = settings?.contact?.phones ?? ['(+90) 536 031 67 75'];
  const offices = settings?.offices ?? [
    { title: t('footer.office0Name'), address: t('footer.office0Address') },
    { title: t('footer.office1Name'), address: t('footer.office1Address') },
  ];
  const copyright = t('footer.copyright');
  const copyrightSubtitle = t('footer.copyrightSubtitle');
  const platform = settings?.footer_links?.platform ?? [];
  const company = settings?.footer_links?.company ?? [];
  const legal =  [
    { label: t('footer.termsOfUse'), url: '/terms-of-use' },
    { label: t('footer.privacyPolicy'), url: '/privacy-policy' },
    { label: t('footer.pricingPolicy'), url: '/pricing' },
  ];
  return (
    <footer id='landing-footer' className='relative overflow-hidden bg-white text-ink'>
      <div className='swirl-watermark -left-20 -top-20 h-[520px] w-[520px]' style={{ opacity: '0.04' }} />

      {/* CTA banner */}
      <div className='relative border-b border-ink/10'>
        <div className='glow left-1/2 -top-40 h-[520px] w-[520px] -translate-x-1/2 opacity-40' />
        <div
          className='layer-content mx-auto max-w-7xl px-4 py-12 text-center sm:px-5 sm:py-14 lg:px-8 lg:py-20'
          data-anim='fade-up'
          ref={fadeUpRef}
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

      <div className='relative bg-white'>
        <div
          className='pointer-events-none absolute inset-0 z-0 bg-contain bg-center bg-no-repeat opacity-50'
          style={{ backgroundImage: "url('/imgs/map.webp')" }}
        />

        {/* Footer links + contact */}
        <div className='relative'>
          <div className='mx-auto max-w-7xl px-4 py-8 sm:px-5 lg:px-8'>
            <div className='grid grid-cols-2 gap-10 md:grid-cols-4 lg:gap-12'>

              <div className='space-y-5'>
                <div>
                  <Image
                    src='/logo.webp'
                    alt={t('a11y.logoAlt')}
                    width={100}
                    height={40}
                    className='h-14 w-auto sm:h-20'
                  />
                  <div className='mt-3 text-sm text-ink-muted sm:text-base'>
                    {t('footer.tagline')}
                  </div>
                </div>
                <div className='flex flex-wrap items-center gap-3'>
                  {settings?.contact?.email && (
                    <a href={`mailto:${settings.contact.email}`} className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-primary transition-opacity hover:opacity-80'>
                      <Mail size={18} />
                    </a>
                  )}
                  <a href='https://x.com/hooweyah' target='_blank' rel='noreferrer' className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-primary transition-opacity hover:opacity-80'>
                    <XIcon />
                  </a>
                  <a href='https://www.facebook.com/Hooweyah/' target='_blank' rel='noreferrer' className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-primary transition-opacity hover:opacity-80'>
                    <FacebookIcon />
                  </a>
                  <a href='https://www.linkedin.com/company/hooweyah/' target='_blank' rel='noreferrer' className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-primary transition-opacity hover:opacity-80'>
                    <LinkedinIcon />
                  </a>
                  <a href='https://www.instagram.com/hooweyah' target='_blank' rel='noreferrer' className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-primary transition-opacity hover:opacity-80'>
                    <InstagramIcon />
                  </a>
                </div>
                <div className='inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary-700'>
                  <BadgeCheck size={15} className='shrink-0' />
                  <span>{t('footer.trademark')}</span>
                </div>
              </div>

              {platform.length > 0 && (
                <div className='md:justify-self-end'>
                  <h5 className='mb-4 text-base font-extrabold text-ink'>{t('footer.platformTitle')}</h5>
                  <ul className='space-y-2 text-sm text-ink-muted'>
                    {platform.map((link) => (
                      <li key={link.url}>
                        <a href={link.url} className='flex items-center gap-1.5 transition-colors hover:text-ink'>
                          <ChevronRight size={18} className='shrink-0 text-primary' />
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {legal.length > 0 && (
                <div className='md:justify-self-end'>
                  <h5 className='mb-4 text-base font-extrabold text-ink'>{t('footer.legalTitle')}</h5>
                  <ul className='space-y-2 text-sm text-ink-muted'>
                    {legal.map((link) => {
                      const LegalIcon = legalIcons[link.url] ?? FileText;
                      return (
                        <li key={link.url}>
                          <a href={link.url} className='flex items-center gap-1.5 transition-colors hover:text-ink'>
                            <LegalIcon size={18} className='shrink-0 text-primary' />
                            {link.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {company.length > 0 && (
                <div className='md:justify-self-end'>
                  <h5 className='mb-4 text-base font-extrabold text-ink'>{t('footer.quickLinksTitle')}</h5>
                  <ul className='space-y-2 text-sm text-ink-muted'>
                    {company.map((link) => (
                      <li key={link.url}>
                        <a href={link.url} className='flex items-center gap-1.5 transition-colors hover:text-ink'>
                          <ChevronRight size={18} className='shrink-0 text-primary' />
                          {link.label}
                        </a>
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
          <div className='mx-auto max-w-7xl px-4 py-2 sm:px-5 lg:px-8'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-0'>

              <div className='w-fit'>
                <h5 className='mb-4 text-base font-extrabold text-ink'>{t('footer.officesTitle')}</h5>
                <div className='space-y-3 text-sm text-ink-muted'>
                  {offices.map((office, i) => (
                    <div key={i} className='flex items-start gap-2.5 w-fit'>
                      <MapPin size={16} className='mt-0.5 shrink-0 text-primary' />
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
                <LicensePreviewDialog>
                  <button
                    type='button'
                    aria-label={t('a11y.viewLicense')}
                    className='cursor-pointer rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
                  >
                    <Image
                      src='/ministry-commerce-certification 1.png'
                      alt={t('footer.certifiedAlt')}
                      width={300}
                      height={200}
                      className='h-14 w-auto sm:h-30'
                    />
                  </button>
                </LicensePreviewDialog>
                <p className='text-sm font-semibold text-ink-muted'>{t('footer.certified')}</p>
              </div>

              <div className='md:justify-self-end'>
                <h5 className='mb-4 text-base font-extrabold text-ink' dir='rtl'>{t('footer.phonesTitle')}</h5>
                <div className='space-y-3 text-sm text-ink-muted'>
                  {phones.map((phone, i) => (
                    <p key={i} className='flex items-center gap-2.5'>
                      <Phone size={16} className='shrink-0 text-primary' />
                      <span className='whitespace-nowrap' dir='ltr'>
                        {phone}
                      </span>
                    </p>
                  ))}
                </div>
              </div>

            </div>
          </div>
            <div className='mx-auto max-w-7xl px-4 py-8 sm:px-5 lg:px-8 flex justify-center'>
              <Image
                src='/imgs/payments.webp'
                alt={t('footer.paymentMethodsAlt')}
                width={150}
                height={30}
                className='w-auto h-4'
              />
            </div>

          <div className='relative overflow-hidden border-t border-white/10 bg-ink px-4 py-6 text-center sm:px-5 lg:px-8'>
            <div className='glow left-1/2 -top-32 h-72 w-72 -translate-x-1/2 opacity-25' />
            <div className='layer-content mx-auto flex max-w-7xl flex-col items-center justify-center gap-1.5 text-xs text-white/70 sm:flex-row sm:gap-3'>
              <p className='font-semibold text-white'>{copyright}</p>
              <span className='hidden h-1 w-1 shrink-0 rounded-full bg-primary sm:inline-block' />
              <p>{copyrightSubtitle}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
