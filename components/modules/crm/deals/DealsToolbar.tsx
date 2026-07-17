"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DEAL_PRIORITIES, DEAL_SORT_OPTIONS, DEAL_STAGES } from "@/enums/deal"
import { CrmSearchField } from "../shared"

type DealsToolbarProps = {
  total: number
  search: string
  view: "table" | "kanban"
  archive: "active" | "archived"
  stage?: string
  priority?: string
  brandId?: string
  sort: string
  brands: Array<{ id: string; name: string }>
  onSearchChange: (value: string) => void
  onViewChange: (value: "table" | "kanban") => void
  onArchiveChange: (value: "active" | "archived") => void
  onStageChange: (value?: string) => void
  onPriorityChange: (value?: string) => void
  onBrandChange: (value?: string) => void
  onSortChange: (value: string) => void
}

export function DealsToolbar({
  total,
  search,
  view,
  archive,
  stage,
  priority,
  brandId,
  sort,
  brands,
  onSearchChange,
  onViewChange,
  onArchiveChange,
  onStageChange,
  onPriorityChange,
  onBrandChange,
  onSortChange,
}: DealsToolbarProps) {
  return (
    <div className="mb-4 space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="font-mono text-[11px] text-muted-foreground">{total} total deals</div>
        <div className="flex flex-wrap items-center gap-2 max-sm:w-full">
          <Tabs value={archive} onValueChange={(next) => onArchiveChange(next as "active" | "archived")}>
            <TabsList className="h-9 rounded-[10px] border border-border bg-muted p-1">
              <TabsTrigger
                value="active"
                className="h-7 rounded-[8px] px-3 text-[11px] data-[state=active]:bg-[rgba(232,64,42,0.15)] data-[state=active]:text-[#E8402A]"
              >
                Active
              </TabsTrigger>
              <TabsTrigger
                value="archived"
                className="h-7 rounded-[8px] px-3 text-[11px] data-[state=active]:bg-[rgba(232,64,42,0.15)] data-[state=active]:text-[#E8402A]"
              >
                Archived
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Tabs value={view} onValueChange={(next) => onViewChange(next as "table" | "kanban")}>
            <TabsList className="h-9 rounded-[10px] border border-border bg-muted p-1">
              <TabsTrigger
                value="table"
                className="h-7 rounded-[8px] px-3 text-[11px] data-[state=active]:bg-[rgba(232,64,42,0.15)] data-[state=active]:text-[#E8402A]"
              >
                Table
              </TabsTrigger>
              <TabsTrigger
                value="kanban"
                className="h-7 rounded-[8px] px-3 text-[11px] data-[state=active]:bg-[rgba(232,64,42,0.15)] data-[state=active]:text-[#E8402A]"
              >
                Kanban
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:flex xl:flex-wrap xl:items-center">
        <CrmSearchField
          value={search}
          onChange={onSearchChange}
          placeholder="Search campaign, brand, contact..."
          ariaLabel="Search deals"
          className="w-full sm:col-span-2 lg:col-span-3 xl:w-[320px]"
        />

        <Select value={stage ?? "__all"} onValueChange={(value) => onStageChange(value === "__all" ? undefined : value)}>
          <SelectTrigger className="h-10 w-full border-border bg-card text-xs text-muted-foreground xl:w-[170px]">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">All stages</SelectItem>
            {DEAL_STAGES.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={priority ?? "__all"}
          onValueChange={(value) => onPriorityChange(value === "__all" ? undefined : value)}
        >
          <SelectTrigger className="h-10 w-full border-border bg-card text-xs text-muted-foreground xl:w-[150px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">All priorities</SelectItem>
            {DEAL_PRIORITIES.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={brandId ?? "__all"} onValueChange={(value) => onBrandChange(value === "__all" ? undefined : value)}>
          <SelectTrigger className="h-10 w-full border-border bg-card text-xs text-muted-foreground xl:w-[180px]">
            <SelectValue placeholder="Brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">All brands</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand.id} value={brand.id}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={onSortChange}>
          <SelectTrigger className="h-10 w-full border-border bg-card text-xs text-muted-foreground xl:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {DEAL_SORT_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option === "updatedAt" ? "Recently Updated" : option === "value" ? "Highest Value" : "Due Date"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
