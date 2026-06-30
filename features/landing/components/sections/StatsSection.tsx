"use client";
import parse from 'html-react-parser';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { statisticsQueryOptions } from '../../queries/queries';

function parseStatValue(value: string): { prefix: string; target: number; suffix: string } {
  const match = value.trim().match(/^([+]?)([\d,]+)([%]?)$/);
  if (!match) return { prefix: '', target: 0, suffix: value };
  return {
    prefix: match[1],
    target: parseInt(match[2].replace(/,/g, ''), 10),
    suffix: match[3],
  };
}

export function StatsSection() {
  const t = useTranslations('landing');
  const local = useLocale();
  const { data: stats } = useQuery(statisticsQueryOptions(local));

  const cards = stats?.cards?.items ?? [];

  const c0 = cards[0];
  const c1 = cards[1];
  const c2 = cards[2];
  const c3 = cards[3];

  const p0 = parseStatValue(c0?.value ?? '+12,500');
  const p1 = parseStatValue(c1?.value ?? '+8,400,000');
  const p2 = parseStatValue(c2?.value ?? '+63%');
  const p3 = parseStatValue(c3?.value ?? '+2,300,000');

  return (
    <section
      id='stats'
      className='bg-pattern relative overflow-hidden py-14 lg:py-20'
    >
      <div className='glow w-[520px] h-[520px] -bottom-32 -left-20 opacity-55'></div>

      <div className='layer-content mx-auto max-w-7xl px-5 lg:px-8'>
        <div className='max-w-2xl mx-auto text-center mb-14' data-anim='fade-up'>
          <div className='eyebrow mb-6'>{stats?.content ?? t('stats.defaultEyebrow')}</div>
          <h2 className='text-3xl sm:text-4xl lg:text-[2.7rem] font-extrabold leading-[1.25] text-ink'>
            {stats?.title ? parse(stats.title) : t('stats.defaultTitle')}
          </h2>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-[180px]'>
          <div
            className='hover-lift lg:col-span-2 lg:row-span-2 p-8 flex flex-col justify-between relative overflow-visible bg-primary rounded-[1.5rem] border border-primary-500/40 shadow-[0_30px_60px_-32px_rgba(160,205,57,0.6)]'
            data-anim='fade-up'
          >
            <Image
              src='/digital_print.png'
              alt={t('a11y.statisticsAlt')}
              width={260}
              height={260}
              className='absolute -translate-x-1/2 object-cover opacity-20'
              priority
            />
            <div className='swirl-watermark inset-0 bg-center' style={{ opacity: '0.12' }}></div>
            <div className='relative z-20'>
              <div className='text-sm font-extrabold text-primary-900/80'>
                {c0?.title ?? t('stats.defaultLabel0')}
              </div>
            </div>
            <div className='relative z-20'>
              <div className='text-6xl lg:text-7xl font-extrabold text-ink leading-none'>
                <span>{p0.prefix}</span>
                <span data-counter data-target={p0.target}>0</span>
                <span>{p0.suffix}</span>
              </div>
              <p className='mt-4 text-primary-900/85 font-semibold max-w-xs'>
                {c0?.description ?? t('stats.defaultBody')}
              </p>
            </div>
          </div>

          <div className='hover-lift surface pattern-card lg:col-span-2 p-7 flex flex-col justify-center' data-anim='fade-up'>
            <div className='text-sm font-extrabold text-neutral-400 mb-2'>
              {c1?.title ?? t('stats.defaultLabel1')}
            </div>
            <div className='text-4xl lg:text-5xl font-extrabold text-ink leading-none'>
              <span>{p1.prefix}</span>
              <span data-counter data-target={p1.target}>0</span>
              <span className='text-primary-600'>{p1.suffix}</span>
            </div>
            <div className='mt-3 h-2 rounded-full bg-primary-line overflow-hidden'>
              <div className='h-full w-[78%] bg-primary rounded-full'></div>
            </div>
          </div>

          <div className='hover-lift surface pattern-card p-7 flex flex-col justify-center' data-anim='fade-up'>
            <div className='text-sm font-extrabold text-neutral-400 mb-2'>
              {c2?.title ?? t('stats.defaultLabel2')}
            </div>
            <div className='text-4xl font-extrabold text-ink leading-none'>
              <span>{p2.prefix}</span>
              <span data-counter data-target={p2.target}>0</span>
              <span className='text-primary-600'>{p2.suffix}</span>
            </div>
          </div>

          <div className='hover-lift surface pattern-card p-7 flex flex-col justify-center' data-anim='fade-up'>
            <div className='text-sm font-extrabold text-neutral-400 mb-2'>
              {c3?.title ?? t('stats.defaultLabel3')}
            </div>
            <div className='text-4xl font-extrabold text-primary-700 leading-none'>
              <span>{p3.prefix}</span>
              <span data-counter data-target={p3.target}>0</span>
              <span>{p3.suffix}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
