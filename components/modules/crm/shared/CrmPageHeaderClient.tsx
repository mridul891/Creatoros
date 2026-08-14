"use client"

import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type CrmPageHeaderClientProps = {
  title: string
  description: string
  actionLabel?: string
  actionIcon?: ReactNode
  onAction?: () => void
  className?: string
}

export function CrmPageHeaderClient({
  title,
  description,
  actionLabel,
  actionIcon,
  onAction,
  className,
}: CrmPageHeaderClientProps) {
  return (
    <div
      className={cn(
        "mb-7 flex flex-wrap items-start justify-between gap-4",
        className
      )}
    >
      <div>
        <h1 className="font-extrabold text-2xl text-foreground tracking-[-0.04em]">
          {title}
        </h1>
        <p className="mt-1 text-[13px] text-muted-foreground">{description}</p>
      </div>
      {actionLabel && onAction ? (
        <Button
          type="button"
          onClick={onAction}
          className="h-10 cursor-pointer gap-2 bg-primary px-4 font-semibold text-[13px] text-primary-foreground hover:bg-primary"
        >
          {actionIcon}
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
