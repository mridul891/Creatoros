"use client"

import { Plus } from "@phosphor-icons/react/dist/ssr"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import { getDeliverableAction } from "@/app/action/deliverableActions"
import { CrmConfirmDialog, CrmPageHeaderClient, CrmPagination, CrmSearchField } from "@/components/modules/crm/shared"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DELIVERABLE_STATUSES } from "@/enums/deliverable"
import { useDealDeliverables } from "@/hooks/useDealDeliverables"
import { useDeliverableMutations } from "@/hooks/useDeliverableMutations"
import { useInvoiceMutations } from "@/hooks/useInvoiceMutations"
import { EMPTY_DELIVERABLE_FORM, deliverableDetailToFormValues, type DeliverableFormValues } from "@/lib/crm/deliverables/deliverableForm"
import { getDeliverableFormFieldErrors } from "@/lib/crm/deliverables/deliverableValidation"
import { keepUnresolvedErrors } from "@/lib/crm/shared/formErrors"
import type { DeliverableField, DeliverableListData } from "@/types/deliverable"
import { DeliverableForm } from "./DeliverableForm"
import { DeliverablesEmptyState } from "./DeliverablesEmptyState"
import { DeliverablesTable } from "./DeliverablesTable"

type DealDeliverablesSectionProps = {
  dealId: string
  initialData: DeliverableListData
  initialLoadError?: string
  onSummaryTotalChange?: (total: number) => void
}

export function DealDeliverablesSection({
  dealId,
  initialData,
  initialLoadError,
  onSummaryTotalChange,
}: DealDeliverablesSectionProps) {
  const router = useRouter()
  const {
    deliverables,
    pagination,
    summary,
    search,
    status,
    platform,
    archive,
    sort,
    isLoading,
    loadError,
    setSearch,
    setStatus,
    setPlatform,
    setArchive,
    setSort,
    setPage,
    refetch,
  } = useDealDeliverables({ dealId, initialData })

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [pendingArchiveId, setPendingArchiveId] = useState<string | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [formValues, setFormValues] = useState<DeliverableFormValues>({ ...EMPTY_DELIVERABLE_FORM, dealId })
  const [formError, setFormError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<DeliverableField, string>>>({})

  const { isSubmitting, isMutating, submitCreate, submitUpdate, runArchive, runRestore, runDelete } = useDeliverableMutations({
    onRefresh: () => {
      void refetch(pagination.page)
    },
  })
  const { isCreatingFromDeliverableId, createFromDeliverable } = useInvoiceMutations({
    onRefresh: () => {
      void refetch(pagination.page)
    },
  })

  const displayError = initialLoadError ?? loadError
  const pendingArchiveItem = pendingArchiveId ? deliverables.find((item) => item.id === pendingArchiveId) : null
  const isArchiveActionRestore = pendingArchiveItem?.isArchived ?? archive === "archived"

  const activePlatforms = useMemo(() => {
    const set = new Set(deliverables.map((item) => item.platform))
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [deliverables])

  useEffect(() => {
    onSummaryTotalChange?.(summary.total)
  }, [onSummaryTotalChange, summary.total])

  async function openCreate() {
    setEditingId(null)
    setFormValues({ ...EMPTY_DELIVERABLE_FORM, dealId })
    setFormError("")
    setFieldErrors({})
    setShowForm(true)
  }

  async function openEdit(deliverableId: string) {
    const result = await getDeliverableAction(deliverableId)
    if (!result.success) {
      toast.error(result.message ?? "Could not load deliverable.")
      return
    }

    setEditingId(result.data.id)
    setFormValues(deliverableDetailToFormValues(result.data))
    setFormError("")
    setFieldErrors({})
    setShowForm(true)
  }

  async function handleSubmit() {
    setFormError("")
    setFieldErrors({})
    const result = editingId ? await submitUpdate(editingId, formValues) : await submitCreate(formValues)

    if (!result.success) {
      setFormError(result.message ?? "Could not save deliverable.")
      setFieldErrors(result.fieldErrors ?? {})
      return
    }

    toast.success(result.message ?? "Deliverable saved.")
    setShowForm(false)
    setEditingId(null)
    await refetch(1)
  }

  function handleFormChange(nextValues: DeliverableFormValues) {
    setFormValues(nextValues)
    if (formError) {
      setFormError("")
    }

    if (Object.keys(fieldErrors).length === 0) {
      return
    }

    const nextAllErrors = getDeliverableFormFieldErrors(nextValues)
    const unresolvedErrors = keepUnresolvedErrors(fieldErrors, nextAllErrors)
    setFieldErrors(unresolvedErrors)
  }

  async function confirmArchive() {
    if (!pendingArchiveId) return
    const target = deliverables.find((item) => item.id === pendingArchiveId)
    const result = target?.isArchived ? await runRestore(pendingArchiveId) : await runArchive(pendingArchiveId)
    if (result.success) {
      setPendingArchiveId(null)
      await refetch(pagination.page)
    }
  }

  async function confirmDelete() {
    if (!pendingDeleteId) return
    const result = await runDelete(pendingDeleteId)
    if (result.success) {
      setPendingDeleteId(null)
      await refetch(1)
    }
  }

  async function handleCreateInvoice(deliverableId: string) {
    const result = await createFromDeliverable(deliverableId)
    if (result.success && result.data) {
      router.push(`/dashboard/invoices?invoice=${result.data.id}`)
    }
  }

  return (
    <div className="rounded-[20px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] p-6">
      <CrmPageHeaderClient
        title="Deliverables"
        description="Brand-facing campaign outcomes and approval lifecycle."
        actionLabel="Add Deliverable"
        actionIcon={<Plus size={14} />}
        onAction={openCreate}
        className="mb-4"
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <CrmSearchField value={search} placeholder="Search deliverables" onChange={setSearch} className="w-[260px]" />
        <Select value={status} onValueChange={(next) => setStatus(next as typeof status)}>
          <SelectTrigger className="h-10 w-[170px] border-[rgba(255,255,255,0.08)] bg-[#0D0D0D] text-xs text-[rgba(255,255,255,0.75)]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {DELIVERABLE_STATUSES.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={platform} onValueChange={setPlatform}>
          <SelectTrigger className="h-10 w-[170px] border-[rgba(255,255,255,0.08)] bg-[#0D0D0D] text-xs text-[rgba(255,255,255,0.75)]">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All platforms</SelectItem>
            {activePlatforms.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={archive} onValueChange={(next) => setArchive(next as typeof archive)}>
          <SelectTrigger className="h-10 w-[140px] border-[rgba(255,255,255,0.08)] bg-[#0D0D0D] text-xs text-[rgba(255,255,255,0.75)]">
            <SelectValue placeholder="Visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(next) => setSort(next as typeof sort)}>
          <SelectTrigger className="h-10 w-[160px] border-[rgba(255,255,255,0.08)] bg-[#0D0D0D] text-xs text-[rgba(255,255,255,0.75)]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="order">Manual order</SelectItem>
            <SelectItem value="dueDate">Due date</SelectItem>
            <SelectItem value="updatedAt">Last updated</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button type="button" size="sm" variant="outline" className="h-8 text-[11px]">
          Total: {summary.total}
        </Button>
        <Button type="button" size="sm" variant="outline" className="h-8 text-[11px]">
          Submitted: {summary.submitted}
        </Button>
        <Button type="button" size="sm" variant="outline" className="h-8 text-[11px]">
          Needs Revision: {summary.needsRevision}
        </Button>
        <Button type="button" size="sm" variant="outline" className="h-8 text-[11px]">
          Published: {summary.published}
        </Button>
      </div>

      {displayError ? <p className="mb-4 text-[12px] text-[#E8402A]">{displayError}</p> : null}

      {isLoading ? (
        <p className="text-[12px] text-[rgba(255,255,255,0.5)]">Loading deliverables...</p>
      ) : deliverables.length === 0 ? (
        <DeliverablesEmptyState onCreate={openCreate} />
      ) : (
        <DeliverablesTable
          items={deliverables}
          isCreatingInvoiceId={isCreatingFromDeliverableId}
          onEdit={openEdit}
          onCreateInvoice={handleCreateInvoice}
          onArchive={(id) => setPendingArchiveId(id)}
          onRestore={(id) => setPendingArchiveId(id)}
          onDelete={(id) => setPendingDeleteId(id)}
        />
      )}

      {pagination.totalPages > 1 ? <CrmPagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} /> : null}

      <DeliverableForm
        open={showForm}
        title={editingId ? "Edit Deliverable" : "Add Deliverable"}
        submitLabel={editingId ? "FloppyDisk Changes" : "Create Deliverable"}
        values={formValues}
        isSubmitting={isSubmitting}
        fieldErrors={fieldErrors}
        formError={formError}
        onChange={handleFormChange}
        onOpenChange={setShowForm}
        onSubmit={handleSubmit}
      />

      <CrmConfirmDialog
        open={Boolean(pendingArchiveId)}
        title={isArchiveActionRestore ? "Restore deliverable?" : "Archive deliverable?"}
        description={
          isArchiveActionRestore
            ? "This deliverable will become active and visible in active workflow."
            : "This deliverable will move to archived history."
        }
        confirmLabel={isArchiveActionRestore ? "Restore" : "Archive"}
        isLoading={isMutating}
        onOpenChange={(open) => {
          if (!open) setPendingArchiveId(null)
        }}
        onConfirm={confirmArchive}
      />

      <CrmConfirmDialog
        open={Boolean(pendingDeleteId)}
        title="Delete deliverable permanently?"
        description="Only archived deliverables can be deleted. This action cannot be undone."
        confirmLabel="Delete Deliverable"
        isLoading={isMutating}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteId(null)
        }}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
