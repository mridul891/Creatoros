import Link from "next/link"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type CrmEmptyStateProps = {
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  action?: ReactNode
  icon?: ReactNode
  className?: string
}

export function CrmEmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  action,
  icon,
  className,
}: CrmEmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-[18px] border border-border border-dashed bg-muted px-6 py-14 text-center",
        className
      )}
    >
      {icon ? (
        <div className="mx-auto mb-3 flex w-fit text-muted-foreground">
          {icon}
        </div>
      ) : null}
      <h3 className="font-bold text-[18px] text-foreground">{title}</h3>
      <p className="mx-auto mt-2 max-w-[460px] text-[13px] text-muted-foreground">
        {description}
      </p>
      {action ? action : null}
      {!action && actionLabel && actionHref ? (
        <Button
          asChild
          className="mt-6 h-10 cursor-pointer bg-primary px-5 font-semibold text-[13px] text-primary-foreground hover:bg-primary"
        >
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  )
}
