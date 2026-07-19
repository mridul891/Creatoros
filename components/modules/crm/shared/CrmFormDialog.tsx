"use client"

import { type ReactNode } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden rounded-xl p-0 sm:max-w-[720px]">
        <DialogHeader className="shrink-0 gap-1.5 border-b border-border px-6 py-5">
          <DialogTitle className="text-lg font-semibold tracking-tight">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>
        <DialogFooter className="m-0 shrink-0 flex-row justify-end gap-2 rounded-b-xl border-t border-border bg-muted/50 px-6 py-4">
          {footer}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
