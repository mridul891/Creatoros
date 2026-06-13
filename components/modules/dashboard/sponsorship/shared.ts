import {
  AlertCircle,
  CheckCircle,
  Handshake,
  Mail,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { DealPriority, SponsorshipStage } from "@/enums/sponsorship";
import type { Deal, DealModalState } from "@/types/sponsorship";

export type Stage = SponsorshipStage;
export type Priority = DealPriority;
export type ModalState = DealModalState;
export type { Deal };

export const STAGES: Stage[] = [
  SponsorshipStage.LEAD,
  SponsorshipStage.OUTREACH,
  SponsorshipStage.NEGOTIATION,
  SponsorshipStage.SIGNED,
  SponsorshipStage.PAID,
];

export const STAGE_CFG: Record<
  Stage,
  { color: string; bg: string; border: string; icon: LucideIcon; label: string }
> = {
  [SponsorshipStage.LEAD]: { color: "#717171", bg: "rgba(113,113,113,0.07)", border: "rgba(113,113,113,0.2)", icon: Tag, label: "Lead" },
  [SponsorshipStage.OUTREACH]: { color: "#d97706", bg: "rgba(217,119,6,0.07)", border: "rgba(217,119,6,0.25)", icon: Mail, label: "Outreach" },
  [SponsorshipStage.NEGOTIATION]: { color: "#E8402A", bg: "rgba(232,64,42,0.07)", border: "rgba(232,64,42,0.25)", icon: AlertCircle, label: "Negotiation" },
  [SponsorshipStage.SIGNED]: { color: "#2563eb", bg: "rgba(37,99,235,0.07)", border: "rgba(37,99,235,0.25)", icon: Handshake, label: "Signed" },
  [SponsorshipStage.PAID]: { color: "#16a34a", bg: "rgba(22,163,74,0.07)", border: "rgba(22,163,74,0.25)", icon: CheckCircle, label: "Paid" },
};

export const STAGE_ACTIVE_CLASS: Record<Stage, string> = {
  [SponsorshipStage.LEAD]: "border-[rgba(113,113,113,0.2)] bg-[rgba(113,113,113,0.07)] text-[#717171]",
  [SponsorshipStage.OUTREACH]: "border-[rgba(217,119,6,0.25)] bg-[rgba(217,119,6,0.07)] text-[#d97706]",
  [SponsorshipStage.NEGOTIATION]: "border-[rgba(232,64,42,0.25)] bg-[rgba(232,64,42,0.07)] text-[#E8402A]",
  [SponsorshipStage.SIGNED]: "border-[rgba(37,99,235,0.25)] bg-[rgba(37,99,235,0.07)] text-[#2563eb]",
  [SponsorshipStage.PAID]: "border-[rgba(22,163,74,0.25)] bg-[rgba(22,163,74,0.07)] text-[#16a34a]",
};

export const PRIORITY_ACTIVE_CLASS: Record<Priority, string> = {
  [DealPriority.HIGH]: "border-[rgba(232,64,42,0.25)] bg-[rgba(232,64,42,0.07)] text-[#E8402A]",
  [DealPriority.MEDIUM]: "border-[rgba(217,119,6,0.25)] bg-[rgba(217,119,6,0.07)] text-[#d97706]",
  [DealPriority.LOW]: "border-[rgba(113,113,113,0.25)] bg-[rgba(113,113,113,0.07)] text-[#717171]",
};

export const PRIORITY_DOT_CLASS: Record<Priority, string> = {
  [DealPriority.HIGH]: "bg-[#E8402A]",
  [DealPriority.MEDIUM]: "bg-[#d97706]",
  [DealPriority.LOW]: "bg-[#717171]",
};

export const LOGO_ACCENT_CLASS: Record<string, string> = {
  "#E8402A": "bg-[#E8402A15] text-[#E8402A]",
  "#111111": "bg-[#11111115] text-[#111111]",
};

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
];

export function fmt(n: number) {
  return "$" + n.toLocaleString();
}
