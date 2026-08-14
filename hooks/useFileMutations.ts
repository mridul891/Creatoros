"use client"

import { useState } from "react"
import { toast } from "sonner"

import {
  archiveFileAction,
  createFileAction,
  deleteFileAction,
  renameFileAction,
  restoreFileAction,
} from "@/app/action/fileActions"

type UseFileMutationsOptions = {
  onRefresh: () => void
}

type FileMutationPayload = {
  dealId: string
  fileName: string
  storagePath: string
  mimeType?: string
  sizeBytes?: number
  category: string
}

function toFormData(input: FileMutationPayload, fileId?: string) {
  const formData = new FormData()
  if (fileId) {
    formData.set("fileId", fileId)
  }
  formData.set("dealId", input.dealId)
  formData.set("fileName", input.fileName)
  formData.set("storagePath", input.storagePath)
  formData.set("category", input.category)
  if (input.mimeType) formData.set("mimeType", input.mimeType)
  if (typeof input.sizeBytes === "number")
    formData.set("sizeBytes", String(input.sizeBytes))
  return formData
}

export function useFileMutations({ onRefresh }: UseFileMutationsOptions) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMutating, setIsMutating] = useState(false)

  async function submitCreate(input: FileMutationPayload) {
    setIsSubmitting(true)
    try {
      return await createFileAction(toFormData(input))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function submitRename(fileId: string, input: FileMutationPayload) {
    setIsSubmitting(true)
    try {
      return await renameFileAction(toFormData(input, fileId))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function runArchive(fileId: string) {
    setIsMutating(true)
    const result = await archiveFileAction(fileId)
    setIsMutating(false)
    if (!result.success) {
      toast.error(result.message ?? "Could not archive file.")
      return result
    }
    toast.success(result.message ?? "File archived.")
    onRefresh()
    return result
  }

  async function runRestore(fileId: string) {
    setIsMutating(true)
    const result = await restoreFileAction(fileId)
    setIsMutating(false)
    if (!result.success) {
      toast.error(result.message ?? "Could not restore file.")
      return result
    }
    toast.success(result.message ?? "File restored.")
    onRefresh()
    return result
  }

  async function runDelete(fileId: string) {
    setIsMutating(true)
    const result = await deleteFileAction(fileId)
    setIsMutating(false)
    if (!result.success) {
      toast.error(result.message ?? "Could not delete file.")
      return result
    }
    toast.success(result.message ?? "File deleted.")
    onRefresh()
    return result
  }

  return {
    isSubmitting,
    isMutating,
    submitCreate,
    submitRename,
    runArchive,
    runRestore,
    runDelete,
  }
}
