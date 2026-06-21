"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import {
  deleteBrandAction,
  updateBrandAction,
  type BrandMutationResult,
} from "@/app/action/brandActions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ContactListData } from "@/types/contact"
import type { BrandField } from "@/types/brand"
import { buildBrandFormData, brandToFormValues, type BrandFormValues } from "@/lib/crm/brands/brandForm"
import { formatShortDate } from "@/lib/format/date"
import { BrandContactsSection } from "@/components/modules/crm/contacts/BrandContactsSection"
import { BrandDeleteDialog } from "./BrandDeleteDialog"
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
}

export function BrandDetailPage({ brand, contactsData }: BrandDetailPageProps) {
  const router = useRouter()

  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formValues, setFormValues] = useState<BrandFormValues>(() => brandToFormValues(brand))
  const [formError, setFormError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<BrandField, string>>>({})

  async function handleUpdate() {
    setIsSubmitting(true)
    setFormError("")
    setFieldErrors({})

    const result: BrandMutationResult = await updateBrandAction(buildBrandFormData(formValues, brand.id))
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
        <Link href="/dashboard/brands" className="text-[12px] text-[rgba(255,255,255,0.5)] hover:text-white">
          ← Back to brands
        </Link>
      </div>

      <Card className="rounded-[20px] border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] px-7 py-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-white">{brand.name}</h1>
            <p className="mt-1 text-[13px] text-[rgba(255,255,255,0.45)]">{brand.category ?? "Uncategorized"}</p>
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
              className="cursor-pointer border-[rgba(255,255,255,0.1)] bg-transparent text-[13px] text-[rgba(255,255,255,0.75)]"
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

        <CardContent className="mt-6 px-0">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.04)] py-4">
              <CardHeader className="pb-2">
                <CardTitle className="font-mono text-[10px] tracking-wider text-[rgba(255,255,255,0.4)]">
                  WEBSITE
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[13px] text-[rgba(255,255,255,0.75)]">
                {brand.website ? (
                  <a href={brand.website} target="_blank" rel="noreferrer" className="hover:text-[#E8402A]">
                    {brand.website}
                  </a>
                ) : (
                  "—"
                )}
              </CardContent>
            </Card>

            <Card className="border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.04)] py-4">
              <CardHeader className="pb-2">
                <CardTitle className="font-mono text-[10px] tracking-wider text-[rgba(255,255,255,0.4)]">
                  PRIMARY CONTACT
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-[13px] text-[rgba(255,255,255,0.75)]">{brand.primaryContactName ?? "—"}</div>
                <div className="mt-0.5 font-mono text-[11px] text-[rgba(255,255,255,0.5)]">
                  {brand.primaryContactEmail ?? "—"}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4 border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.04)] py-4">
            <CardHeader className="pb-2">
              <CardTitle className="font-mono text-[10px] tracking-wider text-[rgba(255,255,255,0.4)]">
                NOTES
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-[13px] leading-6 text-[rgba(255,255,255,0.75)]">
                {brand.notes ?? "No notes added."}
              </p>
            </CardContent>
          </Card>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="rounded-[12px] border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] py-3">
              <CardHeader className="pb-1">
                <CardTitle className="font-mono text-[10px] tracking-wider text-[rgba(255,255,255,0.4)]">
                  CREATED
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[12px] text-[rgba(255,255,255,0.75)]">
                {formatShortDate(brand.createdAt)}
              </CardContent>
            </Card>
            <Card className="rounded-[12px] border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] py-3">
              <CardHeader className="pb-1">
                <CardTitle className="font-mono text-[10px] tracking-wider text-[rgba(255,255,255,0.4)]">
                  LAST UPDATED
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[12px] text-[rgba(255,255,255,0.75)]">
                {formatShortDate(brand.updatedAt)}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <BrandContactsSection brandId={brand.id} initialData={contactsData} />

      <BrandForm
        open={showEdit}
        title="Edit Brand"
        submitLabel="Save Changes"
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
