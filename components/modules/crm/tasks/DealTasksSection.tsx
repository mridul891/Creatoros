"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import { getTaskAction } from "@/app/action/taskActions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { TASK_DUE_DATE_FILTERS, TASK_PRIORITIES, TASK_SORT_OPTIONS, TASK_STATUSES } from "@/enums/task"
import { useDealTasks } from "@/hooks/useDealTasks"
import { useTaskMutations } from "@/hooks/useTaskMutations"
import { EMPTY_TASK_FORM, taskDetailToFormValues, taskToFormValues, type TaskFormValues } from "@/lib/crm/tasks/taskForm"
import { getTaskFormFieldErrors } from "@/lib/crm/tasks/taskValidation"
import type { TaskDetail, TaskField, TaskListData, TaskListItem } from "@/types/task"
import type { DealDetail } from "@/types/deal"
import { CrmConfirmDialog, CrmPagination } from "../shared"
import { TaskDetailPanel } from "./TaskDetailPanel"
import { TaskForm } from "./TaskForm"
import { TasksEmptyState } from "./TasksEmptyState"
import { TasksSkeleton } from "./TasksSkeleton"
import { TasksTable } from "./TasksTable"
import { TasksToolbar } from "./TasksToolbar"

type DealTasksSectionProps = {
  dealId: string
  dealStatus: DealDetail["status"]
  initialData: TaskListData
  initialLoadError?: string
  onSummaryTotalChange?: (total: number) => void
}

function keepUnresolvedErrors(currentErrors: Partial<Record<TaskField, string>>, nextErrors: Partial<Record<TaskField, string>>) {
  const unresolved: Partial<Record<TaskField, string>> = {}
  for (const field of Object.keys(currentErrors) as TaskField[]) {
    const message = nextErrors[field]
    if (message) {
      unresolved[field] = message
    }
  }
  return unresolved
}

export function DealTasksSection({ dealId, dealStatus, initialData, initialLoadError, onSummaryTotalChange }: DealTasksSectionProps) {
  const {
    tasks,
    pagination,
    summary,
    search,
    status,
    priority,
    archive,
    dueDate,
    sort,
    isLoading,
    loadError,
    setTasks,
    setSearch,
    setStatus,
    setPriority,
    setArchive,
    setDueDate,
    setSort,
    setPage,
    refetch,
  } = useDealTasks({ dealId, initialData })

  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<TaskListItem | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [detailTaskId, setDetailTaskId] = useState("")
  const [detailTask, setDetailTask] = useState<TaskDetail | null>(null)
  const [archiving, setArchiving] = useState<TaskListItem | null>(null)
  const [restoring, setRestoring] = useState<TaskListItem | null>(null)
  const [deleting, setDeleting] = useState<TaskListItem | null>(null)
  const [isFetchingDetail, setIsFetchingDetail] = useState(false)
  const [detailLoadError, setDetailLoadError] = useState("")

  const [createFormValues, setCreateFormValues] = useState<TaskFormValues>({ ...EMPTY_TASK_FORM, dealId })
  const [createFieldErrors, setCreateFieldErrors] = useState<Partial<Record<TaskField, string>>>({})
  const [createFormError, setCreateFormError] = useState("")
  const [editFormValues, setEditFormValues] = useState<TaskFormValues>({ ...EMPTY_TASK_FORM, dealId })
  const [editFieldErrors, setEditFieldErrors] = useState<Partial<Record<TaskField, string>>>({})
  const [editFormError, setEditFormError] = useState("")

  const { isSubmitting, isMutating, updatingTaskId, submitCreate, submitUpdate, runStatusChange, runArchive, runRestore, runDelete } =
    useTaskMutations({
      onRefresh: () => {
        void refetch(pagination.page)
      },
    })

  const displayError = initialLoadError ?? loadError
  const hasFilters = Boolean(search.trim()) || status !== "all" || priority !== "all" || archive === "archived" || dueDate !== "all"
  const isReadOnly = dealStatus === "Archived"

  const summaryItems = useMemo(
    () => [
      { label: "Total", value: summary.total },
      { label: "Completed", value: summary.completed },
      { label: "Upcoming", value: summary.upcoming },
      { label: "Overdue", value: summary.overdue },
      { label: "Progress", value: `${summary.progress}%` },
    ],
    [summary],
  )

  useEffect(() => {
    onSummaryTotalChange?.(summary.total)
  }, [onSummaryTotalChange, summary.total])

  function resetCreateForm() {
    setCreateFormValues({ ...EMPTY_TASK_FORM, dealId })
    setCreateFieldErrors({})
    setCreateFormError("")
  }

  function resetEditForm() {
    setEditFormValues({ ...EMPTY_TASK_FORM, dealId })
    setEditFieldErrors({})
    setEditFormError("")
  }

  function handleCreateFormChange(nextValues: TaskFormValues) {
    setCreateFormValues(nextValues)
    if (createFormError) setCreateFormError("")
    if (Object.keys(createFieldErrors).length === 0) return
    const nextAllErrors = getTaskFormFieldErrors(nextValues)
    setCreateFieldErrors(keepUnresolvedErrors(createFieldErrors, nextAllErrors))
  }

  function handleEditFormChange(nextValues: TaskFormValues) {
    setEditFormValues(nextValues)
    if (editFormError) setEditFormError("")
    if (Object.keys(editFieldErrors).length === 0) return
    const nextAllErrors = getTaskFormFieldErrors(nextValues)
    setEditFieldErrors(keepUnresolvedErrors(editFieldErrors, nextAllErrors))
  }

  async function handleCreateSubmit() {
    setCreateFormError("")
    setCreateFieldErrors({})
    const result = await submitCreate(createFormValues)
    if (!result.success) {
      setCreateFormError(result.message ?? "Could not create task.")
      setCreateFieldErrors(result.fieldErrors ?? {})
      return
    }
    toast.success(result.message ?? "Task created.")
    setShowCreate(false)
    resetCreateForm()
    await refetch(1)
  }

  async function handleEditSubmit() {
    if (!editing) return
    setEditFormError("")
    setEditFieldErrors({})
    const result = await submitUpdate(editing.id, editFormValues)
    if (!result.success) {
      setEditFormError(result.message ?? "Could not update task.")
      setEditFieldErrors(result.fieldErrors ?? {})
      return
    }
    toast.success(result.message ?? "Task updated.")
    setEditing(null)
    resetEditForm()
    await refetch(pagination.page)
  }

  async function openTaskDetail(task: TaskListItem) {
    setShowDetail(true)
    setDetailTaskId(task.id)
    setDetailTask(null)
    setDetailLoadError("")
    setIsFetchingDetail(true)
    const result = await getTaskAction(task.id)
    setIsFetchingDetail(false)
    if (!result.success) {
      setDetailLoadError(result.message ?? "Could not load task details.")
      return
    }
    setDetailTask(result.data)
  }

  async function openTaskEdit(task: TaskListItem) {
    if (isReadOnly) {
      return
    }
    setEditing(task)
    setIsFetchingDetail(true)
    const result = await getTaskAction(task.id)
    setIsFetchingDetail(false)
    if (!result.success) {
      setEditFormValues(taskToFormValues(task))
      toast.error(result.message ?? "Could not load full task details.")
      return
    }
    setEditFormValues(taskDetailToFormValues(result.data))
    setEditFieldErrors({})
    setEditFormError("")
  }

  async function handleStatusChange(taskId: string, nextStatus: TaskListItem["status"]) {
    if (isReadOnly) {
      return
    }

    const currentTask = tasks.find((task) => task.id === taskId)
    if (!currentTask || currentTask.status === nextStatus) {
      return
    }

    setTasks((currentItems) =>
      currentItems.map((task) => (task.id === taskId ? { ...task, status: nextStatus, updatedAt: new Date() } : task)),
    )

    const result = await runStatusChange(taskId, nextStatus)
    if (!result.success) {
      setTasks((currentItems) =>
        currentItems.map((task) => (task.id === taskId ? { ...task, status: currentTask.status } : task)),
      )
    }
  }

  async function handleArchiveConfirm() {
    if (!archiving || isReadOnly) return
    const result = await runArchive(archiving.id)
    if (result.success) {
      setArchiving(null)
    }
  }

  async function handleRestoreConfirm() {
    if (!restoring || isReadOnly) return
    const result = await runRestore(restoring.id)
    if (result.success) {
      setRestoring(null)
    }
  }

  async function handleDeleteConfirm() {
    if (!deleting || isReadOnly) return
    const result = await runDelete(deleting.id)
    if (result.success) {
      setDeleting(null)
    }
  }

  return (
    <>
      <div className="rounded-[20px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] p-6">
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {summaryItems.map((item) => (
            <Card key={item.label} className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-3 py-3">
              <p className="text-[10px] uppercase tracking-wide text-[rgba(255,255,255,0.45)]">{item.label}</p>
              <p className="mt-1 text-[18px] font-bold text-white">{item.value}</p>
            </Card>
          ))}
        </div>

        <TasksToolbar
          total={pagination.total}
          search={search}
          status={status}
          priority={priority}
          archive={archive}
          dueDate={dueDate}
          sort={sort}
          onSearchChange={setSearch}
          onStatusChange={(value) => setStatus(value === "all" ? "all" : (value as (typeof TASK_STATUSES)[number]))}
          onPriorityChange={(value) => setPriority(value === "all" ? "all" : (value as (typeof TASK_PRIORITIES)[number]))}
          onArchiveChange={setArchive}
          onDueDateChange={(value) => setDueDate(value as (typeof TASK_DUE_DATE_FILTERS)[number])}
          onSortChange={(value) => setSort(value as (typeof TASK_SORT_OPTIONS)[number])}
          onCreate={() => {
            if (isReadOnly) {
              return
            }
            resetCreateForm()
            setShowCreate(true)
          }}
          createDisabled={isReadOnly}
        />

        {isReadOnly ? (
          <Alert className="mt-4 border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.03)]">
            <AlertDescription className="text-[12px] text-[rgba(255,255,255,0.7)]">
              This deal is archived. Tasks are in read-only mode.
            </AlertDescription>
          </Alert>
        ) : null}

        {displayError ? (
          <Alert variant="destructive" className="mt-4 border-[rgba(232,64,42,0.35)] bg-[rgba(232,64,42,0.1)]">
            <AlertDescription className="text-[12px] text-[#E8402A]">{displayError}</AlertDescription>
          </Alert>
        ) : null}

        <div className="mt-4">
          {isLoading ? (
            <TasksSkeleton />
          ) : tasks.length === 0 ? (
            <TasksEmptyState hasFilters={hasFilters} isReadOnly={isReadOnly} onCreate={() => setShowCreate(true)} />
          ) : (
            <>
              <TasksTable
                items={tasks}
                updatingTaskId={updatingTaskId}
                isReadOnly={isReadOnly}
                onStatusChange={handleStatusChange}
                onView={openTaskDetail}
                onEdit={openTaskEdit}
                onArchive={setArchiving}
                onRestore={setRestoring}
                onDelete={setDeleting}
              />
              {pagination.totalPages > 1 ? (
                <CrmPagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
              ) : null}
            </>
          )}
        </div>
      </div>

      <TaskForm
        open={showCreate}
        title="Create Task"
        submitLabel="Create Task"
        values={createFormValues}
        isSubmitting={isSubmitting}
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
        statusOptions={["Todo"]}
        statusDisabled
      />

      <TaskForm
        open={Boolean(editing)}
        title="Edit Task"
        submitLabel="FloppyDisk Changes"
        values={editFormValues}
        isSubmitting={isSubmitting || isFetchingDetail}
        fieldErrors={editFieldErrors}
        formError={editFormError}
        onChange={handleEditFormChange}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null)
            resetEditForm()
          }
        }}
        onSubmit={handleEditSubmit}
        statusOptions={TASK_STATUSES}
        statusDisabled={isReadOnly}
      />

      <TaskDetailPanel
        open={showDetail}
        task={detailTaskId && detailTask?.id === detailTaskId ? detailTask : null}
        isLoading={isFetchingDetail}
        loadError={detailLoadError}
        onOpenChange={(open) => {
          setShowDetail(open)
          if (!open) {
            setDetailTaskId("")
            setDetailTask(null)
            setDetailLoadError("")
          }
        }}
      />

      <CrmConfirmDialog
        open={Boolean(archiving)}
        title="Archive Task"
        description={`Archive "${archiving?.title ?? ""}"? You can restore it later.`}
        confirmLabel="Archive Task"
        isLoading={isMutating}
        onOpenChange={(open) => {
          if (!open) setArchiving(null)
        }}
        onConfirm={handleArchiveConfirm}
      />

      <CrmConfirmDialog
        open={Boolean(restoring)}
        title="Restore Task"
        description={`Restore "${restoring?.title ?? ""}" to active tasks?`}
        confirmLabel="Restore Task"
        isLoading={isMutating}
        onOpenChange={(open) => {
          if (!open) setRestoring(null)
        }}
        onConfirm={handleRestoreConfirm}
      />

      <CrmConfirmDialog
        open={Boolean(deleting)}
        title="Delete Task"
        description={`Delete "${deleting?.title ?? ""}" permanently? This action cannot be undone.`}
        confirmLabel="Delete Task"
        isLoading={isMutating}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}
