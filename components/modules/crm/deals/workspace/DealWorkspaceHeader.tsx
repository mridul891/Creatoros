"use client"

import Link from "next/link"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { DealDetail } from "@/types/deal"
import { DealDetailInfoCards } from "@/components/modules/crm/deals/DealDetailInfoCards"
import { DealStageBadge } from "@/components/modules/crm/deals/DealStageBadge"

type DealWorkspaceHeaderProps = {
  deal: DealDetail
  onEdit: () => void
  onArchiveToggle: () => void
  onDelete: () => void
}

export function DealWorkspaceHeader({ deal, onEdit, onArchiveToggle, onDelete }: DealWorkspaceHeaderProps) {
  return (
    <>
      <div className="mb-5">
        <Breadcrumb>
          <BreadcrumbList className="text-[12px] text-[rgba(255,255,255,0.5)]">
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="hover:text-white">
                <Link href="/dashboard/deals">Deals</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-[rgba(255,255,255,0.35)]" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-[rgba(255,255,255,0.75)]">{deal.campaignName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Card className="rounded-[20px] border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] px-7 py-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-white">{deal.campaignName}</h1>
            <p className="mt-1 text-[13px] text-[rgba(255,255,255,0.45)]">{deal.brandName}</p>
            <div className="mt-2 flex items-center gap-2">
              <DealStageBadge stage={deal.stage} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onEdit}
              className="cursor-pointer border-[rgba(255,255,255,0.1)] bg-transparent text-[13px] text-[rgba(255,255,255,0.75)]"
            >
              Edit
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onArchiveToggle}
              className="cursor-pointer border-[rgba(255,255,255,0.1)] bg-transparent text-[13px] text-[rgba(255,255,255,0.75)]"
            >
              {deal.status === "Active" ? "Archive" : "Restore"}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={onDelete}
              className="cursor-pointer border-[rgba(232,64,42,0.28)] bg-[rgba(232,64,42,0.14)] text-[#E8402A] hover:bg-[rgba(232,64,42,0.2)]"
            >
              Delete
            </Button>
          </div>
        </div>

        <DealDetailInfoCards deal={deal} />
      </Card>
    </>
  )
}
