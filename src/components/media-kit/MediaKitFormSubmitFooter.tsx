"use client"

import { Loading03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"

type MediaKitFormSubmitFooterProps = {
  isSubmitting: boolean
}

export function MediaKitFormSubmitFooter({
  isSubmitting,
}: MediaKitFormSubmitFooterProps) {
  return (
    <div className="sticky bottom-0 z-10 mt-auto border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <p className="hidden text-muted-foreground text-sm sm:block">
          All changes are saved when you submit the form.
        </p>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:ml-auto sm:w-auto"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <HugeiconsIcon
                icon={Loading03Icon}
                className="size-4 animate-spin"
              />
              Saving...
            </span>
          ) : (
            "Save media kit"
          )}
        </Button>
      </div>
    </div>
  )
}
