"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"

import { cn } from "@/lib/utils"
import { MagnifyingGlassIcon as SearchIcon } from "@phosphor-icons/react"

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

export interface SearchableSelectOption {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

interface SearchableSelectProps
  extends Omit<React.ComponentProps<typeof SelectPrimitive.Root>, "onValueChange"> {
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
        className={cn("w-full data-placeholder:text-muted-foreground", triggerClassName)}
        aria-autocomplete="list"
      >
        <SelectValue
          placeholder={
            selectedOption || renderValue
              ? null
              : <span data-placeholder>{placeholder}</span>
          }
        />
      </SelectTrigger>
      <SelectContent
        className={cn("max-h-[320px]", contentClassName)}
        position="popper"
      >
        <SelectGroup>
          <div className="relative px-2 py-1.5">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              className="w-full h-8 pl-9 pr-3 rounded-md border border-input bg-background text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={disabled}
              autoFocus
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