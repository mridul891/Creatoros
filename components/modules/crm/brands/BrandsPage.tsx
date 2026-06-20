"use client"

import { Plus, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"

import {
  createBrandAction,
  deleteBrandAction,
  updateBrandAction,
} from "@/app/action/brandActions"
import type { BrandField, BrandListData, BrandListItem } from "@/types/brand"
import { BrandDeleteDialog } from "./BrandDeleteDialog"
import { BrandEmptyState } from "./BrandEmptyState"
import { BrandForm, type BrandFormValues } from "./BrandForm"
import { BrandsTable } from "./BrandsTable"

type BrandsPageProps = {
  listData: BrandListData
  initialSearch: string
}

const EMPTY_FORM: BrandFormValues = {
  name: "",
  category: "",
  website: "",
  primaryContactName: "",
  primaryContactEmail: "",
  notes: "",
}

function toFormValues(brand: BrandListItem): BrandFormValues {
  return {
    name: brand.name,
    category: brand.category ?? "",
    website: brand.website ?? "",
    primaryContactName: brand.primaryContactName ?? "",
    primaryContactEmail: brand.primaryContactEmail ?? "",
    notes: "",
  }
}

function buildFormData(values: BrandFormValues, brandId?: string) {
  const formData = new FormData()
  if (brandId) {
    formData.set("brandId", brandId)
  }
  formData.set("name", values.name)
  formData.set("category", values.category)
  formData.set("website", values.website)
  formData.set("primaryContactName", values.primaryContactName)
  formData.set("primaryContactEmail", values.primaryContactEmail)
  formData.set("notes", values.notes)
  return formData
}

export function BrandsPage({ listData, initialSearch }: BrandsPageProps) {
  const router = useRouter()

  const [search, setSearch] = useState(initialSearch)
  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<BrandListItem | null>(null)
  const [deleting, setDeleting] = useState<BrandListItem | null>(null)
  const [formValues, setFormValues] = useState<BrandFormValues>(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<BrandField, string>>>({})
  const [formError, setFormError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const hasMountedRef = useRef(false)

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }

    const timeout = setTimeout(() => {
      const params = new URLSearchParams()
      if (search.trim()) {
        params.set("search", search.trim())
      }
      params.set("page", "1")

      const query = params.toString()
      router.replace(query ? `/dashboard/brands?${query}` : "/dashboard/brands")
    }, 300)

    return () => clearTimeout(timeout)
  }, [router, search])

  const isSearchMode = useMemo(() => initialSearch.trim().length > 0, [initialSearch])

  function resetFormState() {
    setFormValues(EMPTY_FORM)
    setFieldErrors({})
    setFormError("")
  }

  function handleCreateOpen() {
    resetFormState()
    setEditing(null)
    setShowCreate(true)
  }

  function handleEditOpen(brand: BrandListItem) {
    resetFormState()
    setEditing(brand)
    setFormValues(toFormValues(brand))
  }

  async function handleCreateSubmit() {
    setIsSubmitting(true)
    setFieldErrors({})
    setFormError("")

    const result = await createBrandAction(buildFormData(formValues))
    setIsSubmitting(false)

    if (!result.success) {
      setFieldErrors(result.fieldErrors ?? {})
      setFormError(result.message ?? "Could not create brand.")
      return
    }

    toast.success(result.message ?? "Brand created.")
    setShowCreate(false)
    resetFormState()
    router.refresh()
  }

  async function handleUpdateSubmit() {
    if (!editing) {
      return
    }

    setIsSubmitting(true)
    setFieldErrors({})
    setFormError("")

    const result = await updateBrandAction(buildFormData(formValues, editing.id))
    setIsSubmitting(false)

    if (!result.success) {
      setFieldErrors(result.fieldErrors ?? {})
      setFormError(result.message ?? "Could not update brand.")
      return
    }

    toast.success(result.message ?? "Brand updated.")
    setEditing(null)
    resetFormState()
    router.refresh()
  }

  async function handleDeleteConfirm() {
    if (!deleting) {
      return
    }

    setIsDeleting(true)
    const result = await deleteBrandAction(deleting.id)
    setIsDeleting(false)

    if (!result.success) {
      toast.error(result.message ?? "Could not delete brand.")
      return
    }

    toast.success(result.message ?? "Brand deleted.")
    setDeleting(null)
    router.refresh()
  }

  function goToPage(page: number) {
    const params = new URLSearchParams()
    if (initialSearch.trim()) {
      params.set("search", initialSearch.trim())
    }
    params.set("page", String(page))
    router.push(`/dashboard/brands?${params.toString()}`)
  }

  return (
    <div className="w-full max-w-[1280px] px-9 py-7">
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 text-2xl font-extrabold tracking-[-0.04em] text-white">Brands CRM</h1>
          <p className="text-[13px] text-[rgba(255,255,255,0.45)]">
            Manage sponsor relationships and keep outreach details organized.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreateOpen}
          className="flex cursor-pointer items-center gap-2 rounded-[11px] bg-(--cos-primary) px-5 py-2.5 text-[13px] font-bold text-white"
        >
          <Plus size={15} /> New Brand
        </button>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="font-mono text-[11px] text-[rgba(255,255,255,0.42)]">
          {listData.pagination.total} total brands
        </div>
        <div className="relative">
          <Search
            size={13}
            color="rgba(255,255,255,0.4)"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search brands, categories, contacts..."
            className="h-10 w-[300px] rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] pl-[34px] pr-[14px] text-xs text-[rgba(255,255,255,0.7)] outline-none focus:border-[#E8402A]"
          />
        </div>
      </div>

      {listData.items.length === 0 ? (
        <BrandEmptyState isSearch={isSearchMode} onCreate={handleCreateOpen} />
      ) : (
        <BrandsTable items={listData.items} onEdit={handleEditOpen} onDelete={setDeleting} />
      )}

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => goToPage(listData.pagination.page - 1)}
          disabled={listData.pagination.page <= 1}
          className="cursor-pointer rounded-[8px] border border-[rgba(255,255,255,0.1)] px-3 py-1.5 text-[11px] text-[rgba(255,255,255,0.7)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <span className="font-mono text-[11px] text-[rgba(255,255,255,0.45)]">
          Page {listData.pagination.page} / {listData.pagination.totalPages}
        </span>
        <button
          type="button"
          onClick={() => goToPage(listData.pagination.page + 1)}
          disabled={listData.pagination.page >= listData.pagination.totalPages}
          className="cursor-pointer rounded-[8px] border border-[rgba(255,255,255,0.1)] px-3 py-1.5 text-[11px] text-[rgba(255,255,255,0.7)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {showCreate ? (
        <BrandForm
          title="Create Brand"
          submitLabel="Create Brand"
          values={formValues}
          fieldErrors={fieldErrors}
          formError={formError}
          isSubmitting={isSubmitting}
          onChange={setFormValues}
          onCancel={() => {
            setShowCreate(false)
            resetFormState()
          }}
          onSubmit={handleCreateSubmit}
        />
      ) : null}

      {editing ? (
        <BrandForm
          title="Edit Brand"
          submitLabel="Save Changes"
          values={formValues}
          fieldErrors={fieldErrors}
          formError={formError}
          isSubmitting={isSubmitting}
          onChange={setFormValues}
          onCancel={() => {
            setEditing(null)
            resetFormState()
          }}
          onSubmit={handleUpdateSubmit}
        />
      ) : null}

      {deleting ? (
        <BrandDeleteDialog
          brandName={deleting.name}
          isDeleting={isDeleting}
          onCancel={() => setDeleting(null)}
          onConfirm={handleDeleteConfirm}
        />
      ) : null}
    </div>
  )
}
