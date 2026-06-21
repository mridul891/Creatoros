"use client"

import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type CrmPageHeaderProps = {
  title: string
  description: string
  actionLabel?: string
  actionIcon?: ReactNode
  onAction?: () => void
  className?: string
}

export function CrmPageHeader({
  title,
  description,
  actionLabel,
  actionIcon,
  onAction,
  className,
}: CrmPageHeaderProps) {
  return (
    <div className={cn("mb-7 flex flex-wrap items-start justify-between gap-4", className)}>
      <div>
        <h1 className="text-2xl font-extrabold tracking-[-0.04em] text-white">{title}</h1>
        <p className="mt-1 text-[13px] text-[rgba(255,255,255,0.45)]">{description}</p>
      </div>
      {actionLabel && onAction ? (
        <Button
          type="button"
          onClick={onAction}
          className="h-10 cursor-pointer gap-2 bg-(--cos-primary) px-4 text-[13px] font-semibold text-white hover:bg-(--cos-primary)"
        >
          {actionIcon}
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
