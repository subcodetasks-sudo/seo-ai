"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

const LOCALE_OPTIONS: {
  value: Locale;
  labelKey: "english" | "arabic";
  icon: string;
}[] = [
  { value: "en", labelKey: "english", icon: "/imgs/lang-en.svg" },
  { value: "ar", labelKey: "arabic", icon: "/imgs/lang_ar.webp" },
];

function LocaleIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={20}
      height={20}
      className="size-5 shrink-0 rounded-sm object-cover"
    />
  );
}

function LocaleOptionLabel({
  icon,
  label,
}: {
  icon: string;
  label: string;
}) {
  return (
    <span className="flex items-center gap-2">
      <LocaleIcon src={icon} alt={label} />
      <span>{label}</span>
    </span>
  );
}

export function Header() {
  const t = useTranslations("auth.header");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const activeOption =
    LOCALE_OPTIONS.find((option) => option.value === locale) ?? LOCALE_OPTIONS[0];

  return (
    <header className="flex items-center justify-between px-6 py-4 lg:px-10">
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

      <Select
        value={locale}
        onValueChange={(nextLocale) => {
          router.replace(pathname, { locale: nextLocale as Locale });
          router.refresh();
        }}
      >
        <SelectTrigger
          size="sm"
          className="min-w-30 border-neutral-200 bg-white"
          aria-label={t("language")}
        >
          <SelectValue asChild>
            <LocaleOptionLabel
              icon={activeOption.icon}
              label={t(activeOption.labelKey)}
            />
          </SelectValue>
        </SelectTrigger>
        <SelectContent
          position="popper"
          side="bottom"
          align="end"
          sideOffset={4}
          className="min-w-(--radix-select-trigger-width)"
        >
          {LOCALE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <LocaleOptionLabel
                icon={option.icon}
                label={t(option.labelKey)}
              />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </header>
  );
}
