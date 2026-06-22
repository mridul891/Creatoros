"use client"

import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
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
import { DealKanbanBoard } from "@/components/modules/crm/deals/DealKanbanBoard"
import { DealArchiveDialog } from "@/components/modules/crm/deals/DealArchiveDialog"
import { DealDeleteDialog } from "@/components/modules/crm/deals/DealDeleteDialog"
import { DealsTable } from "@/components/modules/crm/deals/DealsTable"
import { DealsToolbar } from "@/components/modules/crm/deals/DealsToolbar"
import { useDealListSearch } from "@/hooks/useDealListSearch"
import { useDealPipeline } from "@/hooks/useDealPipeline"
import { buildDealFormData, EMPTY_DEAL_FORM, type DealFormValues, dealToFormValues } from "@/lib/crm/deals/dealForm"
import type { DealField, DealListData, DealListItem } from "@/types/deal"
import { DealForm } from "./DealForm"
import { CrmEmptyState, CrmPageHeader, CrmPagination } from "../shared"

type DealsPageProps = {
  listData: DealListData
  brands: Array<{ id: string; name: string }>
  contactsByBrand: Record<string, Array<{ id: string; name: string }>>
}

function buildDealsUrl(filters: {
  search?: string
  view?: string
  archive?: string
  stage?: string
  priority?: string
  brandId?: string
  sort?: string
  page?: number
}) {
  const params = new URLSearchParams()
  if (filters.search?.trim()) params.set("search", filters.search.trim())
  if (filters.view) params.set("view", filters.view)
  if (filters.archive) params.set("archive", filters.archive)
  if (filters.stage) params.set("stage", filters.stage)
  if (filters.priority) params.set("priority", filters.priority)
  if (filters.brandId) params.set("brandId", filters.brandId)
  if (filters.sort) params.set("sort", filters.sort)
  if (filters.page) params.set("page", String(filters.page))
  return `/dashboard/deals?${params.toString()}`
}

export function DealsPage({ listData, brands, contactsByBrand }: DealsPageProps) {
  const router = useRouter()
  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<DealListItem | null>(null)
  const [archiving, setArchiving] = useState<DealListItem | null>(null)
  const [restoring, setRestoring] = useState<DealListItem | null>(null)
  const [deleting, setDeleting] = useState<DealListItem | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMutating, setIsMutating] = useState(false)
  const [isInlineUpdating, setIsInlineUpdating] = useState(false)
  const [formValues, setFormValues] = useState<DealFormValues>(EMPTY_DEAL_FORM)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<DealField, string>>>({})
  const [formError, setFormError] = useState("")

  const filters = listData.filters
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
  })

  const contacts = useMemo(() => {
    return formValues.brandId ? contactsByBrand[formValues.brandId] ?? [] : []
  }, [contactsByBrand, formValues.brandId])

  function resetForm() {
    setFormValues(EMPTY_DEAL_FORM)
    setFieldErrors({})
    setFormError("")
  }

  function navigateWith(
    nextFilters: Partial<{
      search: string
      view: string
      archive: string
      stage: string | undefined
      priority: string | undefined
      brandId: string | undefined
      sort: string
    }>,
  ) {
    router.push(
      buildDealsUrl({
        search: "search" in nextFilters ? nextFilters.search : filters.search,
        view: "view" in nextFilters ? nextFilters.view : filters.view,
        archive: "archive" in nextFilters ? nextFilters.archive : filters.archive,
        stage: "stage" in nextFilters ? nextFilters.stage : filters.stage,
        priority: "priority" in nextFilters ? nextFilters.priority : filters.priority,
        brandId: "brandId" in nextFilters ? nextFilters.brandId : filters.brandId,
        sort: "sort" in nextFilters ? nextFilters.sort : filters.sort,
        page: 1,
      }),
    )
  }

  async function handleCreateSubmit() {
    setIsSubmitting(true)
    setFormError("")
    setFieldErrors({})
    const result = await createDealAction(buildDealFormData(formValues))
    setIsSubmitting(false)

    if (!result.success) {
      setFormError(result.message ?? "Could not create deal.")
      setFieldErrors(result.fieldErrors ?? {})
      return
    }

    toast.success(result.message ?? "Deal created.")
    setShowCreate(false)
    resetForm()
    router.refresh()
  }

  async function handleUpdateSubmit() {
    if (!editing) {
      return
    }
    setIsSubmitting(true)
    setFormError("")
    setFieldErrors({})
    const result = await updateDealAction(buildDealFormData(formValues, editing.id))
    setIsSubmitting(false)

    if (!result.success) {
      setFormError(result.message ?? "Could not update deal.")
      setFieldErrors(result.fieldErrors ?? {})
      return
    }

    toast.success(result.message ?? "Deal updated.")
    setEditing(null)
    resetForm()
    router.refresh()
  }

  async function handleArchive() {
    if (!archiving) {
      return
    }
    setIsMutating(true)
    const result = await archiveDealAction(archiving.id)
    setIsMutating(false)
    if (!result.success) {
      toast.error(result.message ?? "Could not archive deal.")
      return
    }
    toast.success(result.message ?? "Deal archived.")
    setArchiving(null)
    router.refresh()
  }

  async function handleRestore() {
    if (!restoring) {
      return
    }
    setIsMutating(true)
    const result = await restoreDealAction(restoring.id)
    setIsMutating(false)
    if (!result.success) {
      toast.error(result.message ?? "Could not restore deal.")
      return
    }
    toast.success(result.message ?? "Deal restored.")
    setRestoring(null)
    router.refresh()
  }

  async function handleDelete() {
    if (!deleting) {
      return
    }
    setIsMutating(true)
    const result = await deleteDealAction(deleting.id)
    setIsMutating(false)
    if (!result.success) {
      toast.error(result.message ?? "Could not delete deal.")
      return
    }
    toast.success(result.message ?? "Deal deleted.")
    setDeleting(null)
    router.refresh()
  }

  async function handleStageChange(dealId: string, stage: DealListItem["stage"]) {
    setIsInlineUpdating(true)
    const result = await updateDealStageAction(dealId, stage)
    setIsInlineUpdating(false)

    if (!result.success) {
      toast.error(result.message ?? "Could not update stage.")
      return
    }

    toast.success(result.message ?? "Deal stage updated.")
    router.refresh()
  }

  async function handlePriorityChange(dealId: string, priority: DealListItem["priority"]) {
    setIsInlineUpdating(true)
    const result = await updateDealPriorityAction(dealId, priority)
    setIsInlineUpdating(false)

    if (!result.success) {
      toast.error(result.message ?? "Could not update priority.")
      return
    }

    toast.success(result.message ?? "Deal priority updated.")
    router.refresh()
  }

  return (
    <div className="w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-9 lg:py-7">
      <CrmPageHeader
        title="Deals CRM"
        description="Track sponsorship opportunities from first outreach to final payment."
        actionLabel="New Deal"
        actionIcon={<Plus size={15} />}
        onAction={() => {
          resetForm()
          setShowCreate(true)
        }}
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-[14px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] p-4">
          <p className="font-mono text-[10px] text-[rgba(255,255,255,0.45)]">Active Deals</p>
          <p className="mt-2 text-2xl font-black text-white">{listData.widgets.activeDeals}</p>
        </div>
        <div className="rounded-[14px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] p-4">
          <p className="font-mono text-[10px] text-[rgba(255,255,255,0.45)]">Revenue In Progress</p>
          <p className="mt-2 text-lg font-bold text-white">${listData.widgets.revenueInProgress.toLocaleString()}</p>
        </div>
        <div className="rounded-[14px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] p-4">
          <p className="font-mono text-[10px] text-[rgba(255,255,255,0.45)]">Closing Soon</p>
          <p className="mt-2 text-2xl font-black text-white">{listData.widgets.dealsClosingSoon}</p>
        </div>
        <div className="rounded-[14px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] p-4">
          <p className="font-mono text-[10px] text-[rgba(255,255,255,0.45)]">Overdue</p>
          <p className="mt-2 text-2xl font-black text-white">{listData.widgets.overdueDeals}</p>
        </div>
        <div className="rounded-[14px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] p-4">
          <p className="font-mono text-[10px] text-[rgba(255,255,255,0.45)]">Highest Value</p>
          <p className="mt-2 truncate text-[13px] font-semibold text-white">
            {listData.widgets.highestValueDeals[0]?.campaignName ?? "No active deals"}
          </p>
        </div>
      </div>

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
          title="No deals found"
          description="Create your first deal to start tracking your pipeline."
          actionLabel="Create Deal"
          onAction={() => {
            resetForm()
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
            onEdit={(deal) => {
              setEditing(deal)
              setFormValues(dealToFormValues(deal))
              setFormError("")
              setFieldErrors({})
            }}
            onArchive={setArchiving}
            onRestore={setRestoring}
            onDelete={setDeleting}
          />
          <CrmPagination
            page={listData.pagination.page}
            totalPages={listData.pagination.totalPages}
            onPageChange={(page) =>
              router.push(
                buildDealsUrl({
                  search: filters.search,
                  view: filters.view,
                  archive: filters.archive,
                  stage: filters.stage,
                  priority: filters.priority,
                  brandId: filters.brandId,
                  sort: filters.sort,
                  page,
                }),
              )
            }
          />
        </>
      )}

      <DealForm
        open={showCreate}
        title="Create Deal"
        submitLabel="Create Deal"
        values={formValues}
        isSubmitting={isSubmitting}
        fieldErrors={fieldErrors}
        formError={formError}
        brands={brands}
        contacts={contacts}
        onChange={setFormValues}
        onOpenChange={(open) => {
          setShowCreate(open)
          if (!open) {
            resetForm()
          }
        }}
        onSubmit={handleCreateSubmit}
      />

      <DealForm
        open={Boolean(editing)}
        title="Edit Deal"
        submitLabel="Save Changes"
        values={formValues}
        isSubmitting={isSubmitting}
        fieldErrors={fieldErrors}
        formError={formError}
        brands={brands}
        contacts={contacts}
        onChange={setFormValues}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null)
            resetForm()
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
