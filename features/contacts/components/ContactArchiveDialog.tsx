"use client"

import { CrmConfirmDialog } from "@/components/shared/crm"

type ContactArchiveDialogProps = {
  open: boolean
  contactName: string
  isArchiving: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function ContactArchiveDialog({
  open,
  contactName,
  isArchiving,
  onOpenChange,
  onConfirm,
}: ContactArchiveDialogProps) {
  return (
    <CrmConfirmDialog
      open={open}
      title="Archive contact"
      description={`${contactName} will be moved to archived contacts and hidden from active workflows.`}
      confirmLabel={isArchiving ? "Archiving..." : "Archive Contact"}
      isLoading={isArchiving}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
    />
  )
}
