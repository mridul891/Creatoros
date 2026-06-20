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
import type { BrandField } from "@/types/brand"
import { BrandDeleteDialog } from "./BrandDeleteDialog"
import { BrandForm, type BrandFormValues } from "./BrandForm"

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
}

function toFormValues(brand: BrandDetailPageProps["brand"]): BrandFormValues {
  return {
    name: brand.name,
    category: brand.category ?? "",
    website: brand.website ?? "",
    primaryContactName: brand.primaryContactName ?? "",
    primaryContactEmail: brand.primaryContactEmail ?? "",
    notes: brand.notes ?? "",
  }
}

function buildFormData(values: BrandFormValues, brandId: string) {
  const formData = new FormData()
  formData.set("brandId", brandId)
  formData.set("name", values.name)
  formData.set("category", values.category)
  formData.set("website", values.website)
  formData.set("primaryContactName", values.primaryContactName)
  formData.set("primaryContactEmail", values.primaryContactEmail)
  formData.set("notes", values.notes)
  return formData
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

export function BrandDetailPage({ brand }: BrandDetailPageProps) {
  const router = useRouter()

  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formValues, setFormValues] = useState<BrandFormValues>(() => toFormValues(brand))
  const [formError, setFormError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<BrandField, string>>>({})

  async function handleUpdate() {
    setIsSubmitting(true)
    setFormError("")
    setFieldErrors({})

    const result: BrandMutationResult = await updateBrandAction(buildFormData(formValues, brand.id))
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
    <div className="w-full max-w-[960px] px-9 py-7">
      <div className="mb-5">
        <Link href="/dashboard/brands" className="text-[12px] text-[rgba(255,255,255,0.5)] hover:text-white">
          ← Back to brands
        </Link>
      </div>

      <div className="rounded-[20px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-white">{brand.name}</h1>
            <p className="mt-1 text-[13px] text-[rgba(255,255,255,0.45)]">{brand.category ?? "Uncategorized"}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setFormValues(toFormValues(brand))
                setFormError("")
                setFieldErrors({})
                setShowEdit(true)
              }}
              className="cursor-pointer rounded-[10px] border border-[rgba(255,255,255,0.1)] px-4 py-2 text-[13px] text-[rgba(255,255,255,0.75)]"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setShowDelete(true)}
              className="cursor-pointer rounded-[10px] border border-[rgba(232,64,42,0.28)] px-4 py-2 text-[13px] text-[#E8402A]"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-[14px] bg-[rgba(255,255,255,0.04)] p-4">
            <div className="font-mono text-[10px] text-[rgba(255,255,255,0.4)]">WEBSITE</div>
            <div className="mt-1 text-[13px] text-[rgba(255,255,255,0.75)]">
              {brand.website ? (
                <a href={brand.website} target="_blank" rel="noreferrer" className="hover:text-[#E8402A]">
                  {brand.website}
                </a>
              ) : (
                "—"
              )}
            </div>
          </div>

          <div className="rounded-[14px] bg-[rgba(255,255,255,0.04)] p-4">
            <div className="font-mono text-[10px] text-[rgba(255,255,255,0.4)]">PRIMARY CONTACT</div>
            <div className="mt-1 text-[13px] text-[rgba(255,255,255,0.75)]">
              {brand.primaryContactName ?? "—"}
            </div>
            <div className="mt-0.5 font-mono text-[11px] text-[rgba(255,255,255,0.5)]">
              {brand.primaryContactEmail ?? "—"}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[14px] bg-[rgba(255,255,255,0.04)] p-4">
          <div className="font-mono text-[10px] text-[rgba(255,255,255,0.4)]">NOTES</div>
          <p className="mt-1 whitespace-pre-wrap text-[13px] leading-6 text-[rgba(255,255,255,0.75)]">
            {brand.notes ?? "No notes added."}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div className="rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-3">
            <div className="font-mono text-[10px] text-[rgba(255,255,255,0.4)]">CREATED</div>
            <div className="mt-1 text-[12px] text-[rgba(255,255,255,0.75)]">{formatDate(brand.createdAt)}</div>
          </div>
          <div className="rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-3">
            <div className="font-mono text-[10px] text-[rgba(255,255,255,0.4)]">LAST UPDATED</div>
            <div className="mt-1 text-[12px] text-[rgba(255,255,255,0.75)]">{formatDate(brand.updatedAt)}</div>
          </div>
        </div>
      </div>

      {showEdit ? (
        <BrandForm
          title="Edit Brand"
          submitLabel="Save Changes"
          values={formValues}
          isSubmitting={isSubmitting}
          fieldErrors={fieldErrors}
          formError={formError}
          onChange={setFormValues}
          onCancel={() => setShowEdit(false)}
          onSubmit={handleUpdate}
        />
      ) : null}

      {showDelete ? (
        <BrandDeleteDialog
          brandName={brand.name}
          isDeleting={isDeleting}
          onCancel={() => setShowDelete(false)}
          onConfirm={handleDelete}
        />
      ) : null}
    </div>
  )
}
