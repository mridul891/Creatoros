"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Plus,
  NotePencil,
  Briefcase,
  User,
  Files,
  MagnifyingGlass,
  SquaresFour,
  List,
  CaretDown,
} from "@phosphor-icons/react/dist/ssr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScriptCard } from "./ScriptCard"
import { ScriptEmptyState } from "./ScriptEmptyState"
import type { Script, ScriptType } from "./shared"
import { TYPE_CFG } from "./shared"

type SortOption = "updated" | "created" | "alphabetical"
type ViewMode = "grid" | "list"
type FilterType = "all" | ScriptType

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "updated", label: "Last Modified" },
  { value: "created", label: "Created" },
  { value: "alphabetical", label: "Alphabetical" },
]

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: "all", label: "All Scripts" },
  { value: "brand_deal", label: "Brand Deal" },
  { value: "personal", label: "Personal" },
]

const SEED_SCRIPTS: Script[] = [
  {
    id: "1",
    title: "Morning Routine Ad Read",
    type: "brand_deal",
    brandId: "b1",
    brandName: "GlowRepublic",
    dealId: "d1",
    content: "Opening hook for the morning routine segment. Hey everyone! So I've been using this amazing skincare product for the past month and I wanted to share my honest thoughts with you all...",
    createdAt: new Date(2026, 5, 15, 10, 30),
    updatedAt: new Date(2026, 6, 20, 14, 34),
  },
  {
    id: "2",
    title: "Seoul Travel Vlog Script",
    type: "personal",
    content: "Day 1 in Seoul! Starting the morning at a traditional hanok cafe. The architecture here is absolutely stunning. We'll explore Bukchon Hanok Village and then head to Gwangjang Market for some street food...",
    createdAt: new Date(2026, 5, 10, 9, 0),
    updatedAt: new Date(2026, 6, 19, 11, 22),
  },
  {
    id: "3",
    title: "Tech Review - PulseTech Integration",
    type: "brand_deal",
    brandId: "b2",
    brandName: "PulseTech",
    dealId: "d2",
    content: "Intro sequence with product showcase. Today we're taking a deep dive into the new PulseTech smart home system. I've been testing this out for three weeks now and here's everything you need to know...",
    createdAt: new Date(2026, 5, 18, 14, 0),
    updatedAt: new Date(2026, 6, 18, 16, 45),
  },
  {
    id: "4",
    title: "5AM Morning Challenge",
    type: "personal",
    content: "Week-long challenge vlog structure. What happens when you wake up at 5AM for an entire week? I'm going to find out. Day 1: Alarm goes off... and I immediately regret this decision...",
    createdAt: new Date(2026, 5, 20, 8, 0),
    updatedAt: new Date(2026, 6, 17, 9, 15),
  },
  {
    id: "5",
    title: "Summer Skincare Routine",
    type: "brand_deal",
    brandId: "b1",
    brandName: "GlowRepublic",
    dealId: "d3",
    content: "Talking points for summer skincare collaboration. Summer is here and that means it's time to switch up our skincare routine! I've partnered with GlowRepublic to show you my updated summer essentials...",
    createdAt: new Date(2026, 6, 1, 12, 0),
    updatedAt: new Date(2026, 6, 15, 17, 30),
  },
  {
    id: "6",
    title: "Desk Setup Tour 2026",
    type: "personal",
    content: "Full walkthrough of the updated workspace. You've been asking for this for months - the complete 2026 desk setup tour! Let me show you every single thing on and around my desk...",
    createdAt: new Date(2026, 6, 5, 15, 0),
    updatedAt: new Date(2026, 6, 12, 10, 0),
  },
]

export function ScriptsPage() {
  const router = useRouter()
  const [scripts, setScripts] = useState<Script[]>(SEED_SCRIPTS)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<FilterType>("all")
  const [sortBy, setSortBy] = useState<SortOption>("updated")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  const filteredScripts = useMemo(() => {
    let result = [...scripts]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.content.toLowerCase().includes(q) ||
          s.brandName?.toLowerCase().includes(q)
      )
    }

    if (typeFilter !== "all") {
      result = result.filter((s) => s.type === typeFilter)
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "updated":
          return b.updatedAt.getTime() - a.updatedAt.getTime()
        case "created":
          return b.createdAt.getTime() - a.createdAt.getTime()
        case "alphabetical":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    return result
  }, [scripts, search, typeFilter, sortBy])

  const stats = useMemo(() => {
    const total = scripts.length
    const brandDeal = scripts.filter((s) => s.type === "brand_deal").length
    const personal = scripts.filter((s) => s.type === "personal").length
    return { total, brandDeal, personal }
  }, [scripts])

  const isSearchMode = search.trim().length > 0 || typeFilter !== "all"

  function handleCreate() {
    const newId = `new-${Date.now()}`
    router.push(`/dashboard/script/${newId}`)
  }

  function handleDuplicate(id: string) {
    const original = scripts.find((s) => s.id === id)
    if (!original) return
    const duplicate: Script = {
      ...original,
      id: `dup-${Date.now()}`,
      title: `${original.title} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setScripts((prev) => [duplicate, ...prev])
  }

  function handleDelete(id: string) {
    setScripts((prev) => prev.filter((s) => s.id !== id))
  }

  const statItems = [
    { label: "Total", count: stats.total, icon: Files, color: "var(--foreground)" },
    { label: "Brand Deal", count: stats.brandDeal, icon: Briefcase, color: TYPE_CFG.brand_deal.color },
    { label: "Personal", count: stats.personal, icon: User, color: TYPE_CFG.personal.color },
  ]

  const currentSort = SORT_OPTIONS.find((o) => o.value === sortBy)
  const currentFilter = FILTER_OPTIONS.find((o) => o.value === typeFilter)

  return (
    <div className="w-full max-w-[1280px] px-4 py-6 md:px-9 md:py-7">
      {/* Header */}
      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-[-0.04em] text-foreground">Scripts</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Write and manage scripts for your brand deals and content
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="h-10 cursor-pointer gap-2 bg-primary px-4 text-[13px] font-semibold text-primary-foreground hover:bg-primary"
        >
          <Plus size={15} weight="bold" />
          New Script
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6 flex flex-wrap gap-3">
        {statItems.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 shadow-xs"
          >
            <stat.icon size={14} color={stat.color} weight="bold" />
            <span className="text-sm font-bold tracking-tight text-foreground">{stat.count}</span>
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-[280px]">
          <MagnifyingGlass
            size={13}
            color="var(--muted-foreground)"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scripts..."
            className="h-10 border-border bg-card pl-[34px] text-xs text-muted-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 gap-1.5 px-3 text-xs font-medium">
                {currentFilter?.label}
                <CaretDown size={12} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              {FILTER_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setTypeFilter(option.value)}
                  className={typeFilter === option.value ? "bg-accent" : ""}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 gap-1.5 px-3 text-xs font-medium">
                {currentSort?.label}
                <CaretDown size={12} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={sortBy === option.value ? "bg-accent" : ""}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Toggle */}
          <div className="flex rounded-lg bg-muted p-[3px]">
            <button
              onClick={() => setViewMode("grid")}
              className={`cursor-pointer rounded-md p-1.5 transition-all duration-150 ${
                viewMode === "grid"
                  ? "bg-card text-foreground shadow-sm"
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              }`}
              aria-label="Grid view"
            >
              <SquaresFour size={14} weight={viewMode === "grid" ? "fill" : "regular"} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`cursor-pointer rounded-md p-1.5 transition-all duration-150 ${
                viewMode === "list"
                  ? "bg-card text-foreground shadow-sm"
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              }`}
              aria-label="List view"
            >
              <List size={14} weight={viewMode === "list" ? "fill" : "regular"} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredScripts.length === 0 ? (
        <ScriptEmptyState isSearch={isSearchMode} onCreate={handleCreate} />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredScripts.map((script) => (
            <ScriptCard
              key={script.id}
              script={script}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
          {filteredScripts.map((script, index) => (
            <a
              key={script.id}
              href={`/dashboard/script/${script.id}`}
              className={`flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/50 ${
                index < filteredScripts.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: TYPE_CFG[script.type].color }}
              />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                {script.title}
              </span>
              {script.brandName && (
                <span className="shrink-0 text-xs font-medium text-primary">
                  {script.brandName}
                </span>
              )}
              <span className="shrink-0 text-[11px] text-muted-foreground">
                {script.updatedAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
