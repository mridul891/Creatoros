"use client"

import { Plus } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"

import { getDealAction } from "@/app/action/dealActions"
import { DealKanbanBoard } from "@/components/modules/crm/deals/DealKanbanBoard"
import { DealArchiveDialog } from "@/components/modules/crm/deals/DealArchiveDialog"
import { DealDeleteDialog } from "@/components/modules/crm/deals/DealDeleteDialog"
import { DealsSummaryWidgets } from "@/components/modules/crm/deals/DealsSummaryWidgets"
import { DealsTable } from "@/components/modules/crm/deals/DealsTable"
import { DealsToolbar } from "@/components/modules/crm/deals/DealsToolbar"
import { useDealListSearch } from "@/hooks/useDealListSearch"
import { useDealMutations } from "@/hooks/useDealMutations"
import { useDealPipeline } from "@/hooks/useDealPipeline"
import { useDealsNavigation } from "@/hooks/useDealsNavigation"
import { getDealFormFieldErrors } from "@/lib/crm/deals/dealValidation"
import { EMPTY_DEAL_FORM, type DealFormValues, dealDetailToFormValues } from "@/lib/crm/deals/dealForm"
import type { DealField, DealListData, DealListItem } from "@/types/deal"
import { DealForm } from "./DealForm"
import { CrmEmptyState, CrmPageHeader, CrmPagination } from "../shared"

type DealsPageProps = {
  listData: DealListData
  brands: Array<{ id: string; name: string }>
  contactsByBrand: Record<string, Array<{ id: string; name: string }>>
}

function keepUnresolvedErrors(
  currentErrors: Partial<Record<DealField, string>>,
  nextErrors: Partial<Record<DealField, string>>
) {
  const unresolved: Partial<Record<DealField, string>> = {}

  for (const field of Object.keys(currentErrors) as DealField[]) {
    const message = nextErrors[field]
    if (message) {
      unresolved[field] = message
    }
  }

  return unresolved
}

export function DealsPage({ listData, brands, contactsByBrand }: DealsPageProps) {
  const filters = listData.filters
  const { navigateWith, navigateToPage, refresh } = useDealsNavigation(filters)

  const [showCreate, setShowCreate] = useState(false)
  const [isEditLoading, setIsEditLoading] = useState(false)
  const [editing, setEditing] = useState<DealListItem | null>(null)
  const [archiving, setArchiving] = useState<DealListItem | null>(null)
  const [restoring, setRestoring] = useState<DealListItem | null>(null)
  const [deleting, setDeleting] = useState<DealListItem | null>(null)
  const [createFormValues, setCreateFormValues] = useState<DealFormValues>(EMPTY_DEAL_FORM)
  const [createFieldErrors, setCreateFieldErrors] = useState<Partial<Record<DealField, string>>>({})
  const [createFormError, setCreateFormError] = useState("")
  const [editFormValues, setEditFormValues] = useState<DealFormValues>(EMPTY_DEAL_FORM)
  const [editFieldErrors, setEditFieldErrors] = useState<Partial<Record<DealField, string>>>({})
  const [editFormError, setEditFormError] = useState("")

  const { search, setSearch } = useDealListSearch({
    initialSearch: filters.search,
    view: filters.view,
    archive: filters.archive,
    stage: filters.stage,
    priority: filters.priority,
    brandId: filters.brandId,
    sort: filters.sort,
  })

  const { deals, isMutating: isPipelineMutating, moveDeal } = useDealPipeline({
    initialDeals: listData.items,
    onMoveSuccess: refresh,
  })

  const {
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
  } = useDealMutations({
    onRefresh: refresh,
  })

  const createContacts = useMemo(() => {
    return createFormValues.brandId ? contactsByBrand[createFormValues.brandId] ?? [] : []
  }, [contactsByBrand, createFormValues.brandId])

  const editContacts = useMemo(() => {
    return editFormValues.brandId ? contactsByBrand[editFormValues.brandId] ?? [] : []
  }, [contactsByBrand, editFormValues.brandId])

  function resetCreateForm() {
    setCreateFormValues(EMPTY_DEAL_FORM)
    setCreateFieldErrors({})
    setCreateFormError("")
  }

  function resetEditForm() {
    setEditFormValues(EMPTY_DEAL_FORM)
    setEditFieldErrors({})
    setEditFormError("")
  }

  function handleCreateFormChange(nextValues: DealFormValues) {
    setCreateFormValues(nextValues)
    if (createFormError) {
      setCreateFormError("")
    }

    if (Object.keys(createFieldErrors).length === 0) {
      return
    }

    const nextAllErrors = getDealFormFieldErrors(nextValues)
    const unresolvedErrors = keepUnresolvedErrors(createFieldErrors, nextAllErrors)
    setCreateFieldErrors(unresolvedErrors)
  }

  function handleEditFormChange(nextValues: DealFormValues) {
    setEditFormValues(nextValues)
    if (editFormError) {
      setEditFormError("")
    }

    if (Object.keys(editFieldErrors).length === 0) {
      return
    }

    const nextAllErrors = getDealFormFieldErrors(nextValues)
    const unresolvedErrors = keepUnresolvedErrors(editFieldErrors, nextAllErrors)
    setEditFieldErrors(unresolvedErrors)
  }

  async function handleCreateSubmit() {
    setCreateFormError("")
    setCreateFieldErrors({})
    const result = await submitCreate(createFormValues)

    if (!result.success) {
      setCreateFormError(result.message ?? "Could not create deal.")
      setCreateFieldErrors(result.fieldErrors ?? {})
      return
    }

    toast.success(result.message ?? "Deal created.")
    setShowCreate(false)
    resetCreateForm()
    refresh()
  }

  async function handleUpdateSubmit() {
    if (!editing) {
      return
    }
    setEditFormError("")
    setEditFieldErrors({})
    const result = await submitUpdate(editing.id, editFormValues)

    if (!result.success) {
      setEditFormError(result.message ?? "Could not update deal.")
      setEditFieldErrors(result.fieldErrors ?? {})
      return
    }

    toast.success(result.message ?? "Deal updated.")
    setEditing(null)
    resetEditForm()
    refresh()
  }

  async function handleArchive() {
    if (!archiving) {
      return
    }
    await runArchive(archiving.id)
    setArchiving(null)
  }

  async function handleRestore() {
    if (!restoring) {
      return
    }
    await runRestore(restoring.id)
    setRestoring(null)
  }

  async function handleDelete() {
    if (!deleting) {
      return
    }
    await runDelete(deleting.id)
    setDeleting(null)
  }

  async function handleStageChange(dealId: string, stage: DealListItem["stage"]) {
    await runStageChange(dealId, stage)
  }

  async function handlePriorityChange(dealId: string, priority: DealListItem["priority"]) {
    await runPriorityChange(dealId, priority)
  }

  async function handleEdit(deal: DealListItem) {
    setIsEditLoading(true)
    const result = await getDealAction(deal.id)
    setIsEditLoading(false)
    if (!result.success) {
      toast.error(result.message ?? "Could not load full deal details.")
      return
    }

    setEditing(deal)
    setEditFormValues(dealDetailToFormValues(result.data))
    setEditFormError("")
    setEditFieldErrors({})
  }

  return (
    <div className="w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-9 lg:py-7">
      <CrmPageHeader
        title="Deals CRM"
        description="Track sponsorship opportunities from first outreach to final payment."
        actionLabel="New Deal"
        actionIcon={<Plus size={15} />}
        onAction={() => {
          resetCreateForm()
          setShowCreate(true)
        }}
      />

      <DealsSummaryWidgets widgets={listData.widgets} />

      <DealsToolbar
        total={listData.pagination.total}
        search={search}
        view={filters.view}
        archive={filters.archive}
        stage={filters.stage}
        priority={filters.priority}
        brandId={filters.brandId}
        sort={filters.sort}
        brands={brands}
        onSearchChange={setSearch}
        onViewChange={(value) => navigateWith({ view: value })}
        onArchiveChange={(value) => navigateWith({ archive: value })}
        onStageChange={(value) => navigateWith({ stage: value })}
        onPriorityChange={(value) => navigateWith({ priority: value })}
        onBrandChange={(value) => navigateWith({ brandId: value })}
        onSortChange={(value) => navigateWith({ sort: value })}
      />

      {listData.items.length === 0 ? (
        <CrmEmptyState
          title={filters.search || filters.brandId || filters.priority || filters.stage ? "No matching deals" : "No deals found"}
          description={
            filters.search || filters.brandId || filters.priority || filters.stage
              ? "Try clearing one or more filters to widen your results."
              : "Create your first deal to start tracking your pipeline."
          }
          actionLabel="Create Deal"
          onAction={() => {
            resetCreateForm()
            setShowCreate(true)
          }}
        />
      ) : filters.view === "kanban" ? (
        <DealKanbanBoard deals={deals} isMutating={isPipelineMutating} onMove={moveDeal} />
      ) : (
        <>
          <DealsTable
            items={listData.items}
            isInlineUpdating={isInlineUpdating}
            onStageChange={handleStageChange}
            onPriorityChange={handlePriorityChange}
            onEdit={handleEdit}
            onArchive={setArchiving}
            onRestore={setRestoring}
            onDelete={setDeleting}
          />
          <CrmPagination page={listData.pagination.page} totalPages={listData.pagination.totalPages} onPageChange={navigateToPage} />
        </>
      )}

      <DealForm
        open={showCreate}
        title="Create Deal"
        submitLabel="Create Deal"
        values={createFormValues}
        isSubmitting={isSubmitting}
        fieldErrors={createFieldErrors}
        formError={createFormError}
        brands={brands}
        contacts={createContacts}
        onChange={handleCreateFormChange}
        onOpenChange={(open) => {
          setShowCreate(open)
          if (!open) {
            resetCreateForm()
          }
        }}
        onSubmit={handleCreateSubmit}
      />

      <DealForm
        open={Boolean(editing)}
        title="Edit Deal"
        submitLabel="Save Changes"
        values={editFormValues}
        isSubmitting={isSubmitting || isEditLoading}
        fieldErrors={editFieldErrors}
        formError={editFormError}
        brands={brands}
        contacts={editContacts}
        onChange={handleEditFormChange}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null)
            resetEditForm()
          }
        }}
        onSubmit={handleUpdateSubmit}
      />

      <DealArchiveDialog
        open={Boolean(archiving)}
        campaignName={archiving?.campaignName ?? ""}
        isLoading={isMutating}
        mode="archive"
        onOpenChange={(open) => {
          if (!open) {
            setArchiving(null)
          }
        }}
        onConfirm={handleArchive}
      />

      <DealArchiveDialog
        open={Boolean(restoring)}
        campaignName={restoring?.campaignName ?? ""}
        isLoading={isMutating}
        mode="restore"
        onOpenChange={(open) => {
          if (!open) {
            setRestoring(null)
          }
        }}
        onConfirm={handleRestore}
      />

      <DealDeleteDialog
        open={Boolean(deleting)}
        campaignName={deleting?.campaignName ?? ""}
        isLoading={isMutating}
        onOpenChange={(open) => {
          if (!open) {
            setDeleting(null)
          }
        }}
        onConfirm={handleDelete}
      />
    </div>
  )
}
