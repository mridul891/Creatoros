"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import {
  archiveContactAction,
  createContactAction,
  getContactAction,
  updateContactAction,
} from "@/app/action/contactActions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useBrandContacts } from "@/hooks/useBrandContacts"
import {
  buildContactFormData,
  type ContactFormValues,
  contactMutationToFormValues,
  contactToFormValues,
  EMPTY_CONTACT_FORM,
} from "@/lib/crm/contacts/contactForm"
import type {
  ContactField,
  ContactListData,
  ContactListItem,
} from "@/types/contact"
import { BrandContactsToolbar } from "./BrandContactsToolbar"
import { ContactArchiveDialog } from "./ContactArchiveDialog"
import { ContactFormModal } from "./ContactFormModal"
import { ContactsEmptyState } from "./ContactsEmptyState"
import { ContactsTable } from "./ContactsTable"
import { ContactsTableSkeleton } from "./ContactsTableSkeleton"

type BrandContactsSectionProps = {
  brandId: string
  initialData: ContactListData
}

export function BrandContactsSection({
  brandId,
  initialData,
}: BrandContactsSectionProps) {
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
  const [formValues, setFormValues] =
    useState<ContactFormValues>(EMPTY_CONTACT_FORM)
  const [formError, setFormError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<ContactField, string>>
  >({})

  function resetForm() {
    setFormValues(EMPTY_CONTACT_FORM)
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
      setFormValues(contactToFormValues(contact))
      toast.error(
        ("message" in result ? result.message : undefined) ??
          "Could not load full contact details."
      )
      return
    }

    setFormValues(contactMutationToFormValues(result.data))
  }

  async function handleCreateSubmit() {
    setIsSubmitting(true)
    setFormError("")
    setFieldErrors({})
    const result = await createContactAction(
      buildContactFormData(formValues, brandId)
    )
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
    const result = await updateContactAction(
      buildContactFormData(formValues, brandId, editing.id)
    )
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
      <div className="mt-6 rounded-[20px] border border-border bg-card p-6">
        <BrandContactsToolbar
          total={total}
          search={search}
          status={status}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onCreate={openCreate}
        />

        {loadError ? (
          <Alert
            variant="destructive"
            className="mt-4 border-[rgba(232,64,42,0.35)] bg-[rgba(232,64,42,0.1)]"
          >
            <AlertDescription className="text-[#E8402A] text-[12px]">
              {loadError}
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="mt-4">
          {isLoading ? (
            <ContactsTableSkeleton />
          ) : contacts.length === 0 ? (
            <ContactsEmptyState
              isSearch={isSearchMode}
              status={status}
              onCreate={openCreate}
            />
          ) : (
            <ContactsTable
              items={contacts}
              onEdit={openEdit}
              onArchive={setArchiving}
            />
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
        submitLabel="FloppyDisk Changes"
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
