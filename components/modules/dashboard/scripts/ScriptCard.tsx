"use client"

import Link from "next/link"
import { DotsThree, Copy, Trash, Link as LinkIcon } from "@phosphor-icons/react/dist/ssr"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Script, TYPE_CFG, formatRelativeDate, getReadingTime, truncateText } from "./shared"

type ScriptCardProps = {
  script: Script
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
  onLinkDeal?: (id: string) => void
}

export function ScriptCard({ script, onDuplicate, onDelete, onLinkDeal }: ScriptCardProps) {
  const typeConfig = TYPE_CFG[script.type]
  const readingTime = getReadingTime(script.content)
  const preview = truncateText(script.content.replace(/<[^>]*>/g, ""), 80)

  return (
    <Link
      href={`/dashboard/script/${script.id}`}
      className="group block rounded-xl border border-border bg-card p-4 shadow-xs transition-all duration-150 hover:border-primary/30 hover:shadow-sm"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: typeConfig.color }}
            aria-hidden="true"
          />
          <span className="text-[11px] font-medium text-muted-foreground">
            {typeConfig.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">{readingTime}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <DotsThree size={14} weight="bold" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={(e) => {
                e.preventDefault()
                onDuplicate(script.id)
              }}>
                <Copy size={14} className="mr-2" />
                Duplicate
              </DropdownMenuItem>
              {script.type === "personal" && onLinkDeal && (
                <DropdownMenuItem onClick={(e) => {
                  e.preventDefault()
                  onLinkDeal(script.id)
                }}>
                  <LinkIcon size={14} className="mr-2" />
                  Link to Deal
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault()
                  onDelete(script.id)
                }}
                className="text-destructive focus:text-destructive"
              >
                <Trash size={14} className="mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <h3 className="mt-3 text-sm font-semibold leading-snug text-foreground">
        {truncateText(script.title, 40)}
      </h3>

      {script.brandName && (
        <p className="mt-1 text-[12px] font-medium text-primary">
          {script.brandName}
        </p>
      )}

      <p className="mt-1 text-[11px] text-muted-foreground">
        {formatRelativeDate(script.updatedAt)}
      </p>

      {preview && (
        <p className="mt-3 line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">
          {preview}
        </p>
      )}
    </Link>
  )
}
