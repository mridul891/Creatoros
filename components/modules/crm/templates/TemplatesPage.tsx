"use client"

import { Pencil, Plus, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"

import {
  createCampaignTemplateAction,
  deleteCampaignTemplateAction,
  updateCampaignTemplateAction,
} from "@/app/action/templateActions"
import { Button } from "@/components/ui/button"
import { EMPTY_TEMPLATE_FORM, type CampaignTemplateFormValues, buildTemplateInput, templateToFormValues } from "@/lib/crm/templates/templateForm"
import type { CampaignTemplateField, CampaignTemplateItem } from "@/types/campaignTemplate"
import { TemplateForm } from "./TemplateForm"
import { CrmConfirmDialog, CrmEmptyStateClient, CrmPageHeaderClient } from "../shared"

type TemplatesPageProps = {
  initialTemplates: CampaignTemplateItem[]
}

export function TemplatesPage({ initialTemplates }: TemplatesPageProps) {
  const [templates, setTemplates] = useState(initialTemplates)
  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<CampaignTemplateItem | null>(null)
  const [deleting, setDeleting] = useState<CampaignTemplateItem | null>(null)
  const [createFormValues, setCreateFormValues] = useState<CampaignTemplateFormValues>(EMPTY_TEMPLATE_FORM)
  const [createFieldErrors, setCreateFieldErrors] = useState<Partial<Record<CampaignTemplateField, string>>>({})
  const [createFormError, setCreateFormError] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [editFormValues, setEditFormValues] = useState<CampaignTemplateFormValues>(EMPTY_TEMPLATE_FORM)
  const [editFieldErrors, setEditFieldErrors] = useState<Partial<Record<CampaignTemplateField, string>>>({})
  const [editFormError, setEditFormError] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  function toTimestamp(value: Date | string) {
    return new Date(value).getTime()
  }

  const sortedTemplates = useMemo(
    () => [...templates].sort((a, b) => Number(b.isSystem) - Number(a.isSystem) || toTimestamp(b.updatedAt) - toTimestamp(a.updatedAt)),
    [templates]
  )

  function resetCreateForm() {
    setCreateFormValues(EMPTY_TEMPLATE_FORM)
    setCreateFieldErrors({})
    setCreateFormError("")
  }

  function resetEditForm() {
    setEditFormValues(EMPTY_TEMPLATE_FORM)
    setEditFieldErrors({})
    setEditFormError("")
  }

  function handleCreateFormChange(nextValues: CampaignTemplateFormValues) {
    setCreateFormValues(nextValues)
    if (createFormError) {
      setCreateFormError("")
    }
    if (Object.keys(createFieldErrors).length > 0) {
      setCreateFieldErrors({})
    }
  }

  function handleEditFormChange(nextValues: CampaignTemplateFormValues) {
    setEditFormValues(nextValues)
    if (editFormError) {
      setEditFormError("")
    }
    if (Object.keys(editFieldErrors).length > 0) {
      setEditFieldErrors({})
    }
  }

  function handleCreateOpen() {
    resetCreateForm()
    setEditing(null)
    setShowCreate(true)
  }

  function handleEditOpen(template: CampaignTemplateItem) {
    setShowCreate(false)
    resetCreateForm()
    resetEditForm()
    setEditing(template)
    setEditFormValues(templateToFormValues(template))
  }

  async function handleCreateSubmit() {
    setIsCreating(true)
    setCreateFieldErrors({})
    setCreateFormError("")
    const result = await createCampaignTemplateAction(buildTemplateInput(createFormValues))
    setIsCreating(false)

    if (!result.success) {
      setCreateFieldErrors(result.fieldErrors ?? {})
      setCreateFormError(result.message)
      return
    }

    setTemplates((current) => [result.data, ...current.filter((item) => item.id !== result.data.id)])
    toast.success(result.message ?? "Template created.")
    setShowCreate(false)
    resetCreateForm()
  }

  async function handleUpdateSubmit() {
    if (!editing) {
      return
    }

    setIsUpdating(true)
    setEditFieldErrors({})
    setEditFormError("")
    const result = await updateCampaignTemplateAction(editing.id, buildTemplateInput(editFormValues))
    setIsUpdating(false)

    if (!result.success) {
      setEditFieldErrors(result.fieldErrors ?? {})
      setEditFormError(result.message)
      return
    }

    setTemplates((current) => current.map((item) => (item.id === result.data.id ? result.data : item)))
    toast.success(result.message ?? "Template updated.")
    setEditing(null)
    resetEditForm()
  }

  async function handleDelete() {
    if (!deleting) {
      return
    }

    setIsDeleting(true)
    const result = await deleteCampaignTemplateAction(deleting.id)
    setIsDeleting(false)

    if (!result.success || !result.data) {
      toast.error(result.message ?? "Could not delete template.")
      return
    }

    setTemplates((current) => current.filter((item) => item.id !== result.data?.id))
    toast.success(result.message ?? "Template deleted.")
    setDeleting(null)
  }

  return (
    <div className="w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-9 lg:py-7">
      <CrmPageHeaderClient
        title="Campaign Templates"
        description="Create reusable checklists and deliverables for new deals."
        actionLabel="New Template"
        actionIcon={<Plus size={15} />}
        onAction={handleCreateOpen}
      />

      {sortedTemplates.length === 0 ? (
        <CrmEmptyStateClient
          title="No templates found"
          description="Create your first template to prefill tasks and deliverables when opening new deals."
          actionLabel="Create Template"
          onAction={handleCreateOpen}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sortedTemplates.map((template) => (
            <article
              key={template.id}
              className="rounded-[14px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-4 sm:p-5"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h2 className="wrap-break-word text-[16px] font-semibold text-white">{template.name}</h2>
                  {template.description ? (
                    <p className="mt-1 wrap-break-word text-[12px] text-[rgba(255,255,255,0.55)]">{template.description}</p>
                  ) : (
                    <p className="mt-1 text-[12px] text-[rgba(255,255,255,0.45)]">No description</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {template.isSystem ? (
                    <span className="rounded-full border border-[rgba(255,255,255,0.18)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.04em] text-[rgba(255,255,255,0.7)]">
                      System
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="mb-4 flex flex-wrap items-center gap-2 text-[11px] text-[rgba(255,255,255,0.65)]">
                <span className="rounded-full border border-[rgba(255,255,255,0.12)] px-2 py-1">{template.tasks.length} tasks</span>
                <span className="rounded-full border border-[rgba(255,255,255,0.12)] px-2 py-1">
                  {template.deliverables.length} deliverables
                </span>
              </div>

              <div className="max-h-[124px] space-y-1 overflow-auto pr-1 text-[12px] text-[rgba(255,255,255,0.7)]">
                {template.tasks.map((task) => (
                  <p key={task.id} className="wrap-break-word">
                    • {task.title} ({task.priority}, +{task.dueOffsetDays}d)
                  </p>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={template.isSystem}
                  title={template.isSystem ? "System templates cannot be edited." : "Edit template"}
                  onClick={() => handleEditOpen(template)}
                  className="border-[rgba(255,255,255,0.14)] bg-transparent"
                >
                  <Pencil className="size-3.5" />
                  Edit
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={template.isSystem}
                  title={template.isSystem ? "System templates cannot be deleted." : "Delete template"}
                  onClick={() => setDeleting(template)}
                  className="border-[rgba(255,255,255,0.14)] bg-transparent text-red-300 hover:text-red-200"
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </Button>
              </div>
              {template.isSystem ? (
                <p className="mt-2 text-[11px] text-[rgba(255,255,255,0.5)]">
                  System template is read-only. Duplicate in spirit by creating a custom template.
                </p>
              ) : null}
            </article>
          ))}
        </div>
      )}

      <TemplateForm
        open={showCreate}
        title="Create Template"
        submitLabel="Create Template"
        values={createFormValues}
        isSubmitting={isCreating}
        fieldErrors={createFieldErrors}
        formError={createFormError}
        onChange={handleCreateFormChange}
        onOpenChange={(open) => {
          setShowCreate(open)
          if (!open) {
            resetCreateForm()
          }
        }}
        onSubmit={handleCreateSubmit}
      />

      <TemplateForm
        open={Boolean(editing)}
        title="Edit Template"
        submitLabel="Save Changes"
        values={editFormValues}
        isSubmitting={isUpdating}
        fieldErrors={editFieldErrors}
        formError={editFormError}
        onChange={handleEditFormChange}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null)
            resetEditForm()
          }
        }}
        onSubmit={handleUpdateSubmit}
      />

      <CrmConfirmDialog
        open={Boolean(deleting)}
        title="Delete template?"
        description={
          deleting
            ? `This will permanently delete "${deleting.name}". Existing deals are not changed.`
            : "This will permanently delete this template."
        }
        confirmLabel={isDeleting ? "Deleting..." : "Delete"}
        onOpenChange={(open) => {
          if (!open) {
            setDeleting(null)
          }
        }}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
