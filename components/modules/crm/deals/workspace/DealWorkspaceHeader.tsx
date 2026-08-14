"use client"

import Link from "next/link"
import { DealDetailInfoCards } from "@/components/modules/crm/deals/DealDetailInfoCards"
import { DealStageBadge } from "@/components/modules/crm/deals/DealStageBadge"
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

type DealWorkspaceHeaderProps = {
  deal: DealDetail
  onEdit: () => void
  onArchiveToggle: () => void
  onDelete: () => void
}

export function DealWorkspaceHeader({
  deal,
  onEdit,
  onArchiveToggle,
  onDelete,
}: DealWorkspaceHeaderProps) {
  return (
    <>
      <div className="mb-5">
        <Breadcrumb>
          <BreadcrumbList className="text-[12px] text-muted-foreground">
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="hover:text-foreground">
                <Link href="/dashboard/deals">Deals</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-muted-foreground" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-muted-foreground">
                {deal.campaignName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Card className="rounded-[20px] border-border bg-card px-7 py-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-extrabold text-2xl text-foreground tracking-[-0.03em]">
              {deal.campaignName}
            </h1>
            <p className="mt-1 text-[13px] text-muted-foreground">
              {deal.brandName}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <DealStageBadge stage={deal.stage} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onEdit}
              className="cursor-pointer border-border bg-transparent text-[13px] text-muted-foreground"
            >
              Edit
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onArchiveToggle}
              className="cursor-pointer border-border bg-transparent text-[13px] text-muted-foreground"
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
