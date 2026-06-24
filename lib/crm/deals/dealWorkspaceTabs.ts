export const DEAL_WORKSPACE_TABS = [
  "overview",
  "tasks",
  "deliverables",
  "notes",
  "files",
  "activity",
  "invoices",
  "payments",
] as const

export type DealWorkspaceTab = (typeof DEAL_WORKSPACE_TABS)[number]

export type DealWorkspaceTabDefinition = {
  id: DealWorkspaceTab
  label: string
  supportsCount?: boolean
  isPlaceholder?: boolean
}

export const DEAL_WORKSPACE_TAB_DEFINITIONS: DealWorkspaceTabDefinition[] = [
  { id: "overview", label: "Overview" },
  { id: "tasks", label: "Tasks", supportsCount: true },
  { id: "deliverables", label: "Deliverables", supportsCount: true },
  { id: "notes", label: "Notes" },
  { id: "files", label: "Files" },
  { id: "activity", label: "Activity" },
  { id: "invoices", label: "Invoices", isPlaceholder: true },
  { id: "payments", label: "Payments", isPlaceholder: true },
]

export function isDealWorkspaceTab(value: string | undefined): value is DealWorkspaceTab {
  if (!value) {
    return false
  }

  return (DEAL_WORKSPACE_TABS as readonly string[]).includes(value)
}
