"use client";

import { useState } from "react";
import {
  Plus, Search, Download, Send, MoreHorizontal,
  CheckCircle, Clock, AlertTriangle, FileText, DollarSign,
  TrendingUp, X, Copy, Trash2, Edit3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { InvoiceStatus, InvoiceTab } from "@/enums/invoice";
import type {
  Invoice,
  InvoiceFiltersState,
  InvoiceFormState,
  InvoiceModalState,
} from "@/types/invoice";

/* ── Types & data ──────────────────────────────────────────── */
const SEED: Invoice[] = [
  { id: "INV-2024", client: "Glow Republic",    logo: "GR", color: "#E8402A", amount: 8500,  issued: "Jun 1, 2026",  due: "Jun 15, 2026", status: InvoiceStatus.PAID,    desc: "Brand partnership — June campaign" },
  { id: "INV-2023", client: "Nomad Gear Co.",   logo: "NG", color: "#111111", amount: 4200,  issued: "May 25, 2026", due: "Jun 8, 2026",  status: InvoiceStatus.PENDING, desc: "Instagram Reel × 3 posts" },
  { id: "INV-2022", client: "ByteBrews",        logo: "BB", color: "#E8402A", amount: 6750,  issued: "May 18, 2026", due: "Jun 1, 2026",  status: InvoiceStatus.OVERDUE, desc: "YouTube integration + story set" },
  { id: "INV-2021", client: "Vibe Studio",      logo: "VS", color: "#111111", amount: 3100,  issued: "May 10, 2026", due: "May 24, 2026", status: InvoiceStatus.PAID,    desc: "Lifestyle shoot × 4 deliverables" },
  { id: "INV-2020", client: "Meridian Health",  logo: "MH", color: "#E8402A", amount: 9200,  issued: "Apr 28, 2026", due: "May 12, 2026", status: InvoiceStatus.PAID,    desc: "Spring wellness campaign" },
  { id: "INV-2019", client: "TrekLight",        logo: "TL", color: "#111111", amount: 2800,  issued: "Apr 15, 2026", due: "Apr 29, 2026", status: InvoiceStatus.DRAFT,   desc: "Adventure series — 2 Reels" },
  { id: "INV-2018", client: "Pulse Tech",       logo: "PT", color: "#E8402A", amount: 5400,  issued: "Apr 5, 2026",  due: "Apr 19, 2026", status: InvoiceStatus.PAID,    desc: "Product launch campaign" },
];

const STATUS_CFG: Record<InvoiceStatus, {
  label: string;
  icon: LucideIcon;
  toneText: string;
  toneBg: string;
  toneBorder: string;
}> = {
  [InvoiceStatus.PAID]:    { label: "Paid", icon: CheckCircle, toneText: "text-[#16a34a]", toneBg: "bg-[rgba(22,163,74,0.08)]", toneBorder: "border-[rgba(22,163,74,0.2)]" },
  [InvoiceStatus.PENDING]: { label: "Pending", icon: Clock, toneText: "text-[#d97706]", toneBg: "bg-[rgba(217,119,6,0.08)]", toneBorder: "border-[rgba(217,119,6,0.2)]" },
  [InvoiceStatus.OVERDUE]: { label: "Overdue", icon: AlertTriangle, toneText: "text-[#E8402A]", toneBg: "bg-[rgba(232,64,42,0.08)]", toneBorder: "border-[rgba(232,64,42,0.2)]" },
  [InvoiceStatus.DRAFT]:   { label: "Draft", icon: FileText, toneText: "text-[#717171]", toneBg: "bg-[rgba(113,113,113,0.08)]", toneBorder: "border-[rgba(113,113,113,0.2)]" },
};

const TABS: InvoiceTab[] = [
  InvoiceTab.ALL,
  InvoiceTab.PAID,
  InvoiceTab.PENDING,
  InvoiceTab.OVERDUE,
  InvoiceTab.DRAFT,
];
const INVOICE_STATUS_OPTIONS: InvoiceStatus[] = [
  InvoiceStatus.DRAFT,
  InvoiceStatus.PENDING,
  InvoiceStatus.OVERDUE,
  InvoiceStatus.PAID,
];
const INVOICE_TAB_TO_STATUS: Partial<Record<InvoiceTab, InvoiceStatus>> = {
  [InvoiceTab.PAID]: InvoiceStatus.PAID,
  [InvoiceTab.PENDING]: InvoiceStatus.PENDING,
  [InvoiceTab.OVERDUE]: InvoiceStatus.OVERDUE,
  [InvoiceTab.DRAFT]: InvoiceStatus.DRAFT,
};
function fmt(n: number) { return `$${n.toLocaleString()}`; }
function nextId(invoices: Invoice[]) {
  const nums = invoices.map(i => parseInt(i.id.replace("INV-", ""))).filter(Boolean);
  return `INV-${Math.max(...nums, 2024) + 1}`;
}

const PRO_FONT = "font-['SF_Pro_Display',_-apple-system,_sans-serif]";
const MONO_FONT = "font-mono";
const LABEL_CLASS = `mb-[6px] block text-xs font-semibold text-[rgba(255,255,255,0.65)] ${PRO_FONT}`;
const INPUT_BASE_CLASS = `box-border w-full rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.05)] px-[14px] py-[10px] text-[13px] text-[rgba(255,255,255,0.7)] outline-none transition-colors duration-150 focus:border-[#E8402A] ${PRO_FONT}`;
const ICON_ACCENT: Record<string, string> = {
  "#111111": "text-[#111111] bg-[#11111112]",
  "#d97706": "text-[#d97706] bg-[#d9770612]",
  "#E8402A": "text-[#E8402A] bg-[#E8402A12]",
  "#16a34a": "text-[#16a34a] bg-[#16a34a12]",
};
const LOGO_TONE: Record<string, string> = {
  "#E8402A": "bg-[#E8402A18] text-[#E8402A]",
  "#111111": "bg-[#11111118] text-[#111111]",
};

/* ── Invoice modal (create / edit) ─────────────────────────── */
function InvoiceModal({ state, onSave, onClose }: {
  state: InvoiceModalState; onSave: (inv: Invoice) => void; onClose: () => void;
}) {
  const ex = state.invoice;
  const [form, setForm] = useState<InvoiceFormState>({
    client: ex?.client ?? "",
    logo: ex?.logo ?? "",
    desc: ex?.desc ?? "",
    amount: ex?.amount ?? 0,
    due: ex?.due ?? "",
    status: ex?.status ?? InvoiceStatus.DRAFT,
  });
  const [err, setErr] = useState("");

  function handleSave() {
    if (!form.client.trim()) { setErr("Client name is required."); return; }
    if (form.amount <= 0) { setErr("Amount must be greater than 0."); return; }
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    onSave({
      id: ex?.id ?? "",
      client: form.client.trim(),
      logo: form.logo.trim() || form.client.slice(0, 2).toUpperCase(),
      color: "#E8402A",
      amount: form.amount,
      desc: form.desc.trim(),
      issued: ex?.issued ?? today,
      due: form.due || "TBD",
      status: form.status,
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-200 flex items-center justify-center bg-[rgba(0,0,0,0.45)] backdrop-blur-[6px]"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="max-h-[90vh] w-[540px] overflow-y-auto rounded-[22px] bg-[#0D0D0D] shadow-[0_32px_80px_rgba(0,0,0,0.22)]">
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.07)] px-7 py-[22px]">
          <div>
            <div className={`text-[17px] font-extrabold tracking-[-0.03em] text-white ${PRO_FONT}`}>
              {ex ? "Edit Invoice" : "New Invoice"}
            </div>
            <div className={`mt-0.5 text-[11px] text-[rgba(255,255,255,0.4)] ${MONO_FONT}`}>{ex?.id ?? "Auto-assigned on save"}</div>
          </div>
          <button onClick={onClose} className="cursor-pointer rounded-lg p-1.5 text-[rgba(255,255,255,0.4)]"><X size={18} /></button>
        </div>

        <div className="flex flex-col gap-4 px-7 py-6">
          <div className="grid grid-cols-[1fr_80px] gap-3">
            <div>
              <label className={LABEL_CLASS}>Client / Brand *</label>
              <input
                value={form.client}
                onChange={e => { setForm(prev => ({ ...prev, client: e.target.value })); setErr(""); }}
                placeholder="e.g. Glow Republic"
                className={INPUT_BASE_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Logo abbr.</label>
              <input
                value={form.logo}
                onChange={e => setForm(prev => ({ ...prev, logo: e.target.value.slice(0, 2).toUpperCase() }))}
                placeholder="GR"
                maxLength={2}
                className={`${INPUT_BASE_CLASS} text-center font-bold tracking-widest ${MONO_FONT}`}
              />
            </div>
          </div>
          <div>
            <label className={LABEL_CLASS}>Description</label>
            <input value={form.desc} onChange={e => setForm(prev => ({ ...prev, desc: e.target.value }))} placeholder="e.g. Instagram campaign × 3 posts" className={INPUT_BASE_CLASS} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLASS}>Amount (USD) *</label>
              <input type="number" value={form.amount || ""} onChange={e => { setForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 })); setErr(""); }} placeholder="5000" className={INPUT_BASE_CLASS} />
            </div>
            <div>
              <label className={LABEL_CLASS}>Due date</label>
              <input value={form.due} onChange={e => setForm(prev => ({ ...prev, due: e.target.value }))} placeholder="e.g. Jun 30, 2026" className={INPUT_BASE_CLASS} />
            </div>
          </div>
          <div>
            <label className={`${LABEL_CLASS} mb-2`}>Status</label>
            <div className="flex gap-2">
              {INVOICE_STATUS_OPTIONS.map(s => {
                const C = STATUS_CFG[s];
                return (
                  <button
                    key={s}
                    onClick={() => setForm(prev => ({ ...prev, status: s }))}
                    className={`flex flex-1 cursor-pointer items-center justify-center gap-[5px] rounded-[9px] border-[1.5px] px-1 py-2 text-[10px] capitalize transition-all duration-150 ${MONO_FONT} ${
                      form.status === s
                        ? `${C.toneBg} ${C.toneText} ${C.toneBorder} font-bold`
                        : "border-[rgba(255,255,255,0.07)] text-[rgba(255,255,255,0.4)] font-normal"
                    }`}
                  >
                    <C.icon size={10} /> {s}
                  </button>
                );
              })}
            </div>
          </div>
          {err && <div className={`rounded-lg bg-[rgba(232,64,42,0.07)] px-3 py-2 text-[11px] text-[#E8402A] ${MONO_FONT}`}>{err}</div>}
        </div>

        <div className="flex justify-end gap-2.5 px-7 pb-6 pt-[14px]">
          <button onClick={onClose} className={`cursor-pointer rounded-[10px] border border-[rgba(255,255,255,0.07)] px-5 py-2.5 text-[13px] text-[rgba(255,255,255,0.4)] ${PRO_FONT}`}>Cancel</button>
          <button onClick={handleSave} className={`flex cursor-pointer items-center gap-2 rounded-[10px] bg-(--cos-primary) px-[22px] py-2.5 text-[13px] font-bold text-white ${PRO_FONT}`}>
            <Send size={13} /> {ex ? "Save Changes" : "Create Invoice"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Overflow menu ─────────────────────────────────────────── */
function RowMenu({ onEdit, onDelete, onStatusChange }: {
  onEdit: () => void; onDelete: () => void;
  onStatusChange: (s: InvoiceStatus) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        className="flex cursor-pointer rounded-[7px] p-1.5 text-[rgba(255,255,255,0.4)] transition-colors duration-150 hover:bg-[rgba(255,255,255,0.05)]"
      >
        <MoreHorizontal size={15} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full z-50 min-w-[180px] overflow-hidden rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
          onMouseLeave={() => setOpen(false)}
        >
          {[
            { label: "Edit invoice", icon: Edit3, action: onEdit, colorClass: "text-[rgba(255,255,255,0.65)]" },
            { label: "Mark as Paid", icon: CheckCircle, action: () => onStatusChange(InvoiceStatus.PAID), colorClass: "text-[#16a34a]" },
            { label: "Mark as Pending", icon: Clock, action: () => onStatusChange(InvoiceStatus.PENDING), colorClass: "text-[#d97706]" },
            { label: "Mark as Overdue", icon: AlertTriangle, action: () => onStatusChange(InvoiceStatus.OVERDUE), colorClass: "text-[#E8402A]" },
            { label: "Delete", icon: Trash2, action: onDelete, colorClass: "text-[#E8402A]" },
          ].map(item => (
            <button
              key={item.label}
              onClick={e => { e.stopPropagation(); item.action(); setOpen(false); }}
              className={`flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-[14px] py-2.5 text-left text-xs transition-colors duration-150 hover:bg-[rgba(255,255,255,0.05)] ${PRO_FONT} ${item.colorClass}`}
            >
              <item.icon size={13} /> {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── InvoicesPage ───────────────────────────────────────────── */
export function InvoicesPage() {
  const [invoices, setInvoices] = useState(SEED);
  const [filters, setFilters] = useState<InvoiceFiltersState>({
    tab: InvoiceTab.ALL,
    search: "",
  });
  const [modal, setModal] = useState<InvoiceModalState | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const totalRevenue = invoices.filter(i => i.status === InvoiceStatus.PAID).reduce((s, i) => s + i.amount, 0);
  const totalPending = invoices.filter(i => i.status === InvoiceStatus.PENDING).reduce((s, i) => s + i.amount, 0);
  const totalOverdue = invoices.filter(i => i.status === InvoiceStatus.OVERDUE).reduce((s, i) => s + i.amount, 0);

  const filtered = invoices
    .filter(i => filters.tab === InvoiceTab.ALL || i.status === INVOICE_TAB_TO_STATUS[filters.tab])
    .filter(i => !filters.search || i.client.toLowerCase().includes(filters.search.toLowerCase()) || i.id.toLowerCase().includes(filters.search.toLowerCase()));

  function handleSave(inv: Invoice) {
    if (inv.id) {
      setInvoices(prev => prev.map(i => i.id === inv.id ? inv : i));
    } else {
      const id = nextId(invoices);
      setInvoices(prev => [{ ...inv, id }, ...prev]);
      setSelected(id);
    }
  }

  function handleDelete(id: string) {
    setInvoices(prev => prev.filter(i => i.id !== id));
    if (selected === id) setSelected(null);
  }

  function handleStatusChange(id: string, status: InvoiceStatus) {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  }

  const selectedInv = invoices.find(i => i.id === selected) ?? null;

  return (
    <div className="w-full max-w-[1280px] px-9 py-7">
      {modal && <InvoiceModal state={modal} onSave={handleSave} onClose={() => setModal(null)} />}

      {/* Header */}
      <div className="mb-7 flex items-start justify-between">
        <div>
          <h1 className={`mb-1 text-2xl font-extrabold tracking-[-0.04em] text-white ${PRO_FONT}`}>Invoices</h1>
          <div className={`text-[13px] text-[rgba(255,255,255,0.4)] ${PRO_FONT}`}>Manage and track all your brand deal invoices</div>
        </div>
        <button
          onClick={() => setModal({})}
          className={`flex cursor-pointer items-center gap-2 rounded-[11px] bg-(--cos-primary) px-5 py-2.5 text-[13px] font-bold text-white transition-opacity duration-150 hover:opacity-85 ${PRO_FONT}`}
        >
          <Plus size={15} /> New Invoice
        </button>
      </div>

      {/* KPIs */}
      <div className="mb-7 grid grid-cols-[repeat(4,1fr)] gap-4">
        {[
          { label: "Total Earned",       value: fmt(totalRevenue), sub: `${invoices.filter(i => i.status === InvoiceStatus.PAID).length} paid invoices`,    icon: DollarSign,  accent: "#111111" },
          { label: "Awaiting Payment",   value: fmt(totalPending), sub: `${invoices.filter(i => i.status === InvoiceStatus.PENDING).length} pending`,        icon: Clock,       accent: "#d97706" },
          { label: "Overdue",            value: fmt(totalOverdue), sub: `${invoices.filter(i => i.status === InvoiceStatus.OVERDUE).length} overdue`,        icon: AlertTriangle,accent:"#E8402A" },
          { label: "Total Invoices",     value: String(invoices.length), sub: "all time",                                                        icon: TrendingUp,  accent: "#16a34a" },
        ].map(k => (
          <div key={k.label} className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] px-[22px] py-5">
            <div className="mb-3 flex items-start justify-between">
              <span className={`text-xs font-medium text-[rgba(255,255,255,0.4)] ${PRO_FONT}`}>{k.label}</span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-[9px] ${ICON_ACCENT[k.accent]}`}>
                <k.icon size={15} />
              </div>
            </div>
            <div className={`mb-[5px] text-[28px] font-extrabold leading-none tracking-[-0.04em] text-white ${PRO_FONT}`}>{k.value}</div>
            <div className={`text-[11px] text-[rgba(255,255,255,0.4)] ${MONO_FONT}`}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-[11px] bg-[rgba(255,255,255,0.05)] p-[3px]">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setFilters(prev => ({ ...prev, tab: t }))}
              className={`cursor-pointer rounded-lg border-none px-4 py-1.5 text-xs transition-all duration-150 ${PRO_FONT} ${
                filters.tab === t
                  ? "bg-[#0D0D0D] font-semibold text-white shadow-[0_1px_4px_rgba(0,0,0,0.1)]"
                  : "bg-transparent font-normal text-[rgba(255,255,255,0.4)]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} color="rgba(255,255,255,0.4)" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={filters.search}
              onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Search…"
              className={`h-9 w-[180px] rounded-[9px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] pl-[34px] pr-[14px] text-xs text-[rgba(255,255,255,0.7)] outline-none transition-colors duration-150 focus:border-[#E8402A] ${PRO_FONT}`}
            />
          </div>
          <button className={`flex h-9 cursor-pointer items-center gap-1.5 rounded-[9px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] px-[14px] text-xs text-[rgba(255,255,255,0.4)] ${PRO_FONT}`}>
            <Download size={12} /> Export CSV
          </button>
        </div>
      </div>

      {/* Table + panel */}
      <div className={`grid gap-4 ${selected ? "grid-cols-[1fr_360px]" : "grid-cols-1"}`}>
        <div className="overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D]">
          {/* Head */}
          <div className={`grid grid-cols-[2fr_1.6fr_1fr_1.1fr_140px_60px] border-b border-[rgba(255,255,255,0.07)] px-6 py-3 text-[10px] tracking-wider text-[rgba(255,255,255,0.4)] ${MONO_FONT}`}>
            {["CLIENT", "DESCRIPTION", "AMOUNT", "DUE", "STATUS", ""].map(h => <span key={h}>{h}</span>)}
          </div>

          {filtered.length === 0 ? (
            <div className={`px-6 py-12 text-center text-[13px] text-[rgba(255,255,255,0.4)] ${PRO_FONT}`}>No invoices found.</div>
          ) : filtered.map((inv, i) => {
            const S = STATUS_CFG[inv.status];
            const isSelected = selected === inv.id;
            return (
              <div
                key={inv.id}
                onClick={() => setSelected(isSelected ? null : inv.id)}
                className={`grid grid-cols-[2fr_1.6fr_1fr_1.1fr_140px_60px] items-center px-6 py-[15px] transition-colors duration-150 ${i < filtered.length - 1 ? "border-b border-[rgba(255,255,255,0.07)]" : ""} ${isSelected ? "bg-[rgba(232,64,42,0.03)]" : "bg-transparent hover:bg-[rgba(255,255,255,0.05)]"} cursor-pointer`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-[11px] font-extrabold ${MONO_FONT} ${LOGO_TONE[inv.color] ?? "bg-[rgba(255,255,255,0.08)] text-white"}`}>{inv.logo}</div>
                  <div>
                    <div className={`text-[13px] font-semibold text-white ${PRO_FONT}`}>{inv.client}</div>
                    <div className={`text-[10px] text-[rgba(255,255,255,0.4)] ${MONO_FONT}`}>{inv.id}</div>
                  </div>
                </div>
                <div className={`truncate pr-2 text-xs text-[rgba(255,255,255,0.4)] ${PRO_FONT}`}>{inv.desc}</div>
                <div className={`text-sm font-bold tracking-[-0.02em] text-white ${PRO_FONT}`}>{fmt(inv.amount)}</div>
                <div className={`text-[11px] text-[rgba(255,255,255,0.4)] ${MONO_FONT}`}>{inv.due}</div>
                <div className={`inline-flex w-fit items-center gap-1.5 rounded-[99px] px-[10px] py-1 ${S.toneBg}`}>
                  <S.icon size={11} className={S.toneText} />
                  <span className={`text-[11px] font-semibold ${S.toneText} ${MONO_FONT}`}>{S.label}</span>
                </div>
                <div className="flex justify-end">
                  <RowMenu
                    onEdit={() => setModal({ invoice: inv })}
                    onDelete={() => handleDelete(inv.id)}
                    onStatusChange={s => handleStatusChange(inv.id, s)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail panel */}
        {selectedInv && (() => {
          const S = STATUS_CFG[selectedInv.status];
          return (
            <div className="flex flex-col gap-[18px] rounded-[18px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] p-[26px]">
              <div className="flex items-start justify-between">
                <div>
                  <div className={`mb-1 text-[11px] text-[rgba(255,255,255,0.4)] ${MONO_FONT}`}>{selectedInv.id}</div>
                  <div className={`text-lg font-extrabold tracking-[-0.03em] text-white ${PRO_FONT}`}>{selectedInv.client}</div>
                </div>
                <button onClick={() => setSelected(null)} className="cursor-pointer border-none bg-transparent p-1 text-[rgba(255,255,255,0.4)]"><X size={16} /></button>
              </div>

              <div className="rounded-[14px] bg-[rgba(255,255,255,0.05)] p-[18px]">
                <div className={`mb-1.5 text-[10px] text-[rgba(255,255,255,0.4)] ${MONO_FONT}`}>INVOICE TOTAL</div>
                <div className={`text-4xl font-black tracking-tighter text-white ${PRO_FONT}`}>{fmt(selectedInv.amount)}</div>
                <div className={`mt-2.5 inline-flex items-center gap-1.5 rounded-[99px] px-[10px] py-1 ${S.toneBg}`}>
                  <S.icon size={11} className={S.toneText} />
                  <span className={`text-[11px] font-semibold ${S.toneText} ${MONO_FONT}`}>{S.label}</span>
                </div>
              </div>

              {[{ label: "Description", value: selectedInv.desc || "—" }, { label: "Issued", value: selectedInv.issued }, { label: "Due Date", value: selectedInv.due }].map(row => (
                <div key={row.label} className="border-b border-[rgba(255,255,255,0.07)] pb-[14px]">
                  <div className={`mb-1 text-[10px] text-[rgba(255,255,255,0.4)] ${MONO_FONT}`}>{row.label.toUpperCase()}</div>
                  <div className={`text-[13px] text-[rgba(255,255,255,0.65)] ${PRO_FONT}`}>{row.value}</div>
                </div>
              ))}

              {/* Status quick-change */}
              <div>
                <div className={`mb-2.5 text-[10px] tracking-[0.06em] text-[rgba(255,255,255,0.4)] ${MONO_FONT}`}>MARK AS</div>
                <div className="flex flex-col gap-1.5">
                  {[...INVOICE_STATUS_OPTIONS].reverse().map(s => {
                    const C = STATUS_CFG[s];
                    const active = selectedInv.status === s;
                    return (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(selectedInv.id, s)}
                        className={`flex cursor-pointer items-center gap-2.5 rounded-[10px] border px-3 py-[9px] text-left transition-all duration-150 ${
                          active
                            ? `${C.toneBorder} ${C.toneBg}`
                            : "border-transparent bg-transparent hover:bg-[rgba(255,255,255,0.05)]"
                        }`}
                      >
                        <C.icon size={13} className={active ? C.toneText : "text-[rgba(255,255,255,0.4)]"} />
                        <span className={`text-xs capitalize ${PRO_FONT} ${active ? `${C.toneText} font-bold` : "font-normal text-[rgba(255,255,255,0.4)]"}`}>{s}</span>
                        {active && <div className={`ml-auto h-[5px] w-[5px] rounded-full ${C.toneText.replace("text", "bg")}`} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button onClick={() => setModal({ invoice: selectedInv })} className={`flex cursor-pointer items-center justify-center gap-2 rounded-[11px] border-none bg-(--cos-primary) p-[11px] text-[13px] font-bold text-white ${PRO_FONT}`}>
                  <Edit3 size={13} /> Edit Invoice
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] p-2.5 text-xs text-[rgba(255,255,255,0.4)] ${PRO_FONT}`}>
                    <Download size={12} /> Download
                  </button>
                  <button
                    onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                    className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] p-2.5 text-xs ${PRO_FONT} ${copied ? "text-[#16a34a]" : "text-[rgba(255,255,255,0.4)]"}`}
                  >
                    {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
                    {copied ? "Copied!" : "Copy link"}
                  </button>
                </div>
                <button onClick={() => { handleDelete(selectedInv.id); }} className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border border-[rgba(232,64,42,0.2)] bg-[rgba(232,64,42,0.05)] p-2.5 text-xs text-[#E8402A] ${PRO_FONT}`}>
                  <Trash2 size={12} /> Delete invoice
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
