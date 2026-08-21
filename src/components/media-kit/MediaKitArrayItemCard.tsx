"use client"

import { Delete02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type MediaKitArrayItemCardProps = {
  children: React.ReactNode
  onRemove: () => void
  removeLabel: string
}

export function MediaKitArrayItemCard({
  children,
  onRemove,
  removeLabel,
}: MediaKitArrayItemCardProps) {
  return (
    <Card size="sm" className="gap-0 bg-muted/20 py-0 shadow-none">
      <CardContent className="space-y-4 py-4">{children}</CardContent>
      <Separator />
      <div className="flex justify-end px-4 py-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <HugeiconsIcon icon={Delete02Icon} className="size-3.5" />
          {removeLabel}
        </Button>
      </div>
    </Card>
  )
}
