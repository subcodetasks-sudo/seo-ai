"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { heroQueryOptions } from "@/features/landing/queries/hero";
import { stripHtml } from "@/lib/landing-api";

export function HeroSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const t = useTranslations("landing");
  const videoSrc = "https://www.youtube.com/embed/VIDEO_ID";

  const { data: heroes } = useQuery(heroQueryOptions);
  const hero = heroes?.[0];

  const title = hero?.title ? stripHtml(hero.title) : t('hero.defaultTitle');
  const description = hero?.description
    ? stripHtml(hero.description)
    : t('hero.defaultDesc');
  const partners = hero?.partners ?? [];

  return (
    <section
      id='hero'
      className='bg-pattern relative overflow-hidden pt-32 lg:pt-40 pb-20 lg:pb-28'
    >
      <div className='glow w-[620px] h-[620px] -top-40 -right-40'></div>
      <div className='glow w-[420px] h-[420px] top-1/3 -left-32 opacity-70'></div>

      <div className='layer-content mx-auto max-w-7xl px-5 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-10 items-center'>
        <div className='max-w-xl'>
          <div className='eyebrow mb-6' data-anim='fade-up'>
            <span className='w-2 h-2 rounded-full bg-primary'></span>
            {t('hero.eyebrow')}
          </div>

          <h1
            className='text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.18] text-ink'
            data-anim='fade-up'
          >
            {title}
          </h1>

          <p
            className='mt-6 text-lg text-ink-soft leading-relaxed'
            data-anim='fade-up'
          >
            {description}
          </p>

          <div
            className='hero-actions mt-9 flex flex-wrap items-center gap-4'
            data-anim='fade-up'
          >
            <a
              href='#pricing'
              className='btn btn-primary px-8 py-4 text-lg cta-pulse'
            >
              {t('hero.cta')}
            </a>
            <button
              type="button"
              className="btn btn-ghost px-7 py-4 text-lg"
              aria-expanded={isVideoOpen}
              aria-controls="hero-video-player"
              onClick={() => setIsVideoOpen((open) => !open)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-primary-600">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>{t("hero.watch")}</span>
            </button>
          </div>

          {isVideoOpen && (
            <div id="hero-video-player" className="inline-video-player">
              <div className="inline-video-player__header">
                <span>{t("hero.watch")}</span>
                <button
                  type="button"
                  className="inline-video-player__close"
                  aria-label={t('a11y.closeVideo')}
                  onClick={() => setIsVideoOpen(false)}
                >
                  ×
                </button>
              </div>
              <iframe
                src={`${videoSrc}?autoplay=1&rel=0`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}

          <div
            className='mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-ink-muted'
            data-anim='fade-up'
          >
            {(t.raw('hero.features') as string[]).map((label) => (
              <span key={label} className='flex items-center gap-2'>
                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='var(--primary-700)' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
                  <polyline points='20 6 9 17 4 12' />
                </svg>
                {label}
              </span>
            ))}
          </div>

          <div
            className='mt-7 flex flex-wrap items-center gap-2.5'
            data-anim='fade-up'
          >
            <span className='text-xs font-bold text-neutral-400'>{t('hero.integrationsLabel')}</span>
            {partners.length > 0
              ? partners.map((p) => (
                  <span
                    key={p.name}
                    className='px-3 py-1.5 rounded-full bg-white border border-primary-line text-xs font-bold text-ink-soft'
                  >
                    {p.name}
                  </span>
                ))
              : ['WordPress', 'Shopify', 'سلة', 'زد'].map((name) => (
                  <span
                    key={name}
                    className='px-3 py-1.5 rounded-full bg-white border border-primary-line text-xs font-bold text-ink-soft'
                  >
                    {name}
                  </span>
                ))}
          </div>
        </div>

        <div className='relative' data-anim='zoom'>
          <div className='absolute inset-6 rounded-[2.5rem] bg-primary/10 blur-3xl'></div>
          <div className='surface pattern-card relative p-5 sm:p-6'>
            <div className='flex items-center justify-between mb-5'>
              <div className='flex items-center gap-2'>
                <span className='w-3 h-3 rounded-full bg-[#ff6058]'></span>
                <span className='w-3 h-3 rounded-full bg-[#ffbd2e]'></span>
                <span className='w-3 h-3 rounded-full bg-primary'></span>
              </div>
              <div className='text-xs font-bold text-neutral-400'>{t('hero.dashboardTitle')}</div>
            </div>

            <div className='grid grid-cols-5 gap-4'>
              <div className='col-span-2 rounded-2xl bg-primary-surface border border-primary-line p-4 flex flex-col items-center justify-center'>
                <div className='relative w-[110px] h-[110px]'>
                  <svg viewBox='0 0 120 120' className='w-full h-full -rotate-90'>
                    <circle className='ring-track' cx='60' cy='60' r='50' fill='none' strokeWidth='11' />
                    <circle
                      id='hero-ring'
                      className='ring-value'
                      cx='60' cy='60' r='50'
                      fill='none' strokeWidth='11'
                      strokeDasharray='314' strokeDashoffset='314'
                      data-offset='38'
                    />
                  </svg>
                  <div className='absolute inset-0 flex flex-col items-center justify-center'>
                    <span className='text-2xl font-extrabold text-ink' data-counter data-target='88'>0</span>
                    <span className='text-[10px] font-bold text-neutral-400'>{t('hero.seoHealth')}</span>
                  </div>
                </div>
                <div className='mt-2 text-xs font-bold text-primary-700'>{t('hero.excellent')}</div>
              </div>

              <div className='col-span-3 grid grid-rows-2 gap-4'>
                <div className='rounded-2xl bg-white border border-primary-line p-3.5'>
                  <div className='text-[11px] font-bold text-neutral-400 mb-1'>{t('hero.pagesCrawled')}</div>
                  <div className='text-xl font-extrabold text-ink' data-counter data-target='1284'>0</div>
                  <div className='mt-2 h-1.5 rounded-full bg-primary-line overflow-hidden'>
                    <div className='h-full w-[82%] bg-primary rounded-full'></div>
                  </div>
                </div>
                <div className='rounded-2xl bg-white border border-primary-line p-3.5'>
                  <div className='text-[11px] font-bold text-neutral-400 mb-1'>{t('hero.issuesFixed')}</div>
                  <div className='text-xl font-extrabold text-ink' data-counter data-target='342'>0</div>
                  <div className='mt-2 h-1.5 rounded-full bg-primary-line overflow-hidden'>
                    <div className='h-full w-[64%] bg-primary rounded-full'></div>
                  </div>
                </div>
              </div>
            </div>

            <div className='mt-4 rounded-2xl bg-primary-surface border border-primary-line p-4'>
              <div className='flex items-center gap-2 mb-3'>
                <span className='w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center'>
                  <svg width='14' height='14' viewBox='0 0 24 24' fill='var(--primary-700)'>
                    <path d='M12 2l2.4 5.6L20 9l-5.6 2.4L12 17l-2.4-5.6L4 9l5.6-1.4z' />
                  </svg>
                </span>
                <span className='text-xs font-extrabold text-ink'>{t('hero.aiSuggestion')}</span>
                <span className='mr-auto text-[10px] font-bold text-primary-700 bg-primary/15 px-2 py-1 rounded-full'>{t('hero.badgeNew')}</span>
              </div>
              <div className='text-[13px] font-semibold text-ink-soft leading-relaxed'>
                {t('hero.sampleSuggestion')}
              </div>
              <div className='mt-3 flex gap-2'>
                <button className='text-[11px] font-bold bg-primary text-ink px-3 py-1.5 rounded-full'>{t('hero.accept')}</button>
                <button className='text-[11px] font-bold bg-white border border-primary-line text-ink-soft px-3 py-1.5 rounded-full'>{t('hero.edit')}</button>
              </div>
            </div>
          </div>

          <div className='floaty float-card absolute -top-6 -left-4 sm:-left-8 p-3.5 hidden sm:block' data-float='1'>
            <div className='flex items-center gap-2.5'>
              <span className='w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center'>
                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='var(--primary-700)' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M3 3v18h18' /><path d='M7 14l4-4 3 3 5-6' />
                </svg>
              </span>
              <div>
                <div className='text-[10px] font-bold text-neutral-400'>{t('hero.organicVisits')}</div>
                <div className='text-sm font-extrabold text-ink'>+47%</div>
              </div>
            </div>
          </div>

          <div className='floaty float-card absolute -bottom-6 -right-3 sm:-right-7 p-3.5 hidden sm:block' data-float='2'>
            <div className='flex items-center gap-2.5'>
              <span className='w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center'>
                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='var(--primary-700)' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M22 11.08V12a10 10 0 11-5.93-9.14' /><polyline points='22 4 12 14.01 9 11.01' />
                </svg>
              </span>
              <div>
                <div className='text-[10px] font-bold text-neutral-400'>{t('hero.autoApplied')}</div>
                <div className='text-sm font-extrabold text-ink'>{t('hero.improvementsToday')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
