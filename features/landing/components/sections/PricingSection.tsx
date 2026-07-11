"use client";
import { useLocale } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { pricingQueryOptions } from '../../queries/queries';
import type { Pricing, PricingPackageItem } from '../../types/landing-api';
import { PricingCards, type Plan } from './PricingCards';

const BAR_CLASSES = [
  'from-[#caa24a] via-[#5d7a2c] to-[#14210a]',
  'from-[#9ed25a] to-[#3f6e1f]',
  'from-[#dbe7c8] to-[#a9c787]',
];

export function PricingSection() {
  const local = useLocale();
  const { data: raw } = useQuery(pricingQueryOptions(local));
  const rawData: Pricing | Pricing[] | undefined = raw;
  const pricing = Array.isArray(rawData) ? rawData[0] : rawData;
  const plans: Plan[] = pricing?.packages?.items.map((item: PricingPackageItem, i: number) => {
    const priceNum = parseFloat(item.price ?? '0');
    // const annual =
    //   isNaN(priceNum) || priceNum === 0
    //     ? item.price
    //     : String(Math.round(priceNum * 0.8));
    return {
      id: String(i),
      name: item.title,
      description: item.description,
      monthly: item.price,
      // annual,
      features: item.features ?? [],
      action: item.button_text,
      barClass: BAR_CLASSES[i % BAR_CLASSES.length],
    };
  }) ?? [];

  // console.log('PricingSection plans:', plans);

  return (
    <PricingCards
      plans={plans}
      eyebrow={pricing?.content ?? ''}
      title={pricing?.title ?? ''}
      subtitle={pricing?.description ?? ''}
    />
  );
}
