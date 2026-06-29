import { apiFetch, stripHtml } from '@/lib/landing-api';
import type { Pricing } from '@/features/landing/types/landing-api';
import { PricingCards, type Plan } from './PricingCards';

const FALLBACK_PLANS: Plan[] = [
  {
    id: 'f0',
    name: 'المؤسسات',
    description: 'للفرق الكبيرة وعدة مواقع',
    monthly: '499',
    annual: '399',
    action: 'تواصل مع المبيعات',
    barClass: 'from-[#caa24a] via-[#5d7a2c] to-[#14210a]',
    features: ['صفحات غير محدودة', 'مواقع متعددة + صلاحيات فرق', 'تقارير تاريخية كاملة', 'مدير حساب مخصص', 'دعم أولوية على مدار الساعة'],
  },
  {
    id: 'f1',
    name: 'الاحترافي',
    description: 'للمتاجر والمواقع النامية',
    monthly: '199',
    annual: '159',
    action: 'ابدأ الآن',
    barClass: 'from-[#9ed25a] to-[#3f6e1f]',
    features: ['فحص حتى 5000 صفحة', 'تقارير متقدمة ومراقبة مستمرة', 'اقتراحات ذكاء اصطناعي غير محدودة'],
  },
  {
    id: 'f2',
    name: 'المبتدئ',
    description: 'لموقع واحد صغير',
    monthly: '0',
    annual: '0',
    action: 'ابدأ مجاناً',
    barClass: 'from-[#dbe7c8] to-[#a9c787]',
    features: ['فحص حتى 100 صفحة', 'تقرير صحة SEO أساسي', '20 اقتراح بالذكاء الاصطناعي شهرياً'],
  },
];

const BAR_CLASSES = [
  'from-[#caa24a] via-[#5d7a2c] to-[#14210a]',
  'from-[#9ed25a] to-[#3f6e1f]',
  'from-[#dbe7c8] to-[#a9c787]',
];

export async function PricingSection() {
  let plans: Plan[] = FALLBACK_PLANS;
  let title = 'باقات تناسب حجم أعمالك';

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
          name: stripHtml(item?.title) || `الباقة ${i + 1}`,
          description: stripHtml(item?.description),
          monthly: priceStr,
          annual,
          features: Array.isArray(item?.features)
            ? item.features.map((f: string) => stripHtml(f)).filter(Boolean)
            : [],
          action: stripHtml(item?.button_text) || (annualNum === 0 ? 'ابدأ مجاناً' : 'ابدأ الآن'),
          barClass: BAR_CLASSES[i % BAR_CLASSES.length],
        };
      });
    }
  } catch {
    // use fallback plans
  }

  return <PricingCards plans={plans} title={title} />;
}
