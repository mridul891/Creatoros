import {
  CheckmarkCircle02Icon,
  Film01Icon,
  InstagramIcon,
  QuotesIcon,
  Scissor01Icon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"
import {
  DealPriority,
  SponsorshipStage,
} from "@/features/sponsorship/enums/sponsorship"
import type {
  Deal,
  DealModalState,
} from "@/features/sponsorship/types/sponsorship"

export type Stage = SponsorshipStage
export type Priority = DealPriority
export type ModalState = DealModalState
export type { Deal }

export const STAGES: Stage[] = [
  SponsorshipStage.LEAD,
  SponsorshipStage.OUTREACH,
  SponsorshipStage.NEGOTIATION,
  SponsorshipStage.SIGNED,
  SponsorshipStage.PAID,
]

export const STAGE_CFG: Record<
  Stage,
  {
    color: string
    bg: string
    border: string
    icon: IconSvgElement
    label: string
  }
> = {
  [SponsorshipStage.LEAD]: {
    color: "#717171",
    bg: "rgba(113,113,113,0.07)",
    border: "rgba(113,113,113,0.2)",
    icon: Film01Icon,
    label: "Planned",
  },
  [SponsorshipStage.OUTREACH]: {
    color: "#d97706",
    bg: "rgba(217,119,6,0.07)",
    border: "rgba(217,119,6,0.25)",
    icon: InstagramIcon,
    label: "Shooting",
  },
  [SponsorshipStage.NEGOTIATION]: {
    color: "#E8402A",
    bg: "rgba(232,64,42,0.07)",
    border: "rgba(232,64,42,0.25)",
    icon: Scissor01Icon,
    label: "Editing",
  },
  [SponsorshipStage.SIGNED]: {
    color: "#2563eb",
    bg: "rgba(37,99,235,0.07)",
    border: "rgba(37,99,235,0.25)",
    icon: QuotesIcon,
    label: "Review",
  },
  [SponsorshipStage.PAID]: {
    color: "#16a34a",
    bg: "rgba(22,163,74,0.07)",
    border: "rgba(22,163,74,0.25)",
    icon: CheckmarkCircle02Icon,
    label: "Published",
  },
}

export const STAGE_ACTIVE_CLASS: Record<Stage, string> = {
  [SponsorshipStage.LEAD]:
    "border-[rgba(113,113,113,0.2)] bg-[rgba(113,113,113,0.07)] text-[#717171]",
  [SponsorshipStage.OUTREACH]:
    "border-[rgba(217,119,6,0.25)] bg-[rgba(217,119,6,0.07)] text-[#d97706]",
  [SponsorshipStage.NEGOTIATION]:
    "border-[rgba(232,64,42,0.25)] bg-[rgba(232,64,42,0.07)] text-[#E8402A]",
  [SponsorshipStage.SIGNED]:
    "border-[rgba(37,99,235,0.25)] bg-[rgba(37,99,235,0.07)] text-[#2563eb]",
  [SponsorshipStage.PAID]:
    "border-[rgba(22,163,74,0.25)] bg-[rgba(22,163,74,0.07)] text-[#16a34a]",
}

export const PRIORITY_ACTIVE_CLASS: Record<Priority, string> = {
  [DealPriority.HIGH]:
    "border-[rgba(232,64,42,0.25)] bg-[rgba(232,64,42,0.07)] text-[#E8402A]",
  [DealPriority.MEDIUM]:
    "border-[rgba(217,119,6,0.25)] bg-[rgba(217,119,6,0.07)] text-[#d97706]",
  [DealPriority.LOW]:
    "border-[rgba(113,113,113,0.25)] bg-[rgba(113,113,113,0.07)] text-[#717171]",
}

export const PRIORITY_DOT_CLASS: Record<Priority, string> = {
  [DealPriority.HIGH]: "bg-[#E8402A]",
  [DealPriority.MEDIUM]: "bg-[#d97706]",
  [DealPriority.LOW]: "bg-[#717171]",
}

export const LOGO_ACCENT_CLASS: Record<string, string> = {
  "#E8402A": "bg-[#E8402A15] text-[#E8402A]",
  "#111111": "bg-[#11111115] text-foreground",
}

export const STAGE_TEXT_CLASS: Record<Stage, string> = {
  [SponsorshipStage.LEAD]: "text-[#717171]",
  [SponsorshipStage.OUTREACH]: "text-[#d97706]",
  [SponsorshipStage.NEGOTIATION]: "text-[#E8402A]",
  [SponsorshipStage.SIGNED]: "text-[#2563eb]",
  [SponsorshipStage.PAID]: "text-[#16a34a]",
}

export const STAGE_DOT_CLASS: Record<Stage, string> = {
  [SponsorshipStage.LEAD]: "bg-[#717171]",
  [SponsorshipStage.OUTREACH]: "bg-[#d97706]",
  [SponsorshipStage.NEGOTIATION]: "bg-[#E8402A]",
  [SponsorshipStage.SIGNED]: "bg-[#2563eb]",
  [SponsorshipStage.PAID]: "bg-[#16a34a]",
}

export const STAGE_BG22_CLASS: Record<Stage, string> = {
  [SponsorshipStage.LEAD]: "bg-[rgba(113,113,113,0.13)] border-r-[#717171]",
  [SponsorshipStage.OUTREACH]: "bg-[rgba(217,119,6,0.13)] border-r-[#d97706]",
  [SponsorshipStage.NEGOTIATION]:
    "bg-[rgba(232,64,42,0.13)] border-r-[#E8402A]",
  [SponsorshipStage.SIGNED]: "bg-[rgba(37,99,235,0.13)] border-r-[#2563eb]",
  [SponsorshipStage.PAID]: "bg-[rgba(22,163,74,0.13)] border-r-[#16a34a]",
}

export const STAGE_COLUMN_SURFACE_CLASS: Record<Stage, string> = {
  [SponsorshipStage.LEAD]:
    "border-[rgba(113,113,113,0.16)] bg-[linear-gradient(180deg,rgba(113,113,113,0.06)_0%,rgba(13,13,13,0)_100%)]",
  [SponsorshipStage.OUTREACH]:
    "border-[rgba(217,119,6,0.16)] bg-[linear-gradient(180deg,rgba(217,119,6,0.06)_0%,rgba(13,13,13,0)_100%)]",
  [SponsorshipStage.NEGOTIATION]:
    "border-[rgba(232,64,42,0.16)] bg-[linear-gradient(180deg,rgba(232,64,42,0.06)_0%,rgba(13,13,13,0)_100%)]",
  [SponsorshipStage.SIGNED]:
    "border-[rgba(37,99,235,0.16)] bg-[linear-gradient(180deg,rgba(37,99,235,0.06)_0%,rgba(13,13,13,0)_100%)]",
  [SponsorshipStage.PAID]:
    "border-[rgba(22,163,74,0.16)] bg-[linear-gradient(180deg,rgba(22,163,74,0.06)_0%,rgba(13,13,13,0)_100%)]",
}

export const STAGE_HEADER_GLOW_CLASS: Record<Stage, string> = {
  [SponsorshipStage.LEAD]: "before:bg-[#717171]",
  [SponsorshipStage.OUTREACH]: "before:bg-[#d97706]",
  [SponsorshipStage.NEGOTIATION]: "before:bg-[#E8402A]",
  [SponsorshipStage.SIGNED]: "before:bg-[#2563eb]",
  [SponsorshipStage.PAID]: "before:bg-[#16a34a]",
}

export const ACCENT_KPI_CARD_CLASS: Record<string, string> = {
  "#111111":
    "border-t-[1.5px] border-t-[#111111]/70 shadow-[inset_0_1px_0_var(--muted-foreground)]",
  "#E8402A":
    "border-t-[1.5px] border-t-[#E8402A]/70 shadow-[0_10px_28px_rgba(232,64,42,0.08)]",
  "#2563eb":
    "border-t-[1.5px] border-t-[#2563eb]/70 shadow-[0_10px_28px_rgba(37,99,235,0.08)]",
  "#16a34a":
    "border-t-[1.5px] border-t-[#16a34a]/70 shadow-[0_10px_28px_rgba(22,163,74,0.08)]",
}

export const ACCENT_SOFT_BG_CLASS: Record<string, string> = {
  "#111111": "bg-[#11111112]",
  "#E8402A": "bg-[#E8402A12]",
  "#2563eb": "bg-[#2563eb12]",
  "#16a34a": "bg-[#16a34a12]",
}

export const ACCENT_TEXT_CLASS: Record<string, string> = {
  "#111111": "text-foreground",
  "#E8402A": "text-[#E8402A]",
  "#2563eb": "text-[#2563eb]",
  "#16a34a": "text-[#16a34a]",
}

export const CATEGORIES = [
  "Beauty",
  "Health",
  "Technology",
  "Fashion",
  "Food & Bev",
  "Finance",
  "Travel",
  "Lifestyle",
  "Fitness",
  "Other",
]

export function fmt(n: number) {
  return `$${n.toLocaleString()}`
}
