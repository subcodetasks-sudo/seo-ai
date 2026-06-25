"use client";

import { ChevronDownIcon } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export function LanguageSelector() {
  const t = useTranslations("common.header");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const activeOption =
    LOCALE_OPTIONS.find((option) => option.value === locale) ?? LOCALE_OPTIONS[0];

  function handleLocaleChange(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale as Locale });
    router.refresh();
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-w-30 gap-1.5 border-neutral-200 bg-white font-normal text-secondary-500 hover:bg-neutral-50"
          aria-label={t("language")}
        >
          <LocaleOptionLabel
            icon={activeOption.icon}
            label={t(activeOption.labelKey)}
          />
          <ChevronDownIcon className="size-4 shrink-0 text-neutral-400" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={4}
        className="min-w-(--radix-dropdown-menu-trigger-width)"
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <DropdownMenuRadioGroup value={locale} onValueChange={handleLocaleChange}>
          {LOCALE_OPTIONS.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              <LocaleOptionLabel
                icon={option.icon}
                label={t(option.labelKey)}
              />
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
