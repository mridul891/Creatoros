"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  archiveNoteAction,
  createNoteAction,
  deleteNoteAction,
  restoreNoteAction,
  updateNoteAction,
} from "@/app/action/noteActions"
import { buildNoteFormData } from "@/lib/crm/notes/noteForm"

type UseNoteMutationsOptions = {
  onRefresh: () => void
}

export function useNoteMutations({ onRefresh }: UseNoteMutationsOptions) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMutating, setIsMutating] = useState(false)

  async function submitCreate(input: {
    dealId: string
    title: string
    content: string
  }) {
    setIsSubmitting(true)
    try {
      return await createNoteAction(buildNoteFormData(input))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function submitUpdate(input: {
    noteId: string
    dealId: string
    title: string
    content: string
    isPinned?: boolean
  }) {
    setIsSubmitting(true)
    try {
      return await updateNoteAction(buildNoteFormData(input))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function runArchive(noteId: string) {
    setIsMutating(true)
    const result = await archiveNoteAction(noteId)
    setIsMutating(false)
    if (!result.success) {
      toast.error(result.message ?? "Could not archive note.")
      return result
    }
    toast.success(result.message ?? "Note archived.")
    onRefresh()
    return result
  }

  async function runRestore(noteId: string) {
    setIsMutating(true)
    const result = await restoreNoteAction(noteId)
    setIsMutating(false)
    if (!result.success) {
      toast.error(result.message ?? "Could not restore note.")
      return result
    }
    toast.success(result.message ?? "Note restored.")
    onRefresh()
    return result
  }

  async function runDelete(noteId: string) {
    setIsMutating(true)
    const result = await deleteNoteAction(noteId)
    setIsMutating(false)
    if (!result.success) {
      toast.error(result.message ?? "Could not delete note.")
      return result
    }
    toast.success(result.message ?? "Note deleted.")
    onRefresh()
    return result
  }

  return {
    isSubmitting,
    isMutating,
    submitCreate,
    submitUpdate,
    runArchive,
    runRestore,
    runDelete,
  }
}
