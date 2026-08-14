"use client"

import { CrmConfirmDialog } from "@/components/shared/crm"

type BrandDeleteDialogProps = {
  open: boolean
  brandName: string
  isDeleting: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function BrandDeleteDialog({
  open,
  brandName,
  isDeleting,
  onOpenChange,
  onConfirm,
}: BrandDeleteDialogProps) {
  return (
    <CrmConfirmDialog
      open={open}
      title="Delete brand"
      description={`This will permanently delete ${brandName}. This action cannot be undone.`}
      confirmLabel={isDeleting ? "Deleting..." : "Delete Brand"}
      isLoading={isDeleting}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
    />
  )
}
