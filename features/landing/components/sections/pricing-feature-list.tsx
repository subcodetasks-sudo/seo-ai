'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import parse from 'html-react-parser';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface Props {
  planName: string;
  features: string[];
  isActive: boolean;
  barClass: string;
}

export function PricingFeatureList({ planName, features, isActive, barClass }: Props) {
  const t = useTranslations('landing');
  const listRef = useRef<HTMLUListElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) {
      setHasOverflow(false);
      return;
    }

    function updateOverflow() {
      if (!list) return;
      setHasOverflow(list.scrollHeight > list.clientHeight + 1);
    }

    updateOverflow();

    const observer = new ResizeObserver(updateOverflow);
    observer.observe(list);
    return () => observer.disconnect();
  }, [features]);

  return (
    <div className='mt-9'>
      <ul
        ref={listRef}
        className={cn(
          'max-h-64 space-y-4 overflow-hidden text-lg font-semibold leading-7',
          isActive ? 'text-ink/80' : 'text-ink-soft'
        )}
      >
        {features.map((feature, fi) => (
          <li className='flex items-center gap-3' key={fi}>
            <span className='check pricing-check'></span>
            <span>{parse(feature)}</span>
          </li>
        ))}
      </ul>

      {hasOverflow && (
        <Dialog>
          <DialogTrigger asChild>
            <button
              type='button'
              onClick={(e) => e.stopPropagation()}
              className='mt-3 text-sm font-bold text-primary-700 hover:underline'
            >
              {t('pricing.showMore')}
            </button>
          </DialogTrigger>
          <DialogContent
            onClick={(e) => e.stopPropagation()}
            className='overflow-hidden rounded-3xl border-0 p-0 shadow-[0_40px_90px_-30px_rgba(20,33,10,0.45)] sm:max-w-lg'
          >
            <span aria-hidden className={`block h-2 w-full bg-linear-to-r ${barClass}`}></span>

            <div className='max-h-[75vh] overflow-y-auto p-6 sm:p-8'>
              <DialogHeader className='mb-1'>
                <DialogTitle className='text-2xl font-extrabold text-ink'>
                  {parse(planName)}
                </DialogTitle>
                <DialogDescription className='sr-only'>
                  {t('pricing.allFeaturesTitle')}
                </DialogDescription>
              </DialogHeader>
              <p className='mb-6 text-sm font-semibold text-neutral-400'>
                {t('pricing.allFeaturesTitle')}
              </p>

              <ul className='grid gap-3 sm:grid-cols-2'>
                {features.map((feature, fi) => (
                  <li
                    key={fi}
                    className='flex items-center gap-3 rounded-xl bg-primary/5 px-4 py-3'
                  >
                    <span className='flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-white'>
                      <Check size={14} strokeWidth={3} />
                    </span>
                    <span className='text-base font-semibold text-ink'>{parse(feature)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
