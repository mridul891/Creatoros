"use client"

import { type ReactNode, useEffect, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

type CrmFormDialogProps = {
  open: boolean
  title: string
  description: string
  onOpenChange: (open: boolean) => void
  children: ReactNode
  footer: ReactNode
}

export function CrmFormDialog({
  open,
  title,
  description,
  onOpenChange,
  children,
  footer,
}: CrmFormDialogProps) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches
  )

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)")
    const onChange = (event: MediaQueryListEvent) => setIsMobile(event.matches)
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className={cn(
            "max-h-[94vh] overflow-y-auto border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] px-5 pb-5 text-[rgba(255,255,255,0.8)]"
          )}
        >
          <SheetHeader className="px-0 pt-3">
            <SheetTitle className="text-lg font-bold text-white">{title}</SheetTitle>
            <SheetDescription className="text-[12px] text-[rgba(255,255,255,0.45)]">
              {description}
            </SheetDescription>
          </SheetHeader>
          <div className="px-0 pb-24">{children}</div>
          <SheetFooter className="fixed right-0 bottom-0 left-0 z-10 flex flex-col-reverse gap-2 border-t border-[rgba(255,255,255,0.08)] bg-[rgba(13,13,13,0.95)] px-5 py-4 backdrop-blur sm:flex-row sm:justify-end">
            {footer}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[92vh] w-[min(96vw,1120px)] max-w-[1120px] gap-0 overflow-hidden border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] p-0 text-[rgba(255,255,255,0.8)] sm:max-w-[1120px]"
      >
        <DialogHeader className="border-b border-[rgba(255,255,255,0.08)] px-8 py-6">
          <DialogTitle className="text-lg font-bold text-white">{title}</DialogTitle>
          <DialogDescription className="text-[12px] text-[rgba(255,255,255,0.45)]">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto px-8 py-6">{children}</div>
        <DialogFooter className="rounded-none border-t border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-8 py-4 sm:justify-end">
          {footer}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
