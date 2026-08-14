"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { DealActivityTimelineSection } from "@/features/activity/components/DealActivityTimelineSection"
import type { ActivityListData } from "@/features/activity/types/activity"
import { DealOverviewSection } from "@/features/deals/components/workspace/DealOverviewSection"
import { DealWorkspaceHeader } from "@/features/deals/components/workspace/DealWorkspaceHeader"
import { DealWorkspaceTabs } from "@/features/deals/components/workspace/DealWorkspaceTabs"
import { useDealMutations } from "@/features/deals/hooks/useDealMutations"
import { getDealFormFieldErrors } from "@/features/deals/schemas/dealValidation"
import type { DealDetail, DealField } from "@/features/deals/types/deal"
import {
  type DealFormValues,
  dealDetailToFormValues,
} from "@/features/deals/utils/dealForm"
import type { DealWorkspaceTab } from "@/features/deals/utils/dealWorkspaceTabs"
import { DealDeliverablesSection } from "@/features/deliverables/components/DealDeliverablesSection"
import type { DeliverableListData } from "@/features/deliverables/types/deliverable"
import { DealFilesSection } from "@/features/files/components/DealFilesSection"
import type { DealFileListData } from "@/features/files/types/dealFile"
import { DealNotesSection } from "@/features/notes/components/DealNotesSection"
import type { DealNoteListData } from "@/features/notes/types/dealNote"
import { DealTasksSection } from "@/features/tasks/components/DealTasksSection"
import type { TaskListData } from "@/features/tasks/types/task"
import { keepUnresolvedErrors } from "@/lib/utils/form-errors"
import { DealArchiveDialog } from "./DealArchiveDialog"
import { DealDeleteDialog } from "./DealDeleteDialog"
import { DealForm } from "./DealForm"

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
  const [deliverablesTotal, setDeliverablesTotal] = useState(
    deliverablesData.summary.total
  )
  const [showEdit, setShowEdit] = useState(false)
  const [archiveMode, setArchiveMode] = useState<"archive" | "restore" | null>(
    null
  )
  const [showDelete, setShowDelete] = useState(false)
  const [formValues, setFormValues] = useState<DealFormValues>(() =>
    dealDetailToFormValues(deal)
  )
  const [formError, setFormError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<DealField, string>>
  >({})

  const {
    isSubmitting,
    isMutating,
    submitUpdate,
    runArchive,
    runRestore,
    runDelete,
  } = useDealMutations({
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
    const result =
      archiveMode === "archive"
        ? await runArchive(deal.id)
        : await runRestore(deal.id)
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
        onArchiveToggle={() =>
          setArchiveMode(deal.status === "Active" ? "archive" : "restore")
        }
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
              return (
                <DealActivityTimelineSection
                  dealId={deal.id}
                  initialData={activityData}
                  initialLoadError={activityError}
                />
              )
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
              return (
                <DealNotesSection
                  dealId={deal.id}
                  initialData={notesData}
                  initialLoadError={notesError}
                />
              )
            }

            if (tab === "files") {
              return (
                <DealFilesSection
                  dealId={deal.id}
                  initialData={filesData}
                  initialLoadError={filesError}
                />
              )
            }

            return null
          }}
        />
      </div>

      <DealForm
        open={showEdit}
        title="Edit Deal"
        submitLabel="FloppyDisk Changes"
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
