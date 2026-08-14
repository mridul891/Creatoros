"use server"

import { revalidatePath } from "next/cache"

import { requireOnboardedUser } from "@/lib/auth/require-user"
import {
  archiveNote,
  createNote,
  deleteNote,
  listDealNotes,
  NoteServiceError,
  restoreNote,
  updateNote,
} from "@/lib/crm/notes/noteService"
import {
  noteArchiveSchema,
  noteCreateSchema,
  noteListSchema,
  noteUpdateSchema,
} from "@/lib/crm/notes/noteValidation"
import type { DealNoteListData } from "@/types/dealNote"

export type NoteMutationResult = {
  success: boolean
  message?: string
  data?: {
    id: string
  }
}

export type NoteListResult = {
  success: boolean
  message?: string
  data?: DealNoteListData
}

function revalidateNotePaths(dealId?: string) {
  revalidatePath("/dashboard/deals")
  if (dealId) {
    revalidatePath(`/dashboard/deals/${dealId}`)
  }
}

function mapNoteServiceError(
  error: unknown,
  fallbackMessage: string
): NoteMutationResult {
  if (error instanceof NoteServiceError) {
    return {
      success: false,
      message: error.message,
    }
  }

  return {
    success: false,
    message: fallbackMessage,
  }
}

export async function listDealNotesAction(input: {
  dealId: string
  search?: string
  archive?: string
  page?: number
  pageSize?: number
}): Promise<NoteListResult> {
  const user = await requireOnboardedUser()
  const parsed = noteListSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid notes list request.",
    }
  }

  try {
    const data = await listDealNotes(user.id, parsed.data)
    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("notes.list_failed", {
      userId: user.id,
      input: parsed.data,
      error,
    })
    return {
      success: false,
      message: "We could not load notes. Please try again.",
    }
  }
}

export async function createNoteAction(
  formData: FormData
): Promise<NoteMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = noteCreateSchema.safeParse({
    dealId: formData.get("dealId"),
    title: formData.get("title"),
    content: formData.get("content"),
  })

  if (!parsed.success) {
    return {
      success: false,
      message: "Please provide title and content.",
    }
  }

  try {
    const data = await createNote(user.id, parsed.data)
    revalidateNotePaths(data.dealId)
    return {
      success: true,
      message: "Note created.",
      data: { id: data.id },
    }
  } catch (error) {
    console.error("notes.create_failed", { userId: user.id, error })
    return mapNoteServiceError(
      error,
      "We could not create this note. Please try again."
    )
  }
}

export async function updateNoteAction(
  formData: FormData
): Promise<NoteMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = noteUpdateSchema.safeParse({
    noteId: formData.get("noteId"),
    dealId: formData.get("dealId"),
    title: formData.get("title"),
    content: formData.get("content"),
    isPinned:
      formData.get("isPinned") === null
        ? undefined
        : formData.get("isPinned") === "true",
  })

  if (!parsed.success) {
    return {
      success: false,
      message: "Please provide title and content.",
    }
  }

  try {
    const data = await updateNote(user.id, parsed.data)
    revalidateNotePaths(data.dealId)
    return {
      success: true,
      message: "Note updated.",
      data: { id: data.id },
    }
  } catch (error) {
    console.error("notes.update_failed", {
      userId: user.id,
      noteId: parsed.data.noteId,
      error,
    })
    return mapNoteServiceError(
      error,
      "We could not update this note. Please try again."
    )
  }
}

export async function archiveNoteAction(
  noteId: string
): Promise<NoteMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = noteArchiveSchema.safeParse({ noteId })
  if (!parsed.success) {
    return {
      success: false,
      message: "Note id is invalid.",
    }
  }

  try {
    const data = await archiveNote(user.id, parsed.data.noteId)
    revalidateNotePaths(data.dealId)
    return {
      success: true,
      message: "Note archived.",
      data: { id: data.id },
    }
  } catch (error) {
    console.error("notes.archive_failed", {
      userId: user.id,
      noteId: parsed.data.noteId,
      error,
    })
    return mapNoteServiceError(
      error,
      "We could not archive this note. Please try again."
    )
  }
}

export async function restoreNoteAction(
  noteId: string
): Promise<NoteMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = noteArchiveSchema.safeParse({ noteId })
  if (!parsed.success) {
    return {
      success: false,
      message: "Note id is invalid.",
    }
  }

  try {
    const data = await restoreNote(user.id, parsed.data.noteId)
    revalidateNotePaths(data.dealId)
    return {
      success: true,
      message: "Note restored.",
      data: { id: data.id },
    }
  } catch (error) {
    console.error("notes.restore_failed", {
      userId: user.id,
      noteId: parsed.data.noteId,
      error,
    })
    return mapNoteServiceError(
      error,
      "We could not restore this note. Please try again."
    )
  }
}

export async function deleteNoteAction(
  noteId: string
): Promise<NoteMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = noteArchiveSchema.safeParse({ noteId })
  if (!parsed.success) {
    return {
      success: false,
      message: "Note id is invalid.",
    }
  }

  try {
    const data = await deleteNote(user.id, parsed.data.noteId)
    revalidateNotePaths(data.dealId)
    return {
      success: true,
      message: "Note deleted.",
      data: { id: data.id },
    }
  } catch (error) {
    console.error("notes.delete_failed", {
      userId: user.id,
      noteId: parsed.data.noteId,
      error,
    })
    return mapNoteServiceError(
      error,
      "We could not delete this note. Please try again."
    )
  }
}
