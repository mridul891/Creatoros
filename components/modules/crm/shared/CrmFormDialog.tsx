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
            "max-h-[92vh] overflow-y-auto border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] text-[rgba(255,255,255,0.8)]"
          )}
        >
          <SheetHeader className="px-0 pt-2">
            <SheetTitle className="text-lg font-bold text-white">{title}</SheetTitle>
            <SheetDescription className="text-[12px] text-[rgba(255,255,255,0.45)]">
              {description}
            </SheetDescription>
          </SheetHeader>
          <div className="px-0">{children}</div>
          <SheetFooter className="px-0">{footer}</SheetFooter>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[680px] border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] p-6 text-[rgba(255,255,255,0.8)]"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white">{title}</DialogTitle>
          <DialogDescription className="text-[12px] text-[rgba(255,255,255,0.45)]">
            {description}
          </DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter className="-mx-6 -mb-6 rounded-b-[20px] border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-6 py-4">
          {footer}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
