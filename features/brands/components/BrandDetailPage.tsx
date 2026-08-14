"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
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
import { ActivityTimelineSection } from "@/features/activity/components/ActivityTimelineSection"
import type { ActivityListData } from "@/features/activity/types/activity"
import {
  type BrandMutationResult,
  deleteBrandAction,
  updateBrandAction,
} from "@/features/brands/actions/brandActions"
import type { BrandField } from "@/features/brands/types/brand"
import {
  type BrandFormValues,
  brandToFormValues,
  buildBrandFormData,
} from "@/features/brands/utils/brandForm"
import { BrandContactsSection } from "@/features/contacts/components/BrandContactsSection"
import type { ContactListData } from "@/features/contacts/types/contact"
import { BrandDeleteDialog } from "./BrandDeleteDialog"
import { BrandDetailInfoCards } from "./BrandDetailInfoCards"
import { BrandForm } from "./BrandForm"

type BrandDetailPageProps = {
  brand: {
    id: string
    name: string
    category: string | null
    website: string | null
    primaryContactName: string | null
    primaryContactEmail: string | null
    notes: string | null
    createdAt: Date
    updatedAt: Date
  }
  contactsData: ContactListData
  activityData: ActivityListData
}

export function BrandDetailPage({
  brand,
  contactsData,
  activityData,
}: BrandDetailPageProps) {
  const router = useRouter()

  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formValues, setFormValues] = useState<BrandFormValues>(() =>
    brandToFormValues(brand)
  )
  const [formError, setFormError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<BrandField, string>>
  >({})

  async function handleUpdate() {
    setIsSubmitting(true)
    setFormError("")
    setFieldErrors({})

    const result: BrandMutationResult = await updateBrandAction(
      buildBrandFormData(formValues, brand.id)
    )
    setIsSubmitting(false)

    if (!result.success) {
      setFormError(result.message ?? "Could not update brand.")
      setFieldErrors(result.fieldErrors ?? {})
      return
    }

    toast.success(result.message ?? "Brand updated.")
    setShowEdit(false)
    router.refresh()
  }

  async function handleDelete() {
    setIsDeleting(true)
    const result = await deleteBrandAction(brand.id)
    setIsDeleting(false)

    if (!result.success) {
      toast.error(result.message ?? "Could not delete brand.")
      return
    }

    toast.success(result.message ?? "Brand deleted.")
    router.replace("/dashboard/brands")
    router.refresh()
  }

  return (
    <div className="w-full max-w-[1100px] px-9 py-7">
      <div className="mb-5">
        <Breadcrumb>
          <BreadcrumbList className="text-[12px] text-muted-foreground">
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="hover:text-foreground">
                <Link href="/dashboard/brands">Brands</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-muted-foreground" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-muted-foreground">
                {brand.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Card className="rounded-[20px] border-border bg-card px-7 py-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-extrabold text-2xl text-foreground tracking-[-0.03em]">
              {brand.name}
            </h1>
            <p className="mt-1 text-[13px] text-muted-foreground">
              {brand.category ?? "Uncategorized"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormValues(brandToFormValues(brand))
                setFormError("")
                setFieldErrors({})
                setShowEdit(true)
              }}
              className="cursor-pointer border-border bg-transparent text-[13px] text-muted-foreground"
            >
              Edit
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

        <BrandDetailInfoCards brand={brand} />
      </Card>

      <ActivityTimelineSection brandId={brand.id} initialData={activityData} />

      <BrandContactsSection brandId={brand.id} initialData={contactsData} />

      <BrandForm
        open={showEdit}
        title="Edit Brand"
        submitLabel="FloppyDisk Changes"
        values={formValues}
        isSubmitting={isSubmitting}
        fieldErrors={fieldErrors}
        formError={formError}
        onChange={setFormValues}
        onOpenChange={(open) => {
          setShowEdit(open)
        }}
        onSubmit={handleUpdate}
      />

      <BrandDeleteDialog
        open={showDelete}
        brandName={brand.name}
        isDeleting={isDeleting}
        onOpenChange={setShowDelete}
        onConfirm={handleDelete}
      />
    </div>
  )
}
