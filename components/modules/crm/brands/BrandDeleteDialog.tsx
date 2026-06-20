"use client"

type BrandDeleteDialogProps = {
  brandName: string
  isDeleting: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function BrandDeleteDialog({
  brandName,
  isDeleting,
  onCancel,
  onConfirm,
}: BrandDeleteDialogProps) {
  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-[rgba(0,0,0,0.45)]">
      <div className="w-full max-w-[460px] rounded-[20px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] p-6">
        <h3 className="text-[18px] font-bold text-white">Delete brand</h3>
        <p className="mt-2 text-[13px] text-[rgba(255,255,255,0.6)]">
          This will permanently delete <span className="font-semibold text-white">{brandName}</span>.
          This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="cursor-pointer rounded-[10px] border border-[rgba(255,255,255,0.1)] px-4 py-2 text-[13px] text-[rgba(255,255,255,0.75)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="cursor-pointer rounded-[10px] bg-[#E8402A] px-4 py-2 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete Brand"}
          </button>
        </div>
      </div>
    </div>
  )
}
