"use client";

import { useState } from "react";
import {
  Download, Share2, RefreshCw, Copy, Check, Edit3, Save,
  Camera as Instagram, CirclePlay as Youtube, MapPin, Zap, Star, Users, Eye,
  TrendingUp, ExternalLink, ChevronRight, BarChart2,
  Heart, Play, Globe, Mail,
} from "lucide-react";
import { MediaKitTab } from "@/enums/media-kit";
import { SocialPlatform } from "@/enums/post";
import type {
  CreatorProfile,
  MediaKitRate,
  MediaKitUiState,
} from "@/types/media-kit";

/* ── Data ──────────────────────────────────────────────────── */
const DEFAULT_CREATOR: CreatorProfile = {
  name: "Maya Chen",
  handle: "@mayachen",
  title: "Lifestyle · Tech · Wellness · Travel",
  bio: "Full-time content creator helping 890K+ people live better, work smarter, and explore more. Known for authentic storytelling, high-quality production, and genuine brand partnerships that audiences trust.",
  location: "San Francisco, CA",
  website: "mayachen.co",
  email: "partnerships@mayachen.co",
  avatar: "https://images.unsplash.com/photo-1531539134685-27d854339120?w=300&h=300&fit=crop&crop=face",
  cover: "https://images.unsplash.com/photo-1617854818583-09e7f077a156?w=1200&h=400&fit=crop",
};

const PLATFORM_STATS = [
  {
    platform: "Instagram", icon: Instagram, color: "#E8402A",
    handle: "@mayachen",
    followers: "890K", followersRaw: 890000,
    er: "6.4%", avgViews: "180K", avgReach: "142K",
    posts: "1,240", cpm: "$14.20",
    badges: ["Top Lifestyle", "High ER"],
  },
  {
    platform: "YouTube", icon: Youtube, color: "#111111",
    handle: "Maya Chen",
    followers: "215K", followersRaw: 215000,
    er: "4.8%", avgViews: "95K", avgReach: "98K",
    posts: "312", cpm: "$11.80",
    badges: ["Watch Time ↑", "Growing"],
  },
];

const METRICS_SPOTLIGHT = [
  { label: "Combined Reach", value: "1.1M+", icon: Users,     color: "#111111" },
  { label: "Avg Engagement", value: "6.4%",  icon: Heart,     color: "#E8402A" },
  { label: "Avg CPM",        value: "$14.20", icon: TrendingUp, color: "#111111" },
  { label: "Creator Rating", value: "4.9★",  icon: Star,      color: "#E8402A" },
];

const DEMOGRAPHICS = {
  age:    [{ label: "18–24", pct: 28 }, { label: "25–34", pct: 42 }, { label: "35–44", pct: 18 }, { label: "45+", pct: 12 }],
  gender: [{ label: "Female", pct: 68 }, { label: "Male", pct: 29 }, { label: "Non-binary / Other", pct: 3 }],
  geo:    [{ country: "United States", flag: "🇺🇸", pct: 52 }, { country: "United Kingdom", flag: "🇬🇧", pct: 12 }, { country: "Canada", flag: "🇨🇦", pct: 9 }, { country: "Australia", flag: "🇦🇺", pct: 7 }, { country: "Germany", flag: "🇩🇪", pct: 4 }, { country: "Other", flag: "🌍", pct: 16 }],
};

const CONTENT_NICHES = ["Lifestyle", "Tech & Gadgets", "Wellness & Fitness", "Travel", "Productivity", "Food & Coffee"];

const RECENT_COLLABS = [
  { brand: "Glow Republic",   logo: "GR", color: "#E8402A", category: "Skincare",   result: "2.1M impressions", rating: 5 },
  { brand: "Meridian Health", logo: "MH", color: "#111111", category: "Wellness",   result: "890K views",       rating: 5 },
  { brand: "Nomad Gear",      logo: "NG", color: "#E8402A", category: "Travel",     result: "1.4M reach",       rating: 5 },
  { brand: "Pulse Tech",      logo: "PT", color: "#111111", category: "Technology", result: "3.2% CTR",         rating: 4 },
  { brand: "Vibe Studio",     logo: "VS", color: "#E8402A", category: "Lifestyle",  result: "6.8% ER",          rating: 5 },
  { brand: "ByteBrews",       logo: "BB", color: "#111111", category: "Food & Bev", result: "520K views",       rating: 4 },
];

const DEFAULT_RATES: MediaKitRate[] = [
  { type: "Instagram Reel",       price: "$3,500 – $5,000",  desc: "Up to 60s · full usage rights · story repost" },
  { type: "Instagram Feed Post",  price: "$1,800 – $2,800",  desc: "Single image or carousel · caption included" },
  { type: "YouTube Integration",  price: "$4,500 – $7,000",  desc: "60–90s mid-roll or pre-roll · 30 day exclusivity" },
  { type: "YouTube Dedicated",    price: "$8,500 – $12,000", desc: "Full branded video · 8–15 min · script approval" },
  { type: "Story Set (5 frames)", price: "$800 – $1,200",    desc: "Swipe-up link · 24h live · highlights included" },
  { type: "Campaign Package",     price: "From $15,000",     desc: "Multi-platform · long-term · custom scope" },
];

const PORTFOLIO = [
  { thumb: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop", type: "Reel",  platform: SocialPlatform.INSTAGRAM, views: "265K", er: "9.1%" },
  { thumb: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop", type: "Reel",  platform: SocialPlatform.INSTAGRAM, views: "210K", er: "8.2%" },
  { thumb: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop", type: "Video", platform: SocialPlatform.YOUTUBE,   views: "187K", er: "7.4%" },
  { thumb: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop", type: "Video", platform: SocialPlatform.YOUTUBE,   views: "142K", er: "6.8%" },
  { thumb: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=300&fit=crop", type: "Photo", platform: SocialPlatform.INSTAGRAM, views: "98K",  er: "5.1%" },
  { thumb: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop", type: "Photo", platform: SocialPlatform.INSTAGRAM, views: "74K",  er: "3.9%" },
];

/* ── Helpers ───────────────────────────────────────────────── */
function StatBar({ pct, color }: { pct: number; color: string }) {
  const widthClass =
    pct === 68 ? "w-[68%]" :
      pct === 52 ? "w-[52%]" :
        pct === 42 ? "w-[42%]" :
          pct === 29 ? "w-[29%]" :
            pct === 28 ? "w-[28%]" :
              pct === 18 ? "w-[18%]" :
                pct === 16 ? "w-[16%]" :
                  pct === 12 ? "w-[12%]" :
                    pct === 9 ? "w-[9%]" :
                      pct === 7 ? "w-[7%]" :
                        pct === 4 ? "w-[4%]" :
                          "w-[3%]";
  const colorClass = color === "#E8402A" ? "bg-[#E8402A]" : "bg-[#111111]";

  return (
    <div className="h-[6px] overflow-hidden rounded-[99px] bg-[rgba(255,255,255,0.05)]">
      <div className={`h-full rounded-[99px] ${widthClass} ${colorClass}`} />
    </div>
  );
}

function EditableField({ value, onSave, multiline = false, large = false }: {
  value: string; onSave: (v: string) => void; multiline?: boolean; large?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (!editing) {
    return (
      <span
        onClick={() => { setDraft(value); setEditing(true); }}
        className="cursor-text border-b border-dashed border-b-transparent transition-colors duration-150"
        onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(232,64,42,0.4)")}
        onMouseLeave={e => (e.currentTarget.style.borderColor = "transparent")}
      >
        {value}
      </span>
    );
  }

  const sharedInputClasses = "box-border w-full rounded-[8px] border-[1.5px] border-[#E8402A] bg-[rgba(232,64,42,0.04)] px-[10px] py-[6px] text-inherit [font-family:inherit] [font-size:inherit] [font-weight:inherit] [line-height:inherit] outline-none";

  return multiline ? (
    <span className="block">
      <textarea
        value={draft}
        onChange={e => setDraft(e.target.value)}
        autoFocus
        rows={3}
        className={`${sharedInputClasses} resize-y`}
      />
      <span className="mt-[6px] flex gap-[8px]">
        <button onClick={() => { onSave(draft); setEditing(false); }} className="cursor-pointer rounded-[6px] border-0 bg-(--cos-primary) px-[12px] py-[4px] text-[11px] font-semibold text-white font-['SF_Pro_Display',-apple-system,sans-serif]">Save</button>
        <button onClick={() => setEditing(false)} className="cursor-pointer rounded-[6px] border border-[rgba(255,255,255,0.07)] bg-transparent px-[12px] py-[4px] text-[11px] text-[rgba(255,255,255,0.4)] font-['SF_Pro_Display',-apple-system,sans-serif]">Cancel</button>
      </span>
    </span>
  ) : (
    <input
      value={draft}
      onChange={e => setDraft(e.target.value)}
      autoFocus
      onBlur={() => { onSave(draft); setEditing(false); }}
      onKeyDown={e => { if (e.key === "Enter") { onSave(draft); setEditing(false); } if (e.key === "Escape") setEditing(false); }}
      className={sharedInputClasses}
    />
  );
}

/* ── Tab nav ───────────────────────────────────────────────── */
const TABS: { id: MediaKitTab; label: string }[] = [
  { id: MediaKitTab.OVERVIEW,  label: "Overview" },
  { id: MediaKitTab.AUDIENCE,  label: "Audience" },
  { id: MediaKitTab.RATES,     label: "Rate Card" },
  { id: MediaKitTab.PORTFOLIO, label: "Portfolio" },
];

/* ── MediaKitPage ───────────────────────────────────────────── */
export function MediaKitPage() {
  const [uiState, setUiState] = useState<MediaKitUiState>({
    tab: MediaKitTab.OVERVIEW,
    editMode: false,
    copied: false,
    regenerating: false,
  });
  const [creator, setCreator] = useState(DEFAULT_CREATOR);
  const [rates, setRates] = useState(DEFAULT_RATES);

  function patch(key: keyof typeof DEFAULT_CREATOR, val: string) {
    setCreator(prev => ({ ...prev, [key]: val }));
  }

  function handleCopy() {
    setUiState(prev => ({ ...prev, copied: true }));
    setTimeout(() => setUiState(prev => ({ ...prev, copied: false })), 2000);
  }

  function handleRegenerate() {
    setUiState(prev => ({ ...prev, regenerating: true }));
    setTimeout(() => setUiState(prev => ({ ...prev, regenerating: false })), 1800);
  }

  return (
    <div className="w-full max-w-[1100px] px-[36px] py-[28px]">

      {/* ── Top bar ── */}
      <div className="mb-[28px] flex items-start justify-between">
        <div>
          <h1 className="mb-[4px] text-[24px] font-extrabold tracking-[-0.04em] text-white font-['SF_Pro_Display',-apple-system,sans-serif]">Media Kit</h1>
          <div className="flex items-center gap-[10px] text-[12px] text-[rgba(255,255,255,0.4)] font-['SF_Pro_Display',-apple-system,sans-serif]">
            <div className="h-[6px] w-[6px] rounded-full bg-[#22c55e]" />
            Auto-synced from live platform data · Updated 2h ago
          </div>
        </div>
        <div className="flex items-center gap-[8px]">
          <button
            onClick={() => setUiState(prev => ({ ...prev, editMode: !prev.editMode }))}
            className={`flex cursor-pointer items-center gap-[7px] rounded-[10px] px-[16px] py-[9px] text-[12px] transition-all duration-150 font-['SF_Pro_Display',-apple-system,sans-serif] ${uiState.editMode
              ? "border-[1.5px] border-[#E8402A] bg-[rgba(232,64,42,0.06)] font-semibold text-[#E8402A]"
              : "border-[1.5px] border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] font-normal text-[rgba(255,255,255,0.4)]"
              }`}
          >
            {uiState.editMode ? <><Save size={13} /> Save Changes</> : <><Edit3 size={13} /> Edit Kit</>}
          </button>
          <button
            onClick={handleRegenerate}
            className="flex cursor-pointer items-center gap-[7px] rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] px-[14px] py-[9px] text-[12px] text-[rgba(255,255,255,0.4)] transition-opacity duration-150 hover:opacity-70 font-['SF_Pro_Display',-apple-system,sans-serif]"
            onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            <RefreshCw size={13} className={uiState.regenerating ? "animate-spin" : ""} />
            {uiState.regenerating ? "Regenerating…" : "Regenerate"}
          </button>
          <button onClick={handleCopy} className="flex cursor-pointer items-center gap-[7px] rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] px-[14px] py-[9px] text-[12px] text-[rgba(255,255,255,0.4)] font-['SF_Pro_Display',-apple-system,sans-serif]">
            {uiState.copied ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
            {uiState.copied ? "Copied!" : "Share link"}
          </button>
          <button className="flex cursor-pointer items-center gap-[7px] rounded-[10px] border-0 bg-(--cos-primary) px-[18px] py-[9px] text-[13px] font-bold text-white font-['SF_Pro_Display',-apple-system,sans-serif]">
            <Download size={13} /> Export PDF
          </button>
        </div>
      </div>

      {/* ── Kit preview container ── */}
      <div className="overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] shadow-[0_8px_48px_rgba(0,0,0,0.07)]">

        {/* ── Hero cover ── */}
        <div className="relative h-[240px]">
          <img src={creator.cover} alt="Cover" className="block h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(17,17,17,0.82)_0%,rgba(17,17,17,0.4)_55%,rgba(232,64,42,0.15)_100%)]" />

          {/* Floating brand badge */}
          <div className="absolute right-[24px] top-[20px] flex items-center gap-[7px] rounded-[99px] border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.1)] px-[16px] py-[7px] backdrop-blur-[14px]">
            <Zap size={11} color="#E8402A" />
            <span className="text-[10px] font-semibold tracking-widest text-white font-mono">CREATOROS · VERIFIED</span>
          </div>

          {/* Key metrics strip in cover */}
          <div className="absolute bottom-[24px] right-[24px] flex gap-[10px]">
            {METRICS_SPOTLIGHT.map(m => (
              <div key={m.label} className="rounded-[12px] border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.1)] px-[16px] py-[10px] text-center backdrop-blur-[14px]">
                <div className="text-[18px] font-black leading-none tracking-[-0.04em] text-white font-['SF_Pro_Display',-apple-system,sans-serif]">{m.value}</div>
                <div className="mt-[4px] text-[9px] tracking-[0.06em] text-[rgba(255,255,255,0.6)] font-mono">{m.label.toUpperCase()}</div>
              </div>
            ))}
          </div>

          {/* Avatar */}
          <div className="absolute bottom-[-44px] left-[36px]">
            <div className="relative inline-block">
              <img src={creator.avatar} alt={creator.name} className="block h-[96px] w-[96px] rounded-[24px] border-4 border-[#0D0D0D] object-cover shadow-[0_8px_24px_rgba(0,0,0,0.2)]" />
              <div className="absolute bottom-[6px] right-[6px] h-[18px] w-[18px] rounded-full border-[3px] border-[#0D0D0D] bg-[#22c55e]" />
            </div>
          </div>
        </div>

        {/* ── Profile header ── */}
        <div className="px-[36px] pb-0 pt-[56px]">
          <div className="mb-[24px] flex items-start justify-between">
            <div>
              <h2 className="mb-[6px] text-[28px] font-black leading-[1.1] tracking-[-0.04em] text-white font-['SF_Pro_Display',-apple-system,sans-serif]">
                {uiState.editMode
                  ? <EditableField value={creator.name} onSave={v => patch("name", v)} />
                  : creator.name}
              </h2>
              <div className="mb-[8px] text-[14px] font-semibold text-[#E8402A] font-mono">
                {uiState.editMode
                  ? <EditableField value={creator.handle} onSave={v => patch("handle", v)} />
                  : creator.handle}
              </div>
              <div className="mb-[12px] text-[13px] font-medium text-[rgba(255,255,255,0.4)] font-['SF_Pro_Display',-apple-system,sans-serif]">
                {uiState.editMode
                  ? <EditableField value={creator.title} onSave={v => patch("title", v)} />
                  : creator.title}
              </div>
              <div className="flex flex-wrap gap-[20px]">
                {[
                  { icon: MapPin, text: creator.location, key: "location" as const },
                  { icon: Globe, text: creator.website, key: "website" as const },
                  { icon: Mail, text: creator.email, key: "email" as const },
                ].map(({ icon: Icon, text, key }) => (
                  <div key={key} className="flex items-center gap-[6px] text-[12px] text-[rgba(255,255,255,0.4)] font-['SF_Pro_Display',-apple-system,sans-serif]">
                    <Icon size={12} />
                    {uiState.editMode ? <EditableField value={text} onSave={v => patch(key, v)} /> : text}
                  </div>
                ))}
              </div>
            </div>

            {/* Platform badges */}
            <div className="flex gap-[10px]">
              {PLATFORM_STATS.map(p => (
                <div key={p.platform} className={`flex items-center gap-[8px] rounded-[12px] px-[14px] py-[8px] ${p.color === "#E8402A"
                  ? "border border-[#E8402A]/25 bg-[#E8402A]/10"
                  : "border border-[#111111]/25 bg-[#111111]/10"
                  }`}>
                  <p.icon size={16} color={p.color} />
                  <div>
                    <div className="text-[14px] font-extrabold tracking-[-0.03em] text-white font-['SF_Pro_Display',-apple-system,sans-serif]">{p.followers}</div>
                    <div className="text-[9px] text-[rgba(255,255,255,0.4)] font-mono">{p.platform.toUpperCase()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div className="mb-[28px] max-w-[720px] text-[14px] leading-[1.8] text-[rgba(255,255,255,0.65)] font-['SF_Pro_Display',-apple-system,sans-serif]">
            {uiState.editMode
              ? <EditableField value={creator.bio} onSave={v => patch("bio", v)} multiline />
              : creator.bio}
          </div>

          {/* Content niches */}
          <div className="mb-[28px] flex flex-wrap gap-[8px]">
            {CONTENT_NICHES.map(n => (
              <span key={n} className="rounded-[99px] border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.05)] px-[14px] py-[5px] text-[12px] font-medium text-[rgba(255,255,255,0.65)] font-['SF_Pro_Display',-apple-system,sans-serif]">{n}</span>
            ))}
            {uiState.editMode && (
              <button className="cursor-pointer rounded-[99px] border border-dashed border-[#E8402A]/40 bg-transparent px-[14px] py-[5px] text-[12px] text-[#E8402A] font-['SF_Pro_Display',-apple-system,sans-serif]">+ Add niche</button>
            )}
          </div>

          {/* ── Tab bar ── */}
          <div className="flex gap-[2px] border-b border-[rgba(255,255,255,0.07)]">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setUiState(prev => ({ ...prev, tab: t.id }))}
                className={`-mb-px cursor-pointer border-0 border-b-2 bg-transparent px-[20px] py-[12px] text-[13px] transition-all duration-150 font-['SF_Pro_Display',-apple-system,sans-serif] ${uiState.tab === t.id
                  ? "border-b-[#E8402A] font-bold text-white"
                  : "border-b-transparent font-medium text-[rgba(255,255,255,0.4)]"
                  }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab content ── */}
        <div className="px-[36px] pb-[40px] pt-[32px]">

          {/* OVERVIEW */}
          {uiState.tab === MediaKitTab.OVERVIEW && (
            <div className="flex flex-col gap-[32px]">

              {/* Platform deep-dive cards */}
              <div>
                <div className="mb-[16px] text-[14px] font-bold tracking-[-0.02em] text-white font-['SF_Pro_Display',-apple-system,sans-serif]">Platform Performance</div>
                <div className="grid grid-cols-2 gap-[16px]">
                  {PLATFORM_STATS.map(p => (
                    <div key={p.platform} className="overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.07)] bg-[#050505]">
                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.07)] px-[22px] py-[18px]">
                        <div className="flex items-center gap-[12px]">
                          <div className={`flex h-[42px] w-[42px] items-center justify-center rounded-[13px] ${p.color === "#E8402A" ? "bg-[#E8402A]/15" : "bg-[#111111]/15"}`}>
                            <p.icon size={20} color={p.color} />
                          </div>
                          <div>
                            <div className="text-[15px] font-extrabold tracking-[-0.03em] text-white font-['SF_Pro_Display',-apple-system,sans-serif]">{p.platform}</div>
                            <div className="mt-px text-[11px] text-[rgba(255,255,255,0.4)] font-mono">{p.handle}</div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-[4px]">
                          {p.badges.map(b => (
                            <span key={b} className={`rounded-[99px] px-[8px] py-[2px] text-[9px] font-bold font-mono ${p.color === "#E8402A" ? "bg-[#E8402A]/12 text-[#E8402A]" : "bg-[#111111]/12 text-[#111111]"}`}>{b}</span>
                          ))}
                        </div>
                      </div>
                      {/* Stats grid */}
                      <div className="grid grid-cols-3 gap-[16px] px-[22px] py-[18px]">
                        {[
                          { label: "Followers", value: p.followers, icon: Users },
                          { label: "Avg ER", value: p.er, icon: Heart },
                          { label: "Avg Views", value: p.avgViews, icon: Eye },
                          { label: "Avg Reach", value: p.avgReach, icon: Globe },
                          { label: "Total Posts", value: p.posts, icon: BarChart2 },
                          { label: "Avg CPM", value: p.cpm, icon: TrendingUp },
                        ].map(s => (
                          <div key={s.label}>
                            <div className="mb-[4px] flex items-center gap-[4px]">
                              <s.icon size={10} color="rgba(255,255,255,0.4)" />
                              <span className="text-[9px] tracking-[0.06em] text-[rgba(255,255,255,0.4)] font-mono">{s.label.toUpperCase()}</span>
                            </div>
                            <div className={`text-[20px] font-extrabold leading-none tracking-[-0.04em] font-['SF_Pro_Display',-apple-system,sans-serif] ${p.color === "#E8402A" ? "text-[#E8402A]" : "text-[#111111]"}`}>{s.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Past brand partnerships */}
              <div>
                <div className="mb-[16px] text-[14px] font-bold tracking-[-0.02em] text-white font-['SF_Pro_Display',-apple-system,sans-serif]">
                  Brand Partnerships
                </div>
                <div className="grid grid-cols-3 gap-[12px]">
                  {RECENT_COLLABS.map(b => (
                    <div key={b.brand} className="flex cursor-default items-center gap-[14px] rounded-[14px] border border-[rgba(255,255,255,0.07)] bg-[#050505] px-[18px] py-[16px] transition-[border-color,transform] duration-200"
                      onMouseEnter={e => { e.currentTarget.style.borderColor = `${b.color}40`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "none"; }}
                    >
                      <div className={`flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[12px] text-[12px] font-black font-mono ${b.color === "#E8402A" ? "bg-[#E8402A]/15 text-[#E8402A]" : "bg-[#111111]/15 text-[#111111]"}`}>{b.logo}</div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[12px] font-bold text-white font-['SF_Pro_Display',-apple-system,sans-serif]">{b.brand}</div>
                        <div className="mt-px text-[10px] text-[rgba(255,255,255,0.4)] font-mono">{b.category}</div>
                        <div className={`mt-[3px] text-[11px] font-bold font-mono ${b.color === "#E8402A" ? "text-[#E8402A]" : "text-[#111111]"}`}>{b.result}</div>
                      </div>
                      <div className="text-[11px] text-[#E8402A]">{"★".repeat(b.rating)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AUDIENCE */}
          {uiState.tab === MediaKitTab.AUDIENCE && (
            <div className="grid grid-cols-2 gap-[24px]">

              {/* Age */}
              <div className="rounded-[18px] border border-[rgba(255,255,255,0.07)] bg-[#050505] p-[24px]">
                <div className="mb-[4px] text-[13px] font-bold text-white font-['SF_Pro_Display',-apple-system,sans-serif]">Age Distribution</div>
                <div className="mb-[20px] text-[11px] text-[rgba(255,255,255,0.4)] font-mono">Combined Instagram + YouTube</div>
                {DEMOGRAPHICS.age.map(d => (
                  <div key={d.label} className="mb-[14px]">
                    <div className="mb-[6px] flex justify-between">
                      <span className="text-[13px] font-medium text-[rgba(255,255,255,0.65)] font-['SF_Pro_Display',-apple-system,sans-serif]">{d.label}</span>
                      <div className="flex items-center gap-[8px]">
                        <span className="text-[11px] text-[rgba(255,255,255,0.4)] font-mono">{d.pct}% of audience</span>
                        <span className="text-[14px] font-extrabold tracking-[-0.03em] text-[#111111] font-['SF_Pro_Display',-apple-system,sans-serif]">{d.pct}%</span>
                      </div>
                    </div>
                    <StatBar pct={d.pct} color={d.pct === 42 ? "#E8402A" : "#111111"} />
                  </div>
                ))}
                <div className="mt-[20px] rounded-[12px] border border-[#E8402A]/15 bg-[#E8402A]/6 px-[16px] py-[12px]">
                  <div className="text-[11px] font-semibold text-[#E8402A] font-mono">CORE DEMO</div>
                  <div className="mt-[4px] text-[13px] text-[rgba(255,255,255,0.65)] font-['SF_Pro_Display',-apple-system,sans-serif]">25–34 is the dominant group at <strong>42%</strong> — ideal for aspirational lifestyle, career & wellness brands.</div>
                </div>
              </div>

              {/* Gender */}
              <div className="rounded-[18px] border border-[rgba(255,255,255,0.07)] bg-[#050505] p-[24px]">
                <div className="mb-[4px] text-[13px] font-bold text-white font-['SF_Pro_Display',-apple-system,sans-serif]">Gender Split</div>
                <div className="mb-[20px] text-[11px] text-[rgba(255,255,255,0.4)] font-mono">Instagram audience</div>

                {/* Donut visual (CSS-only) */}
                <div className="mb-[24px] flex items-center gap-[24px]">
                  <div className="relative h-[110px] w-[110px] shrink-0">
                    <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3.8" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E8402A" strokeWidth="3.8"
                        strokeDasharray={`${68} ${100 - 68}`} strokeLinecap="round" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#111111" strokeWidth="3.8"
                        strokeDasharray={`${29} ${100 - 29}`}
                        strokeDashoffset={`${-(68)}`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-[18px] font-black tracking-[-0.04em] text-white font-['SF_Pro_Display',-apple-system,sans-serif]">68%</div>
                      <div className="text-[9px] text-[rgba(255,255,255,0.4)] font-mono">Female</div>
                    </div>
                  </div>
                  <div className="flex-1">
                    {DEMOGRAPHICS.gender.map(g => (
                      <div key={g.label} className="mb-[10px] flex items-center gap-[10px]">
                        <div className={`h-[10px] w-[10px] shrink-0 rounded-[3px] ${g.label === "Female" ? "bg-[#E8402A]" : g.label === "Male" ? "bg-[#111111]" : "bg-[#D1D1D1]"}`} />
                        <span className="flex-1 text-[12px] text-[rgba(255,255,255,0.65)] font-['SF_Pro_Display',-apple-system,sans-serif]">{g.label}</span>
                        <span className="text-[13px] font-extrabold tracking-[-0.03em] text-white font-['SF_Pro_Display',-apple-system,sans-serif]">{g.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[12px] bg-[rgba(255,255,255,0.05)] px-[16px] py-[12px] text-[13px] leading-[1.6] text-[rgba(255,255,255,0.65)] font-['SF_Pro_Display',-apple-system,sans-serif]">
                  Predominantly female audience — strong fit for beauty, wellness, fashion, and lifestyle brands.
                </div>
              </div>

              {/* Top locations */}
              <div className="col-span-2 rounded-[18px] border border-[rgba(255,255,255,0.07)] bg-[#050505] p-[24px]">
                <div className="mb-[4px] text-[13px] font-bold text-white font-['SF_Pro_Display',-apple-system,sans-serif]">Top Locations</div>
                <div className="mb-[20px] text-[11px] text-[rgba(255,255,255,0.4)] font-mono">Where your audience lives</div>
                <div className="grid grid-cols-3 gap-[16px]">
                  {DEMOGRAPHICS.geo.map((g, i) => (
                    <div key={g.country}>
                      <div className="mb-[8px] flex items-center justify-between">
                        <div className="flex items-center gap-[8px]">
                          <span className="text-[18px]">{g.flag}</span>
                          <span className="text-[12px] font-medium text-[rgba(255,255,255,0.65)] font-['SF_Pro_Display',-apple-system,sans-serif]">{g.country}</span>
                        </div>
                        <span className={`text-[14px] font-extrabold tracking-[-0.03em] font-['SF_Pro_Display',-apple-system,sans-serif] ${i < 2 ? "text-[#E8402A]" : "text-white"}`}>{g.pct}%</span>
                      </div>
                      <StatBar pct={g.pct} color={i < 2 ? "#E8402A" : "#111111"} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* RATES */}
          {uiState.tab === MediaKitTab.RATES && (
            <div className="flex flex-col gap-[24px]">

              {/* Rate cards */}
              <div>
                <div className="mb-[16px] flex items-center justify-between">
                  <div>
                    <div className="mb-[2px] text-[14px] font-bold text-white font-['SF_Pro_Display',-apple-system,sans-serif]">Rate Card</div>
                    <div className="text-[11px] text-[rgba(255,255,255,0.4)] font-mono">All prices in USD · excludes usage licensing</div>
                  </div>
                  {uiState.editMode && (
                    <button className="flex cursor-pointer items-center gap-[6px] rounded-[9px] border border-dashed border-[#E8402A]/40 bg-transparent px-[14px] py-[7px] text-[11px] text-[#E8402A] font-['SF_Pro_Display',-apple-system,sans-serif]">
                      + Add rate
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-[12px]">
                  {rates.map((r, i) => (
                    <div key={r.type} className={`flex items-start justify-between rounded-[16px] px-[22px] py-[20px] transition-transform duration-200 ${i === rates.length - 1 ? "border border-transparent bg-(--cos-primary)" : "border border-[rgba(255,255,255,0.07)] bg-[#050505]"}`}
                      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "none"}
                    >
                      <div>
                        <div className="mb-[5px] text-[13px] font-bold text-white font-['SF_Pro_Display',-apple-system,sans-serif]">
                          {uiState.editMode && i !== rates.length - 1
                            ? <EditableField value={r.type} onSave={v => setRates(prev => prev.map((x, j) => j === i ? { ...x, type: v } : x))} />
                            : r.type}
                        </div>
                        <div className={`text-[11px] font-mono ${i === rates.length - 1 ? "text-[rgba(255,255,255,0.5)]" : "text-[rgba(255,255,255,0.4)]"}`}>{r.desc}</div>
                      </div>
                      <div className="ml-[16px] shrink-0 text-right">
                        <div className="text-[16px] font-black tracking-[-0.03em] text-[#E8402A] font-['SF_Pro_Display',-apple-system,sans-serif]">
                          {uiState.editMode && i !== rates.length - 1
                            ? <EditableField value={r.price} onSave={v => setRates(prev => prev.map((x, j) => j === i ? { ...x, price: v } : x))} />
                            : r.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes + contact */}
              <div className="grid grid-cols-2 gap-[16px]">
                <div className="rounded-[16px] border border-[#E8402A]/15 bg-[#E8402A]/5 p-[22px]">
                  <div className="mb-[12px] text-[12px] font-bold tracking-[0.06em] text-[#E8402A] font-mono">WHAT&apos;S INCLUDED</div>
                  {["Full creative direction & script", "2 rounds of revision", "30-day exclusivity (campaign packages)", "Analytics report post-campaign", "Story reposts for feed posts", "Professional editing & colour grade"].map(item => (
                    <div key={item} className="mb-[7px] flex items-center gap-[8px] text-[12px] text-[rgba(255,255,255,0.65)] font-['SF_Pro_Display',-apple-system,sans-serif]">
                      <div className="h-[5px] w-[5px] shrink-0 rounded-full bg-[#E8402A]" />
                      {item}
                    </div>
                  ))}
                </div>
                <div className="rounded-[16px] bg-(--cos-primary) p-[22px]">
                  <div className="mb-[12px] text-[12px] font-bold tracking-[0.06em] text-[rgba(255,255,255,0.5)] font-mono">GET IN TOUCH</div>
                  <div className="mb-[6px] text-[16px] font-extrabold tracking-[-0.03em] text-white font-['SF_Pro_Display',-apple-system,sans-serif]">Let&apos;s work together</div>
                  <div className="mb-[18px] text-[12px] leading-[1.6] text-[rgba(255,255,255,0.5)] font-['SF_Pro_Display',-apple-system,sans-serif]">
                    All rates are starting points — final pricing depends on brief scope, exclusivity, and timeline.
                  </div>
                  <div className="mb-[16px] text-[12px] text-[rgba(255,255,255,0.6)] font-mono">{creator.email}</div>
                  <div className="flex gap-[8px]">
                    <button className="flex flex-1 cursor-pointer items-center justify-center gap-[6px] rounded-[10px] border-0 bg-[#E8402A] px-[10px] py-[10px] text-[12px] font-bold text-white font-['SF_Pro_Display',-apple-system,sans-serif]">
                      <Mail size={12} /> Email Me
                    </button>
                    <button className="flex flex-1 cursor-pointer items-center justify-center gap-[6px] rounded-[10px] border border-[rgba(255,255,255,0.15)] bg-transparent px-[10px] py-[10px] text-[12px] text-white font-['SF_Pro_Display',-apple-system,sans-serif]">
                      <Share2 size={12} /> Share Kit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PORTFOLIO */}
          {uiState.tab === MediaKitTab.PORTFOLIO && (
            <div>
              <div className="mb-[16px] flex items-center justify-between">
                <div>
                  <div className="mb-[2px] text-[14px] font-bold text-white font-['SF_Pro_Display',-apple-system,sans-serif]">Content Portfolio</div>
                  <div className="text-[11px] text-[rgba(255,255,255,0.4)] font-mono">Top performing posts across all platforms</div>
                </div>
                <div className="flex items-center gap-[8px] rounded-[9px] border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.05)] px-[12px] py-[6px] text-[11px] text-[rgba(255,255,255,0.4)] font-mono">
                  Sorted by views <ChevronRight size={12} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-[14px]">
                {PORTFOLIO.map((p, i) => (
                  <div key={i} className="cursor-pointer overflow-hidden rounded-[16px] border border-[rgba(255,255,255,0.07)] transition-[transform,box-shadow] duration-200"
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.12)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <div className="relative aspect-4/3">
                      <img src={p.thumb} alt="" className="block h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.7)_0%,transparent_50%)]" />
                      {/* Platform */}
                      <div className={`absolute left-[10px] top-[10px] flex h-[26px] w-[26px] items-center justify-center rounded-[7px] ${p.platform === SocialPlatform.INSTAGRAM ? "bg-[#E8402A]" : "bg-[#111111]"}`}>
                        {p.platform === SocialPlatform.INSTAGRAM ? <Instagram size={13} color="white" /> : <Youtube size={13} color="white" />}
                      </div>
                      {/* Type */}
                      <div className="absolute right-[10px] top-[10px] flex items-center gap-[4px] rounded-[99px] bg-[rgba(0,0,0,0.5)] px-[9px] py-[3px] backdrop-blur-[6px]">
                        <Play size={8} color="white" />
                        <span className="text-[9px] tracking-[0.06em] text-white font-mono">{p.type.toUpperCase()}</span>
                      </div>
                      {/* Stats */}
                      <div className="absolute bottom-[10px] left-[10px] right-[10px] flex justify-between">
                        <span className="text-[14px] font-extrabold tracking-[-0.03em] text-white font-['SF_Pro_Display',-apple-system,sans-serif]">{p.views}</span>
                        <span className="rounded-[99px] bg-[rgba(232,64,42,0.85)] px-[8px] py-[2px] text-[10px] font-bold text-white font-mono">{p.er} ER</span>
                      </div>
                    </div>
                    <div className="bg-[#0D0D0D] px-[14px] py-[12px]">
                      <div className="flex items-center gap-[14px]">
                        <div className="flex items-center gap-[5px] text-[11px] text-[rgba(255,255,255,0.4)] font-mono">
                          <Eye size={10} /> {p.views}
                        </div>
                        <div className="text-[11px] font-semibold text-[#E8402A] font-mono">
                          {p.er} engagement
                        </div>
                        <button className="ml-auto flex cursor-pointer items-center gap-[4px] border-0 bg-transparent p-0 text-[10px] text-[rgba(255,255,255,0.4)] font-mono">
                          <ExternalLink size={10} /> View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
