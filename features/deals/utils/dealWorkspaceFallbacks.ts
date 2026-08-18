import type { ActivityListData } from "@/features/activity"
import type { DeliverableListData } from "@/features/deliverables/types/deliverable"
import type { DealFileListData } from "@/features/files/types/dealFile"
import type { DealNoteListData } from "@/features/notes/types/dealNote"
import type { TaskListData } from "@/features/tasks/types/task"
import { PAGE_SIZE_DEFAULT } from "@/lib/utils/pagination"

function emptyPagination() {
  return {
    page: 1,
    pageSize: PAGE_SIZE_DEFAULT,
    total: 0,
    totalPages: 1,
  }
}

export function emptyDealActivityData(dealId: string): ActivityListData {
  return {
    items: [],
    pagination: emptyPagination(),
    filters: {
      dealId,
    },
  }
}

export function emptyDealTasksData(): TaskListData {
  return {
    items: [],
    pagination: emptyPagination(),
    filters: {
      search: "",
      archive: "active",
      dueDate: "all",
      sort: "order",
    },
    summary: {
      total: 0,
      completed: 0,
      upcoming: 0,
      overdue: 0,
      progress: 0,
    },
  }
}

export function emptyDealDeliverablesData(): DeliverableListData {
  return {
    items: [],
    pagination: emptyPagination(),
    filters: {
      search: "",
      archive: "active",
      sort: "order",
    },
    summary: {
      total: 0,
      draft: 0,
      submitted: 0,
      needsRevision: 0,
      approved: 0,
      published: 0,
    },
  }
}

export function emptyDealNotesData(): DealNoteListData {
  return {
    items: [],
    pagination: emptyPagination(),
    filters: {
      search: "",
      archive: "active",
    },
  }
}

export function emptyDealFilesData(): DealFileListData {
  return {
    items: [],
    pagination: emptyPagination(),
    filters: {
      search: "",
      archive: "active",
    },
  }
}
