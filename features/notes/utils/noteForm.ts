import { sanitizeOptionalString } from "@/lib/utils/form"

type NoteFormInput = {
  noteId?: string
  dealId: string
  title: string
  content: string
  isPinned?: boolean
}

export function buildNoteFormData(input: NoteFormInput) {
  const formData = new FormData()
  if (input.noteId) {
    formData.set("noteId", input.noteId)
  }
  formData.set("dealId", input.dealId)
  formData.set("title", sanitizeOptionalString(input.title) ?? "")
  formData.set("content", sanitizeOptionalString(input.content) ?? "")
  if (typeof input.isPinned === "boolean") {
    formData.set("isPinned", String(input.isPinned))
  }
  return formData
}
