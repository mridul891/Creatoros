"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { DealActivityTimelineSection } from "@/components/modules/crm/activity/DealActivityTimelineSection"
import { DealOverviewSection } from "@/components/modules/crm/deals/workspace/DealOverviewSection"
import { DealWorkspaceHeader } from "@/components/modules/crm/deals/workspace/DealWorkspaceHeader"
import { DealWorkspaceTabs } from "@/components/modules/crm/deals/workspace/DealWorkspaceTabs"
import { getDealFormFieldErrors } from "@/lib/crm/deals/dealValidation"
import { dealDetailToFormValues, type DealFormValues } from "@/lib/crm/deals/dealForm"
import { keepUnresolvedErrors } from "@/lib/crm/shared/formErrors"
import type { DealWorkspaceTab } from "@/lib/crm/deals/dealWorkspaceTabs"
import type { ActivityListData } from "@/types/activity"
import type { DealDetail, DealField } from "@/types/deal"
import type { DealFileListData } from "@/types/dealFile"
import type { DealNoteListData } from "@/types/dealNote"
import type { DeliverableListData } from "@/types/deliverable"
import type { TaskListData } from "@/types/task"
import { useDealMutations } from "@/hooks/useDealMutations"
import { DealArchiveDialog } from "./DealArchiveDialog"
import { DealDeleteDialog } from "./DealDeleteDialog"
import { DealForm } from "./DealForm"
import { DealDeliverablesSection } from "../deliverables/DealDeliverablesSection"
import { DealFilesSection } from "../files/DealFilesSection"
import { DealNotesSection } from "../notes/DealNotesSection"
import { DealTasksSection } from "../tasks/DealTasksSection"

type DealDetailPageProps = {
  deal: DealDetail
  initialTab: DealWorkspaceTab
  activityData: ActivityListData
  activityError?: string
  tasksData: TaskListData
  tasksError?: string
  deliverablesData: DeliverableListData
  deliverablesError?: string
  notesData: DealNoteListData
  notesError?: string
  filesData: DealFileListData
  filesError?: string
  brands: Array<{ id: string; name: string }>
  contacts: Array<{ id: string; name: string }>
}

export function DealDetailPage({
  deal,
  initialTab,
  activityData,
  activityError,
  tasksData,
  tasksError,
  deliverablesData,
  deliverablesError,
  notesData,
  notesError,
  filesData,
  filesError,
  brands,
  contacts,
}: DealDetailPageProps) {
  const router = useRouter()
  const [tasksTotal, setTasksTotal] = useState(tasksData.summary.total)
  const [deliverablesTotal, setDeliverablesTotal] = useState(deliverablesData.summary.total)
  const [showEdit, setShowEdit] = useState(false)
  const [archiveMode, setArchiveMode] = useState<"archive" | "restore" | null>(null)
  const [showDelete, setShowDelete] = useState(false)
  const [formValues, setFormValues] = useState<DealFormValues>(() => dealDetailToFormValues(deal))
  const [formError, setFormError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<DealField, string>>>({})

  const { isSubmitting, isMutating, submitUpdate, runArchive, runRestore, runDelete } = useDealMutations({
    onRefresh: () => router.refresh(),
    onDeleteSuccess: () => router.replace("/dashboard/deals"),
  })

  async function handleUpdate() {
    setFormError("")
    setFieldErrors({})
    const result = await submitUpdate(deal.id, formValues)

    if (!result.success) {
      setFormError(result.message ?? "Could not update deal.")
      setFieldErrors(result.fieldErrors ?? {})
      return
    }

    toast.success(result.message ?? "Deal updated.")
    setShowEdit(false)
    router.refresh()
  }

  async function handleArchiveOrRestore() {
    if (!archiveMode) {
      return
    }
    const result = archiveMode === "archive" ? await runArchive(deal.id) : await runRestore(deal.id)
    if (!result.success) return
    setArchiveMode(null)
  }

  async function handleDelete() {
    await runDelete(deal.id)
  }

  function handleFormChange(nextValues: DealFormValues) {
    setFormValues(nextValues)
    if (formError) {
      setFormError("")
    }

    if (Object.keys(fieldErrors).length === 0) {
      return
    }

    const nextAllErrors = getDealFormFieldErrors(nextValues)
    const unresolvedErrors = keepUnresolvedErrors(fieldErrors, nextAllErrors)
    setFieldErrors(unresolvedErrors)
  }

  return (
    <div className="w-full max-w-[1100px] px-9 py-7">
      <DealWorkspaceHeader
        deal={deal}
        onEdit={() => {
          setFormValues(dealDetailToFormValues(deal))
          setFormError("")
          setFieldErrors({})
          setShowEdit(true)
        }}
        onArchiveToggle={() => setArchiveMode(deal.status === "Active" ? "archive" : "restore")}
        onDelete={() => setShowDelete(true)}
      />

      <div className="mt-6">
        <DealWorkspaceTabs
          dealId={deal.id}
          activeTab={initialTab}
          taskCount={tasksTotal}
          deliverableCount={deliverablesTotal}
          renderTabContent={(tab) => {
            if (tab === "overview") {
              return <DealOverviewSection deal={deal} />
            }

            if (tab === "activity") {
              return <DealActivityTimelineSection dealId={deal.id} initialData={activityData} initialLoadError={activityError} />
            }

            if (tab === "tasks") {
              return (
                <DealTasksSection
                  dealId={deal.id}
                  dealStatus={deal.status}
                  initialData={tasksData}
                  initialLoadError={tasksError}
                  onSummaryTotalChange={setTasksTotal}
                />
              )
            }

            if (tab === "deliverables") {
              return (
                <DealDeliverablesSection
                  dealId={deal.id}
                  initialData={deliverablesData}
                  initialLoadError={deliverablesError}
                  onSummaryTotalChange={setDeliverablesTotal}
                />
              )
            }

            if (tab === "notes") {
              return <DealNotesSection dealId={deal.id} initialData={notesData} initialLoadError={notesError} />
            }

            if (tab === "files") {
              return <DealFilesSection dealId={deal.id} initialData={filesData} initialLoadError={filesError} />
            }

            return null
          }}
        />
      </div>

      <DealForm
        open={showEdit}
        title="Edit Deal"
        submitLabel="Save Changes"
        values={formValues}
        isSubmitting={isSubmitting}
        fieldErrors={fieldErrors}
        formError={formError}
        brands={brands}
        contacts={contacts}
        onChange={handleFormChange}
        onOpenChange={(open) => setShowEdit(open)}
        onSubmit={handleUpdate}
      />

      <DealArchiveDialog
        open={Boolean(archiveMode)}
        campaignName={deal.campaignName}
        isLoading={isMutating}
        mode={archiveMode ?? "archive"}
        onOpenChange={(open) => {
          if (!open) {
            setArchiveMode(null)
          }
        }}
        onConfirm={handleArchiveOrRestore}
      />

      <DealDeleteDialog
        open={showDelete}
        campaignName={deal.campaignName}
        isLoading={isMutating}
        onOpenChange={setShowDelete}
        onConfirm={handleDelete}
      />
    </div>
  )
}
