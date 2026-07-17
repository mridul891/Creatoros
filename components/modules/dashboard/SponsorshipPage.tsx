"use client";

import { useState } from "react";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  Plus, MagnifyingGlass, CheckCircle, FilmSlate, InstagramLogo, Quotes,
  EnvelopeSimple, Calendar, X, WarningCircle,
  Trash, PencilSimple, Lightning, Target, Trophy, CaretRight,
} from "@phosphor-icons/react/dist/ssr";
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
  [SponsorshipStage.LEAD]: "text-[#717171]",
  [SponsorshipStage.OUTREACH]: "text-[#d97706]",
  [SponsorshipStage.NEGOTIATION]: "text-[#E8402A]",
  [SponsorshipStage.SIGNED]: "text-[#2563eb]",
  [SponsorshipStage.PAID]: "text-[#16a34a]",
};
const STAGE_DOT_CLASS: Record<Stage, string> = {
  [SponsorshipStage.LEAD]: "bg-[#717171]",
  [SponsorshipStage.OUTREACH]: "bg-[#d97706]",
  [SponsorshipStage.NEGOTIATION]: "bg-[#E8402A]",
  [SponsorshipStage.SIGNED]: "bg-[#2563eb]",
  [SponsorshipStage.PAID]: "bg-[#16a34a]",
};
const STAGE_BG22_CLASS: Record<Stage, string> = {
  [SponsorshipStage.LEAD]: "bg-[rgba(113,113,113,0.13)] border-r-[#717171]",
  [SponsorshipStage.OUTREACH]: "bg-[rgba(217,119,6,0.13)] border-r-[#d97706]",
  [SponsorshipStage.NEGOTIATION]: "bg-[rgba(232,64,42,0.13)] border-r-[#E8402A]",
  [SponsorshipStage.SIGNED]: "bg-[rgba(37,99,235,0.13)] border-r-[#2563eb]",
  [SponsorshipStage.PAID]: "bg-[rgba(22,163,74,0.13)] border-r-[#16a34a]",
};
const STAGE_COLUMN_SURFACE_CLASS: Record<Stage, string> = {
  [SponsorshipStage.LEAD]: "border-[rgba(113,113,113,0.16)] bg-[linear-gradient(180deg,rgba(113,113,113,0.06)_0%,rgba(13,13,13,0)_100%)]",
  [SponsorshipStage.OUTREACH]: "border-[rgba(217,119,6,0.16)] bg-[linear-gradient(180deg,rgba(217,119,6,0.06)_0%,rgba(13,13,13,0)_100%)]",
  [SponsorshipStage.NEGOTIATION]: "border-[rgba(232,64,42,0.16)] bg-[linear-gradient(180deg,rgba(232,64,42,0.06)_0%,rgba(13,13,13,0)_100%)]",
  [SponsorshipStage.SIGNED]: "border-[rgba(37,99,235,0.16)] bg-[linear-gradient(180deg,rgba(37,99,235,0.06)_0%,rgba(13,13,13,0)_100%)]",
  [SponsorshipStage.PAID]: "border-[rgba(22,163,74,0.16)] bg-[linear-gradient(180deg,rgba(22,163,74,0.06)_0%,rgba(13,13,13,0)_100%)]",
};
const STAGE_HEADER_GLOW_CLASS: Record<Stage, string> = {
  [SponsorshipStage.LEAD]: "before:bg-[#717171]",
  [SponsorshipStage.OUTREACH]: "before:bg-[#d97706]",
  [SponsorshipStage.NEGOTIATION]: "before:bg-[#E8402A]",
  [SponsorshipStage.SIGNED]: "before:bg-[#2563eb]",
  [SponsorshipStage.PAID]: "before:bg-[#16a34a]",
};
const ACCENT_KPI_CARD_CLASS: Record<string, string> = {
  "#111111": "border-t-[1.5px] border-t-[#111111]/70 shadow-[inset_0_1px_0_var(--muted-foreground)]",
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
  "#111111": "text-foreground",
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
      className={`group relative mb-2 cursor-pointer overflow-hidden rounded-[14px] border-[1.5px] bg-card px-[15px] py-[14px] transition-all duration-150 ${isSelected ? "border-[#E8402A] shadow-[0_0_0_3px_rgba(232,64,42,0.1)]" : "border-border shadow-[0_1px_4px_rgba(0,0,0,0.04)]"}`}
      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = "rgba(232,64,42,0.3)"; }}
      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = "var(--muted-foreground)"; }}>
      <div className="absolute inset-x-0 top-0 h-[2px] opacity-70" style={{ backgroundColor: stageAccent.color }} />
      <div className="mb-[9px] flex items-start justify-between">
        <div className="flex items-center gap-[9px]">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-[9px] font-extrabold ${logoClass}`}>{deal.logo}</div>
          <div>
            <div className="text-xs font-bold leading-[1.2] text-foreground">{deal.brand}</div>
            <div className="font-mono text-[10px] text-muted-foreground">{deal.category}</div>
          </div>
        </div>
        <div className={`mt-[3px] h-[6px] w-[6px] shrink-0 rounded-full ${PRIORITY_DOT_CLASS[deal.priority]}`} />
      </div>
      <div className="mb-2 flex items-center justify-between">
        <div>
          <div className="font-mono text-[8px] tracking-[0.08em] text-muted-foreground">EST. VALUE</div>
          <div className="text-[13px] font-bold tracking-[-0.02em] text-muted-foreground">{fmt(deal.value)}</div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[6px]">
          <span className={`inline-flex items-center gap-[4px] rounded-[99px] border px-[6px] py-[2px] font-mono text-[8px] font-bold ${STAGE_ACTIVE_CLASS[deal.stage]}`}>
            <StageAccentIcon size={8} />
            {deal.stage}
          </span>
          <div className="font-mono text-[9px] text-muted-foreground">
            {deal.deadline === "Done" ? "✓ Done" : `Due ${deal.deadline}`}
          </div>
        </div>
        {nextStage && (
          <button onClick={e => { e.stopPropagation(); onAdvance(); }} className="flex cursor-pointer items-center gap-[3px] rounded-[99px] border border-border bg-card px-[7px] py-[3px] font-mono text-[9px] text-muted-foreground transition-all duration-150"
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#E8402A"; e.currentTarget.style.color = "#E8402A"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--muted-foreground)"; e.currentTarget.style.color = "var(--muted-foreground)"; }}>
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
    <div className="sticky top-7 w-[300px] shrink-0 self-start rounded-[18px] border border-border bg-card p-[22px]">
      <div className="flex justify-between">
        <div className="flex items-center gap-[11px]">
          <div className={`flex h-10 w-10 items-center justify-center rounded-[11px] font-mono text-[11px] font-extrabold ${logoClass}`}>{deal.logo}</div>
          <div>
            <div className="text-[15px] font-extrabold tracking-[-0.03em] text-foreground">{deal.brand}</div>
            <div className="font-mono text-[10px] text-muted-foreground">{deal.category}</div>
          </div>
        </div>
        <button onClick={onClose} className="cursor-pointer p-1 text-muted-foreground"><X size={15} /></button>
      </div>

      <div className="mt-4 rounded-xl bg-muted p-4">
        <div className="mb-1 font-mono text-[9px] tracking-[0.07em] text-muted-foreground">DEAL VALUE</div>
        <div className="text-[30px] font-black tracking-tighter text-foreground">{fmt(deal.value)}</div>
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
        <div className="mb-2 font-mono text-[9px] tracking-[0.07em] text-muted-foreground">MOVE TO STAGE</div>
        <div className="flex flex-col gap-1">
          {STAGES.map(stage => {
            const C = STAGE_CFG[stage]; const active = deal.stage === stage;
            return (
              <button key={stage} onClick={() => onStageChange(deal.id, stage)} className={`flex cursor-pointer items-center gap-[9px] rounded-[9px] px-[11px] py-2 text-left transition-all duration-150 ${active ? `border ${STAGE_ACTIVE_CLASS[stage]}` : "border border-transparent"}`}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "var(--muted-foreground)"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "none"; }}>
                <C.icon size={12} color={active ? C.color : "var(--muted-foreground)"} />
                <span className={`text-[11px] ${active ? `font-bold ${STAGE_TEXT_CLASS[stage]}` : "font-normal text-muted-foreground"}`}>{stage}</span>
                {active && <div className={`ml-auto h-[5px] w-[5px] rounded-full ${STAGE_DOT_CLASS[stage]}`} />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-[14px]">
        <div className="mb-[9px] font-mono text-[9px] tracking-[0.07em] text-muted-foreground">CONTACT</div>
        {deal.contact && <div className="mb-[5px] text-xs font-semibold text-foreground">{deal.contact}</div>}
        {deal.email && <div className="mb-[3px] flex items-center gap-[5px] font-mono text-[10px] text-muted-foreground"><EnvelopeSimple size={10} /> {deal.email}</div>}
        {deal.deadline && <div className="flex items-center gap-[5px] font-mono text-[10px] text-muted-foreground"><Calendar size={10} /> Due {deal.deadline}</div>}
      </div>

      {deal.notes && (
        <div className="mt-4">
          <div className="mb-[6px] font-mono text-[9px] tracking-[0.07em] text-muted-foreground">NOTES</div>
          <div className="rounded-[9px] bg-muted px-3 py-[11px] text-[11px] leading-[1.65] text-muted-foreground">{deal.notes}</div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button onClick={onEdit} className="flex cursor-pointer items-center justify-center gap-[5px] rounded-[9px] bg-primary p-[9px] text-[11px] font-semibold text-primary-foreground">
          <PencilSimple size={11} /> Edit
        </button>
        <button onClick={() => { onDelete(deal.id); onClose(); }} className="flex cursor-pointer items-center justify-center gap-[5px] rounded-[9px] border border-[rgba(232,64,42,0.2)] bg-[rgba(232,64,42,0.05)] p-[9px] text-[11px] text-[#E8402A]">
          <Trash size={11} /> Delete
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
    <div className="rounded-2xl border border-border bg-card px-[22px] py-5">
      <div className="mb-4">
        <div className="mb-[3px] text-[13px] font-bold tracking-[-0.02em] text-foreground">Pipeline Funnel</div>
        <div className="text-[11px] text-muted-foreground">Deal counts by stage</div>
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
                  <div className="h-[10px] w-px bg-muted" />
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
                <div className="h-[22px] flex-1 overflow-hidden rounded-[5px] bg-muted">
                  <div className={`flex h-full items-center rounded-[5px] border-r-2 pl-2 transition-[width] duration-400 ease-in-out ${STAGE_BG22_CLASS[t.stage]} ${barPct <= 5 ? "w-[5%]" : barPct <= 10 ? "w-[10%]" : barPct <= 15 ? "w-[15%]" : barPct <= 20 ? "w-[20%]" : barPct <= 25 ? "w-[25%]" : barPct <= 30 ? "w-[30%]" : barPct <= 35 ? "w-[35%]" : barPct <= 40 ? "w-[40%]" : barPct <= 45 ? "w-[45%]" : barPct <= 50 ? "w-[50%]" : barPct <= 55 ? "w-[55%]" : barPct <= 60 ? "w-[60%]" : barPct <= 65 ? "w-[65%]" : barPct <= 70 ? "w-[70%]" : barPct <= 75 ? "w-[75%]" : barPct <= 80 ? "w-[80%]" : barPct <= 85 ? "w-[85%]" : barPct <= 90 ? "w-[90%]" : barPct <= 95 ? "w-[95%]" : "w-full"}`}>
                    <span className={`whitespace-nowrap font-mono text-[9px] font-bold ${STAGE_TEXT_CLASS[t.stage]}`}>{t.count}</span>
                  </div>
                </div>
                <div className="w-14 shrink-0 text-right font-mono text-[10px] font-bold text-muted-foreground">{fmt(t.value)}</div>
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
  const COLOR_CLASSES = ["bg-secondary", "bg-[#E8402A]", "bg-[#2563eb]", "bg-[#16a34a]", "bg-[#d97706]", "bg-[#7c3aed]"];

  return (
    <div className="rounded-2xl border border-border bg-card px-[22px] py-5">
      <div className="mb-[14px]">
        <div className="mb-[3px] text-[13px] font-bold tracking-[-0.02em] text-foreground">Revenue by Category</div>
        <div className="text-[11px] text-muted-foreground">Total pipeline value distribution</div>
      </div>
      <ResponsiveContainer width="100%" height={130}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -30, bottom: 0 }} barCategoryGap="30%">
          <XAxis dataKey="cat" tick={{ fontSize: 9, fontFamily: "'SF Mono', 'Menlo', monospace", fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
          <Tooltip
            formatter={(value) => [fmt(Number(value ?? 0)), "Value"]}
            contentStyle={{ fontSize: 11, fontFamily: "var(--font-sans)", borderRadius: 8, border: "1px solid var(--muted-foreground)", background: "var(--card)", color: "var(--muted-foreground)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
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
            <span className="font-mono text-[9px] text-muted-foreground">{d.cat} {Math.round(d.val / total * 100)}%</span>
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
    <div className="rounded-2xl border border-border bg-card px-[22px] py-5">
      <div className="mb-[14px] flex items-start justify-between">
        <div>
          <div className="mb-[3px] text-[13px] font-bold tracking-[-0.02em] text-foreground">Monthly Revenue</div>
          <div className="text-[11px] text-muted-foreground">Paid deals YTD</div>
        </div>
        <div className="text-right">
          <div className="text-[18px] font-black tracking-[-0.04em] text-foreground">{fmt(ytd)}</div>
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
          <XAxis dataKey="month" tick={{ fontSize: 9, fontFamily: "'SF Mono', 'Menlo', monospace", fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => v === 0 ? "" : `$${(v/1000).toFixed(0)}k`} />
          <Tooltip
            formatter={(value) => [fmt(Number(value ?? 0)), "Revenue"]}
            contentStyle={{ fontSize: 11, fontFamily: "var(--font-sans)", borderRadius: 8, border: "1px solid var(--muted-foreground)", background: "var(--card)", color: "var(--muted-foreground)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
          />
          <Area type="monotone" dataKey="revenue" stroke="#E8402A" strokeWidth={2} fill="url(#revGrad)" dot={{ fill: "#E8402A", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: "#E8402A" }} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="mt-[10px] flex gap-4 border-t border-border pt-[10px]">
        <div>
          <div className="mb-[2px] font-mono text-[9px] text-muted-foreground">AVG DEAL</div>
          <div className="text-[13px] font-extrabold tracking-[-0.03em] text-foreground">{fmt(avgDeal)}</div>
        </div>
        <div>
          <div className="mb-[2px] font-mono text-[9px] text-muted-foreground">BEST MONTH</div>
          <div className="text-[13px] font-extrabold tracking-[-0.03em] text-foreground">April</div>
        </div>
        <div>
          <div className="mb-[2px] font-mono text-[9px] text-muted-foreground">WIN RATE</div>
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
    { icon: WarningCircle, color: "#E8402A", bgClass: "bg-[rgba(232,64,42,0.08)]", label: "Action needed", value: `${overdue} high-priority deals`, sub: "still in active stages" },
    { icon: Target, color: "#d97706", bgClass: "bg-[rgba(217,119,6,0.08)]", label: "Negotiation at risk", value: fmt(negotiationVal), sub: "pending closure this month" },
    { icon: Trophy, color: "#16a34a", bgClass: "bg-[rgba(22,163,74,0.08)]", label: "Top category", value: topCat, sub: "highest pipeline value" },
    { icon: Lightning, color: "#2563eb", bgClass: "bg-[rgba(37,99,235,0.08)]", label: "Close rate", value: `${signedPct}%`, sub: "leads converted to signed/paid" },
  ];

  return (
    <div className="mb-6 grid grid-cols-4 gap-[10px]">
      {insights.map(ins => (
        <div key={ins.label} className="flex items-start gap-3 rounded-[13px] border border-border bg-card px-4 py-[14px]">
          <div className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] ${ins.bgClass}`}>
            <ins.icon size={15} color={ins.color} />
          </div>
          <div className="min-w-0">
            <div className="mb-[3px] font-mono text-[9px] tracking-[0.04em] text-muted-foreground">{ins.label.toUpperCase()}</div>
            <div className="mb-[3px] text-[14px] font-extrabold leading-[1.1] tracking-[-0.03em] text-foreground">{ins.value}</div>
            <div className="text-[10px] leading-[1.3] text-muted-foreground">{ins.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── SponsorshipPage ────────────────────────────────────────────── */
export function SponsorshipPage({ mode = SponsorshipMode.KANBAN }: { mode?: SponsorshipMode }) {
  const [deals, setDeals] = useState(SEED_DEALS);
  const [viewMode, setViewMode] = useState<SponsorshipMode>(mode);
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
  const totalPaid = deals.filter(d => d.stage === SponsorshipStage.PAID).reduce((s, d) => s + d.value, 0);
  const totalSigned = deals.filter(d => d.stage === SponsorshipStage.SIGNED).reduce((s, d) => s + d.value, 0);
  const activeDeals = deals.filter(d => d.stage !== SponsorshipStage.PAID).length;
  const plannedCount = deals.filter(d => d.stage === SponsorshipStage.LEAD).length;
  const shootingCount = deals.filter(d => d.stage === SponsorshipStage.OUTREACH).length;

  function handleSave(deal: Deal) {
    if (deal.id) setDeals(prev => prev.map(d => d.id === deal.id ? deal : d));
    else setDeals(prev => [...prev, { ...deal, id: nextId++ }]);
  }
  function handleDelete(id: number) { setDeals(prev => prev.filter(d => d.id !== id)); setSelectedId(null); }
  function handleStageChange(id: number, stage: Stage) { setDeals(prev => prev.map(d => d.id === id ? { ...d, stage } : d)); }
  function handlePriorityChange(id: number, priority: DealPriority) {
    setDeals(prev => prev.map(d => d.id === id ? { ...d, priority } : d));
  }
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
          <h1 className="mb-1 text-2xl font-extrabold tracking-[-0.04em] text-foreground">Content Pipeline</h1>
          <div className="text-[13px] text-muted-foreground">Track each campaign from planning to published content</div>
          <div className="mt-3 inline-flex rounded-[10px] border border-border bg-card p-1">
            {[
              { id: SponsorshipMode.TABLE, label: "Table" },
              { id: SponsorshipMode.KANBAN, label: "Kanban" },
            ].map((v) => {
              const active = viewMode === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setViewMode(v.id)}
                  className={`cursor-pointer rounded-[8px] px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                    active ? "bg-[rgba(232,64,42,0.15)] text-[#E8402A]" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {v.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-[10px]">
          <div className="relative">
            <MagnifyingGlass size={13} color="var(--muted-foreground)" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={uiState.search} onChange={e => setUiState(prev => ({ ...prev, search: e.target.value }))} placeholder="Search content…" className="h-[38px] w-[170px] rounded-[10px] border border-border bg-card pl-[34px] pr-[14px] text-xs text-muted-foreground outline-none"
              onFocus={e => e.currentTarget.style.borderColor = "#E8402A"}
              onBlur={e => e.currentTarget.style.borderColor = "var(--muted-foreground)"} />
          </div>
          <button onClick={() => setModal({})} className="flex cursor-pointer items-center gap-2 rounded-[11px] bg-primary px-5 py-[10px] text-[13px] font-bold text-primary-foreground">
            <Plus size={15} /> Add Content
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="mb-5 grid grid-cols-4 gap-[14px]">
        {[
          { label: "Content Items", value: String(deals.length), sub: `${plannedCount} planned`, icon: FilmSlate, accent: "#111111", trend: `Est. value ${fmt(totalPipeline)}` },
          { label: "In Production", value: String(activeDeals), sub: `${shootingCount} shooting now`, icon: InstagramLogo, accent: "#E8402A", trend: `${deals.filter(d => d.priority === DealPriority.HIGH && d.stage !== SponsorshipStage.PAID).length} high priority` },
          { label: "Pending Review", value: String(deals.filter(d => d.stage === SponsorshipStage.SIGNED).length), sub: "awaiting approval", icon: Quotes, accent: "#2563eb", trend: `Est. value ${fmt(totalSigned)}` },
          { label: "Published", value: String(deals.filter(d => d.stage === SponsorshipStage.PAID).length), sub: "completed", icon: CheckCircle, accent: "#16a34a", trend: `Est. value ${fmt(totalPaid)}` },
        ].map(k => (
          <div key={k.label} className={`rounded-2xl border border-border bg-card px-5 py-[18px] ${ACCENT_KPI_CARD_CLASS[k.accent] ?? ""}`}>
            <div className="mb-[10px] flex items-start justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">{k.label}</span>
              <div className={`flex h-[30px] w-[30px] items-center justify-center rounded-lg ${ACCENT_SOFT_BG_CLASS[k.accent] ?? "bg-muted"}`}>
                <k.icon size={14} color={k.accent} />
              </div>
            </div>
            <div className="mb-1 text-[26px] font-black leading-none tracking-[-0.04em] text-foreground">{k.value}</div>
            <div className="mb-[3px] font-mono text-[10px] text-muted-foreground">{k.sub}</div>
            <div className={`font-mono text-[9px] font-semibold ${ACCENT_TEXT_CLASS[k.accent] ?? "text-foreground"}`}>{k.trend}</div>
          </div>
        ))}
      </div>

      {viewMode === SponsorshipMode.Analytics ? (
        /* ── Analytics view ── */
        <div className="flex flex-col gap-4">
          <InsightCards deals={deals} />
          <div className="grid grid-cols-3 gap-[14px]">
            <PipelineFunnel deals={deals} />
            <CategoryBreakdown deals={deals} />
            <RevenueTrend />
          </div>

          {/* Top deals table */}
          <div className="rounded-2xl border border-border bg-card px-[22px] py-5">
            <div className="mb-4 text-[13px] font-bold tracking-[-0.02em] text-foreground">All Deals — Value Ranked</div>
            <div className="flex flex-col">
              <div className="mb-1 grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr] gap-3 border-b border-border pb-[10px]">
                {["Brand", "Value", "Category", "Stage", "Priority"].map(h => (
                  <div key={h} className="font-mono text-[9px] font-bold tracking-[0.07em] text-muted-foreground">{h.toUpperCase()}</div>
                ))}
              </div>
              {[...deals].sort((a, b) => b.value - a.value).map((deal, i) => {
                const S = STAGE_CFG[deal.stage];
                const logoClass = LOGO_ACCENT_CLASS[deal.logoColor] ?? "bg-[#E8402A15] text-[#E8402A]";
                return (
                  <div key={deal.id} onClick={() => { setSelectedId(deal.id); }} className={`grid cursor-pointer grid-cols-[2fr_1fr_1fr_1fr_1.5fr] gap-3 rounded-lg py-[10px] transition-colors duration-100 ${i < deals.length - 1 ? "border-b border-border" : ""}`}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--muted-foreground)"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}>
                    <div className="flex items-center gap-[9px]">
                      <div className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md font-mono text-[8px] font-extrabold ${logoClass}`}>{deal.logo}</div>
                      <span className="text-xs font-semibold text-foreground">{deal.brand}</span>
                    </div>
                    <div className="flex items-center text-xs font-extrabold tracking-[-0.03em] text-foreground">{fmt(deal.value)}</div>
                    <div className="flex items-center font-mono text-[11px] text-muted-foreground">{deal.category}</div>
                    <div className="flex items-center">
                      <div className={`inline-flex items-center gap-1 rounded-[99px] border px-2 py-[3px] ${STAGE_ACTIVE_CLASS[deal.stage]}`}>
                        <S.icon size={9} color={S.color} />
                        <span className="font-mono text-[9px] font-bold">{deal.stage}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-[6px]">
                      <div className={`h-[6px] w-[6px] rounded-full ${PRIORITY_DOT_CLASS[deal.priority]}`} />
                      <span className="font-mono text-[11px] capitalize text-muted-foreground">{deal.priority}</span>
                      <CaretRight size={12} color="var(--muted-foreground)" className="ml-auto" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : viewMode === SponsorshipMode.TABLE ? (
        /* ── Table view ── */
        <div className="rounded-2xl border border-border bg-card px-5 py-4">
          <div className="mb-3 text-[12px] font-semibold text-muted-foreground">
            {filtered.length} items
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[980px]">
              <div className="grid grid-cols-[2.2fr_1.2fr_1.1fr_1.1fr_1.4fr_1fr] gap-3 border-b border-border px-2 pb-2">
                {["Content", "Stage", "Priority", "Deadline", "Contact", "Est. value"].map((h) => (
                  <div key={h} className="font-mono text-[9px] tracking-[0.08em] text-muted-foreground">
                    {h.toUpperCase()}
                  </div>
                ))}
              </div>
              {[...filtered]
                .sort((a, b) => STAGES.indexOf(a.stage) - STAGES.indexOf(b.stage))
                .map((deal, i) => {
                  return (
                    <div
                      key={deal.id}
                      onClick={() => {
                        setSelectedId(deal.id);
                        setModal({ deal });
                      }}
                      className={`grid cursor-pointer grid-cols-[2.2fr_1.2fr_1.1fr_1.1fr_1.4fr_1fr] gap-3 px-2 py-3 transition-colors ${
                        i < filtered.length - 1 ? "border-b border-border" : ""
                      }`}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--muted-foreground)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "none";
                      }}
                    >
                      <div className="min-w-0">
                        <div className="truncate text-[12px] font-bold text-foreground">{deal.brand}</div>
                        <div className="truncate font-mono text-[10px] text-muted-foreground">{deal.category}</div>
                      </div>
                      <div className="flex items-center">
                        <select
                          value={deal.stage}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleStageChange(deal.id, e.target.value as Stage)}
                          className="w-full cursor-pointer rounded-[8px] border border-border bg-muted px-2 py-1.5 font-mono text-[10px] text-muted-foreground outline-none"
                        >
                          {STAGES.map((stage) => (
                            <option key={stage} value={stage}>
                              {stage}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center">
                        <select
                          value={deal.priority}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handlePriorityChange(deal.id, e.target.value as DealPriority)}
                          className="w-full cursor-pointer rounded-[8px] border border-border bg-muted px-2 py-1.5 font-mono text-[10px] capitalize text-muted-foreground outline-none"
                        >
                          {[DealPriority.HIGH, DealPriority.MEDIUM, DealPriority.LOW].map((priority) => (
                            <option key={priority} value={priority}>
                              {priority}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center font-mono text-[10px] text-muted-foreground">
                        {deal.deadline === "Done" ? "Done" : deal.deadline}
                      </div>
                      <div className="flex items-center font-mono text-[10px] text-muted-foreground">
                        {deal.contact || "—"}
                      </div>
                      <div className="flex items-center text-[11px] font-semibold text-muted-foreground">{fmt(deal.value)}</div>
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
                    <div className={`relative mb-[9px] rounded-xl border border-border bg-card px-[13px] py-[10px] before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:rounded-t-xl ${STAGE_HEADER_GLOW_CLASS[stage]}`}>
                      <div className="mb-[3px] flex items-center justify-between">
                        <div className="flex items-center gap-[5px]">
                          <CIcon size={11} color={C.color} />
                          <span className={`font-mono text-[10px] font-bold ${STAGE_TEXT_CLASS[stage]}`}>{stage.toUpperCase()}</span>
                        </div>
                        <div className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border font-mono text-[9px] font-extrabold ${STAGE_ACTIVE_CLASS[stage]}`}>{stageDeals.length}</div>
                      </div>
                      <div className="font-mono text-[9px] text-muted-foreground">Est. value {fmt(stageValue)}</div>
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
                    <button onClick={() => setModal({ defaultStage: stage })} className="flex w-full cursor-pointer items-center justify-center gap-[5px] rounded-[10px] border border-dashed border-border bg-transparent p-2 text-[10px] text-muted-foreground transition-colors duration-150"
                      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(232,64,42,0.4)"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--muted-foreground)"}>
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
