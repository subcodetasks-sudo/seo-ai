"use client"

import { useTranslations } from "next-intl"
import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({
  className,
  "aria-label": ariaLabel,
  ...props
}: React.ComponentProps<"svg">) {
  const t = useTranslations("common.state")

  return (
    <Loader2Icon
      role="status"
      aria-label={ariaLabel ?? t("loading")}
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
