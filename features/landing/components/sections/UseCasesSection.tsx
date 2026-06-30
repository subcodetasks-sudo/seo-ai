"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import parse from "html-react-parser";

import { toolUsageQueryOptions } from "@/features/landing/queries/queries";
import type { ToolUsageSection } from "@/features/landing/types/landing-api";

function getField(sections: ToolUsageSection[], sectionName: string, fieldLabel: string): string | number | undefined {
  return sections
    .find((s) => s.name === sectionName)
    ?.fields.find((f) => f.label === fieldLabel)
    ?.value;
}

export function UseCasesSection() {
  const t = useTranslations('landing');
  const locale = useLocale();

  const { data: toolUsages } = useQuery(toolUsageQueryOptions(locale));
  const item = toolUsages?.[0];
  const features = item?.features ?? [];

  const FEATURE_EYEBROWS = t.raw('usecases.eyebrows') as string[];
  const FEATURE_LINK_LABELS = t.raw('usecases.links') as string[];
  const FEATURE_LINKS = [
    { href: '#pricing', label: FEATURE_LINK_LABELS[0] },
    { href: '#pricing', label: FEATURE_LINK_LABELS[1] },
    { href: '#pricing', label: FEATURE_LINK_LABELS[2] },
    { href: '#stats', label: FEATURE_LINK_LABELS[3] },
  ];

  const sectionTitle = item?.title ? parse(item.title) : 'جولة داخل المنصة — من الفحص إلى النتائج';
  const sectionDesc = item?.description ? parse(item.description) : 'أربع قدرات أساسية تعمل معاً لتمنح موقعك حضوراً أقوى في محركات البحث، مع إبقائك دائماً في موضع التحكّم.';

  const f = (i: number) => {
    const feat = features[i];
    const sections = feat?.sections ?? [];
    const eyebrowFromApi = getField(sections, 'Feature Label', 'Feature Label');
    const buttonText = getField(sections, 'Button', 'Button Text');
    const buttonUrl = getField(sections, 'Button', 'Button URL');
    return {
      eyebrow: eyebrowFromApi ?? FEATURE_EYEBROWS[i] ?? `${t('usecases.eyebrow')} 0${i + 1}`,
      title: feat?.title ? parse(feat.title) : null,
      desc: feat?.description ? parse(feat.description) : null,
      sections,
      link: {
        href: typeof buttonUrl === 'string' ? buttonUrl : (FEATURE_LINKS[i]?.href ?? '#pricing'),
        label: typeof buttonText === 'string' ? buttonText : (FEATURE_LINKS[i]?.label ?? ''),
      },
    };
  };

  // Feature 0 — card data from sections
  const f0 = f(0);
  const f0Sections = features[0]?.sections ?? [];
  const auditStatus = getField(f0Sections, 'Audit', 'Audit Status') ?? t('usecases.scanBadge');
  const auditSpeed = getField(f0Sections, 'Audit', 'Audit Speed') ?? '٢٤٠ صفحة/دقيقة';
  const auditProgress = Number(getField(f0Sections, 'Audit', 'Progress') ?? 76);
  const auditCurrentUrl = getField(f0Sections, 'Audit', 'Current Scan URL') ?? '/products/category/shoes';
  const pagesCrawled = getField(f0Sections, 'Statistics', 'Pages Audited') ?? 1284;
  const issuesFound = getField(f0Sections, 'Statistics', 'Issues Found') ?? 37;
  const healthScore = getField(f0Sections, 'Statistics', 'SEO Health Score') ?? 88;

  return (
    <section
      id='usecases'
      className='bg-pattern relative overflow-hidden py-14 lg:py-20'
    >
      <div className='glow w-[460px] h-[460px] top-10 -left-40 opacity-60'></div>
      <div className='glow w-[420px] h-[420px] bottom-1/4 -right-32 opacity-50'></div>

      <div className='layer-content mx-auto max-w-7xl px-5 lg:px-8'>
        <div
          className='max-w-2xl mx-auto text-center mb-16 lg:mb-24'
          data-anim='fade-up'
        >
          <div className='eyebrow mb-6'>{t('usecases.eyebrow')}</div>
          <h2 className='text-3xl sm:text-4xl lg:text-[2.7rem] font-extrabold leading-[1.25] text-ink'>
            {sectionTitle}
          </h2>
          <div className='mt-5 text-lg text-ink-soft leading-relaxed'>
            {sectionDesc}
          </div>
        </div>

        <div
          id='showcase-flow'
          className='relative space-y-24 lg:space-y-36'
        >
          <svg
            id='flow-svg'
            className='absolute inset-0 w-full h-full pointer-events-none hidden lg:block'
            style={{ zIndex: '0' }}
            fill='none'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
          >
            <defs>
              <linearGradient id='flowGrad' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#bedc6f' />
                <stop offset='100%' stopColor='#759c25' />
              </linearGradient>
              <filter
                id='flowGlow'
                x='-60%'
                y='-60%'
                width='220%'
                height='220%'
              >
                <feGaussianBlur stdDeviation='3.2' result='b' />
                <feMerge>
                  <feMergeNode in='b' />
                  <feMergeNode in='SourceGraphic' />
                </feMerge>
              </filter>
            </defs>
            <path
              id='flow-base'
              stroke='#a0cd39'
              strokeOpacity='0.18'
              strokeWidth='2'
              strokeLinecap='round'
              strokeDasharray='1 9'
            />
            <path
              id='flow-progress'
              stroke='url(#flowGrad)'
              strokeWidth='2.5'
              strokeLinecap='round'
              filter='url(#flowGlow)'
            />
            <g id='flow-nodes'></g>
            <g id='flow-orb' style={{ opacity: '0' }}>
              <circle
                r='9'
                fill='#a0cd39'
                fillOpacity="0.25"
                filter='url(#flowGlow)'
              />
              <circle r='6' fill='#a0cd39' filter='url(#flowGlow)' />
              <circle r='2.6' fill='#ffffff' />
            </g>
          </svg>

          {/* Feature 0 — Website Audit */}
          <div className='feature-block relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16'>
            <div className='lg:w-1/2' data-anim='slide' data-from='right'>
              <div className='eyebrow mb-5'>{f0.eyebrow}</div>
              {f0.title && (
                <h3 className='text-2xl sm:text-3xl lg:text-[2.2rem] font-extrabold leading-[1.3] text-ink'>
                  {f0.title}
                </h3>
              )}
              <div className='mt-5 text-lg text-ink-soft leading-relaxed'>
                {f0.desc ?? t('usecases.feature0DefaultDesc')}
              </div>
              <a
                href={f0.link.href}
                className='group inline-flex items-center gap-2 mt-7 text-primary-700 font-extrabold text-lg border-b-2 border-primary pb-1'
              >
                {f0.link.label}
                <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' className='transition-transform group-hover:-translate-x-1'>
                  <line x1='19' y1='12' x2='5' y2='12' />
                  <polyline points='12 19 5 12 12 5' />
                </svg>
              </a>
            </div>
            <div className='lg:w-1/2 w-full relative' data-anim='slide' data-from='left'>
              <div className='absolute inset-8 rounded-[2.5rem] bg-primary/10 blur-3xl'></div>
              <div className='surface hover-lift pattern-card relative p-6 sm:p-7'>
                <div className='flex items-center justify-between mb-5'>
                  <div className='flex items-center gap-2'>
                    <span className='w-3 h-3 rounded-full bg-[#ff6058]'></span>
                    <span className='w-3 h-3 rounded-full bg-[#ffbd2e]'></span>
                    <span className='w-3 h-3 rounded-full bg-primary'></span>
                  </div>
                  <span className='text-xs font-bold text-primary-700 bg-primary/15 px-3 py-1.5 rounded-full flex items-center gap-1.5'>
                    <span className='w-1.5 h-1.5 rounded-full bg-primary'></span> {String(auditStatus)}
                  </span>
                </div>
                <div className='rounded-2xl bg-primary-surface border border-primary-line p-5'>
                  <div className='flex items-center justify-between mb-2.5'>
                    <span className='text-sm font-extrabold text-ink'>{t('usecases.scanProgress')}</span>
                    <span className='text-sm font-extrabold text-primary-700'>{auditProgress}%</span>
                  </div>
                  <div className='h-2.5 rounded-full bg-primary-line overflow-hidden'>
                    <div className='crawl-bar h-full bg-primary rounded-full' style={{ width: `${auditProgress}%` }}></div>
                  </div>
                  <div className='mt-2 text-xs font-bold text-neutral-400'>{String(auditCurrentUrl)}</div>
                </div>
                <div className='mt-4 grid grid-cols-3 gap-3'>
                  <div className='rounded-2xl bg-white border border-primary-line p-4 text-center'>
                    <div className='text-2xl font-extrabold text-ink'>{pagesCrawled}</div>
                    <div className='text-[10px] font-bold text-neutral-400 mt-1'>{t('usecases.pagesCrawled')}</div>
                  </div>
                  <div className='rounded-2xl bg-white border border-primary-line p-4 text-center'>
                    <div className='text-2xl font-extrabold text-[#b8851c]'>{issuesFound}</div>
                    <div className='text-[10px] font-bold text-neutral-400 mt-1'>{t('usecases.issuesFound')}</div>
                  </div>
                  <div className='rounded-2xl bg-primary/12 border border-primary/30 p-4 text-center'>
                    <div className='text-2xl font-extrabold text-primary-700'>{healthScore}</div>
                    <div className='text-[10px] font-bold text-primary-700 mt-1'>{t('usecases.seoHealth')}</div>
                  </div>
                </div>
              </div>
              <div className='floaty absolute -top-6 -right-3 sm:-right-7 p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 shadow-[0_24px_48px_-22px_rgba(19,26,20,0.22)] hidden sm:block' data-float='a'>
                <div className='flex items-center gap-2.5'>
                  <span className='w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center'>
                    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='var(--primary-700)' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round'>
                      <path d='M13 2L3 14h9l-1 8 10-12h-9z' />
                    </svg>
                  </span>
                  <div>
                    <div className='text-[10px] font-bold text-neutral-400'>{t('usecases.scanSpeed')}</div>
                    <div className='text-sm font-extrabold text-ink'>{String(auditSpeed)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 1 — AI Panel */}
          <div className='feature-block relative z-10 flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16'>
            <div className='lg:w-1/2' data-anim='slide' data-from='left'>
              <div className='eyebrow mb-5'>{f(1).eyebrow}</div>
              <h3 className='text-2xl sm:text-3xl lg:text-[2.2rem] font-extrabold leading-[1.3] text-ink'>
                {f(1).title ?? t('usecases.feature1DefaultTitle')}
              </h3>
              <div className='mt-5 text-lg text-ink-soft leading-relaxed'>
                {f(1).desc ?? t('usecases.feature1DefaultDesc')}
              </div>
              <a href={f(1).link.href} className='group inline-flex items-center gap-2 mt-7 text-primary-700 font-extrabold text-lg border-b-2 border-primary pb-1'>
                {f(1).link.label}
                <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' className='transition-transform group-hover:-translate-x-1'>
                  <line x1='19' y1='12' x2='5' y2='12' />
                  <polyline points='12 19 5 12 12 5' />
                </svg>
              </a>
            </div>
            <div className='lg:w-1/2 w-full relative' data-anim='slide' data-from='right'>
              <div className='absolute inset-8 rounded-[2.5rem] bg-primary/10 blur-3xl'></div>
              <div className='surface hover-lift pattern-card relative p-6 sm:p-7'>
                <div className='flex items-center gap-2 mb-5'>
                  <span className='w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center'>
                    <svg width='16' height='16' viewBox='0 0 24 24' fill='var(--primary-700)'><path d='M12 2l2.4 5.6L20 9l-5.6 2.4L12 17l-2.4-5.6L4 9l5.6-1.4z' /></svg>
                  </span>
                  <span className='text-sm font-extrabold text-ink'>{t('usecases.aiPanel')}</span>
                </div>
                <div className='rounded-2xl bg-primary-surface border border-primary-line p-4'>
                  <div className='text-[11px] font-extrabold text-neutral-400 mb-2'>{t('usecases.metaTitle')}</div>
                  <div className='flex items-start gap-2 mb-2'>
                    <span className='text-[10px] font-bold text-[#c0392b] bg-[#fdecea] px-2 py-0.5 rounded-md mt-0.5 shrink-0'>{t('usecases.before')}</span>
                    <span className='text-[13px] text-neutral-400 line-through'>{t('usecases.sampleOldTitle')}</span>
                  </div>
                  <div className='flex items-start gap-2'>
                    <span className='text-[10px] font-bold text-primary-700 bg-primary/15 px-2 py-0.5 rounded-md mt-0.5 shrink-0'>{t('usecases.after')}</span>
                    <span className='text-[13px] font-semibold text-ink'>{t('usecases.sampleNewTitle')}</span>
                  </div>
                </div>
                <div className='mt-3 rounded-2xl bg-primary-surface border border-primary-line p-4'>
                  <div className='text-[11px] font-extrabold text-neutral-400 mb-2'>{t('usecases.metaDesc')}</div>
                  <div className='flex items-start gap-2 mb-2'>
                    <span className='text-[10px] font-bold text-[#c0392b] bg-[#fdecea] px-2 py-0.5 rounded-md mt-0.5 shrink-0'>{t('usecases.before')}</span>
                    <span className='text-[13px] text-neutral-400 line-through'>{t('usecases.sampleOldDesc')}</span>
                  </div>
                  <div className='flex items-start gap-2'>
                    <span className='text-[10px] font-bold text-primary-700 bg-primary/15 px-2 py-0.5 rounded-md mt-0.5 shrink-0'>{t('usecases.after')}</span>
                    <span className='text-[13px] font-semibold text-ink'>{t('usecases.sampleNewDesc')}</span>
                  </div>
                </div>
                <div className='mt-3 flex items-center gap-2 rounded-xl bg-white border border-primary-line px-4 py-3'>
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='var(--primary-700)' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round'>
                    <polyline points='16 18 22 12 16 6' /><polyline points='8 6 2 12 8 18' />
                  </svg>
                  <span className='text-[13px] font-semibold text-ink-soft'>{t('usecases.schemaBadge')}</span>
                  <span className='mr-auto text-[10px] font-bold text-primary-700 bg-primary/15 px-2 py-1 rounded-full'>{t('usecases.schemaReady')}</span>
                </div>
              </div>
              <div className='floaty absolute -bottom-6 -left-3 sm:-left-8 p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 shadow-[0_24px_48px_-22px_rgba(19,26,20,0.22)] hidden sm:block' data-float='b'>
                <div className='flex items-center gap-2.5'>
                  <span className='w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center'>
                    <svg width='18' height='18' viewBox='0 0 24 24' fill='var(--primary-700)'><path d='M12 2l2.4 5.6L20 9l-5.6 2.4L12 17l-2.4-5.6L4 9l5.6-1.4z' /></svg>
                  </span>
                  <div>
                    <div className='text-[10px] font-bold text-neutral-400'>{t('usecases.generatedNow')}</div>
                    <div className='text-sm font-extrabold text-ink'>{t('usecases.generatedCount')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 — Review & Approve */}
          <div className='feature-block relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16'>
            <div className='lg:w-1/2' data-anim='slide' data-from='right'>
              <div className='eyebrow mb-5'>{f(2).eyebrow}</div>
              <h3 className='text-2xl sm:text-3xl lg:text-[2.2rem] font-extrabold leading-[1.3] text-ink'>
                {f(2).title ?? t('usecases.feature2DefaultTitle')}
              </h3>
              <div className='mt-5 text-lg text-ink-soft leading-relaxed'>
                {f(2).desc ?? t('usecases.feature2DefaultDesc')}
              </div>
              <a href={f(2).link.href} className='group inline-flex items-center gap-2 mt-7 text-primary-700 font-extrabold text-lg border-b-2 border-primary pb-1'>
                {f(2).link.label}
                <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' className='transition-transform group-hover:-translate-x-1'>
                  <line x1='19' y1='12' x2='5' y2='12' />
                  <polyline points='12 19 5 12 12 5' />
                </svg>
              </a>
            </div>
            <div className='lg:w-1/2 w-full relative' data-anim='slide' data-from='left'>
              <div className='absolute inset-8 rounded-[2.5rem] bg-primary/10 blur-3xl'></div>
              <div className='surface hover-lift pattern-card relative p-6 sm:p-7'>
                <div className='flex items-center justify-between mb-5'>
                  <span className='text-sm font-extrabold text-ink'>{t('usecases.reviewChanges')}</span>
                  <span className='text-xs font-bold text-[#b8851c] bg-[#fff6e6] px-3 py-1.5 rounded-full'>{t('usecases.pendingApproval')}</span>
                </div>
                <div className='rounded-2xl bg-primary-surface border border-primary-line p-4'>
                  <div className='text-[11px] font-extrabold text-neutral-400 mb-3'>{t('usecases.proposedChange')}</div>
                  <div className='rounded-xl bg-[#fdecea] border border-[#f5c6c0] px-3 py-2.5 mb-2'>
                    <span className='text-[13px] text-[#a93226] line-through'>{t('usecases.sampleOldPageTitle')}</span>
                  </div>
                  <div className='flex justify-center my-1 text-[#9aa49a]'>
                    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round'>
                      <line x1='12' y1='5' x2='12' y2='19' /><polyline points='19 12 12 19 5 12' />
                    </svg>
                  </div>
                  <div className='rounded-xl bg-primary/12 border border-primary/30 px-3 py-2.5'>
                    <span className='text-[13px] font-semibold text-[#2f4012]'>{t('usecases.sampleNewPageTitle')}</span>
                  </div>
                </div>
                <div className='mt-4 flex items-center gap-2.5'>
                  <button className='flex-1 inline-flex items-center justify-center gap-2 bg-primary text-ink font-extrabold py-3 rounded-full'>
                    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
                      <polyline points='20 6 9 17 4 12' />
                    </svg>
                    {t('usecases.approveApply')}
                  </button>
                  <button className='inline-flex items-center justify-center gap-2 bg-white border border-primary-line text-ink-soft font-bold py-3 px-4 rounded-full'>{t('usecases.editBtn')}</button>
                  <button className='inline-flex items-center justify-center w-11 h-11 bg-white border border-primary-line text-[#c0392b] rounded-full' aria-label={t('usecases.reject')}>
                    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
                      <line x1='18' y1='6' x2='6' y2='18' /><line x1='6' y1='6' x2='18' y2='18' />
                    </svg>
                  </button>
                </div>
              </div>
              <div className='floaty absolute -top-6 -left-3 sm:-left-8 p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 shadow-[0_24px_48px_-22px_rgba(19,26,20,0.22)] hidden sm:block' data-float='c'>
                <div className='flex items-center gap-2.5'>
                  <span className='w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center'>
                    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='var(--primary-700)' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round'>
                      <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />
                    </svg>
                  </span>
                  <div>
                    <div className='text-[10px] font-bold text-neutral-400'>{t('usecases.finalDecision')}</div>
                    <div className='text-sm font-extrabold text-ink'>{t('usecases.alwaysYours')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 — Monitoring Dashboard */}
          <div className='feature-block relative z-10 flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16'>
            <div className='lg:w-1/2' data-anim='slide' data-from='left'>
              <div className='eyebrow mb-5'>{f(3).eyebrow}</div>
              <h3 className='text-2xl sm:text-3xl lg:text-[2.2rem] font-extrabold leading-[1.3] text-ink'>
                {f(3).title ?? t('usecases.feature3DefaultTitle')}
              </h3>
              <div className='mt-5 text-lg text-ink-soft leading-relaxed'>
                {f(3).desc ?? t('usecases.feature3DefaultDesc')}
              </div>
              <a href={f(3).link.href} className='group inline-flex items-center gap-2 mt-7 text-primary-700 font-extrabold text-lg border-b-2 border-primary pb-1'>
                {f(3).link.label}
                <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' className='transition-transform group-hover:-translate-x-1'>
                  <line x1='19' y1='12' x2='5' y2='12' />
                  <polyline points='12 19 5 12 12 5' />
                </svg>
              </a>
            </div>
            <div className='lg:w-1/2 w-full relative' data-anim='slide' data-from='right'>
              <div className='absolute inset-8 rounded-[2.5rem] bg-primary/10 blur-3xl'></div>
              <div className='surface hover-lift pattern-card relative p-6 sm:p-7'>
                <div className='flex items-center justify-between mb-5'>
                  <div>
                    <div className='text-sm font-extrabold text-ink'>{t('usecases.monitoringDashboard')}</div>
                    <div className='text-xs text-neutral-400'>{t('usecases.last6Months')}</div>
                  </div>
                  <span className='text-xs font-bold text-primary-700 bg-primary/15 px-3 py-1.5 rounded-full'>{t('usecases.performanceGain')}</span>
                </div>
                <div className='rounded-2xl bg-primary-surface border border-primary-line p-5'>
                  <div className='text-[11px] font-extrabold text-neutral-400 mb-3'>{t('usecases.seoHealthProgress')}</div>
                  <svg viewBox='0 0 320 110' className='w-full h-28' preserveAspectRatio='none'>
                    <defs>
                      <linearGradient id='trendFill' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='0%' stopColor='#a0cd39' stopOpacity='0.35' />
                        <stop offset='100%' stopColor='#a0cd39' stopOpacity='0' />
                      </linearGradient>
                    </defs>
                    <path d='M0,88 L53,74 L106,80 L160,52 L213,44 L266,26 L320,16 L320,110 L0,110 Z' fill='url(#trendFill)' />
                    <path className='trend-line' d='M0,88 L53,74 L106,80 L160,52 L213,44 L266,26 L320,16' fill='none' stroke='#a0cd39' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round' />
                    <circle cx='320' cy='16' r='4' fill='#759c25' />
                  </svg>
                </div>
                <div className='mt-4 grid grid-cols-2 gap-3'>
                  <div className='flex items-center gap-3 rounded-xl bg-white border border-primary-line px-4 py-3'>
                    <span className='w-9 h-9 rounded-xl bg-[#fdecea] flex items-center justify-center text-[#c0392b] font-extrabold text-xs'>404</span>
                    <div>
                      <div className='text-base font-extrabold text-ink'>3</div>
                      <div className='text-[10px] font-bold text-neutral-400'>{t('usecases.brokenPages')}</div>
                    </div>
                  </div>
                  <div className='flex items-center gap-3 rounded-xl bg-white border border-primary-line px-4 py-3'>
                    <span className='w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center'>
                      <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='var(--primary-700)' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round'>
                        <path d='M9 11l3 3L22 4' /><path d='M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11' />
                      </svg>
                    </span>
                    <div>
                      <div className='text-base font-extrabold text-ink'>128</div>
                      <div className='text-[10px] font-bold text-neutral-400'>{t('usecases.trackedIssues')}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='floaty absolute -bottom-6 -right-3 sm:-right-8 p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 shadow-[0_24px_48px_-22px_rgba(19,26,20,0.22)] hidden sm:block w-[220px]' data-float='d'>
                <div className='flex items-start gap-2.5'>
                  <span className='w-9 h-9 rounded-xl bg-[#fff6e6] flex items-center justify-center shrink-0'>
                    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='#b8851c' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round'>
                      <path d='M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9' /><path d='M13.73 21a2 2 0 01-3.46 0' />
                    </svg>
                  </span>
                  <div>
                    <div className='text-[10px] font-bold text-neutral-400'>{t('usecases.newAlert')}</div>
                    <div className='text-[13px] font-extrabold text-ink leading-snug'>{t('usecases.alertText')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
