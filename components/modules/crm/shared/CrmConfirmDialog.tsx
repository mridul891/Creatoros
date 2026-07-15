"use client"

import { Warning } from "@phosphor-icons/react/dist/ssr"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type CrmConfirmDialogProps = {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  isLoading?: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function CrmConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  isLoading = false,
  onOpenChange,
  onConfirm,
}: CrmConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-[rgba(255,255,255,0.08)] bg-[#0D0D0D] text-[rgba(255,255,255,0.8)]">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-[rgba(232,64,42,0.14)] text-[#E8402A]">
            <Warning />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-white">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-[rgba(255,255,255,0.55)]">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]">
          <AlertDialogCancel disabled={isLoading} className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            variant="destructive"
            className="cursor-pointer"
          >
            {isLoading ? "Processing..." : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
