"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Check,
  CircleNotch,
  CaretDown,
  Briefcase,
  User,
} from "@phosphor-icons/react/dist/ssr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ScriptType } from "./shared"
import { TYPE_CFG } from "./shared"

type SaveStatus = "saved" | "saving" | "unsaved"

type ScriptEditorShellProps = {
  scriptId: string
  children: React.ReactNode
}

export function ScriptEditorShell({ scriptId, children }: ScriptEditorShellProps) {
  const isNew = scriptId.startsWith("new-")

  const [title, setTitle] = useState(isNew ? "" : "Morning Routine Ad Read")
  const [type, setType] = useState<ScriptType>(isNew ? "personal" : "brand_deal")
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved")
  const [linkedBrand, setLinkedBrand] = useState<string | null>(isNew ? null : "GlowRepublic")

  useEffect(() => {
    if (saveStatus === "unsaved") {
      const timer = setTimeout(() => {
        setSaveStatus("saving")
        setTimeout(() => setSaveStatus("saved"), 800)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [saveStatus, title, type])

  function handleTitleChange(value: string) {
    setTitle(value)
    setSaveStatus("unsaved")
  }

  function handleTypeChange(newType: ScriptType) {
    setType(newType)
    setSaveStatus("unsaved")
    if (newType === "personal") {
      setLinkedBrand(null)
    }
  }

  const typeConfig = TYPE_CFG[type]

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Top Bar */}
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            asChild
            className="h-8 w-8 shrink-0"
          >
            <Link href="/dashboard/script" aria-label="Back to Scripts">
              <ArrowLeft size={16} />
            </Link>
          </Button>

          <div className="h-5 w-px bg-border" />

          {/* Type Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-8 gap-1.5 px-2.5 text-xs font-medium"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: typeConfig.color }}
                />
                {typeConfig.label}
                <CaretDown size={10} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-36">
              <DropdownMenuItem
                onClick={() => handleTypeChange("brand_deal")}
                className={type === "brand_deal" ? "bg-accent" : ""}
              >
                <Briefcase size={14} className="mr-2" />
                Brand Deal
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleTypeChange("personal")}
                className={type === "personal" ? "bg-accent" : ""}
              >
                <User size={14} className="mr-2" />
                Personal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Linked Brand (only for brand deals) */}
          {type === "brand_deal" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 gap-1.5 px-2.5 text-xs font-medium text-primary"
                >
                  {linkedBrand || "Link to Deal"}
                  <CaretDown size={10} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44">
                <DropdownMenuItem onClick={() => setLinkedBrand("GlowRepublic")}>
                  GlowRepublic
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLinkedBrand("PulseTech")}>
                  PulseTech
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLinkedBrand("FitLife")}>
                  FitLife
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Save Status */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {saveStatus === "saving" && (
            <>
              <CircleNotch size={12} className="animate-spin" />
              <span>Saving...</span>
            </>
          )}
          {saveStatus === "saved" && (
            <>
              <Check size={12} className="text-green-500" />
              <span>Saved</span>
            </>
          )}
          {saveStatus === "unsaved" && (
            <span className="text-amber-500">Unsaved changes</span>
          )}
        </div>
      </div>

      {/* Title Area */}
      <div className="shrink-0 border-b border-border bg-background px-4 py-4 md:px-6">
        <Input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Untitled Script"
          className="h-auto border-none bg-transparent p-0 text-2xl font-bold tracking-tight text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-0"
        />
      </div>

      {/* Editor Content */}
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </div>
  )
}
