"use client"

import { Add01Icon, PinIcon, Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import {
  CrmConfirmDialog,
  CrmPageHeaderClient,
  CrmPagination,
} from "@/components/shared/crm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useDealNotes } from "@/features/notes/hooks/useDealNotes"
import { useNoteMutations } from "@/features/notes/hooks/useNoteMutations"
import type {
  DealNoteListData,
  DealNoteListItem,
} from "@/features/notes/types/dealNote"

type DealNotesSectionProps = {
  dealId: string
  initialData: DealNoteListData
  initialLoadError?: string
}

export function DealNotesSection({
  dealId,
  initialData,
  initialLoadError,
}: DealNotesSectionProps) {
  const {
    notes,
    pagination,
    search,
    archive,
    isLoading,
    loadError,
    setSearch,
    setArchive,
    setPage,
    refetch,
  } = useDealNotes({
    dealId,
    initialData,
  })

  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(
    notes[0]?.id ?? null
  )
  const [titleDraft, setTitleDraft] = useState("")
  const [contentDraft, setContentDraft] = useState("")
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [pendingArchiveId, setPendingArchiveId] = useState<string | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const {
    isSubmitting,
    isMutating,
    submitCreate,
    submitUpdate,
    runArchive,
    runRestore,
    runDelete,
  } = useNoteMutations({
    onRefresh: () => {
      void refetch(pagination.page)
    },
  })

  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedNoteId) ?? null,
    [notes, selectedNoteId]
  )
  const displayError = initialLoadError ?? loadError

  useEffect(() => {
    if (!selectedNote && notes.length > 0) {
      setSelectedNoteId(notes[0].id)
    }
  }, [notes, selectedNote])

  useEffect(() => {
    setTitleDraft(selectedNote?.title ?? "")
    setContentDraft(selectedNote?.content ?? "")
  }, [selectedNote?.title, selectedNote?.content])

  useEffect(() => {
    if (!selectedNote) return
    if (
      titleDraft === selectedNote.title &&
      contentDraft === selectedNote.content
    )
      return

    const timer = setTimeout(async () => {
      setIsAutoSaving(true)
      const result = await submitUpdate({
        noteId: selectedNote.id,
        dealId,
        title: titleDraft,
        content: contentDraft,
        isPinned: selectedNote.isPinned,
      })
      setIsAutoSaving(false)
      if (!result.success) {
        toast.error(result.message ?? "Auto-save failed.")
        return
      }
      await refetch(pagination.page)
    }, 700)

    return () => clearTimeout(timer)
  }, [
    contentDraft,
    dealId,
    pagination.page,
    refetch,
    selectedNote,
    submitUpdate,
    titleDraft,
  ])

  async function handleCreate() {
    const result = await submitCreate({
      dealId,
      title: "New note",
      content: "Start writing...",
    })
    if (!result.success) {
      toast.error(result.message ?? "Could not create note.")
      return
    }
    await refetch(1)
  }

  async function handleTogglePin(note: DealNoteListItem) {
    const result = await submitUpdate({
      noteId: note.id,
      dealId,
      title: note.title,
      content: note.content,
      isPinned: !note.isPinned,
    })
    if (!result.success) {
      toast.error(result.message ?? "Could not update pin state.")
      return
    }
    await refetch(pagination.page)
  }

  async function confirmArchive() {
    if (!pendingArchiveId) return
    const note = notes.find((item) => item.id === pendingArchiveId)
    const result =
      note?.status === "Archived"
        ? await runRestore(pendingArchiveId)
        : await runArchive(pendingArchiveId)
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
    <div className="rounded-[20px] border border-border bg-card p-6">
      <CrmPageHeaderClient
        title="Notes"
        description="Rich text notes with auto-save, pinning, and search."
        actionLabel="Add Note"
        actionIcon={<HugeiconsIcon icon={Add01Icon} size={14} />}
        onAction={handleCreate}
        className="mb-4"
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative w-[260px]">
          <HugeiconsIcon
            icon={Search01Icon}
            size={13}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search notes"
            className="h-10 border-border bg-card pl-[34px] text-muted-foreground text-xs"
          />
        </div>
        <Button
          type="button"
          size="sm"
          variant={archive === "active" ? "default" : "outline"}
          className="h-9"
          onClick={() => setArchive("active")}
        >
          Active
        </Button>
        <Button
          type="button"
          size="sm"
          variant={archive === "archived" ? "default" : "outline"}
          className="h-9"
          onClick={() => setArchive("archived")}
        >
          Archived
        </Button>
        <p className="text-[11px] text-muted-foreground">
          {isAutoSaving ? "Auto-saving..." : "All changes saved"}
        </p>
      </div>

      {displayError ? (
        <p className="mb-4 text-[#E8402A] text-[12px]">{displayError}</p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-[280px_1fr]">
        <div className="rounded-[14px] border border-border p-3">
          {isLoading ? (
            <p className="text-[12px] text-muted-foreground">
              Loading notes...
            </p>
          ) : null}
          {notes.length === 0 ? (
            <p className="text-[12px] text-muted-foreground">No notes yet.</p>
          ) : null}
          <div className="space-y-2">
            {notes.map((note) => (
              <button
                key={note.id}
                type="button"
                onClick={() => setSelectedNoteId(note.id)}
                className={`w-full rounded-[10px] border px-3 py-2 text-left ${
                  selectedNoteId === note.id
                    ? "border-[#E8402A] bg-[rgba(232,64,42,0.12)]"
                    : "border-border bg-muted"
                }`}
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="truncate font-semibold text-[12px] text-foreground">
                    {note.title}
                  </p>
                  <HugeiconsIcon
                    icon={PinIcon}
                    size={12}
                    className={
                      note.isPinned ? "text-[#E8402A]" : "text-muted-foreground"
                    }
                  />
                </div>
                <p className="line-clamp-2 text-[11px] text-muted-foreground">
                  {note.content}
                </p>
                <p className="mt-2 text-[10px] text-muted-foreground">
                  {new Date(note.updatedAt).toLocaleString()}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[14px] border border-border p-4">
          {selectedNote ? (
            <div className="space-y-3">
              <Input
                value={titleDraft}
                onChange={(event) => setTitleDraft(event.target.value)}
                className="h-10 border-border bg-card text-[13px]"
              />
              <Textarea
                value={contentDraft}
                onChange={(event) => setContentDraft(event.target.value)}
                rows={14}
                className="min-h-[300px] border-border bg-card text-[13px]"
              />
              <div className="flex flex-wrap justify-between gap-2">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleTogglePin(selectedNote)}
                    disabled={isSubmitting}
                  >
                    {selectedNote.isPinned ? "Unpin" : "PushPin"}
                  </Button>
                  {selectedNote.status === "Archived" ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setPendingArchiveId(selectedNote.id)}
                      disabled={isMutating}
                    >
                      Restore
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setPendingArchiveId(selectedNote.id)}
                      disabled={isMutating}
                    >
                      Archive
                    </Button>
                  )}
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => setPendingDeleteId(selectedNote.id)}
                  disabled={selectedNote.status !== "Archived" || isMutating}
                >
                  Delete
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-[12px] text-muted-foreground">
              Select a note to start editing.
            </p>
          )}
        </div>
      </div>

      {pagination.totalPages > 1 ? (
        <CrmPagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      ) : null}

      <CrmConfirmDialog
        open={Boolean(pendingArchiveId)}
        title="Update note archive state?"
        description="Archived notes remain searchable and can be restored later."
        confirmLabel="Confirm"
        isLoading={isMutating}
        onOpenChange={(open) => {
          if (!open) setPendingArchiveId(null)
        }}
        onConfirm={confirmArchive}
      />

      <CrmConfirmDialog
        open={Boolean(pendingDeleteId)}
        title="Delete archived note permanently?"
        description="This action cannot be undone."
        confirmLabel="Delete Note"
        isLoading={isMutating}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteId(null)
        }}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
