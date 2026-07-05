"use client";

import parse from 'html-react-parser';
import { useLocale, useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { stripHtml } from '@/lib/landing-api';
import { privacyPolicyQueryOptions, termsOfUseQueryOptions } from '../../landing/queries/queries';
import type { LegalPage } from '../../landing/types/landing-api';

function LegalContentBody({
  eyebrow,
  data,
}: {
  eyebrow: string;
  data: LegalPage | undefined;
}) {
  return (
    <section className='bg-pattern relative overflow-hidden pt-32 pb-14 lg:pb-20 lg:pt-40'>
      <div className='glow -top-20 left-1/2 h-[440px] w-[440px] -translate-x-1/2 opacity-40' />

      <div className='layer-content mx-auto max-w-4xl px-5 lg:px-8'>
        <div className='mb-10 text-center' data-anim='fade-up'>
          <div className='eyebrow mb-5'>{eyebrow}</div>
          <h1 className='text-3xl font-extrabold leading-[1.25] text-ink sm:text-4xl lg:text-[2.7rem]'>
            {stripHtml(data?.title)}
          </h1>
        </div>

        <div className='surface pattern-card relative overflow-hidden p-6 sm:p-10' data-anim='fade-up'>
          <div className='swirl-watermark inset-0 bg-center' style={{ opacity: '0.04' }} />
          <div className='legal-prose relative'>
            {data?.description && (
              <div className='legal-prose-intro'>{parse(data.description)}</div>
            )}
            {parse(data?.content?? "")}
          </div>
        </div>
      </div>
    </section>
  );
}

function TermsOfUseContent() {
  const t = useTranslations('legal.termsOfUse');
  const locale = useLocale();
  const { data } = useQuery(termsOfUseQueryOptions(locale));

  return <LegalContentBody eyebrow={t('eyebrow')} data={data} />;
}

function PrivacyPolicyContent() {
  const t = useTranslations('legal.privacyPolicy');
  const locale = useLocale();
  const { data } = useQuery(privacyPolicyQueryOptions(locale));

  return <LegalContentBody eyebrow={t('eyebrow')} data={data} />;
}

export function LegalContent({ namespace }: { namespace: 'termsOfUse' | 'privacyPolicy' }) {
  return namespace === 'termsOfUse' ? <TermsOfUseContent /> : <PrivacyPolicyContent />;
}
