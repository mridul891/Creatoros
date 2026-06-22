"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { DealActivityTimelineSection } from "@/components/modules/crm/activity/DealActivityTimelineSection"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getDealFormFieldErrors } from "@/lib/crm/deals/dealValidation"
import { dealDetailToFormValues, type DealFormValues } from "@/lib/crm/deals/dealForm"
import type { ActivityListData } from "@/types/activity"
import type { DealDetail, DealField } from "@/types/deal"
import { useDealMutations } from "@/hooks/useDealMutations"
import { DealArchiveDialog } from "./DealArchiveDialog"
import { DealDeleteDialog } from "./DealDeleteDialog"
import { DealDetailInfoCards } from "./DealDetailInfoCards"
import { DealForm } from "./DealForm"
import { DealStageBadge } from "./DealStageBadge"

type DealDetailPageProps = {
  deal: DealDetail
  activityData: ActivityListData
  activityError?: string
  brands: Array<{ id: string; name: string }>
  contacts: Array<{ id: string; name: string }>
}

function keepUnresolvedErrors(
  currentErrors: Partial<Record<DealField, string>>,
  nextErrors: Partial<Record<DealField, string>>
) {
  const unresolved: Partial<Record<DealField, string>> = {}

  for (const field of Object.keys(currentErrors) as DealField[]) {
    const message = nextErrors[field]
    if (message) {
      unresolved[field] = message
    }
  }

  return unresolved
}

export function DealDetailPage({ deal, activityData, activityError, brands, contacts }: DealDetailPageProps) {
  const router = useRouter()
  const [showEdit, setShowEdit] = useState(false)
  const [archiveMode, setArchiveMode] = useState<"archive" | "restore" | null>(null)
  const [showDelete, setShowDelete] = useState(false)
  const [formValues, setFormValues] = useState<DealFormValues>(() => dealDetailToFormValues(deal))
  const [formError, setFormError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<DealField, string>>>({})

  const { isSubmitting, isMutating, submitUpdate, runArchive, runRestore, runDelete } = useDealMutations({
    onRefresh: () => router.refresh(),
    onDeleteSuccess: () => router.replace("/dashboard/deals"),
  })

  async function handleUpdate() {
    setFormError("")
    setFieldErrors({})
    const result = await submitUpdate(deal.id, formValues)

    if (!result.success) {
      setFormError(result.message ?? "Could not update deal.")
      setFieldErrors(result.fieldErrors ?? {})
      return
    }

    toast.success(result.message ?? "Deal updated.")
    setShowEdit(false)
    router.refresh()
  }

  async function handleArchiveOrRestore() {
    if (!archiveMode) {
      return
    }
    const result = archiveMode === "archive" ? await runArchive(deal.id) : await runRestore(deal.id)
    if (!result.success) return
    setArchiveMode(null)
  }

  async function handleDelete() {
    await runDelete(deal.id)
  }

  function handleFormChange(nextValues: DealFormValues) {
    setFormValues(nextValues)
    if (formError) {
      setFormError("")
    }

    if (Object.keys(fieldErrors).length === 0) {
      return
    }

    const nextAllErrors = getDealFormFieldErrors(nextValues)
    const unresolvedErrors = keepUnresolvedErrors(fieldErrors, nextAllErrors)
    setFieldErrors(unresolvedErrors)
  }

  return (
    <div className="w-full max-w-[1100px] px-9 py-7">
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
              onClick={() => {
                setFormValues(dealDetailToFormValues(deal))
                setFormError("")
                setFieldErrors({})
                setShowEdit(true)
              }}
              className="cursor-pointer border-[rgba(255,255,255,0.1)] bg-transparent text-[13px] text-[rgba(255,255,255,0.75)]"
            >
              Edit
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setArchiveMode(deal.status === "Active" ? "archive" : "restore")}
              className="cursor-pointer border-[rgba(255,255,255,0.1)] bg-transparent text-[13px] text-[rgba(255,255,255,0.75)]"
            >
              {deal.status === "Active" ? "Archive" : "Restore"}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => setShowDelete(true)}
              className="cursor-pointer border-[rgba(232,64,42,0.28)] bg-[rgba(232,64,42,0.14)] text-[#E8402A] hover:bg-[rgba(232,64,42,0.2)]"
            >
              Delete
            </Button>
          </div>
        </div>

        <DealDetailInfoCards deal={deal} />
      </Card>

      <div className="mt-6">
        <Tabs defaultValue="overview">
          <TabsList className="h-9 rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] p-1">
            <TabsTrigger value="overview" className="h-7 rounded-[8px] px-3 text-[11px] data-[state=active]:text-[#E8402A]">
              Overview
            </TabsTrigger>
            <TabsTrigger value="timeline" className="h-7 rounded-[8px] px-3 text-[11px] data-[state=active]:text-[#E8402A]">
              Timeline
            </TabsTrigger>
            <TabsTrigger value="tasks" className="h-7 rounded-[8px] px-3 text-[11px] data-[state=active]:text-[#E8402A]">
              Tasks
            </TabsTrigger>
            <TabsTrigger value="deliverables" className="h-7 rounded-[8px] px-3 text-[11px] data-[state=active]:text-[#E8402A]">
              Deliverables
            </TabsTrigger>
            <TabsTrigger value="files" className="h-7 rounded-[8px] px-3 text-[11px] data-[state=active]:text-[#E8402A]">
              Files
            </TabsTrigger>
            <TabsTrigger value="notes" className="h-7 rounded-[8px] px-3 text-[11px] data-[state=active]:text-[#E8402A]">
              Notes
            </TabsTrigger>
            <TabsTrigger value="invoices" className="h-7 rounded-[8px] px-3 text-[11px] data-[state=active]:text-[#E8402A]">
              Invoices
            </TabsTrigger>
            <TabsTrigger value="payments" className="h-7 rounded-[8px] px-3 text-[11px] data-[state=active]:text-[#E8402A]">
              Payments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <Card className="rounded-[20px] border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] p-6">
              <h2 className="text-lg font-bold text-white">Overview</h2>
              <p className="mt-3 text-[13px] text-[rgba(255,255,255,0.7)]">
                {deal.campaignDescription ?? "No campaign description has been added yet."}
              </p>
              <p className="mt-4 text-[13px] text-[rgba(255,255,255,0.65)]">
                <span className="font-semibold text-white">Deliverables:</span>{" "}
                {deal.deliverablesSummary ?? "No deliverables summary yet."}
              </p>
              <p className="mt-3 text-[13px] text-[rgba(255,255,255,0.65)]">
                <span className="font-semibold text-white">Notes:</span> {deal.notes ?? "No notes yet."}
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="mt-4">
            <DealActivityTimelineSection dealId={deal.id} initialData={activityData} initialLoadError={activityError} />
          </TabsContent>

          {["tasks", "deliverables", "files", "notes", "invoices", "payments"].map((key) => (
            <TabsContent key={key} value={key} className="mt-4">
              <Card className="rounded-[20px] border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] p-6">
                <h2 className="text-lg font-bold text-white capitalize">{key}</h2>
                <p className="mt-2 text-[13px] text-[rgba(255,255,255,0.6)]">
                  {key.charAt(0).toUpperCase() + key.slice(1)} module will be linked to this deal in upcoming sprints.
                </p>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <DealForm
        open={showEdit}
        title="Edit Deal"
        submitLabel="Save Changes"
        values={formValues}
        isSubmitting={isSubmitting}
        fieldErrors={fieldErrors}
        formError={formError}
        brands={brands}
        contacts={contacts}
        onChange={handleFormChange}
        onOpenChange={(open) => setShowEdit(open)}
        onSubmit={handleUpdate}
      />

      <DealArchiveDialog
        open={Boolean(archiveMode)}
        campaignName={deal.campaignName}
        isLoading={isMutating}
        mode={archiveMode ?? "archive"}
        onOpenChange={(open) => {
          if (!open) {
            setArchiveMode(null)
          }
        }}
        onConfirm={handleArchiveOrRestore}
      />

      <DealDeleteDialog
        open={showDelete}
        campaignName={deal.campaignName}
        isLoading={isMutating}
        onOpenChange={setShowDelete}
        onConfirm={handleDelete}
      />
    </div>
  )
}
