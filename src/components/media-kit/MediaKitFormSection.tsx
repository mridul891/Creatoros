"use client"

import { AlertCircleIcon, ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { MediaKitFormData } from "@/schemas/mediaKit"

type MediaKitFormSectionProps = {
  step: number
  title: string
  description?: string
  defaultOpen?: boolean
  errorCount?: number
  children: React.ReactNode
}

export function MediaKitFormSection({
  step,
  title,
  description,
  defaultOpen = true,
  errorCount = 0,
  children,
}: MediaKitFormSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const hasErrors = errorCount > 0

  const {
    formState: { isSubmitted },
  } = useFormContext<MediaKitFormData>()

  useEffect(() => {
    if (hasErrors && isSubmitted) {
      setOpen(true)
    }
  }, [hasErrors, isSubmitted])

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card
        className={cn(
          "gap-0 py-0 shadow-sm transition-shadow hover:shadow-md",
          hasErrors && "ring-1 ring-destructive/40",
          !open && "bg-card"
        )}
      >
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className={cn(
              "w-full rounded-xl text-left transition-colors",
              "hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              open && "rounded-b-none"
            )}
          >
            <CardHeader className="grid-cols-[auto_1fr_auto] items-start gap-3 py-4">
              <span
                className={cn(
                  "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full font-medium text-xs",
                  hasErrors
                    ? "bg-destructive/10 text-destructive"
                    : "bg-primary/10 text-primary"
                )}
              >
                {step}
              </span>

              <div className="min-w-0 space-y-1">
                <CardTitle className="text-base">{title}</CardTitle>
                {description ? (
                  <CardDescription className="text-pretty">
                    {description}
                  </CardDescription>
                ) : null}
              </div>

              <CardAction className="flex items-center gap-2 pt-0.5">
                {hasErrors ? (
                  <Badge
                    variant="destructive"
                    className="hidden gap-1 sm:inline-flex"
                  >
                    <HugeiconsIcon icon={AlertCircleIcon} className="size-3" />
                    {errorCount === 1 ? "1 error" : `${errorCount} errors`}
                  </Badge>
                ) : null}

                {hasErrors ? (
                  <span
                    role="status"
                    className="flex size-7 items-center justify-center rounded-full bg-destructive/10 sm:hidden"
                    aria-label={`${errorCount} validation ${errorCount === 1 ? "error" : "errors"}`}
                  >
                    <HugeiconsIcon
                      icon={AlertCircleIcon}
                      className="size-3.5 text-destructive"
                    />
                  </span>
                ) : null}

                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                    open && "rotate-180"
                  )}
                />
              </CardAction>
            </CardHeader>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <Separator />
          <CardContent className="space-y-4 py-4">{children}</CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
