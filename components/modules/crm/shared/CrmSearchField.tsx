"use client"

import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type CrmSearchFieldProps = {
  value: string
  placeholder: string
  ariaLabel?: string
  onChange: (value: string) => void
  className?: string
}

export function CrmSearchField({ value, placeholder, ariaLabel, onChange, className }: CrmSearchFieldProps) {
  return (
    <div className={cn("relative", className)}>
      <MagnifyingGlass
        size={13}
        color="rgba(255,255,255,0.4)"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
      />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="h-10 border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] pl-[34px] text-xs text-[rgba(255,255,255,0.7)] placeholder:text-[rgba(255,255,255,0.45)] focus-visible:border-[#E8402A] focus-visible:ring-[#E8402A]/20"
      />
    </div>
  )
}
