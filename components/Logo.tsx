import { useTranslations } from 'next-intl';
import Image from 'next/image'
import React from 'react'

const Logo = () => {
  const t = useTranslations("auth.header");

  return (
  <div className="flex items-center gap-2">
    <Image
      src="/imgs/logo.webp"
      alt={t("brand")}
      width={40}
      height={40}
      className="size-10 shrink-0"
      priority
    />
    <span className="text-lg font-semibold text-secondary-500">{t("brand")}</span>
  </div>
  )
}

export default Logo