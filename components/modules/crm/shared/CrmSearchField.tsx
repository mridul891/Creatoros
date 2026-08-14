"use client"

import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type CrmSearchFieldProps = {
  value: string
  placeholder: string
  ariaLabel?: string
  onChange: (value: string) => void
  className?: string
}

export function CrmSearchField({
  value,
  placeholder,
  ariaLabel,
  onChange,
  className,
}: CrmSearchFieldProps) {
  return (
    <div className={cn("relative", className)}>
      <HugeiconsIcon
        icon={Search01Icon}
        size={13}
        color="var(--muted-foreground)"
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
      />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="h-10 border-border bg-card pl-[34px] text-muted-foreground text-xs placeholder:text-muted-foreground focus-visible:border-[#E8402A] focus-visible:ring-[#E8402A]/20"
      />
    </div>
  )
}
