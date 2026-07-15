"use client"

import { Download, Eye, UploadSimple, Archive, Pencil } from "@phosphor-icons/react/dist/ssr"
import { useMemo, useState } from "react"
import type { ChangeEvent } from "react"
import { toast } from "sonner"

import { CrmConfirmDialog, CrmPagination, CrmSearchField } from "@/components/modules/crm/shared"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DEAL_FILE_CATEGORIES } from "@/enums/dealFile"
import { useDealFiles } from "@/hooks/useDealFiles"
import { useFileMutations } from "@/hooks/useFileMutations"
import type { DealFileListData, DealFileListItem } from "@/types/dealFile"

type DealFilesSectionProps = {
  dealId: string
  initialData: DealFileListData
  initialLoadError?: string
}

type FileDraft = {
  fileName: string
  storagePath: string
  mimeType?: string
  sizeBytes?: number
  category: string
}

const EMPTY_FILE_DRAFT: FileDraft = {
  fileName: "",
  storagePath: "",
  category: "Reference",
}

function formatSize(sizeBytes: number | null) {
  if (!sizeBytes || sizeBytes <= 0) return "—"
  const kb = sizeBytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

export function DealFilesSection({ dealId, initialData, initialLoadError }: DealFilesSectionProps) {
  const { files, pagination, search, archive, category, isLoading, loadError, setSearch, setArchive, setCategory, setPage, refetch } = useDealFiles({
    dealId,
    initialData,
  })
  const { isSubmitting, isMutating, submitCreate, submitRename, runArchive, runRestore, runDelete } = useFileMutations({
    onRefresh: () => {
      void refetch(pagination.page)
    },
  })

  const [draft, setDraft] = useState<FileDraft>(EMPTY_FILE_DRAFT)
  const [editingFile, setEditingFile] = useState<DealFileListItem | null>(null)
  const [pendingArchiveId, setPendingArchiveId] = useState<string | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const displayError = initialLoadError ?? loadError
  const categoriesInList = useMemo(() => Array.from(new Set(files.map((file) => file.category))), [files])

  async function handleUploadFromInput(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const payload: FileDraft = {
      fileName: file.name,
      storagePath: `local://${dealId}/${Date.now()}-${file.name}`,
      mimeType: file.type || undefined,
      sizeBytes: file.size,
      category: draft.category,
    }

    const result = await submitCreate({
      dealId,
      ...payload,
    })

    if (!result.success) {
      toast.error(result.message ?? "Could not upload file metadata.")
      return
    }

    toast.success("File metadata captured.")
    await refetch(1)
  }

  async function handleRename() {
    if (!editingFile) return
    const result = await submitRename(editingFile.id, {
      dealId,
      fileName: draft.fileName,
      storagePath: draft.storagePath,
      mimeType: draft.mimeType,
      sizeBytes: draft.sizeBytes,
      category: draft.category,
    })

    if (!result.success) {
      toast.error(result.message ?? "Could not rename file.")
      return
    }

    toast.success("File updated.")
    setEditingFile(null)
    setDraft(EMPTY_FILE_DRAFT)
    await refetch(pagination.page)
  }

  function openRename(file: DealFileListItem) {
    setEditingFile(file)
    setDraft({
      fileName: file.fileName,
      storagePath: file.storagePath,
      mimeType: file.mimeType ?? undefined,
      sizeBytes: file.sizeBytes ?? undefined,
      category: file.category,
    })
  }

  async function confirmArchive() {
    if (!pendingArchiveId) return
    const target = files.find((file) => file.id === pendingArchiveId)
    const result = target?.status === "Archived" ? await runRestore(pendingArchiveId) : await runArchive(pendingArchiveId)
    if (result.success) {
      setPendingArchiveId(null)
      await refetch(pagination.page)
    }
  }

  async function confirmDelete() {
    if (!pendingDeleteId) return
    const result = await runDelete(pendingDeleteId)
    if (result.success) {
      setPendingDeleteId(null)
      await refetch(1)
    }
  }

  return (
    <div className="rounded-[20px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white">Files</h2>
          <p className="text-[12px] text-[rgba(255,255,255,0.5)]">Contracts, briefs, assets, media, invoices, and references.</p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-(--cos-primary) px-3 py-2 text-[12px] font-semibold text-white">
          <UploadSimple size={14} />
          Upload
          <input type="file" className="hidden" onChange={handleUploadFromInput} />
        </label>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <CrmSearchField value={search} placeholder="Search files" onChange={setSearch} className="w-[260px]" />
        <Select value={archive} onValueChange={(next) => setArchive(next as typeof archive)}>
          <SelectTrigger className="h-10 w-[140px] border-[rgba(255,255,255,0.08)] bg-[#0D0D0D] text-xs text-[rgba(255,255,255,0.75)]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={(next) => setCategory(next as typeof category)}>
          <SelectTrigger className="h-10 w-[180px] border-[rgba(255,255,255,0.08)] bg-[#0D0D0D] text-xs text-[rgba(255,255,255,0.75)]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {[...new Set([...DEAL_FILE_CATEGORIES, ...categoriesInList])].map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {displayError ? <p className="mb-4 text-[12px] text-[#E8402A]">{displayError}</p> : null}

      {editingFile ? (
        <div className="mb-4 rounded-[12px] border border-[rgba(255,255,255,0.08)] p-3">
          <p className="mb-2 text-[12px] font-semibold text-white">Rename / update metadata</p>
          <div className="grid gap-2 md:grid-cols-3">
            <Input value={draft.fileName} onChange={(e) => setDraft((prev) => ({ ...prev, fileName: e.target.value }))} />
            <Input value={draft.storagePath} onChange={(e) => setDraft((prev) => ({ ...prev, storagePath: e.target.value }))} />
            <Select value={draft.category} onValueChange={(next) => setDraft((prev) => ({ ...prev, category: next }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEAL_FILE_CATEGORIES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-2 flex gap-2">
            <Button type="button" size="sm" onClick={handleRename} disabled={isSubmitting}>
              FloppyDisk
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                setEditingFile(null)
                setDraft(EMPTY_FILE_DRAFT)
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-[14px] border border-[rgba(255,255,255,0.07)]">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] text-left">
              <th className="px-4 py-3 text-[11px] font-semibold text-[rgba(255,255,255,0.58)]">File</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-[rgba(255,255,255,0.58)]">Category</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-[rgba(255,255,255,0.58)]">Size</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-[rgba(255,255,255,0.58)]">Updated</th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold text-[rgba(255,255,255,0.58)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-[12px] text-[rgba(255,255,255,0.55)]">
                  Loading files...
                </td>
              </tr>
            ) : files.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-[12px] text-[rgba(255,255,255,0.55)]">
                  No files found for current filters.
                </td>
              </tr>
            ) : (
              files.map((file) => (
                <tr key={file.id} className="border-b border-[rgba(255,255,255,0.05)] last:border-none">
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-semibold text-white">{file.fileName}</p>
                    <p className="text-[11px] text-[rgba(255,255,255,0.5)]">{file.storagePath}</p>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[rgba(255,255,255,0.72)]">{file.category}</td>
                  <td className="px-4 py-3 text-[12px] text-[rgba(255,255,255,0.72)]">{formatSize(file.sizeBytes)}</td>
                  <td className="px-4 py-3 text-[12px] text-[rgba(255,255,255,0.72)]">{new Date(file.updatedAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button type="button" size="sm" variant="outline" className="h-8" onClick={() => openRename(file)}>
                        <Pencil size={12} />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8"
                        onClick={() => toast.info(`Preview path: ${file.storagePath}`)}
                      >
                        <Eye size={12} />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8"
                        onClick={() => toast.info(`Download path: ${file.storagePath}`)}
                      >
                        <Download size={12} />
                      </Button>
                      <Button type="button" size="sm" variant="outline" className="h-8" onClick={() => setPendingArchiveId(file.id)}>
                        <Archive size={12} />
                      </Button>
                      <Button type="button" size="sm" variant="destructive" className="h-8" onClick={() => setPendingDeleteId(file.id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 ? <CrmPagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} /> : null}

      <CrmConfirmDialog
        open={Boolean(pendingArchiveId)}
        title="Update file archive state?"
        description="Archived files remain discoverable and can be restored."
        confirmLabel="Confirm"
        isLoading={isMutating}
        onOpenChange={(open) => {
          if (!open) setPendingArchiveId(null)
        }}
        onConfirm={confirmArchive}
      />

      <CrmConfirmDialog
        open={Boolean(pendingDeleteId)}
        title="Delete archived file permanently?"
        description="Only archived files should be permanently deleted."
        confirmLabel="Delete File"
        isLoading={isMutating}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteId(null)
        }}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
