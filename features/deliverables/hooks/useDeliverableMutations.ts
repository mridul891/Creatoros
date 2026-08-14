"use client"

import { useState } from "react"
import { toast } from "sonner"

import {
  archiveDeliverableAction,
  createDeliverableAction,
  deleteDeliverableAction,
  restoreDeliverableAction,
  updateDeliverableAction,
} from "@/features/deliverables/actions/deliverableActions"
import {
  buildDeliverableFormData,
  type DeliverableFormValues,
} from "@/features/deliverables/utils/deliverableForm"

type UseDeliverableMutationsOptions = {
  onRefresh: () => void
}

export function useDeliverableMutations({
  onRefresh,
}: UseDeliverableMutationsOptions) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMutating, setIsMutating] = useState(false)

  async function submitCreate(values: DeliverableFormValues) {
    setIsSubmitting(true)
    try {
      return await createDeliverableAction(buildDeliverableFormData(values))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function submitUpdate(
    deliverableId: string,
    values: DeliverableFormValues
  ) {
    setIsSubmitting(true)
    try {
      return await updateDeliverableAction(
        buildDeliverableFormData(values, deliverableId)
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function runArchive(deliverableId: string) {
    setIsMutating(true)
    const result = await archiveDeliverableAction(deliverableId)
    setIsMutating(false)
    if (!result.success) {
      toast.error(result.message ?? "Could not archive deliverable.")
      return result
    }
    toast.success(result.message ?? "Deliverable archived.")
    onRefresh()
    return result
  }

  async function runRestore(deliverableId: string) {
    setIsMutating(true)
    const result = await restoreDeliverableAction(deliverableId)
    setIsMutating(false)
    if (!result.success) {
      toast.error(result.message ?? "Could not restore deliverable.")
      return result
    }
    toast.success(result.message ?? "Deliverable restored.")
    onRefresh()
    return result
  }

  async function runDelete(deliverableId: string) {
    setIsMutating(true)
    const result = await deleteDeliverableAction(deliverableId)
    setIsMutating(false)
    if (!result.success) {
      toast.error(result.message ?? "Could not delete deliverable.")
      return result
    }
    toast.success(result.message ?? "Deliverable deleted.")
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
