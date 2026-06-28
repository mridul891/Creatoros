"use client"

import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { toast } from "sonner"

import {
  createBrandAction,
  deleteBrandAction,
  updateBrandAction,
} from "@/app/action/brandActions"
import { useBrandListSearch } from "@/hooks/useBrandListSearch"
import { buildBrandFormData, brandToFormValues, EMPTY_BRAND_FORM, type BrandFormValues } from "@/lib/crm/brands/brandForm"
import type { BrandField, BrandListData, BrandListItem } from "@/types/brand"
import { BrandDeleteDialog } from "./BrandDeleteDialog"
import { BrandEmptyState } from "./BrandEmptyState"
import { BrandForm } from "./BrandForm"
import { BrandsTable } from "./BrandsTable"
import { CrmPageHeaderClient, CrmPagination, CrmSearchField } from "../shared"

type BrandsPageProps = { listData: BrandListData; initialSearch: string }

export function BrandsPage({ listData, initialSearch }: BrandsPageProps) {
  const router = useRouter()

  const { search, setSearch } = useBrandListSearch(initialSearch)
  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<BrandListItem | null>(null)
  const [deleting, setDeleting] = useState<BrandListItem | null>(null)
  const [formValues, setFormValues] = useState<BrandFormValues>(EMPTY_BRAND_FORM)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<BrandField, string>>>({})
  const [formError, setFormError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isSearchMode = useMemo(() => initialSearch.trim().length > 0, [initialSearch])

  function resetFormState() {
    setFormValues(EMPTY_BRAND_FORM)
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
    setFormValues(brandToFormValues(brand))
  }

  async function handleCreateSubmit() {
    setIsSubmitting(true)
    setFieldErrors({})
    setFormError("")

    const result = await createBrandAction(buildBrandFormData(formValues))
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

    const result = await updateBrandAction(buildBrandFormData(formValues, editing.id))
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
    if (search.trim()) {
      params.set("search", search.trim())
    }
    params.set("page", String(page))
    router.push(`/dashboard/brands?${params.toString()}`)
  }

  return (
    <div className="w-full max-w-[1280px] px-9 py-7">
      <CrmPageHeaderClient
        title="Brands CRM"
        description="Manage sponsor relationships and keep outreach details organized."
        actionLabel="New Brand"
        actionIcon={<Plus size={15} />}
        onAction={handleCreateOpen}
      />

      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="font-mono text-[11px] text-[rgba(255,255,255,0.42)]">
          {listData.pagination.total} total brands
        </div>
        <CrmSearchField
          value={search}
          onChange={setSearch}
          placeholder="Search brands, categories, contacts..."
          className="w-[300px]"
        />
      </div>

      {listData.items.length === 0 ? (
        <BrandEmptyState isSearch={isSearchMode} onCreate={handleCreateOpen} />
      ) : (
        <BrandsTable items={listData.items} onEdit={handleEditOpen} onDelete={setDeleting} />
      )}

      <CrmPagination
        page={listData.pagination.page}
        totalPages={listData.pagination.totalPages}
        onPageChange={goToPage}
      />

      <BrandForm
        open={showCreate}
        title="Create Brand"
        submitLabel="Create Brand"
        values={formValues}
        fieldErrors={fieldErrors}
        formError={formError}
        isSubmitting={isSubmitting}
        onChange={setFormValues}
        onOpenChange={(open) => {
          setShowCreate(open)
          if (!open) {
            resetFormState()
          }
        }}
        onSubmit={handleCreateSubmit}
      />

      <BrandForm
        open={Boolean(editing)}
        title="Edit Brand"
        submitLabel="Save Changes"
        values={formValues}
        fieldErrors={fieldErrors}
        formError={formError}
        isSubmitting={isSubmitting}
        onChange={setFormValues}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null)
            resetFormState()
          }
        }}
        onSubmit={handleUpdateSubmit}
      />

      <BrandDeleteDialog
        open={Boolean(deleting)}
        brandName={deleting?.name ?? ""}
        isDeleting={isDeleting}
        onOpenChange={(open) => {
          if (!open) {
            setDeleting(null)
          }
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
