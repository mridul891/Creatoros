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
      <DialogContent
        className="max-h-[92vh] w-[calc(100vw-1.5rem)] max-w-2xl gap-0 overflow-hidden p-0"
      >
        <DialogHeader className="gap-1 border-b px-4 py-4 pr-12 sm:px-6">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto px-4 py-4 sm:px-6">{children}</div>
        <DialogFooter className="border-t px-4 py-3 sm:px-6">
          {footer}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
