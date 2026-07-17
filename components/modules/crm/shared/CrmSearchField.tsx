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
        color="var(--muted-foreground)"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
      />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="h-10 border-border bg-card pl-[34px] text-xs text-muted-foreground placeholder:text-muted-foreground focus-visible:border-[#E8402A] focus-visible:ring-[#E8402A]/20"
      />
    </div>
  )
}
