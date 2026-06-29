import { getTranslations } from 'next-intl/server';
import { apiFetch, stripHtml } from '@/lib/landing-api';
import type { Pricing } from '@/features/landing/types/landing-api';
import { PricingCards, type Plan } from './PricingCards';

const BAR_CLASSES = [
  'from-[#caa24a] via-[#5d7a2c] to-[#14210a]',
  'from-[#9ed25a] to-[#3f6e1f]',
  'from-[#dbe7c8] to-[#a9c787]',
];

export async function PricingSection() {
  const t = await getTranslations('landing');

  const FALLBACK_PLANS: Plan[] = [
    {
      id: 'f0',
      name: t('pricing.plan0Name'),
      description: t('pricing.plan0Desc'),
      monthly: '499',
      annual: '399',
      action: t('pricing.plan0Action'),
      barClass: 'from-[#caa24a] via-[#5d7a2c] to-[#14210a]',
      features: t.raw('pricing.plan0Features') as string[],
    },
    {
      id: 'f1',
      name: t('pricing.plan1Name'),
      description: t('pricing.plan1Desc'),
      monthly: '199',
      annual: '159',
      action: t('pricing.plan1Action'),
      barClass: 'from-[#9ed25a] to-[#3f6e1f]',
      features: t.raw('pricing.plan1Features') as string[],
    },
    {
      id: 'f2',
      name: t('pricing.plan2Name'),
      description: t('pricing.plan2Desc'),
      monthly: '0',
      annual: '0',
      action: t('pricing.plan2Action'),
      barClass: 'from-[#dbe7c8] to-[#a9c787]',
      features: t.raw('pricing.plan2Features') as string[],
    },
  ];

  let plans: Plan[] = FALLBACK_PLANS;
  let title = t('pricing.defaultTitle');

  try {
    const raw = await apiFetch<Pricing | Pricing[]>('/api/v1/pricing?lang=ar');
    const pricing = Array.isArray(raw) ? raw[0] : raw;

    if (pricing?.title) {
      title = stripHtml(pricing.title) || title;
    }

    const items = pricing?.packages?.items;
    if (Array.isArray(items) && items.length > 0) {
      plans = items.map((item, i) => {
        const priceStr = String(item?.price ?? '0');
        const annualNum = parseFloat(priceStr);
        const annual =
          isNaN(annualNum) || annualNum === 0
            ? priceStr
            : String(Math.round(annualNum * 0.8));

        return {
          id: String(i),
          name: stripHtml(item?.title) || t('pricing.defaultPlanName', { n: i + 1 }),
          description: stripHtml(item?.description),
          monthly: priceStr,
          annual,
          features: Array.isArray(item?.features)
            ? item.features.map((f: string) => stripHtml(f)).filter(Boolean)
            : [],
          action: stripHtml(item?.button_text) || (annualNum === 0 ? t('pricing.plan2Action') : t('pricing.plan1Action')),
          barClass: BAR_CLASSES[i % BAR_CLASSES.length],
        };
      });
    }
  } catch {
    // use fallback plans
  }

  return <PricingCards plans={plans} title={title} />;
}
