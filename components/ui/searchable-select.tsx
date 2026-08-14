"use client"

import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type * as SelectPrimitive from "@radix-ui/react-select"
import * as React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export interface SearchableSelectOption {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

interface SearchableSelectProps
  extends Omit<
    React.ComponentProps<typeof SelectPrimitive.Root>,
    "onValueChange"
  > {
  options: SearchableSelectOption[]
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  searchPlaceholder?: string
  noResultsMessage?: string
  className?: string
  triggerClassName?: string
  contentClassName?: string
  renderValue?: (option: SearchableSelectOption) => React.ReactNode
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  disabled = false,
  searchPlaceholder = "Search...",
  noResultsMessage = "No results found",
  className,
  triggerClassName,
  contentClassName,
  renderValue,
  ...props
}: SearchableSelectProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)

  const filteredOptions = React.useMemo(
    () =>
      options.filter((option) =>
        typeof option.label === "string"
          ? option.label.toLowerCase().includes(searchQuery.toLowerCase())
          : false
      ),
    [options, searchQuery]
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleValueChange = (newValue: string) => {
    onValueChange(newValue)
    setSearchQuery("")
    setIsOpen(false)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setSearchQuery("")
    }
  }

  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <Select
      value={value}
      onValueChange={handleValueChange}
      onOpenChange={handleOpenChange}
      disabled={disabled}
      open={isOpen}
      {...props}
    >
      <SelectTrigger
        className={cn(
          "w-full data-placeholder:text-muted-foreground",
          triggerClassName
        )}
        aria-autocomplete="list"
      >
        <SelectValue
          placeholder={
            selectedOption || renderValue ? null : (
              <span data-placeholder>{placeholder}</span>
            )
          }
        />
      </SelectTrigger>
      <SelectContent
        className={cn("max-h-[320px]", contentClassName)}
        position="popper"
      >
        <SelectGroup>
          <div className="relative px-2 py-1.5">
            <HugeiconsIcon
              icon={Search01Icon}
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              className="h-8 w-full rounded-md border border-input bg-background pr-3 pl-9 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={disabled}
            />
          </div>
          <SelectSeparator className="mx-2 my-1" />
          {filteredOptions.length === 0 ? (
            <SelectLabel className="px-2 py-1.5 text-muted-foreground">
              {noResultsMessage}
            </SelectLabel>
          ) : (
            filteredOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {renderValue && selectedOption?.value === option.value
                  ? renderValue(option)
                  : option.label}
              </SelectItem>
            ))
          )}
        </SelectGroup>
        {filteredOptions.length > 8 && (
          <>
            <SelectScrollUpButton />
            <SelectScrollDownButton />
          </>
        )}
      </SelectContent>
    </Select>
  )
}
