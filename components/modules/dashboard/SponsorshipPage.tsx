"use client";

import { useState } from "react";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  Plus, Search, DollarSign, TrendingUp, CheckCircle,
  Mail, Calendar, X, Handshake, AlertCircle,
  Trash2, Edit3, Zap, Target, Award, ChevronRight,
} from "lucide-react";
import {
  DealPriority,
  SponsorshipMode,
  SponsorshipStage,
} from "@/enums/sponsorship";
import { DealModal } from "./sponsorship/DealModal";
import {
  Deal,
  fmt,
  ModalState,
  Stage,
  STAGES,
  STAGE_ACTIVE_CLASS,
  PRIORITY_ACTIVE_CLASS,
  PRIORITY_DOT_CLASS,
  LOGO_ACCENT_CLASS,
  STAGE_CFG,
} from "./sponsorship/shared";

/* ── Seed data ─────────────────────────────────────────────────── */
const SEED_DEALS: Deal[] = [
  { id:  1, brand: "Lumi Beauty",     logo: "LB", logoColor: "#E8402A", value: 7500,  stage: SponsorshipStage.LEAD,        category: "Beauty",     contact: "Sarah Kim",    email: "sarah@lumibauty.co",   deadline: "Jul 15", notes: "Inbound inquiry via Instagram DM",  priority: DealPriority.HIGH,   added: "Jun 5",  month: 6 },
  { id:  2, brand: "Arc Wellness",    logo: "AW", logoColor: "#111111", value: 4200,  stage: SponsorshipStage.LEAD,        category: "Health",     contact: "Tom Richards", email: "tom@arcwellness.com",   deadline: "Jul 20", notes: "Referral from Meridian deal",       priority: DealPriority.MEDIUM, added: "Jun 7",  month: 6 },
  { id:  3, brand: "Skyline Apparel", logo: "SA", logoColor: "#E8402A", value: 6000,  stage: SponsorshipStage.OUTREACH,    category: "Fashion",    contact: "Maya Patel",   email: "maya@skylineapp.com",   deadline: "Jun 30", notes: "Sent pitch deck + rate card",       priority: DealPriority.HIGH,   added: "May 28", month: 5 },
  { id:  4, brand: "Rover Tech",      logo: "RT", logoColor: "#111111", value: 9800,  stage: SponsorshipStage.OUTREACH,    category: "Technology", contact: "Jake Osei",    email: "jake@rovertech.io",     deadline: "Jul 10", notes: "Follow-up call booked Jun 12",      priority: DealPriority.HIGH,   added: "Jun 1",  month: 6 },
  { id:  5, brand: "Drift Coffee",    logo: "DC", logoColor: "#E8402A", value: 2500,  stage: SponsorshipStage.NEGOTIATION, category: "Food & Bev", contact: "Ava Liu",      email: "ava@driftcoffee.co",    deadline: "Jun 25", notes: "Counter-offer received — $2,200",   priority: DealPriority.MEDIUM, added: "May 20", month: 5 },
  { id:  6, brand: "Nomad Finance",   logo: "NF", logoColor: "#111111", value: 11500, stage: SponsorshipStage.NEGOTIATION, category: "Finance",    contact: "Carlos Reyes", email: "carlos@nomadfi.com",    deadline: "Jun 28", notes: "Contract review with legal",        priority: DealPriority.HIGH,   added: "May 15", month: 5 },
  { id:  7, brand: "Glow Republic",   logo: "GR", logoColor: "#E8402A", value: 8500,  stage: SponsorshipStage.SIGNED,      category: "Beauty",     contact: "Nisha Sharma", email: "nisha@glowrepublic.co", deadline: "Jul 5",  notes: "Brief received — 3 Reels due Jul",  priority: DealPriority.HIGH,   added: "May 10", month: 5 },
  { id:  8, brand: "Pulse Tech",      logo: "PT", logoColor: "#111111", value: 5400,  stage: SponsorshipStage.SIGNED,      category: "Technology", contact: "Daniel Park",  email: "dan@pulsetech.com",     deadline: "Jun 24", notes: "Integration video + 2 stories",     priority: DealPriority.MEDIUM, added: "Jun 2",  month: 6 },
  { id:  9, brand: "Meridian Health", logo: "MH", logoColor: "#E8402A", value: 9200,  stage: SponsorshipStage.PAID,        category: "Health",     contact: "Priya Anand",  email: "priya@meridian.co",     deadline: "Done",   notes: "Campaign completed — invoice paid", priority: DealPriority.LOW,    added: "Apr 20", month: 4 },
  { id: 10, brand: "Vibe Studio",     logo: "VS", logoColor: "#111111", value: 3100,  stage: SponsorshipStage.PAID,        category: "Lifestyle",  contact: "Owen Clarke",  email: "owen@vibestudio.io",    deadline: "Done",   notes: "4 deliverables approved",           priority: DealPriority.LOW,    added: "Apr 8",  month: 4 },
  { id: 11, brand: "Neon Labs",       logo: "NL", logoColor: "#E8402A", value: 6800,  stage: SponsorshipStage.PAID,        category: "Technology", contact: "Wei Zhang",    email: "wei@neonlabs.io",       deadline: "Done",   notes: "YouTube integration done",          priority: DealPriority.LOW,    added: "Mar 12", month: 3 },
  { id: 12, brand: "Fresh Press",     logo: "FP", logoColor: "#111111", value: 2800,  stage: SponsorshipStage.PAID,        category: "Food & Bev", contact: "Lila Moreau",  email: "lila@freshpress.co",    deadline: "Done",   notes: "2 story posts delivered",           priority: DealPriority.LOW,    added: "Feb 5",  month: 2 },
];
const STAGE_TEXT_CLASS: Record<Stage, string> = {
  Lead: "text-[#717171]",
  Outreach: "text-[#d97706]",
  Negotiation: "text-[#E8402A]",
  Signed: "text-[#2563eb]",
  Paid: "text-[#16a34a]",
};
const STAGE_DOT_CLASS: Record<Stage, string> = {
  Lead: "bg-[#717171]",
  Outreach: "bg-[#d97706]",
  Negotiation: "bg-[#E8402A]",
  Signed: "bg-[#2563eb]",
  Paid: "bg-[#16a34a]",
};
const STAGE_BG22_CLASS: Record<Stage, string> = {
  Lead: "bg-[rgba(113,113,113,0.13)] border-r-[#717171]",
  Outreach: "bg-[rgba(217,119,6,0.13)] border-r-[#d97706]",
  Negotiation: "bg-[rgba(232,64,42,0.13)] border-r-[#E8402A]",
  Signed: "bg-[rgba(37,99,235,0.13)] border-r-[#2563eb]",
  Paid: "bg-[rgba(22,163,74,0.13)] border-r-[#16a34a]",
};
const STAGE_COLUMN_SURFACE_CLASS: Record<Stage, string> = {
  Lead: "border-[rgba(113,113,113,0.16)] bg-[linear-gradient(180deg,rgba(113,113,113,0.06)_0%,rgba(13,13,13,0)_100%)]",
  Outreach: "border-[rgba(217,119,6,0.16)] bg-[linear-gradient(180deg,rgba(217,119,6,0.06)_0%,rgba(13,13,13,0)_100%)]",
  Negotiation: "border-[rgba(232,64,42,0.16)] bg-[linear-gradient(180deg,rgba(232,64,42,0.06)_0%,rgba(13,13,13,0)_100%)]",
  Signed: "border-[rgba(37,99,235,0.16)] bg-[linear-gradient(180deg,rgba(37,99,235,0.06)_0%,rgba(13,13,13,0)_100%)]",
  Paid: "border-[rgba(22,163,74,0.16)] bg-[linear-gradient(180deg,rgba(22,163,74,0.06)_0%,rgba(13,13,13,0)_100%)]",
};
const STAGE_HEADER_GLOW_CLASS: Record<Stage, string> = {
  Lead: "before:bg-[#717171]",
  Outreach: "before:bg-[#d97706]",
  Negotiation: "before:bg-[#E8402A]",
  Signed: "before:bg-[#2563eb]",
  Paid: "before:bg-[#16a34a]",
};
const ACCENT_KPI_CARD_CLASS: Record<string, string> = {
  "#111111": "border-t-[1.5px] border-t-[#111111]/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]",
  "#E8402A": "border-t-[1.5px] border-t-[#E8402A]/70 shadow-[0_10px_28px_rgba(232,64,42,0.08)]",
  "#2563eb": "border-t-[1.5px] border-t-[#2563eb]/70 shadow-[0_10px_28px_rgba(37,99,235,0.08)]",
  "#16a34a": "border-t-[1.5px] border-t-[#16a34a]/70 shadow-[0_10px_28px_rgba(22,163,74,0.08)]",
};
const ACCENT_SOFT_BG_CLASS: Record<string, string> = {
  "#111111": "bg-[#11111112]",
  "#E8402A": "bg-[#E8402A12]",
  "#2563eb": "bg-[#2563eb12]",
  "#16a34a": "bg-[#16a34a12]",
};
const ACCENT_TEXT_CLASS: Record<string, string> = {
  "#111111": "text-[#111111]",
  "#E8402A": "text-[#E8402A]",
  "#2563eb": "text-[#2563eb]",
  "#16a34a": "text-[#16a34a]",
};

const MONTHLY_DATA = [
  { month: "Jan", revenue: 0,    deals: 0 },
  { month: "Feb", revenue: 2800, deals: 1 },
  { month: "Mar", revenue: 6800, deals: 1 },
  { month: "Apr", revenue: 12300,deals: 2 },
  { month: "May", revenue: 8200, deals: 3 },
  { month: "Jun", revenue: 5400, deals: 2 },
];

/* ── Modal ─────────────────────────────────────────────────────── */

/* ── Deal card ──────────────────────────────────────────────────── */
function DealCard({ deal, isSelected, onClick, onAdvance, onDragStart, onDragEnd }: {
  deal: Deal;
  isSelected: boolean;
  onClick: () => void;
  onAdvance: () => void;
  onDragStart: (dealId: number) => void;
  onDragEnd: () => void;
}) {
  const nextStage = STAGES[STAGES.indexOf(deal.stage) + 1];
  const logoClass = LOGO_ACCENT_CLASS[deal.logoColor] ?? "bg-[#E8402A15] text-[#E8402A]";
  const stageAccent = STAGE_CFG[deal.stage];
  const StageAccentIcon = stageAccent.icon;
  return (
    <div
      onClick={onClick}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(deal.id));
        onDragStart(deal.id);
      }}
      onDragEnd={onDragEnd}
      className={`group relative mb-2 cursor-pointer overflow-hidden rounded-[14px] border-[1.5px] bg-[#0D0D0D] px-[15px] py-[14px] transition-all duration-150 ${isSelected ? "border-[#E8402A] shadow-[0_0_0_3px_rgba(232,64,42,0.1)]" : "border-[rgba(255,255,255,0.07)] shadow-[0_1px_4px_rgba(0,0,0,0.04)]"}`}
      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = "rgba(232,64,42,0.3)"; }}
      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}>
      <div className="absolute inset-x-0 top-0 h-[2px] opacity-70" style={{ backgroundColor: stageAccent.color }} />
      <div className="mb-[9px] flex items-start justify-between">
        <div className="flex items-center gap-[9px]">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-[9px] font-extrabold ${logoClass}`}>{deal.logo}</div>
          <div>
            <div className="text-xs font-bold leading-[1.2] text-white">{deal.brand}</div>
            <div className="font-mono text-[10px] text-[rgba(255,255,255,0.4)]">{deal.category}</div>
          </div>
        </div>
        <div className={`mt-[3px] h-[6px] w-[6px] shrink-0 rounded-full ${PRIORITY_DOT_CLASS[deal.priority]}`} />
      </div>
      <div className="mb-2 text-[17px] font-black tracking-[-0.04em] text-white">{fmt(deal.value)}</div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[6px]">
          <span className={`inline-flex items-center gap-[4px] rounded-[99px] border px-[6px] py-[2px] font-mono text-[8px] font-bold ${STAGE_ACTIVE_CLASS[deal.stage]}`}>
            <StageAccentIcon size={8} />
            {deal.stage}
          </span>
          <div className="font-mono text-[9px] text-[rgba(255,255,255,0.4)]">
            {deal.deadline === "Done" ? "✓ Done" : `Due ${deal.deadline}`}
          </div>
        </div>
        {nextStage && (
          <button onClick={e => { e.stopPropagation(); onAdvance(); }} className="flex cursor-pointer items-center gap-[3px] rounded-[99px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] px-[7px] py-[3px] font-mono text-[9px] text-[rgba(255,255,255,0.4)] transition-all duration-150"
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#E8402A"; e.currentTarget.style.color = "#E8402A"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}>
            → {nextStage}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Deal panel ─────────────────────────────────────────────────── */
function DealPanel({ deal, onClose, onEdit, onDelete, onStageChange }: {
  deal: Deal; onClose: () => void; onEdit: () => void;
  onDelete: (id: number) => void; onStageChange: (id: number, s: Stage) => void;
}) {
  const S = STAGE_CFG[deal.stage];
  const logoClass = LOGO_ACCENT_CLASS[deal.logoColor] ?? "bg-[#E8402A15] text-[#E8402A]";
  return (
    <div className="sticky top-7 w-[300px] shrink-0 self-start rounded-[18px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] p-[22px]">
      <div className="flex justify-between">
        <div className="flex items-center gap-[11px]">
          <div className={`flex h-10 w-10 items-center justify-center rounded-[11px] font-mono text-[11px] font-extrabold ${logoClass}`}>{deal.logo}</div>
          <div>
            <div className="text-[15px] font-extrabold tracking-[-0.03em] text-white">{deal.brand}</div>
            <div className="font-mono text-[10px] text-[rgba(255,255,255,0.4)]">{deal.category}</div>
          </div>
        </div>
        <button onClick={onClose} className="cursor-pointer p-1 text-[rgba(255,255,255,0.4)]"><X size={15} /></button>
      </div>

      <div className="mt-4 rounded-xl bg-[rgba(255,255,255,0.05)] p-4">
        <div className="mb-1 font-mono text-[9px] tracking-[0.07em] text-[rgba(255,255,255,0.4)]">DEAL VALUE</div>
        <div className="text-[30px] font-black tracking-tighter text-white">{fmt(deal.value)}</div>
        <div className="mt-[9px] flex gap-[6px]">
          <div className={`inline-flex items-center gap-[5px] rounded-[99px] border px-[9px] py-1 ${STAGE_ACTIVE_CLASS[deal.stage]}`}>
            <S.icon size={9} color={S.color} />
            <span className="font-mono text-[9px] font-bold">{deal.stage}</span>
          </div>
          <div className={`inline-flex items-center gap-[5px] rounded-[99px] px-[9px] py-1 ${PRIORITY_ACTIVE_CLASS[deal.priority].replace("border-[rgba(232,64,42,0.25)]","").replace("border-[rgba(217,119,6,0.25)]","").replace("border-[rgba(113,113,113,0.25)]","")}`}>
            <div className={`h-[5px] w-[5px] rounded-full ${PRIORITY_DOT_CLASS[deal.priority]}`} />
            <span className="font-mono text-[9px] font-semibold capitalize">{deal.priority}</span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 font-mono text-[9px] tracking-[0.07em] text-[rgba(255,255,255,0.4)]">MOVE TO STAGE</div>
        <div className="flex flex-col gap-1">
          {STAGES.map(stage => {
            const C = STAGE_CFG[stage]; const active = deal.stage === stage;
            return (
              <button key={stage} onClick={() => onStageChange(deal.id, stage)} className={`flex cursor-pointer items-center gap-[9px] rounded-[9px] px-[11px] py-2 text-left transition-all duration-150 ${active ? `border ${STAGE_ACTIVE_CLASS[stage]}` : "border border-transparent"}`}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "none"; }}>
                <C.icon size={12} color={active ? C.color : "rgba(255,255,255,0.4)"} />
                <span className={`text-[11px] ${active ? `font-bold ${STAGE_TEXT_CLASS[stage]}` : "font-normal text-[rgba(255,255,255,0.4)]"}`}>{stage}</span>
                {active && <div className={`ml-auto h-[5px] w-[5px] rounded-full ${STAGE_DOT_CLASS[stage]}`} />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 border-t border-[rgba(255,255,255,0.07)] pt-[14px]">
        <div className="mb-[9px] font-mono text-[9px] tracking-[0.07em] text-[rgba(255,255,255,0.4)]">CONTACT</div>
        {deal.contact && <div className="mb-[5px] text-xs font-semibold text-white">{deal.contact}</div>}
        {deal.email && <div className="mb-[3px] flex items-center gap-[5px] font-mono text-[10px] text-[rgba(255,255,255,0.4)]"><Mail size={10} /> {deal.email}</div>}
        {deal.deadline && <div className="flex items-center gap-[5px] font-mono text-[10px] text-[rgba(255,255,255,0.4)]"><Calendar size={10} /> Due {deal.deadline}</div>}
      </div>

      {deal.notes && (
        <div className="mt-4">
          <div className="mb-[6px] font-mono text-[9px] tracking-[0.07em] text-[rgba(255,255,255,0.4)]">NOTES</div>
          <div className="rounded-[9px] bg-[rgba(255,255,255,0.05)] px-3 py-[11px] text-[11px] leading-[1.65] text-[rgba(255,255,255,0.65)]">{deal.notes}</div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button onClick={onEdit} className="flex cursor-pointer items-center justify-center gap-[5px] rounded-[9px] bg-(--cos-primary) p-[9px] text-[11px] font-semibold text-white">
          <Edit3 size={11} /> Edit
        </button>
        <button onClick={() => { onDelete(deal.id); onClose(); }} className="flex cursor-pointer items-center justify-center gap-[5px] rounded-[9px] border border-[rgba(232,64,42,0.2)] bg-[rgba(232,64,42,0.05)] p-[9px] text-[11px] text-[#E8402A]">
          <Trash2 size={11} /> Delete
        </button>
      </div>
    </div>
  );
}

/* ── Pipeline Funnel ────────────────────────────────────────────── */
function PipelineFunnel({ deals }: { deals: Deal[] }) {
  const totals = STAGES.map((s) => ({
    stage: s,
    count: deals.filter(d => d.stage === s).length,
    value: deals.filter(d => d.stage === s).reduce((acc, d) => acc + d.value, 0),
    cfg: STAGE_CFG[s],
  }));

  const maxCount = Math.max(...totals.map(t => t.count), 1);

  return (
    <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] px-[22px] py-5">
      <div className="mb-4">
        <div className="mb-[3px] text-[13px] font-bold tracking-[-0.02em] text-white">Pipeline Funnel</div>
        <div className="text-[11px] text-[rgba(255,255,255,0.4)]">Deal counts by stage</div>
      </div>
      <div className="flex flex-col gap-[6px]">
        {totals.map((t, i) => {
          const pct = t.count / maxCount;
          const barPct = Math.max(Math.round(pct * 100), 4);
          const prevCount = i > 0 ? totals[i - 1].count : t.count;
          const convRate = i === 0 ? null : prevCount > 0 ? Math.round((t.count / prevCount) * 100) : 0;
          return (
            <div key={t.stage}>
              {convRate !== null && (
                <div className="mb-[3px] flex items-center gap-[6px] pl-2">
                  <div className="h-[10px] w-px bg-[rgba(255,255,255,0.07)]" />
                  <span className={`font-mono text-[9px] font-bold ${convRate >= 70 ? "text-[#16a34a]" : convRate >= 40 ? "text-[#d97706]" : "text-[#E8402A]"}`}>
                    {convRate}% conversion
                  </span>
                </div>
              )}
              <div className="flex items-center gap-[10px]">
                <div className="flex w-[90px] shrink-0 items-center gap-[6px]">
                  <t.cfg.icon size={11} color={t.cfg.color} />
                  <span className={`font-mono text-[10px] font-semibold ${STAGE_TEXT_CLASS[t.stage]}`}>{t.stage}</span>
                </div>
                <div className="h-[22px] flex-1 overflow-hidden rounded-[5px] bg-[rgba(255,255,255,0.05)]">
                  <div className={`flex h-full items-center rounded-[5px] border-r-2 pl-2 transition-[width] duration-400 ease-in-out ${STAGE_BG22_CLASS[t.stage]} ${barPct <= 5 ? "w-[5%]" : barPct <= 10 ? "w-[10%]" : barPct <= 15 ? "w-[15%]" : barPct <= 20 ? "w-[20%]" : barPct <= 25 ? "w-[25%]" : barPct <= 30 ? "w-[30%]" : barPct <= 35 ? "w-[35%]" : barPct <= 40 ? "w-[40%]" : barPct <= 45 ? "w-[45%]" : barPct <= 50 ? "w-[50%]" : barPct <= 55 ? "w-[55%]" : barPct <= 60 ? "w-[60%]" : barPct <= 65 ? "w-[65%]" : barPct <= 70 ? "w-[70%]" : barPct <= 75 ? "w-[75%]" : barPct <= 80 ? "w-[80%]" : barPct <= 85 ? "w-[85%]" : barPct <= 90 ? "w-[90%]" : barPct <= 95 ? "w-[95%]" : "w-full"}`}>
                    <span className={`whitespace-nowrap font-mono text-[9px] font-bold ${STAGE_TEXT_CLASS[t.stage]}`}>{t.count}</span>
                  </div>
                </div>
                <div className="w-14 shrink-0 text-right font-mono text-[10px] font-bold text-[rgba(255,255,255,0.4)]">{fmt(t.value)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Category Breakdown ─────────────────────────────────────────── */
function CategoryBreakdown({ deals }: { deals: Deal[] }) {
  const catMap: Record<string, number> = {};
  deals.forEach(d => { catMap[d.category] = (catMap[d.category] ?? 0) + d.value; });
  const data = Object.entries(catMap)
    .map(([cat, val]) => ({ cat: cat === "Food & Bev" ? "Food" : cat, val }))
    .sort((a, b) => b.val - a.val)
    .slice(0, 6);
  const total = data.reduce((s, d) => s + d.val, 0);

  const COLORS = ["#111111", "#E8402A", "#2563eb", "#16a34a", "#d97706", "#7c3aed"];
  const COLOR_CLASSES = ["bg-[#111111]", "bg-[#E8402A]", "bg-[#2563eb]", "bg-[#16a34a]", "bg-[#d97706]", "bg-[#7c3aed]"];

  return (
    <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] px-[22px] py-5">
      <div className="mb-[14px]">
        <div className="mb-[3px] text-[13px] font-bold tracking-[-0.02em] text-white">Revenue by Category</div>
        <div className="text-[11px] text-[rgba(255,255,255,0.4)]">Total pipeline value distribution</div>
      </div>
      <ResponsiveContainer width="100%" height={130}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -30, bottom: 0 }} barCategoryGap="30%">
          <XAxis dataKey="cat" tick={{ fontSize: 9, fontFamily: "'SF Mono', 'Menlo', monospace", fill: "rgba(255,255,255,0.35)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
          <Tooltip
            formatter={(value) => [fmt(Number(value ?? 0)), "Value"]}
            contentStyle={{ fontSize: 11, fontFamily: "'SF Pro Display', -apple-system, sans-serif", borderRadius: 8, border: "1px solid rgba(255,255,255,0.07)", background: "#0D0D0D", color: "rgba(255,255,255,0.65)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
            cursor={{ fill: "rgba(232,64,42,0.04)" }}
          />
          <Bar dataKey="val" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-[10px] flex flex-wrap gap-y-[6px] gap-x-3">
        {data.map((d, i) => (
          <div key={d.cat} className="flex items-center gap-[5px]">
            <div className={`h-[7px] w-[7px] shrink-0 rounded-[2px] ${COLOR_CLASSES[i % COLOR_CLASSES.length]}`} />
            <span className="font-mono text-[9px] text-[rgba(255,255,255,0.4)]">{d.cat} {Math.round(d.val / total * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Monthly Revenue Trend ──────────────────────────────────────── */
function RevenueTrend() {
  const ytd = MONTHLY_DATA.reduce((s, d) => s + d.revenue, 0);
  const avgDeal = Math.round(ytd / MONTHLY_DATA.filter(d => d.deals > 0).reduce((s, d) => s + d.deals, 0));

  return (
    <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] px-[22px] py-5">
      <div className="mb-[14px] flex items-start justify-between">
        <div>
          <div className="mb-[3px] text-[13px] font-bold tracking-[-0.02em] text-white">Monthly Revenue</div>
          <div className="text-[11px] text-[rgba(255,255,255,0.4)]">Paid deals YTD</div>
        </div>
        <div className="text-right">
          <div className="text-[18px] font-black tracking-[-0.04em] text-white">{fmt(ytd)}</div>
          <div className="font-mono text-[9px] font-bold text-[#16a34a]">YTD 2026</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={110}>
        <AreaChart data={MONTHLY_DATA} margin={{ top: 4, right: 0, left: -30, bottom: 0 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E8402A" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#E8402A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" tick={{ fontSize: 9, fontFamily: "'SF Mono', 'Menlo', monospace", fill: "rgba(255,255,255,0.35)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => v === 0 ? "" : `$${(v/1000).toFixed(0)}k`} />
          <Tooltip
            formatter={(value) => [fmt(Number(value ?? 0)), "Revenue"]}
            contentStyle={{ fontSize: 11, fontFamily: "'SF Pro Display', -apple-system, sans-serif", borderRadius: 8, border: "1px solid rgba(255,255,255,0.07)", background: "#0D0D0D", color: "rgba(255,255,255,0.65)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
          />
          <Area type="monotone" dataKey="revenue" stroke="#E8402A" strokeWidth={2} fill="url(#revGrad)" dot={{ fill: "#E8402A", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: "#E8402A" }} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="mt-[10px] flex gap-4 border-t border-[rgba(255,255,255,0.07)] pt-[10px]">
        <div>
          <div className="mb-[2px] font-mono text-[9px] text-[rgba(255,255,255,0.4)]">AVG DEAL</div>
          <div className="text-[13px] font-extrabold tracking-[-0.03em] text-white">{fmt(avgDeal)}</div>
        </div>
        <div>
          <div className="mb-[2px] font-mono text-[9px] text-[rgba(255,255,255,0.4)]">BEST MONTH</div>
          <div className="text-[13px] font-extrabold tracking-[-0.03em] text-white">April</div>
        </div>
        <div>
          <div className="mb-[2px] font-mono text-[9px] text-[rgba(255,255,255,0.4)]">WIN RATE</div>
          <div className="text-[13px] font-extrabold tracking-[-0.03em] text-[#16a34a]">62%</div>
        </div>
      </div>
    </div>
  );
}

/* ── Insight Cards ──────────────────────────────────────────────── */
function InsightCards({ deals }: { deals: Deal[] }) {
  const overdue = deals.filter(d => d.priority === DealPriority.HIGH && d.stage !== SponsorshipStage.PAID).length;
  const negotiationVal = deals.filter(d => d.stage === SponsorshipStage.NEGOTIATION).reduce((s, d) => s + d.value, 0);
  const topCat = (() => {
    const m: Record<string, number> = {};
    deals.forEach(d => { m[d.category] = (m[d.category] ?? 0) + d.value; });
    return Object.entries(m).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
  })();
  const signedPct = deals.length > 0 ? Math.round(deals.filter(d => d.stage === SponsorshipStage.SIGNED || d.stage === SponsorshipStage.PAID).length / deals.length * 100) : 0;

  const insights = [
    { icon: AlertCircle, color: "#E8402A", bgClass: "bg-[rgba(232,64,42,0.08)]", label: "Action needed", value: `${overdue} high-priority deals`, sub: "still in active stages" },
    { icon: Target, color: "#d97706", bgClass: "bg-[rgba(217,119,6,0.08)]", label: "Negotiation at risk", value: fmt(negotiationVal), sub: "pending closure this month" },
    { icon: Award, color: "#16a34a", bgClass: "bg-[rgba(22,163,74,0.08)]", label: "Top category", value: topCat, sub: "highest pipeline value" },
    { icon: Zap, color: "#2563eb", bgClass: "bg-[rgba(37,99,235,0.08)]", label: "Close rate", value: `${signedPct}%`, sub: "leads converted to signed/paid" },
  ];

  return (
    <div className="mb-6 grid grid-cols-4 gap-[10px]">
      {insights.map(ins => (
        <div key={ins.label} className="flex items-start gap-3 rounded-[13px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] px-4 py-[14px]">
          <div className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] ${ins.bgClass}`}>
            <ins.icon size={15} color={ins.color} />
          </div>
          <div className="min-w-0">
            <div className="mb-[3px] font-mono text-[9px] tracking-[0.04em] text-[rgba(255,255,255,0.4)]">{ins.label.toUpperCase()}</div>
            <div className="mb-[3px] text-[14px] font-extrabold leading-[1.1] tracking-[-0.03em] text-white">{ins.value}</div>
            <div className="text-[10px] leading-[1.3] text-[rgba(255,255,255,0.4)]">{ins.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── SponsorshipPage ────────────────────────────────────────────── */
export function SponsorshipPage({ mode = SponsorshipMode.KANBAN }: { mode?: SponsorshipMode }) {
  const [deals, setDeals] = useState(SEED_DEALS);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [uiState, setUiState] = useState({
    search: "",
    dragDealId: null as number | null,
    dragOverStage: null as Stage | null,
  });
  let nextId = Math.max(...deals.map(d => d.id)) + 1;

  const selectedDeal = deals.find(d => d.id === selectedId) ?? null;
  const filtered = uiState.search ? deals.filter(d => d.brand.toLowerCase().includes(uiState.search.toLowerCase()) || d.category.toLowerCase().includes(uiState.search.toLowerCase())) : deals;

  const totalPipeline = deals.reduce((s, d) => s + d.value, 0);
  const totalPaid     = deals.filter(d => d.stage === SponsorshipStage.PAID).reduce((s, d) => s + d.value, 0);
  const totalSigned   = deals.filter(d => d.stage === SponsorshipStage.SIGNED).reduce((s, d) => s + d.value, 0);
  const activeDeals   = deals.filter(d => d.stage !== SponsorshipStage.PAID).length;

  function handleSave(deal: Deal) {
    if (deal.id) setDeals(prev => prev.map(d => d.id === deal.id ? deal : d));
    else setDeals(prev => [...prev, { ...deal, id: nextId++ }]);
  }
  function handleDelete(id: number) { setDeals(prev => prev.filter(d => d.id !== id)); setSelectedId(null); }
  function handleStageChange(id: number, stage: Stage) { setDeals(prev => prev.map(d => d.id === id ? { ...d, stage } : d)); }
  function handleAdvance(deal: Deal) {
    const idx = STAGES.indexOf(deal.stage);
    if (idx < STAGES.length - 1) handleStageChange(deal.id, STAGES[idx + 1]);
  }
  function handleDropToStage(stage: Stage) {
    if (uiState.dragDealId == null) return;
    const draggedDeal = deals.find(d => d.id === uiState.dragDealId);
    if (!draggedDeal || draggedDeal.stage === stage) {
      setUiState(prev => ({ ...prev, dragDealId: null, dragOverStage: null }));
      return;
    }
    handleStageChange(uiState.dragDealId, stage);
    setUiState(prev => ({ ...prev, dragDealId: null, dragOverStage: null }));
  }

  return (
    <div className="w-full max-w-[1300px] px-9 py-7">
      {modal && <DealModal state={modal} onSave={handleSave} onClose={() => setModal(null)} />}

      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-extrabold tracking-[-0.04em] text-white">Sponsorships</h1>
          <div className="text-[13px] text-[rgba(255,255,255,0.4)]">Track brand deals from first contact to final payment</div>
        </div>
        <div className="flex items-center gap-[10px]">
          <div className="relative">
            <Search size={13} color="rgba(255,255,255,0.4)" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={uiState.search} onChange={e => setUiState(prev => ({ ...prev, search: e.target.value }))} placeholder="Search deals…" className="h-[38px] w-[170px] rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] pl-[34px] pr-[14px] text-xs text-[rgba(255,255,255,0.7)] outline-none"
              onFocus={e => e.currentTarget.style.borderColor = "#E8402A"}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"} />
          </div>
          <button onClick={() => setModal({})} className="flex cursor-pointer items-center gap-2 rounded-[11px] bg-(--cos-primary) px-5 py-[10px] text-[13px] font-bold text-white">
            <Plus size={15} /> Add Deal
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="mb-5 grid grid-cols-4 gap-[14px]">
        {[
          { label: "Total Pipeline", value: fmt(totalPipeline), sub: `${deals.length} total deals`, icon: DollarSign, accent: "#111111", trend: "+18% vs last quarter" },
          { label: "Active Deals", value: String(activeDeals), sub: "in progress", icon: TrendingUp, accent: "#E8402A", trend: `${deals.filter(d => d.priority === DealPriority.HIGH && d.stage !== SponsorshipStage.PAID).length} high priority` },
          { label: "Signed Value", value: fmt(totalSigned), sub: "awaiting deliverables", icon: Handshake, accent: "#2563eb", trend: `${deals.filter(d => d.stage === SponsorshipStage.SIGNED).length} contracts` },
          { label: "Paid This Year", value: fmt(totalPaid), sub: "collected", icon: CheckCircle, accent: "#16a34a", trend: `${deals.filter(d => d.stage === SponsorshipStage.PAID).length} completed` },
        ].map(k => (
          <div key={k.label} className={`rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] px-5 py-[18px] ${ACCENT_KPI_CARD_CLASS[k.accent] ?? ""}`}>
            <div className="mb-[10px] flex items-start justify-between">
              <span className="text-[11px] font-medium text-[rgba(255,255,255,0.4)]">{k.label}</span>
              <div className={`flex h-[30px] w-[30px] items-center justify-center rounded-lg ${ACCENT_SOFT_BG_CLASS[k.accent] ?? "bg-[rgba(255,255,255,0.08)]"}`}>
                <k.icon size={14} color={k.accent} />
              </div>
            </div>
            <div className="mb-1 text-[26px] font-black leading-none tracking-[-0.04em] text-white">{k.value}</div>
            <div className="mb-[3px] font-mono text-[10px] text-[rgba(255,255,255,0.4)]">{k.sub}</div>
            <div className={`font-mono text-[9px] font-semibold ${ACCENT_TEXT_CLASS[k.accent] ?? "text-white"}`}>{k.trend}</div>
          </div>
        ))}
      </div>

      {mode === SponsorshipMode.ANALYTICS ? (
        /* ── Analytics view ── */
        <div className="flex flex-col gap-4">
          <InsightCards deals={deals} />
          <div className="grid grid-cols-3 gap-[14px]">
            <PipelineFunnel deals={deals} />
            <CategoryBreakdown deals={deals} />
            <RevenueTrend />
          </div>

          {/* Top deals table */}
          <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] px-[22px] py-5">
            <div className="mb-4 text-[13px] font-bold tracking-[-0.02em] text-white">All Deals — Value Ranked</div>
            <div className="flex flex-col">
              <div className="mb-1 grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr] gap-3 border-b border-[rgba(255,255,255,0.07)] pb-[10px]">
                {["Brand", "Value", "Category", "Stage", "Priority"].map(h => (
                  <div key={h} className="font-mono text-[9px] font-bold tracking-[0.07em] text-[rgba(255,255,255,0.4)]">{h.toUpperCase()}</div>
                ))}
              </div>
              {[...deals].sort((a, b) => b.value - a.value).map((deal, i) => {
                const S = STAGE_CFG[deal.stage];
                const logoClass = LOGO_ACCENT_CLASS[deal.logoColor] ?? "bg-[#E8402A15] text-[#E8402A]";
                return (
                  <div key={deal.id} onClick={() => { setSelectedId(deal.id); }} className={`grid cursor-pointer grid-cols-[2fr_1fr_1fr_1fr_1.5fr] gap-3 rounded-lg py-[10px] transition-colors duration-100 ${i < deals.length - 1 ? "border-b border-[rgba(255,255,255,0.07)]" : ""}`}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}>
                    <div className="flex items-center gap-[9px]">
                      <div className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md font-mono text-[8px] font-extrabold ${logoClass}`}>{deal.logo}</div>
                      <span className="text-xs font-semibold text-white">{deal.brand}</span>
                    </div>
                    <div className="flex items-center text-xs font-extrabold tracking-[-0.03em] text-white">{fmt(deal.value)}</div>
                    <div className="flex items-center font-mono text-[11px] text-[rgba(255,255,255,0.4)]">{deal.category}</div>
                    <div className="flex items-center">
                      <div className={`inline-flex items-center gap-1 rounded-[99px] border px-2 py-[3px] ${STAGE_ACTIVE_CLASS[deal.stage]}`}>
                        <S.icon size={9} color={S.color} />
                        <span className="font-mono text-[9px] font-bold">{deal.stage}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-[6px]">
                      <div className={`h-[6px] w-[6px] rounded-full ${PRIORITY_DOT_CLASS[deal.priority]}`} />
                      <span className="font-mono text-[11px] capitalize text-[rgba(255,255,255,0.4)]">{deal.priority}</span>
                      <ChevronRight size={12} color="rgba(255,255,255,0.4)" className="ml-auto" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* ── Kanban view ── */
        <div className="flex items-start gap-4">
          <div className="flex-1 overflow-x-auto">
            <div className="grid grid-cols-[repeat(5,minmax(185px,1fr))] gap-[10px]">
              {STAGES.map(stage => {
                const C = STAGE_CFG[stage];
                const CIcon = C.icon;
                const stageDeals = filtered.filter(d => d.stage === stage);
                const stageValue = stageDeals.reduce((s, d) => s + d.value, 0);

                return (
                  <div
                    key={stage}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (uiState.dragDealId != null) {
                        e.dataTransfer.dropEffect = "move";
                        setUiState(prev => ({ ...prev, dragOverStage: stage }));
                      }
                    }}
                    onDragLeave={() => {
                      if (uiState.dragOverStage === stage) setUiState(prev => ({ ...prev, dragOverStage: null }));
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleDropToStage(stage);
                    }}
                    className={`rounded-[14px] border px-[6px] pb-[7px] pt-[6px] transition-colors duration-150 ${STAGE_COLUMN_SURFACE_CLASS[stage]} ${uiState.dragOverStage === stage ? "ring-1 ring-[#E8402A]/50" : ""}`}
                  >
                    <div className={`relative mb-[9px] rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] px-[13px] py-[10px] before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:rounded-t-xl ${STAGE_HEADER_GLOW_CLASS[stage]}`}>
                      <div className="mb-[3px] flex items-center justify-between">
                        <div className="flex items-center gap-[5px]">
                          <CIcon size={11} color={C.color} />
                          <span className={`font-mono text-[10px] font-bold ${STAGE_TEXT_CLASS[stage]}`}>{stage.toUpperCase()}</span>
                        </div>
                        <div className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border font-mono text-[9px] font-extrabold ${STAGE_ACTIVE_CLASS[stage]}`}>{stageDeals.length}</div>
                      </div>
                      <div className="text-[13px] font-extrabold tracking-[-0.03em] text-white">{fmt(stageValue)}</div>
                    </div>
                    {stageDeals.map(deal => (
                      <div key={deal.id}>
                        <DealCard deal={deal} isSelected={selectedId === deal.id}
                          onClick={() => setSelectedId(selectedId === deal.id ? null : deal.id)}
                          onAdvance={() => handleAdvance(deal)}
                          onDragStart={(dealId) => setUiState(prev => ({ ...prev, dragDealId: dealId }))}
                          onDragEnd={() => { setUiState(prev => ({ ...prev, dragDealId: null, dragOverStage: null })); }}
                        />
                      </div>
                    ))}
                    <button onClick={() => setModal({ defaultStage: stage })} className="flex w-full cursor-pointer items-center justify-center gap-[5px] rounded-[10px] border border-dashed border-[rgba(255,255,255,0.07)] bg-transparent p-2 text-[10px] text-[rgba(255,255,255,0.4)] transition-colors duration-150"
                      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(232,64,42,0.4)"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}>
                      <Plus size={10} /> Add
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {selectedDeal && (
            <DealPanel deal={selectedDeal} onClose={() => setSelectedId(null)}
              onEdit={() => { setModal({ deal: selectedDeal }); }}
              onDelete={handleDelete} onStageChange={handleStageChange} />
          )}
        </div>
      )}
    </div>
  );
}
