"use client";
import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

interface LicensePreviewDialogProps {
  children: React.ReactNode;
}

export function LicensePreviewDialog({ children }: LicensePreviewDialogProps) {
  const t = useTranslations('landing');
  const [loaded, setLoaded] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='flex h-[85vh] max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl'>
        <DialogHeader className='shrink-0 border-b border-ink/10 p-4'>
          <DialogTitle className='flex items-center gap-2 text-ink'>
            <ShieldCheck size={18} className='shrink-0 text-primary-700' />
            {t('footer.licensePreviewTitle')}
          </DialogTitle>
        </DialogHeader>
        <div className='relative flex-1 overflow-auto bg-neutral-100 p-4'>
          {!loaded && <Skeleton className='absolute inset-4 rounded-lg' />}
          <Image
            src='/imgs/license.jpg'
            alt={t('footer.licensePreviewTitle')}
            width={1240}
            height={1754}
            onLoad={() => setLoaded(true)}
            className={cn(
              'mx-auto h-auto w-full rounded-lg shadow-lg transition-opacity duration-300',
              loaded ? 'opacity-100' : 'opacity-0'
            )}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
