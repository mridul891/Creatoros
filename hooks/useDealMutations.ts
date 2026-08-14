"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  archiveDealAction,
  createDealAction,
  deleteDealAction,
  restoreDealAction,
  updateDealAction,
  updateDealPriorityAction,
  updateDealStageAction,
} from "@/app/action/dealActions"
import {
  buildDealFormData,
  type DealFormValues,
} from "@/lib/crm/deals/dealForm"
import type { DealListItem } from "@/types/deal"

type UseDealMutationsOptions = {
  onRefresh: () => void
  onDeleteSuccess?: () => void
}

export function useDealMutations({
  onRefresh,
  onDeleteSuccess,
}: UseDealMutationsOptions) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMutating, setIsMutating] = useState(false)
  const [isInlineUpdating, setIsInlineUpdating] = useState(false)

  async function submitCreate(values: DealFormValues) {
    setIsSubmitting(true)
    try {
      return await createDealAction(buildDealFormData(values))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function submitUpdate(dealId: string, values: DealFormValues) {
    setIsSubmitting(true)
    try {
      return await updateDealAction(buildDealFormData(values, dealId))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function runArchive(dealId: string) {
    setIsMutating(true)
    const result = await archiveDealAction(dealId)
    setIsMutating(false)
    if (!result.success) {
      toast.error(result.message ?? "Could not archive deal.")
      return result
    }
    toast.success(result.message ?? "Deal archived.")
    onRefresh()
    return result
  }

  async function runRestore(dealId: string) {
    setIsMutating(true)
    const result = await restoreDealAction(dealId)
    setIsMutating(false)
    if (!result.success) {
      toast.error(result.message ?? "Could not restore deal.")
      return result
    }
    toast.success(result.message ?? "Deal restored.")
    onRefresh()
    return result
  }

  async function runDelete(dealId: string) {
    setIsMutating(true)
    const result = await deleteDealAction(dealId)
    setIsMutating(false)
    if (!result.success) {
      toast.error(result.message ?? "Could not delete deal.")
      return result
    }
    toast.success(result.message ?? "Deal deleted.")
    onDeleteSuccess?.()
    onRefresh()
    return result
  }

  async function runStageChange(dealId: string, stage: DealListItem["stage"]) {
    setIsInlineUpdating(true)
    const result = await updateDealStageAction(dealId, stage)
    setIsInlineUpdating(false)
    if (!result.success) {
      toast.error(result.message ?? "Could not update stage.")
      return result
    }
    toast.success(result.message ?? "Deal stage updated.")
    onRefresh()
    return result
  }

  async function runPriorityChange(
    dealId: string,
    priority: DealListItem["priority"]
  ) {
    setIsInlineUpdating(true)
    const result = await updateDealPriorityAction(dealId, priority)
    setIsInlineUpdating(false)
    if (!result.success) {
      toast.error(result.message ?? "Could not update priority.")
      return result
    }
    toast.success(result.message ?? "Deal priority updated.")
    onRefresh()
    return result
  }

  return {
    isSubmitting,
    isMutating,
    isInlineUpdating,
    submitCreate,
    submitUpdate,
    runArchive,
    runRestore,
    runDelete,
    runStageChange,
    runPriorityChange,
  }
}
