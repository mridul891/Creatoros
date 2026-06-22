"use client"

import { CrmConfirmDialog } from "../shared"

type DealDeleteDialogProps = {
  open: boolean
  campaignName: string
  isLoading: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DealDeleteDialog({ open, campaignName, isLoading, onOpenChange, onConfirm }: DealDeleteDialogProps) {
  return (
    <CrmConfirmDialog
      open={open}
      title="Delete deal permanently?"
      description={`${campaignName} will be deleted permanently. This action cannot be undone.`}
      confirmLabel="Delete Deal"
      isLoading={isLoading}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
    />
  )
}
