"use client"

import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import {
  archiveContactAction,
  createContactAction,
  getContactAction,
  updateContactAction,
  type ContactMutationResult,
} from "@/app/action/contactActions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useBrandContacts } from "@/hooks/useBrandContacts"
import type { ContactField, ContactListData, ContactListItem } from "@/types/contact"
import { ContactArchiveDialog } from "./ContactArchiveDialog"
import { ContactFormModal, type ContactFormValues } from "./ContactFormModal"
import { ContactsEmptyState } from "./ContactsEmptyState"
import { ContactsTable } from "./ContactsTable"
import { ContactsTableSkeleton } from "./ContactsTableSkeleton"
import { CrmSearchField } from "../shared"

type BrandContactsSectionProps = {
  brandId: string
  initialData: ContactListData
}

const EMPTY_FORM: ContactFormValues = {
  name: "",
  email: "",
  phoneNumber: "",
  jobTitle: "",
  notes: "",
  isPrimary: false,
}

function toFormValues(contact: ContactListItem): ContactFormValues {
  return {
    name: contact.name,
    email: contact.email ?? "",
    phoneNumber: contact.phoneNumber ?? "",
    jobTitle: contact.jobTitle ?? "",
    notes: "",
    isPrimary: contact.isPrimary,
  }
}

function toFormValuesFromMutation(result: NonNullable<ContactMutationResult["data"]>): ContactFormValues {
  return {
    name: result.name,
    email: result.email ?? "",
    phoneNumber: result.phoneNumber ?? "",
    jobTitle: result.jobTitle ?? "",
    notes: result.notes ?? "",
    isPrimary: result.isPrimary,
  }
}

function buildFormData(values: ContactFormValues, brandId: string, contactId?: string) {
  const formData = new FormData()
  formData.set("brandId", brandId)
  if (contactId) {
    formData.set("contactId", contactId)
  }
  formData.set("name", values.name)
  formData.set("email", values.email)
  formData.set("phoneNumber", values.phoneNumber)
  formData.set("jobTitle", values.jobTitle)
  formData.set("notes", values.notes)
  formData.set("isPrimary", String(values.isPrimary))
  return formData
}

export function BrandContactsSection({ brandId, initialData }: BrandContactsSectionProps) {
  const router = useRouter()
  const {
    contacts,
    total,
    search,
    status,
    isLoading,
    loadError,
    setSearch,
    setStatus,
    setContacts,
    setTotal,
    refetch,
  } = useBrandContacts({
    brandId,
    initialData,
  })

  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<ContactListItem | null>(null)
  const [archiving, setArchiving] = useState<ContactListItem | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isArchiving, setIsArchiving] = useState(false)
  const [isFetchingEdit, setIsFetchingEdit] = useState(false)
  const [formValues, setFormValues] = useState<ContactFormValues>(EMPTY_FORM)
  const [formError, setFormError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<ContactField, string>>>({})

  function resetForm() {
    setFormValues(EMPTY_FORM)
    setFormError("")
    setFieldErrors({})
  }

  function openCreate() {
    resetForm()
    setShowCreate(true)
  }

  async function openEdit(contact: ContactListItem) {
    resetForm()
    setEditing(contact)
    setIsFetchingEdit(true)

    const result = await getContactAction(brandId, contact.id)
    setIsFetchingEdit(false)

    if (!result.success || !result.data) {
      setFormValues(toFormValues(contact))
      toast.error(("message" in result ? result.message : undefined) ?? "Could not load full contact details.")
      return
    }

    setFormValues(toFormValuesFromMutation(result.data))
  }

  async function handleCreateSubmit() {
    setIsSubmitting(true)
    setFormError("")
    setFieldErrors({})
    const result = await createContactAction(buildFormData(formValues, brandId))
    setIsSubmitting(false)

    if (!result.success || !result.data) {
      setFormError(result.message ?? "Could not create contact.")
      setFieldErrors(result.fieldErrors ?? {})
      return
    }
    toast.success(result.message ?? "Contact created.")
    setShowCreate(false)
    resetForm()
    await refetch(search, status)
    router.refresh()
  }

  async function handleUpdateSubmit() {
    if (!editing) {
      return
    }

    setIsSubmitting(true)
    setFormError("")
    setFieldErrors({})
    const result = await updateContactAction(buildFormData(formValues, brandId, editing.id))
    setIsSubmitting(false)

    if (!result.success || !result.data) {
      setFormError(result.message ?? "Could not update contact.")
      setFieldErrors(result.fieldErrors ?? {})
      return
    }
    toast.success(result.message ?? "Contact updated.")
    setEditing(null)
    resetForm()
    await refetch(search, status)
    router.refresh()
  }

  async function handleArchiveConfirm() {
    if (!archiving) {
      return
    }

    setIsArchiving(true)
    const snapshot = contacts
    const archivedId = archiving.id
    setContacts((previous) => previous.filter((item) => item.id !== archivedId))
    setTotal((previous) => Math.max(0, previous - 1))

    const result = await archiveContactAction(brandId, archivedId)
    setIsArchiving(false)

    if (!result.success) {
      setContacts(snapshot)
      setTotal(snapshot.length)
      toast.error(result.message ?? "Could not archive contact.")
      return
    }

    toast.success(result.message ?? "Contact archived.")
    setArchiving(null)
    await refetch(search, status)
    router.refresh()
  }

  const isSearchMode = search.trim().length > 0

  return (
    <>
      <div className="mt-6 rounded-[20px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">Contacts</h2>
            <p className="mt-1 text-[12px] text-[rgba(255,255,255,0.5)]">
              {total} {total === 1 ? "contact" : "contacts"} in this brand
            </p>
          </div>
          <Button
            type="button"
            onClick={openCreate}
            className="h-9 cursor-pointer gap-2 bg-(--cos-primary) px-4 text-[12px] font-semibold text-white hover:bg-(--cos-primary)"
          >
            <Plus size={14} />
            Add Contact
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <CrmSearchField
            value={search}
            onChange={setSearch}
            placeholder="Search name, email, position..."
            className="w-full max-w-[320px]"
          />

          <Select value={status} onValueChange={(value) => setStatus(value as "active" | "archived")}>
            <SelectTrigger className="h-10 w-[140px] cursor-pointer border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] text-xs text-[rgba(255,255,255,0.7)]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loadError ? (
          <Alert variant="destructive" className="mt-4 border-[rgba(232,64,42,0.35)] bg-[rgba(232,64,42,0.1)]">
            <AlertDescription className="text-[12px] text-[#E8402A]">{loadError}</AlertDescription>
          </Alert>
        ) : null}

        <div className="mt-4">
          {isLoading ? (
            <ContactsTableSkeleton />
          ) : contacts.length === 0 ? (
            <ContactsEmptyState isSearch={isSearchMode} status={status} onCreate={openCreate} />
          ) : (
            <ContactsTable items={contacts} onEdit={openEdit} onArchive={setArchiving} />
          )}
        </div>
      </div>

      <ContactFormModal
        open={showCreate}
        title="Create Contact"
        submitLabel="Create Contact"
        values={formValues}
        isSubmitting={isSubmitting}
        fieldErrors={fieldErrors}
        formError={formError}
        onChange={setFormValues}
        onOpenChange={(open) => {
          setShowCreate(open)
          if (!open) {
            resetForm()
          }
        }}
        onSubmit={handleCreateSubmit}
      />

      <ContactFormModal
        open={Boolean(editing)}
        title="Edit Contact"
        submitLabel="Save Changes"
        values={formValues}
        isSubmitting={isSubmitting || isFetchingEdit}
        fieldErrors={fieldErrors}
        formError={formError}
        onChange={setFormValues}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null)
            resetForm()
          }
        }}
        onSubmit={handleUpdateSubmit}
      />

      <ContactArchiveDialog
        open={Boolean(archiving)}
        contactName={archiving?.name ?? ""}
        isArchiving={isArchiving}
        onOpenChange={(open) => {
          if (!open) {
            setArchiving(null)
          }
        }}
        onConfirm={handleArchiveConfirm}
      />
    </>
  )
}
