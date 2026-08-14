"use client"

import {
  Add01Icon,
  Alert02Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Copy01Icon,
  Delete02Icon,
  Dollar01Icon,
  Download01Icon,
  Edit02Icon,
  File02Icon,
  MailSend01Icon,
  MoreHorizontalIcon,
  Search01Icon,
  TradeUpIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { useState } from "react"
import { InvoiceStatus, InvoiceTab } from "@/features/invoices/enums/invoice"
import type {
  Invoice,
  InvoiceFiltersState,
  InvoiceFormState,
  InvoiceListData,
  InvoiceListItem,
  InvoiceModalState,
} from "@/features/invoices/types/invoice"

/* ── Types & data ──────────────────────────────────────────── */
const STATUS_CFG: Record<
  InvoiceStatus,
  {
    label: string
    icon: IconSvgElement
    toneText: string
    toneBg: string
    toneBorder: string
  }
> = {
  [InvoiceStatus.DRAFT]: {
    label: "Draft",
    icon: File02Icon,
    toneText: "text-[#717171]",
    toneBg: "bg-[rgba(113,113,113,0.08)]",
    toneBorder: "border-[rgba(113,113,113,0.2)]",
  },
  [InvoiceStatus.SENT]: {
    label: "Sent",
    icon: Clock01Icon,
    toneText: "text-[#d97706]",
    toneBg: "bg-[rgba(217,119,6,0.08)]",
    toneBorder: "border-[rgba(217,119,6,0.2)]",
  },
  [InvoiceStatus.PAID]: {
    label: "Paid",
    icon: CheckmarkCircle02Icon,
    toneText: "text-[#16a34a]",
    toneBg: "bg-[rgba(22,163,74,0.08)]",
    toneBorder: "border-[rgba(22,163,74,0.2)]",
  },
  [InvoiceStatus.OVERDUE]: {
    label: "Overdue",
    icon: Alert02Icon,
    toneText: "text-[#E8402A]",
    toneBg: "bg-[rgba(232,64,42,0.08)]",
    toneBorder: "border-[rgba(232,64,42,0.2)]",
  },
  [InvoiceStatus.ARCHIVED]: {
    label: "Archived",
    icon: File02Icon,
    toneText: "text-[#717171]",
    toneBg: "bg-[rgba(113,113,113,0.08)]",
    toneBorder: "border-[rgba(113,113,113,0.2)]",
  },
}

const TABS: InvoiceTab[] = [
  InvoiceTab.ALL,
  InvoiceTab.SENT,
  InvoiceTab.PAID,
  InvoiceTab.OVERDUE,
  InvoiceTab.DRAFT,
  InvoiceTab.ARCHIVED,
]
const INVOICE_STATUS_OPTIONS: InvoiceStatus[] = [
  InvoiceStatus.DRAFT,
  InvoiceStatus.SENT,
  InvoiceStatus.PAID,
  InvoiceStatus.OVERDUE,
  InvoiceStatus.ARCHIVED,
]
const INVOICE_TAB_TO_STATUS: Partial<Record<InvoiceTab, InvoiceStatus>> = {
  [InvoiceTab.SENT]: InvoiceStatus.SENT,
  [InvoiceTab.PAID]: InvoiceStatus.PAID,
  [InvoiceTab.OVERDUE]: InvoiceStatus.OVERDUE,
  [InvoiceTab.DRAFT]: InvoiceStatus.DRAFT,
  [InvoiceTab.ARCHIVED]: InvoiceStatus.ARCHIVED,
}
function fmt(n: number) {
  return `$${n.toLocaleString()}`
}
function nextId(invoices: Invoice[]) {
  const nums = invoices
    .map((i) => parseInt(i.id.replace("INV-", ""), 10))
    .filter(Boolean)
  return `INV-${Math.max(...nums, 2024) + 1}`
}

const MONO_FONT = "font-mono"
const LABEL_CLASS = `mb-[6px] block text-xs font-semibold text-muted-foreground `
const INPUT_BASE_CLASS = `box-border w-full rounded-[10px] border border-border bg-muted px-[14px] py-[10px] text-[13px] text-muted-foreground outline-none transition-colors duration-150 focus:border-[#E8402A] `
const ICON_ACCENT: Record<string, string> = {
  "#111111": "text-foreground bg-[#11111112]",
  "#d97706": "text-[#d97706] bg-[#d9770612]",
  "#E8402A": "text-[#E8402A] bg-[#E8402A12]",
  "#16a34a": "text-[#16a34a] bg-[#16a34a12]",
}
const LOGO_TONE: Record<string, string> = {
  "#E8402A": "bg-[#E8402A18] text-[#E8402A]",
  "#111111": "bg-[#11111118] text-foreground",
}

function formatInvoiceDate(value: Date | null) {
  if (!value) return "TBD"
  return value.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function getInitials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .padEnd(2, value[1]?.toUpperCase() ?? "X")
}

function toInvoice(item: InvoiceListItem): Invoice {
  return {
    id: item.invoiceNumber,
    invoiceId: item.id,
    client: item.client,
    logo: getInitials(item.client),
    color: "#E8402A",
    amount: item.amount,
    currency: item.currency,
    issued: formatInvoiceDate(item.issuedAt),
    due: formatInvoiceDate(item.dueDate),
    status: item.status,
    desc: item.description,
    dealId: item.dealId,
    metadata: item.metadata,
  }
}

/* ── Invoice modal (create / edit) ─────────────────────────── */
function InvoiceModal({
  state,
  onSave,
  onClose,
}: {
  state: InvoiceModalState
  onSave: (inv: Invoice) => void
  onClose: () => void
}) {
  const ex = state.invoice
  const [form, setForm] = useState<InvoiceFormState>({
    client: ex?.client ?? "",
    logo: ex?.logo ?? "",
    desc: ex?.desc ?? "",
    amount: ex?.amount ?? 0,
    due: ex?.due ?? "",
    status: ex?.status ?? InvoiceStatus.DRAFT,
  })
  const [err, setErr] = useState("")

  function handleSave() {
    if (!form.client.trim()) {
      setErr("Client name is required.")
      return
    }
    if (form.amount <= 0) {
      setErr("Amount must be greater than 0.")
      return
    }
    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    onSave({
      id: ex?.id ?? "",
      invoiceId: ex?.invoiceId ?? "",
      client: form.client.trim(),
      logo: form.logo.trim() || form.client.slice(0, 2).toUpperCase(),
      color: "#E8402A",
      amount: form.amount,
      currency: ex?.currency ?? "USD",
      desc: form.desc.trim(),
      issued: ex?.issued ?? today,
      due: form.due || "TBD",
      status: form.status,
      dealId: ex?.dealId ?? null,
      metadata: ex?.metadata ?? null,
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-200 flex items-center justify-center bg-muted backdrop-blur-[6px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="max-h-[90vh] w-[540px] overflow-y-auto rounded-[22px] bg-card shadow-[0_32px_80px_rgba(0,0,0,0.22)]">
        <div className="flex items-center justify-between border-border border-b px-7 py-[22px]">
          <div>
            <div
              className={`font-extrabold text-[17px] text-foreground tracking-[-0.03em]`}
            >
              {ex ? "Edit Invoice" : "New Invoice"}
            </div>
            <div
              className={`mt-0.5 text-[11px] text-muted-foreground ${MONO_FONT}`}
            >
              {ex?.id ?? "Auto-assigned on save"}
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-muted-foreground"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-7 py-6">
          <div className="grid grid-cols-[1fr_80px] gap-3">
            <div>
              <label className={LABEL_CLASS}>Client / Brand *</label>
              <input
                value={form.client}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, client: e.target.value }))
                  setErr("")
                }}
                placeholder="e.g. Glow Republic"
                className={INPUT_BASE_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Logo abbr.</label>
              <input
                value={form.logo}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    logo: e.target.value.slice(0, 2).toUpperCase(),
                  }))
                }
                placeholder="GR"
                maxLength={2}
                className={`${INPUT_BASE_CLASS} text-center font-bold tracking-widest ${MONO_FONT}`}
              />
            </div>
          </div>
          <div>
            <label className={LABEL_CLASS}>Description</label>
            <input
              value={form.desc}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, desc: e.target.value }))
              }
              placeholder="e.g. Instagram campaign × 3 posts"
              className={INPUT_BASE_CLASS}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLASS}>Amount (USD) *</label>
              <input
                type="number"
                value={form.amount || ""}
                onChange={(e) => {
                  setForm((prev) => ({
                    ...prev,
                    amount: parseFloat(e.target.value) || 0,
                  }))
                  setErr("")
                }}
                placeholder="5000"
                className={INPUT_BASE_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Due date</label>
              <input
                value={form.due}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, due: e.target.value }))
                }
                placeholder="e.g. Jun 30, 2026"
                className={INPUT_BASE_CLASS}
              />
            </div>
          </div>
          <div>
            <label className={`${LABEL_CLASS} mb-2`}>Status</label>
            <div className="flex gap-2">
              {INVOICE_STATUS_OPTIONS.map((s) => {
                const C = STATUS_CFG[s]
                return (
                  <button
                    key={s}
                    onClick={() => setForm((prev) => ({ ...prev, status: s }))}
                    className={`flex flex-1 cursor-pointer items-center justify-center gap-[5px] rounded-[9px] border-[1.5px] px-1 py-2 text-[10px] capitalize transition-all duration-150 ${MONO_FONT} ${
                      form.status === s
                        ? `${C.toneBg} ${C.toneText} ${C.toneBorder} font-bold`
                        : "border-border font-normal text-muted-foreground"
                    }`}
                  >
                    <HugeiconsIcon icon={C.icon} size={10} /> {s}
                  </button>
                )
              })}
            </div>
          </div>
          {err && (
            <div
              className={`rounded-lg bg-[rgba(232,64,42,0.07)] px-3 py-2 text-[#E8402A] text-[11px] ${MONO_FONT}`}
            >
              {err}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2.5 px-7 pt-[14px] pb-6">
          <button
            onClick={onClose}
            className={`cursor-pointer rounded-[10px] border border-border px-5 py-2.5 text-[13px] text-muted-foreground`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`flex cursor-pointer items-center gap-2 rounded-[10px] bg-primary px-[22px] py-2.5 font-bold text-[13px] text-primary-foreground`}
          >
            <HugeiconsIcon icon={MailSend01Icon} size={13} />{" "}
            {ex ? "FloppyDisk Changes" : "Create Invoice"}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Overflow menu ─────────────────────────────────────────── */
function RowMenu({
  onEdit,
  onDelete,
  onStatusChange,
}: {
  onEdit: () => void
  onDelete: () => void
  onStatusChange: (s: InvoiceStatus) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
        }}
        className="flex cursor-pointer rounded-[7px] p-1.5 text-muted-foreground transition-colors duration-150 hover:bg-muted"
      >
        <HugeiconsIcon icon={MoreHorizontalIcon} size={15} />
      </button>
      {open && (
        <div
          className="absolute top-full right-0 z-50 min-w-[180px] overflow-hidden rounded-xl border border-border bg-card shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
          onMouseLeave={() => setOpen(false)}
        >
          {[
            {
              label: "Edit invoice",
              icon: Edit02Icon,
              action: onEdit,
              colorClass: "text-muted-foreground",
            },
            {
              label: "Mark as Paid",
              icon: CheckmarkCircle02Icon,
              action: () => onStatusChange(InvoiceStatus.PAID),
              colorClass: "text-[#16a34a]",
            },
            {
              label: "Mark as Sent",
              icon: Clock01Icon,
              action: () => onStatusChange(InvoiceStatus.SENT),
              colorClass: "text-[#d97706]",
            },
            {
              label: "Mark as Overdue",
              icon: Alert02Icon,
              action: () => onStatusChange(InvoiceStatus.OVERDUE),
              colorClass: "text-[#E8402A]",
            },
            {
              label: "Delete",
              icon: Delete02Icon,
              action: onDelete,
              colorClass: "text-[#E8402A]",
            },
          ].map((item) => (
            <button
              key={item.label}
              onClick={(e) => {
                e.stopPropagation()
                item.action()
                setOpen(false)
              }}
              className={`flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-[14px] py-2.5 text-left text-xs transition-colors duration-150 hover:bg-muted ${item.colorClass}`}
            >
              <HugeiconsIcon icon={item.icon} size={13} /> {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── InvoicesPage ───────────────────────────────────────────── */
type InvoicesPageProps = {
  initialData: InvoiceListData
  selectedInvoiceId?: string
}

export function InvoicesPage({
  initialData,
  selectedInvoiceId,
}: InvoicesPageProps) {
  const [invoices, setInvoices] = useState(() =>
    initialData.items.map((item) => toInvoice(item))
  )
  const [filters, setFilters] = useState<InvoiceFiltersState>({
    tab: InvoiceTab.ALL,
    search: "",
  })
  const [modal, setModal] = useState<InvoiceModalState | null>(null)
  const [selected, setSelected] = useState<string | null>(() => {
    const selectedItem = selectedInvoiceId
      ? initialData.items.find((item) => item.id === selectedInvoiceId)
      : null
    return selectedItem?.invoiceNumber ?? null
  })
  const [copied, setCopied] = useState(false)

  const totalRevenue = invoices
    .filter((i) => i.status === InvoiceStatus.PAID)
    .reduce((s, i) => s + i.amount, 0)
  const totalPending = invoices
    .filter((i) => i.status === InvoiceStatus.SENT)
    .reduce((s, i) => s + i.amount, 0)
  const totalOverdue = invoices
    .filter((i) => i.status === InvoiceStatus.OVERDUE)
    .reduce((s, i) => s + i.amount, 0)

  const filtered = invoices
    .filter(
      (i) =>
        filters.tab === InvoiceTab.ALL ||
        i.status === INVOICE_TAB_TO_STATUS[filters.tab]
    )
    .filter(
      (i) =>
        !filters.search ||
        i.client.toLowerCase().includes(filters.search.toLowerCase()) ||
        i.id.toLowerCase().includes(filters.search.toLowerCase())
    )

  function handleSave(inv: Invoice) {
    if (inv.id) {
      setInvoices((prev) => prev.map((i) => (i.id === inv.id ? inv : i)))
    } else {
      const id = nextId(invoices)
      setInvoices((prev) => [{ ...inv, id }, ...prev])
      setSelected(id)
    }
  }

  function handleDelete(id: string) {
    setInvoices((prev) => prev.filter((i) => i.id !== id))
    if (selected === id) setSelected(null)
  }

  function handleStatusChange(id: string, status: InvoiceStatus) {
    setInvoices((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
  }

  const selectedInv = invoices.find((i) => i.id === selected) ?? null

  return (
    <div className="w-full max-w-[1280px] px-9 py-7">
      {modal && (
        <InvoiceModal
          state={modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {/* Header */}
      <div className="mb-7 flex items-start justify-between">
        <div>
          <h1
            className={`mb-1 font-extrabold text-2xl text-foreground tracking-[-0.04em]`}
          >
            Invoices
          </h1>
          <div className={`text-[13px] text-muted-foreground`}>
            Manage and track all your brand deal invoices
          </div>
        </div>
        <button
          onClick={() => setModal({})}
          className={`flex cursor-pointer items-center gap-2 rounded-[11px] bg-primary px-5 py-2.5 font-bold text-[13px] text-primary-foreground transition-opacity duration-150 hover:opacity-85`}
        >
          <HugeiconsIcon icon={Add01Icon} size={15} /> New Invoice
        </button>
      </div>

      {/* KPIs */}
      <div className="mb-7 grid grid-cols-[repeat(4,1fr)] gap-4">
        {[
          {
            label: "Total Earned",
            value: fmt(totalRevenue),
            sub: `${invoices.filter((i) => i.status === InvoiceStatus.PAID).length} paid invoices`,
            icon: Dollar01Icon,
            accent: "#111111",
          },
          {
            label: "Awaiting Payment",
            value: fmt(totalPending),
            sub: `${invoices.filter((i) => i.status === InvoiceStatus.SENT).length} sent`,
            icon: Clock01Icon,
            accent: "#d97706",
          },
          {
            label: "Overdue",
            value: fmt(totalOverdue),
            sub: `${invoices.filter((i) => i.status === InvoiceStatus.OVERDUE).length} overdue`,
            icon: Alert02Icon,
            accent: "#E8402A",
          },
          {
            label: "Total Invoices",
            value: String(invoices.length),
            sub: "all time",
            icon: TradeUpIcon,
            accent: "#16a34a",
          },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-2xl border border-border bg-card px-[22px] py-5"
          >
            <div className="mb-3 flex items-start justify-between">
              <span className={`font-medium text-muted-foreground text-xs`}>
                {k.label}
              </span>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-[9px] ${ICON_ACCENT[k.accent]}`}
              >
                <HugeiconsIcon icon={k.icon} size={15} />
              </div>
            </div>
            <div
              className={`mb-[5px] font-extrabold text-[28px] text-foreground leading-none tracking-[-0.04em]`}
            >
              {k.value}
            </div>
            <div className={`text-[11px] text-muted-foreground ${MONO_FONT}`}>
              {k.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-[11px] bg-muted p-[3px]">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setFilters((prev) => ({ ...prev, tab: t }))}
              className={`cursor-pointer rounded-lg border-none px-4 py-1.5 text-xs transition-all duration-150 ${
                filters.tab === t
                  ? "bg-card font-semibold text-foreground shadow-[0_1px_4px_rgba(0,0,0,0.1)]"
                  : "bg-transparent font-normal text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <HugeiconsIcon
              icon={Search01Icon}
              size={13}
              color="var(--muted-foreground)"
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
            />
            <input
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              placeholder="Search..."
              className={`h-9 w-[180px] rounded-[9px] border border-border bg-card pr-[14px] pl-[34px] text-muted-foreground text-xs outline-none transition-colors duration-150 focus:border-[#E8402A]`}
            />
          </div>
          <button
            className={`flex h-9 cursor-pointer items-center gap-1.5 rounded-[9px] border border-border bg-card px-[14px] text-muted-foreground text-xs`}
          >
            <HugeiconsIcon icon={Download01Icon} size={12} /> Export CSV
          </button>
        </div>
      </div>

      {/* Table + panel */}
      <div
        className={`grid gap-4 ${selected ? "grid-cols-[1fr_360px]" : "grid-cols-1"}`}
      >
        <div className="overflow-hidden rounded-[18px] border border-border bg-card">
          {/* Head */}
          <div
            className={`grid grid-cols-[2fr_1.6fr_1fr_1.1fr_140px_60px] border-border border-b px-6 py-3 text-[10px] text-muted-foreground tracking-wider ${MONO_FONT}`}
          >
            {["CLIENT", "DESCRIPTION", "AMOUNT", "DUE", "STATUS", ""].map(
              (h) => (
                <span key={h}>{h}</span>
              )
            )}
          </div>

          {filtered.length === 0 ? (
            <div
              className={`px-6 py-12 text-center text-[13px] text-muted-foreground`}
            >
              No invoices found.
            </div>
          ) : (
            filtered.map((inv, i) => {
              const S = STATUS_CFG[inv.status]
              const isSelected = selected === inv.id
              return (
                <div
                  key={inv.id}
                  onClick={() => setSelected(isSelected ? null : inv.id)}
                  className={`grid grid-cols-[2fr_1.6fr_1fr_1.1fr_140px_60px] items-center px-6 py-[15px] transition-colors duration-150 ${i < filtered.length - 1 ? "border-border border-b" : ""} ${isSelected ? "bg-[rgba(232,64,42,0.03)]" : "bg-transparent hover:bg-muted"} cursor-pointer`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] font-extrabold text-[11px] ${MONO_FONT} ${LOGO_TONE[inv.color] ?? "bg-muted text-foreground"}`}
                    >
                      {inv.logo}
                    </div>
                    <div>
                      <div
                        className={`font-semibold text-[13px] text-foreground`}
                      >
                        {inv.client}
                      </div>
                      <div
                        className={`text-[10px] text-muted-foreground ${MONO_FONT}`}
                      >
                        {inv.id}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`truncate pr-2 text-muted-foreground text-xs`}
                  >
                    {inv.desc}
                  </div>
                  <div
                    className={`font-bold text-foreground text-sm tracking-[-0.02em]`}
                  >
                    {fmt(inv.amount)}
                  </div>
                  <div
                    className={`text-[11px] text-muted-foreground ${MONO_FONT}`}
                  >
                    {inv.due}
                  </div>
                  <div
                    className={`inline-flex w-fit items-center gap-1.5 rounded-[99px] px-[10px] py-1 ${S.toneBg}`}
                  >
                    <HugeiconsIcon
                      icon={S.icon}
                      size={11}
                      className={S.toneText}
                    />
                    <span
                      className={`font-semibold text-[11px] ${S.toneText} ${MONO_FONT}`}
                    >
                      {S.label}
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <RowMenu
                      onEdit={() => setModal({ invoice: inv })}
                      onDelete={() => handleDelete(inv.id)}
                      onStatusChange={(s) => handleStatusChange(inv.id, s)}
                    />
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Detail panel */}
        {selectedInv &&
          (() => {
            const S = STATUS_CFG[selectedInv.status]
            return (
              <div className="flex flex-col gap-[18px] rounded-[18px] border border-border bg-card p-[26px]">
                <div className="flex items-start justify-between">
                  <div>
                    <div
                      className={`mb-1 text-[11px] text-muted-foreground ${MONO_FONT}`}
                    >
                      {selectedInv.id}
                    </div>
                    <div
                      className={`font-extrabold text-foreground text-lg tracking-[-0.03em]`}
                    >
                      {selectedInv.client}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="cursor-pointer border-none bg-transparent p-1 text-muted-foreground"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={16} />
                  </button>
                </div>

                <div className="rounded-[14px] bg-muted p-[18px]">
                  <div
                    className={`mb-1.5 text-[10px] text-muted-foreground ${MONO_FONT}`}
                  >
                    INVOICE TOTAL
                  </div>
                  <div
                    className={`font-black text-4xl text-foreground tracking-tighter`}
                  >
                    {fmt(selectedInv.amount)}
                  </div>
                  <div
                    className={`mt-2.5 inline-flex items-center gap-1.5 rounded-[99px] px-[10px] py-1 ${S.toneBg}`}
                  >
                    <HugeiconsIcon
                      icon={S.icon}
                      size={11}
                      className={S.toneText}
                    />
                    <span
                      className={`font-semibold text-[11px] ${S.toneText} ${MONO_FONT}`}
                    >
                      {S.label}
                    </span>
                  </div>
                </div>

                {[
                  { label: "Description", value: selectedInv.desc || "—" },
                  { label: "Issued", value: selectedInv.issued },
                  { label: "Due Date", value: selectedInv.due },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="border-border border-b pb-[14px]"
                  >
                    <div
                      className={`mb-1 text-[10px] text-muted-foreground ${MONO_FONT}`}
                    >
                      {row.label.toUpperCase()}
                    </div>
                    <div className={`text-[13px] text-muted-foreground`}>
                      {row.value}
                    </div>
                  </div>
                ))}

                {/* Status quick-change */}
                <div>
                  <div
                    className={`mb-2.5 text-[10px] text-muted-foreground tracking-[0.06em] ${MONO_FONT}`}
                  >
                    MARK AS
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {[...INVOICE_STATUS_OPTIONS].reverse().map((s) => {
                      const C = STATUS_CFG[s]
                      const active = selectedInv.status === s
                      return (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(selectedInv.id, s)}
                          className={`flex cursor-pointer items-center gap-2.5 rounded-[10px] border px-3 py-[9px] text-left transition-all duration-150 ${
                            active
                              ? `${C.toneBorder} ${C.toneBg}`
                              : "border-transparent bg-transparent hover:bg-muted"
                          }`}
                        >
                          <HugeiconsIcon
                            icon={C.icon}
                            size={13}
                            className={
                              active ? C.toneText : "text-muted-foreground"
                            }
                          />
                          <span
                            className={`text-xs capitalize ${active ? `${C.toneText} font-bold` : "font-normal text-muted-foreground"}`}
                          >
                            {s}
                          </span>
                          {active && (
                            <div
                              className={`ml-auto h-[5px] w-[5px] rounded-full ${C.toneText.replace("text", "bg")}`}
                            />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setModal({ invoice: selectedInv })}
                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-[11px] border-none bg-primary p-[11px] font-bold text-[13px] text-primary-foreground`}
                  >
                    <HugeiconsIcon icon={Edit02Icon} size={13} /> Edit Invoice
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border border-border bg-card p-2.5 text-muted-foreground text-xs`}
                    >
                      <HugeiconsIcon icon={Download01Icon} size={12} /> Download
                    </button>
                    <button
                      onClick={() => {
                        setCopied(true)
                        setTimeout(() => setCopied(false), 1500)
                      }}
                      className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border border-border bg-card p-2.5 text-xs ${copied ? "text-[#16a34a]" : "text-muted-foreground"}`}
                    >
                      {copied ? (
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} />
                      ) : (
                        <HugeiconsIcon icon={Copy01Icon} size={12} />
                      )}
                      {copied ? "Copied!" : "Copy link"}
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      handleDelete(selectedInv.id)
                    }}
                    className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border border-[rgba(232,64,42,0.2)] bg-[rgba(232,64,42,0.05)] p-2.5 text-[#E8402A] text-xs`}
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={12} /> Delete
                    invoice
                  </button>
                </div>
              </div>
            )
          })()}
      </div>
    </div>
  )
}
