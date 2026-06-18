import Image from 'next/image'
import { useTranslations } from 'next-intl';

const LogoIcon = () => {
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
    </div>
  )
}

export default LogoIcon