"use client"

import { CrmConfirmDialog } from "@/components/shared/crm"

type DealArchiveDialogProps = {
  open: boolean
  campaignName: string
  isLoading: boolean
  mode: "archive" | "restore"
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DealArchiveDialog({
  open,
  campaignName,
  isLoading,
  mode,
  onOpenChange,
  onConfirm,
}: DealArchiveDialogProps) {
  const isArchive = mode === "archive"
  return (
    <CrmConfirmDialog
      open={open}
      title={isArchive ? "Archive deal?" : "Restore deal?"}
      description={
        isArchive
          ? `Archive ${campaignName}? You can restore it anytime from archived deals.`
          : `Restore ${campaignName} to your active pipeline?`
      }
      confirmLabel={isArchive ? "Archive Deal" : "Restore Deal"}
      isLoading={isLoading}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
    />
  )
}
