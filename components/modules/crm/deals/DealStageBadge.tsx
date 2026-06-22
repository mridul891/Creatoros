import { DEAL_STAGE_LABEL, type DealStage } from "@/enums/deal"
import { Badge } from "@/components/ui/badge"

const STAGE_CLASS: Record<DealStage, string> = {
  Lead: "border-[rgba(113,113,113,0.25)] bg-[rgba(113,113,113,0.08)] text-[#9CA3AF]",
  Contacted: "border-[rgba(99,102,241,0.3)] bg-[rgba(99,102,241,0.1)] text-[#A5B4FC]",
  Negotiation: "border-[rgba(232,64,42,0.3)] bg-[rgba(232,64,42,0.1)] text-[#FF8A7A]",
  ProposalSent: "border-[rgba(217,119,6,0.3)] bg-[rgba(217,119,6,0.1)] text-[#FBBF24]",
  ContractSigned: "border-[rgba(37,99,235,0.3)] bg-[rgba(37,99,235,0.1)] text-[#93C5FD]",
  Active: "border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.1)] text-[#6EE7B7]",
  Delivered: "border-[rgba(14,165,233,0.3)] bg-[rgba(14,165,233,0.1)] text-[#7DD3FC]",
  Completed: "border-[rgba(139,92,246,0.3)] bg-[rgba(139,92,246,0.1)] text-[#C4B5FD]",
  Paid: "border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.1)] text-[#86EFAC]",
  Cancelled: "border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.1)] text-[#FCA5A5]",
}

type DealStageBadgeProps = {
  stage: DealStage
}

export function DealStageBadge({ stage }: DealStageBadgeProps) {
  return (
    <Badge variant="outline" className={`px-2 py-0.5 text-[10px] ${STAGE_CLASS[stage]}`}>
      {DEAL_STAGE_LABEL[stage]}
    </Badge>
  )
}
