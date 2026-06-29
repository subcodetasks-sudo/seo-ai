"use client";

import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';

const navItems = [
  { href: '#about', key: 'navbar.about' },
  { href: '#usecases', key: 'navbar.usecases' },
  { href: '#stats', key: 'navbar.stats' },
  { href: '#pricing', key: 'navbar.pricing' },
  { href: '#testimonials', key: 'navbar.testimonials' },
  { href: '#faq', key: 'navbar.faq' },
] as const;

export function LandingHeader() {
  const t = useTranslations("landing");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <header id='site-header' className='site-header fixed top-0 inset-x-0 z-50'>
      <div className='mx-auto max-w-7xl px-5 lg:px-8 h-20 flex items-center justify-between'>
        <a href='#hero' className='flex items-center shrink-0'>
          <Image
            src='/logo.webp'
            alt='هويّة'
            width={180}
            height={120}
            className='h-10 w-auto'
            priority
          />
        </a>
        <nav className='hidden lg:flex items-center gap-8'>
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className='nav-link text-[15px]'>
              {t(item.key)}
            </a>
          ))}
        </nav>
        <div className='flex items-center gap-3'>
          <button
            id='language-toggle'
            type='button'
            className='language-toggle'
            aria-label='Change language'
            aria-pressed={locale === 'en'}
            data-lang={locale}
            onClick={toggleLanguage}
          >
            <span>{t('navbar.languageToggle')}</span>
          </button>
          <a href='#pricing' className='btn btn-primary px-6 py-3 hidden sm:inline-flex'>
            {t('navbar.cta')}
          </a>
          <button
            id='menu-toggle'
            aria-label={t('navbar.menu')}
            className='lg:hidden w-11 h-11 rounded-full border border-[#ecefe7] bg-white flex items-center justify-center'
          >
            <svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round'>
              <line x1='3' y1='6' x2='21' y2='6' />
              <line x1='3' y1='12' x2='21' y2='12' />
              <line x1='3' y1='18' x2='21' y2='18' />
            </svg>
          </button>
        </div>
      </div>
      <div id='mobile-menu' className='mobile-menu lg:hidden bg-white border-t border-[#ecefe7]'>
        <nav className='px-5 py-4 flex flex-col gap-1'>
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className='py-3 text-ink/80 font-semibold'>
              {t(item.key)}
            </a>
          ))}
          <a href='#pricing' className='btn btn-primary px-6 py-3 mt-2'>
            {t('navbar.cta')}
          </a>
        </nav>
      </div>
    </header>
  );
}
