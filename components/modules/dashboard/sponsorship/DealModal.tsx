"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { DealPriority, SponsorshipStage } from "@/enums/sponsorship";
import type { DealFormState } from "@/types/sponsorship";
import {
  CATEGORIES,
  Deal,
  ModalState,
  Priority,
  PRIORITY_ACTIVE_CLASS,
  PRIORITY_DOT_CLASS,
  Stage,
  STAGES,
  STAGE_ACTIVE_CLASS,
  STAGE_CFG,
} from "./shared";

export function DealModal({
  state,
  onSave,
  onClose,
}: {
  state: ModalState;
  onSave: (d: Deal) => void;
  onClose: () => void;
}) {
  const ex = state.deal;
  const [form, setForm] = useState<DealFormState>({
    brand: ex?.brand ?? "",
    logo: ex?.logo ?? "",
    category: ex?.category ?? "Beauty",
    value: ex?.value ?? 0,
    stage: ex?.stage ?? state.defaultStage ?? SponsorshipStage.LEAD,
    contact: ex?.contact ?? "",
    email: ex?.email ?? "",
    deadline: ex?.deadline ?? "",
    notes: ex?.notes ?? "",
    priority: ex?.priority ?? DealPriority.MEDIUM,
  });
  const [err, setErr] = useState("");
  const inputClassName = "box-border w-full rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.05)] px-[14px] py-[10px] text-[13px] text-[rgba(255,255,255,0.7)] outline-none";
  const labelClassName = "mb-[6px] block text-xs font-semibold text-[rgba(255,255,255,0.65)]";

  function handleSave() {
    if (!form.brand.trim()) {
      setErr("Brand name is required.");
      return;
    }
    if (form.value <= 0) {
      setErr("Content value must be greater than 0.");
      return;
    }
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
    onSave({
      id: ex?.id ?? 0,
      brand: form.brand.trim(),
      logo: form.logo.trim() || form.brand.slice(0, 2).toUpperCase(),
      logoColor: "#E8402A",
      value: form.value,
      category: form.category,
      stage: form.stage,
      contact: form.contact.trim(),
      email: form.email.trim(),
      deadline: form.deadline || "TBD",
      notes: form.notes.trim(),
      priority: form.priority,
      added: ex?.added ?? today,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-[rgba(0,0,0,0.45)] backdrop-blur-[6px]" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="max-h-[90vh] w-[580px] overflow-y-auto rounded-[22px] bg-[#0D0D0D] shadow-[0_32px_80px_rgba(0,0,0,0.22)]">
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.07)] px-[28px] py-[22px]">
          <div className="text-[17px] font-extrabold tracking-[-0.03em] text-white">{ex ? "Edit Content" : "New Content"}</div>
          <button onClick={onClose} className="cursor-pointer rounded-lg p-[6px] text-[rgba(255,255,255,0.4)]"><X size={18} /></button>
        </div>
        <div className="flex flex-col gap-4 px-[28px] py-[22px]">
          <div className="grid grid-cols-[1fr_80px_1fr] gap-3">
            <div>
              <label className={labelClassName}>Brand name *</label>
              <input value={form.brand} onChange={(e) => { setForm(prev => ({ ...prev, brand: e.target.value })); setErr(""); }} placeholder="e.g. Glow Republic" className={inputClassName} onFocus={(e) => e.currentTarget.style.borderColor = "#E8402A"} onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"} />
            </div>
            <div>
              <label className={labelClassName}>Logo</label>
              <input value={form.logo} onChange={(e) => setForm(prev => ({ ...prev, logo: e.target.value.slice(0, 2).toUpperCase() }))} placeholder="GR" maxLength={2} className={`${inputClassName} text-center font-mono font-bold`} onFocus={(e) => e.currentTarget.style.borderColor = "#E8402A"} onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"} />
            </div>
            <div>
              <label className={labelClassName}>Category</label>
              <select value={form.category} onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))} className={`${inputClassName} cursor-pointer`}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClassName}>Content value (USD) *</label>
              <input type="number" value={form.value || ""} onChange={(e) => { setForm(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 })); setErr(""); }} placeholder="5000" className={inputClassName} onFocus={(e) => e.currentTarget.style.borderColor = "#E8402A"} onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"} />
            </div>
            <div>
              <label className={labelClassName}>Deadline</label>
              <input value={form.deadline} onChange={(e) => setForm(prev => ({ ...prev, deadline: e.target.value }))} placeholder="e.g. Jul 15" className={inputClassName} onFocus={(e) => e.currentTarget.style.borderColor = "#E8402A"} onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClassName}>Contact name</label>
              <input value={form.contact} onChange={(e) => setForm(prev => ({ ...prev, contact: e.target.value }))} placeholder="e.g. Sarah Kim" className={inputClassName} onFocus={(e) => e.currentTarget.style.borderColor = "#E8402A"} onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"} />
            </div>
            <div>
              <label className={labelClassName}>Email</label>
              <input value={form.email} onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))} placeholder="sarah@brand.co" className={inputClassName} onFocus={(e) => e.currentTarget.style.borderColor = "#E8402A"} onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"} />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold text-[rgba(255,255,255,0.65)]">Pipeline stage</label>
            <div className="flex gap-[6px]">
              {STAGES.map((s) => {
                const active = form.stage === s;
                const StageIcon = STAGE_CFG[s].icon;
                return (
                  <button key={s} onClick={() => setForm(prev => ({ ...prev, stage: s }))} className={`flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-[10px] border-[1.5px] px-1 py-2 font-mono text-[9px] ${active ? `font-bold ${STAGE_ACTIVE_CLASS[s]}` : "border-[rgba(255,255,255,0.07)] text-[rgba(255,255,255,0.4)] font-normal"}`}>
                    <StageIcon size={10} /> {s}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold text-[rgba(255,255,255,0.65)]">Priority</label>
            <div className="flex gap-2">
              {[DealPriority.HIGH, DealPriority.MEDIUM, DealPriority.LOW].map((p) => (
                <button key={p} onClick={() => setForm(prev => ({ ...prev, priority: p }))} className={`flex flex-1 cursor-pointer items-center justify-center gap-[6px] rounded-[10px] border-[1.5px] p-[9px] text-xs capitalize ${form.priority === p ? `${PRIORITY_ACTIVE_CLASS[p]} font-bold` : "border-[rgba(255,255,255,0.07)] text-[rgba(255,255,255,0.4)] font-normal"}`}>
                  <div className={`h-[6px] w-[6px] shrink-0 rounded-full ${PRIORITY_DOT_CLASS[p]}`} />
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClassName}>Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))} placeholder="Any context, next steps, or reminders…" rows={3} className={`${inputClassName} resize-y`} onFocus={(e) => e.currentTarget.style.borderColor = "#E8402A"} onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"} />
          </div>
          {err && <div className="rounded-lg bg-[rgba(232,64,42,0.07)] px-3 py-2 font-mono text-[11px] text-[#E8402A]">{err}</div>}
        </div>
        <div className="flex justify-end gap-[10px] px-[28px] pb-6 pt-[14px]">
          <button onClick={onClose} className="cursor-pointer rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-transparent px-5 py-[10px] text-[13px] text-[rgba(255,255,255,0.4)]">Cancel</button>
          <button onClick={handleSave} className="cursor-pointer rounded-[10px] bg-(--cos-primary) px-6 py-[10px] text-[13px] font-bold text-white">{ex ? "Save Changes" : "Add Content"}</button>
        </div>
      </div>
    </div>
  );
}
