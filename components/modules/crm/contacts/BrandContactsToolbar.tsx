"use client"

import { Plus } from "@phosphor-icons/react/dist/ssr"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ContactFilter } from "@/enums/contact"
import { CrmSearchField } from "../shared"

type BrandContactsToolbarProps = {
  total: number
  search: string
  status: ContactFilter
  onSearchChange: (value: string) => void
  onStatusChange: (status: ContactFilter) => void
  onCreate: () => void
}

export function BrandContactsToolbar({
  total,
  search,
  status,
  onSearchChange,
  onStatusChange,
  onCreate,
}: BrandContactsToolbarProps) {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">Contacts</h2>
          <p className="mt-1 text-[12px] text-muted-foreground">
            {total} {total === 1 ? "contact" : "contacts"} in this brand
          </p>
        </div>
        <Button
          type="button"
          onClick={onCreate}
          className="h-9 cursor-pointer gap-2 bg-primary px-4 text-[12px] font-semibold text-primary-foreground hover:bg-primary"
        >
          <Plus size={14} />
          Add Contact
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <CrmSearchField
          value={search}
          onChange={onSearchChange}
          placeholder="Search name, email, position..."
          className="w-full max-w-[320px]"
        />

        <Tabs value={status} onValueChange={(value) => onStatusChange(value as ContactFilter)}>
          <TabsList className="h-10 border border-border bg-muted p-1">
            <TabsTrigger
              value="active"
              className="h-8 cursor-pointer px-3 text-xs text-muted-foreground data-active:bg-muted data-active:text-foreground"
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              value="archived"
              className="h-8 cursor-pointer px-3 text-xs text-muted-foreground data-active:bg-muted data-active:text-foreground"
            >
              Archived
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </>
  )
}
