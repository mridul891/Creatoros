import Link from "next/link"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type CrmPageHeaderProps = {
  title: string
  description: string
  actionLabel?: string
  actionIcon?: ReactNode
  actionHref?: string
  action?: ReactNode
  className?: string
}

export function CrmPageHeader({
  title,
  description,
  actionLabel,
  actionIcon,
  actionHref,
  action,
  className,
}: CrmPageHeaderProps) {
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
      {action ? action : null}
      {!action && actionLabel && actionHref ? (
        <Button
          asChild
          className="h-10 cursor-pointer gap-2 bg-primary px-4 font-semibold text-[13px] text-primary-foreground hover:bg-primary"
        >
          <Link href={actionHref}>
            {actionIcon}
            {actionLabel}
          </Link>
        </Button>
      ) : null}
    </div>
  )
}
