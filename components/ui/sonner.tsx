"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { Check, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <Check className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "color-mix(in srgb, var(--primary-50) 80%, transparent)",
          "--normal-text": "var(--secondary-500)",
          "--normal-border": "color-mix(in srgb, var(--primary-200) 40%, transparent)",
          "--success-bg": "color-mix(in srgb, var(--primary-75) 95%, transparent)",
          "--success-text": "var(--secondary-500)",
          "--success-border": "color-mix(in srgb, var(--primary-200) 40%, transparent)",
          "--border-radius": "1rem",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "cn-toast !bg-primary-50/80 backdrop-blur-md !rounded-2xl !text-secondary-500 !border-primary-200/40 !shadow-sm !shadow-primary-100/50 !shadow-inner",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
