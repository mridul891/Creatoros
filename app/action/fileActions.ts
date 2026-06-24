"use server"

import { revalidatePath } from "next/cache"

import { requireOnboardedUser } from "@/lib/auth/require-user"
import { archiveFile, createFile, deleteFile, FileServiceError, listDealFiles, renameFile, restoreFile } from "@/lib/crm/files/fileService"
import { fileArchiveSchema, fileCreateSchema, fileListSchema, fileUpdateSchema } from "@/lib/crm/files/fileValidation"
import { sanitizeOptionalString } from "@/lib/crm/shared/form"
import type { DealFileListData } from "@/types/dealFile"

export type FileMutationResult = {
  success: boolean
  message?: string
  data?: {
    id: string
  }
}

export type FileListResult = {
  success: boolean
  message?: string
  data?: DealFileListData
}

function revalidateFilePaths(dealId?: string) {
  revalidatePath("/dashboard/deals")
  if (dealId) {
    revalidatePath(`/dashboard/deals/${dealId}`)
  }
}

function mapFileServiceError(error: unknown, fallbackMessage: string): FileMutationResult {
  if (error instanceof FileServiceError) {
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

export async function listDealFilesAction(input: {
  dealId: string
  search?: string
  archive?: string
  category?: string
  page?: number
  pageSize?: number
}): Promise<FileListResult> {
  const user = await requireOnboardedUser()
  const parsed = fileListSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid files list request.",
    }
  }

  try {
    const data = await listDealFiles(user.id, parsed.data)
    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("files.list_failed", { userId: user.id, input: parsed.data, error })
    return {
      success: false,
      message: "We could not load files. Please try again.",
    }
  }
}

export async function createFileAction(formData: FormData): Promise<FileMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = fileCreateSchema.safeParse({
    dealId: formData.get("dealId"),
    fileName: formData.get("fileName"),
    storagePath: formData.get("storagePath"),
    mimeType: sanitizeOptionalString(formData.get("mimeType")),
    sizeBytes: sanitizeOptionalString(formData.get("sizeBytes")),
    category: formData.get("category"),
    metadata: undefined,
  })

  if (!parsed.success) {
    return {
      success: false,
      message: "Please provide valid file details.",
    }
  }

  try {
    const data = await createFile(user.id, parsed.data)
    revalidateFilePaths(data.dealId)
    return {
      success: true,
      message: "File uploaded.",
      data: { id: data.id },
    }
  } catch (error) {
    console.error("files.create_failed", { userId: user.id, error })
    return mapFileServiceError(error, "We could not upload this file. Please try again.")
  }
}

export async function renameFileAction(formData: FormData): Promise<FileMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = fileUpdateSchema.safeParse({
    fileId: formData.get("fileId"),
    dealId: formData.get("dealId"),
    fileName: formData.get("fileName"),
    storagePath: formData.get("storagePath"),
    mimeType: sanitizeOptionalString(formData.get("mimeType")),
    sizeBytes: sanitizeOptionalString(formData.get("sizeBytes")),
    category: formData.get("category"),
    metadata: undefined,
  })

  if (!parsed.success) {
    return {
      success: false,
      message: "Please provide valid file details.",
    }
  }

  try {
    const data = await renameFile(user.id, parsed.data)
    revalidateFilePaths(data.dealId)
    return {
      success: true,
      message: "File renamed.",
      data: { id: data.id },
    }
  } catch (error) {
    console.error("files.rename_failed", { userId: user.id, fileId: parsed.data.fileId, error })
    return mapFileServiceError(error, "We could not rename this file. Please try again.")
  }
}

export async function archiveFileAction(fileId: string): Promise<FileMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = fileArchiveSchema.safeParse({ fileId })
  if (!parsed.success) {
    return {
      success: false,
      message: "File id is invalid.",
    }
  }

  try {
    const data = await archiveFile(user.id, parsed.data.fileId)
    revalidateFilePaths(data.dealId)
    return {
      success: true,
      message: "File archived.",
      data: { id: data.id },
    }
  } catch (error) {
    console.error("files.archive_failed", { userId: user.id, fileId: parsed.data.fileId, error })
    return mapFileServiceError(error, "We could not archive this file. Please try again.")
  }
}

export async function restoreFileAction(fileId: string): Promise<FileMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = fileArchiveSchema.safeParse({ fileId })
  if (!parsed.success) {
    return {
      success: false,
      message: "File id is invalid.",
    }
  }

  try {
    const data = await restoreFile(user.id, parsed.data.fileId)
    revalidateFilePaths(data.dealId)
    return {
      success: true,
      message: "File restored.",
      data: { id: data.id },
    }
  } catch (error) {
    console.error("files.restore_failed", { userId: user.id, fileId: parsed.data.fileId, error })
    return mapFileServiceError(error, "We could not restore this file. Please try again.")
  }
}

export async function deleteFileAction(fileId: string): Promise<FileMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = fileArchiveSchema.safeParse({ fileId })
  if (!parsed.success) {
    return {
      success: false,
      message: "File id is invalid.",
    }
  }

  try {
    const data = await deleteFile(user.id, parsed.data.fileId)
    revalidateFilePaths(data.dealId)
    return {
      success: true,
      message: "File deleted.",
      data: { id: data.id },
    }
  } catch (error) {
    console.error("files.delete_failed", { userId: user.id, fileId: parsed.data.fileId, error })
    return mapFileServiceError(error, "We could not delete this file. Please try again.")
  }
}
