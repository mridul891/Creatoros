"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import {
  type DealPriority,
  SponsorshipMode,
  SponsorshipStage,
} from "@/features/sponsorship/enums/sponsorship"
import type { Deal } from "@/features/sponsorship/types/sponsorship"
import { SEED_DEALS } from "./data"
import { calculatePipelineSummary } from "./metrics"
import { type ModalState, STAGES, type Stage } from "./shared"

interface PipelineUiState {
  search: string
  dragDealId: number | null
  dragOverStage: Stage | null
}

export function usePipeline(
  initialMode: SponsorshipMode = SponsorshipMode.TABLE
) {
  const [deals, setDeals] = useState<Deal[]>(SEED_DEALS)
  const [viewMode, setViewMode] = useState<SponsorshipMode>(initialMode)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [modal, setModal] = useState<ModalState | null>(null)
  const [uiState, setUiState] = useState<PipelineUiState>({
    search: "",
    dragDealId: null,
    dragOverStage: null,
  })
  const nextIdRef = useRef(Math.max(...SEED_DEALS.map((deal) => deal.id)) + 1)

  const selectedDeal = useMemo(
    () => deals.find((deal) => deal.id === selectedId) ?? null,
    [deals, selectedId]
  )
  const filteredDeals = useMemo(() => {
    const query = uiState.search.trim().toLowerCase()
    if (!query) return deals
    return deals.filter(
      (deal) =>
        deal.brand.toLowerCase().includes(query) ||
        deal.category.toLowerCase().includes(query)
    )
  }, [deals, uiState.search])
  const summary = useMemo(() => calculatePipelineSummary(deals), [deals])

  const setSearch = useCallback((search: string) => {
    setUiState((prev) => ({ ...prev, search }))
  }, [])

  const handleStageChange = useCallback((id: number, stage: Stage) => {
    setDeals((prev) =>
      prev.map((deal) => (deal.id === id ? { ...deal, stage } : deal))
    )
  }, [])

  const handlePriorityChange = useCallback(
    (id: number, priority: DealPriority) => {
      setDeals((prev) =>
        prev.map((deal) => (deal.id === id ? { ...deal, priority } : deal))
      )
    },
    []
  )

  const handleSave = useCallback((deal: Deal) => {
    if (deal.id) {
      setDeals((prev) =>
        prev.map((item) => (item.id === deal.id ? deal : item))
      )
      return
    }

    const nextId = nextIdRef.current
    nextIdRef.current += 1
    setDeals((prev) => [...prev, { ...deal, id: nextId }])
  }, [])

  const handleDelete = useCallback((id: number) => {
    setDeals((prev) => prev.filter((deal) => deal.id !== id))
    setSelectedId((prev) => (prev === id ? null : prev))
  }, [])

  const handleAdvance = useCallback(
    (deal: Deal) => {
      const index = STAGES.indexOf(deal.stage)
      if (index < STAGES.length - 1) {
        handleStageChange(deal.id, STAGES[index + 1])
      }
    },
    [handleStageChange]
  )

  const handleDropToStage = useCallback(
    (stage: Stage) => {
      if (uiState.dragDealId == null) return

      const draggedDeal = deals.find((deal) => deal.id === uiState.dragDealId)
      if (!draggedDeal || draggedDeal.stage === stage) {
        setUiState((prev) => ({
          ...prev,
          dragDealId: null,
          dragOverStage: null,
        }))
        return
      }

      handleStageChange(uiState.dragDealId, stage)
      setUiState((prev) => ({ ...prev, dragDealId: null, dragOverStage: null }))
    },
    [deals, handleStageChange, uiState.dragDealId]
  )

  const onDragStart = useCallback((dealId: number) => {
    setUiState((prev) => ({ ...prev, dragDealId: dealId }))
  }, [])

  const onDragEnd = useCallback(() => {
    setUiState((prev) => ({ ...prev, dragDealId: null, dragOverStage: null }))
  }, [])

  const onDragOverStage = useCallback((stage: Stage) => {
    setUiState((prev) => ({ ...prev, dragOverStage: stage }))
  }, [])

  const onDragLeaveStage = useCallback((stage: Stage) => {
    setUiState((prev) =>
      prev.dragOverStage === stage ? { ...prev, dragOverStage: null } : prev
    )
  }, [])

  const openCreateModal = useCallback((defaultStage?: Stage) => {
    setModal(defaultStage ? { defaultStage } : {})
  }, [])

  const openEditModal = useCallback((deal: Deal) => {
    setModal({ deal })
  }, [])

  const closeModal = useCallback(() => {
    setModal(null)
  }, [])

  const closePanel = useCallback(() => {
    setSelectedId(null)
  }, [])

  const openDealPanel = useCallback((dealId: number) => {
    setSelectedId(dealId)
  }, [])

  const toggleDealPanel = useCallback((dealId: number) => {
    setSelectedId((prev) => (prev === dealId ? null : dealId))
  }, [])

  return {
    deals,
    filteredDeals,
    selectedDeal,
    selectedId,
    summary,
    viewMode,
    uiState,
    modal,
    setViewMode,
    setSearch,
    setModal,
    closeModal,
    closePanel,
    openDealPanel,
    toggleDealPanel,
    openCreateModal,
    openEditModal,
    handleSave,
    handleDelete,
    handleStageChange,
    handlePriorityChange,
    handleAdvance,
    handleDropToStage,
    onDragStart,
    onDragEnd,
    onDragOverStage,
    onDragLeaveStage,
  }
}

export function isPipelineDealPublished(stage: Stage) {
  return stage === SponsorshipStage.PAID
}
