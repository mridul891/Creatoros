"use client";

import { useState } from "react";
import {
  ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon,
  Clock, CheckCircle, Edit3, Camera as Instagram, CirclePlay as Youtube,
} from "lucide-react";
import {
  PlatformFilter,
  PostStatus as PostStatusEnum,
  PostType as PostTypeEnum,
  SocialPlatform,
} from "@/enums/post";
import type { CalendarFiltersState } from "@/types/post";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ModalState, Platform, Post, PostStatus, PRO_FONT, MONO_FONT, STATUS_CFG } from "./calendar/shared";
import { PostModal } from "./calendar/PostModal";
import { PostChip } from "./calendar/PostChip";
import { PostPanel } from "./calendar/PostPanel";

type CalendarDayProps = {
  day: { date: Date };
  modifiers: { outside?: boolean };
};

/* ── Seed data ─────────────────────────────────────────────── */
const SEED_POSTS: Post[] = [
  { id:  1, day:  2, title: "Morning Routine Reel",        caption: "5 habits that changed my mornings ☀️", platform: SocialPlatform.INSTAGRAM, type: PostTypeEnum.REEL,  status: PostStatusEnum.PUBLISHED, time: "09:00", views: "124K" },
  { id:  2, day:  2, title: "Study With Me — 3h session",  caption: "Cozy study session with lofi beats",   platform: SocialPlatform.YOUTUBE,   type: PostTypeEnum.VIDEO, status: PostStatusEnum.PUBLISHED, time: "11:00", views: "87K" },
  { id:  3, day:  5, title: "Desk Setup Tour",             caption: "Full 2026 desk setup walkthrough",    platform: SocialPlatform.YOUTUBE,   type: PostTypeEnum.VIDEO, status: PostStatusEnum.PUBLISHED, time: "14:00", views: "98K" },
  { id:  4, day:  5, title: "BTS brand shoot",             caption: "Behind the scenes with @GlowRepublic",platform: SocialPlatform.INSTAGRAM, type: PostTypeEnum.STORY, status: PostStatusEnum.PUBLISHED, time: "16:30" },
  { id:  5, day:  8, title: "Tokyo Vlog Part 1",           caption: "First 24 hours in Tokyo 🇯🇵",          platform: SocialPlatform.YOUTUBE,   type: PostTypeEnum.VIDEO, status: PostStatusEnum.PUBLISHED, time: "12:00", views: "210K" },
  { id:  6, day:  9, title: "Travel gear picks",           caption: "Everything in my travel bag",         platform: SocialPlatform.INSTAGRAM, type: PostTypeEnum.REEL,  status: PostStatusEnum.PUBLISHED, time: "18:00", views: "265K" },
  { id:  7, day: 12, title: "Productivity Tips carousel",  caption: "10 tips to 10x your output",         platform: SocialPlatform.INSTAGRAM, type: PostTypeEnum.PHOTO, status: PostStatusEnum.PUBLISHED, time: "10:00", views: "74K" },
  { id:  8, day: 15, title: "Glow Republic collab",        caption: "My honest skincare review #ad",      platform: SocialPlatform.INSTAGRAM, type: PostTypeEnum.REEL,  status: PostStatusEnum.PUBLISHED, time: "17:00", views: "180K" },
  { id:  9, day: 16, title: "Q&A — your questions",        caption: "Answering 30 questions from you",    platform: SocialPlatform.YOUTUBE,   type: PostTypeEnum.VIDEO, status: PostStatusEnum.PUBLISHED, time: "15:00", views: "56K" },
  { id: 10, day: 18, title: "Morning Coffee Vlog",         caption: "A slow morning in SF ☕",              platform: SocialPlatform.YOUTUBE,   type: PostTypeEnum.VIDEO, status: PostStatusEnum.PUBLISHED, time: "11:00", views: "142K" },
  { id: 11, day: 19, title: "5AM club challenge",          caption: "I tried waking up at 5AM for a week",platform: SocialPlatform.INSTAGRAM, type: PostTypeEnum.REEL,  status: PostStatusEnum.PUBLISHED, time: "07:00", views: "312K" },
  { id: 12, day: 22, title: "Seoul street food haul",      caption: "Best street food in Seoul 🇰🇷",        platform: SocialPlatform.INSTAGRAM, type: PostTypeEnum.PHOTO, status: PostStatusEnum.PUBLISHED, time: "18:30", views: "48K" },
  { id: 13, day: 24, title: "Brand Deal Announcement",     caption: "",                                    platform: SocialPlatform.INSTAGRAM, type: PostTypeEnum.REEL,  status: PostStatusEnum.SCHEDULED, time: "12:00" },
  { id: 14, day: 24, title: "Pulse Tech Integration",      caption: "",                                    platform: SocialPlatform.YOUTUBE,   type: PostTypeEnum.VIDEO, status: PostStatusEnum.SCHEDULED, time: "14:00" },
  { id: 15, day: 26, title: "Summer skincare routine",     caption: "",                                    platform: SocialPlatform.INSTAGRAM, type: PostTypeEnum.REEL,  status: PostStatusEnum.SCHEDULED, time: "17:00" },
  { id: 16, day: 28, title: "Workspace refresh vlog",      caption: "",                                    platform: SocialPlatform.YOUTUBE,   type: PostTypeEnum.VIDEO, status: PostStatusEnum.SCHEDULED, time: "11:00" },
  { id: 17, day: 30, title: "June wrap-up Reel",           caption: "",                                    platform: SocialPlatform.INSTAGRAM, type: PostTypeEnum.REEL,  status: PostStatusEnum.SCHEDULED, time: "18:00" },
  { id: 18, day:  3, title: "Untitled draft",              caption: "",                                    platform: SocialPlatform.INSTAGRAM, type: PostTypeEnum.PHOTO, status: PostStatusEnum.DRAFT,     time: "" },
  { id: 19, day: 20, title: "Tech unboxing idea",          caption: "",                                    platform: SocialPlatform.YOUTUBE,   type: PostTypeEnum.VIDEO, status: PostStatusEnum.DRAFT,     time: "" },
];


/* ── CalendarPage ───────────────────────────────────────────── */
export function CalendarPage() {
  const [posts, setPosts] = useState(SEED_POSTS);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [filters, setFilters] = useState<CalendarFiltersState>({
    platform: PlatformFilter.ALL,
    status: PlatformFilter.ALL,
  });
  const [calendarState, setCalendarState] = useState({
    currentMonth: new Date(2026, 5, 1),
  });
  let nextId = Math.max(...posts.map(p => p.id)) + 1;

  const selectedPost = posts.find(p => p.id === selectedId) ?? null;

  const calendarMonth = calendarState.currentMonth;
  const firstDayOffset = (new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay() + 6) % 7;
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const lastRowIndex = Math.floor((daysInMonth + firstDayOffset - 1) / 7);
  const today = 9;
  const monthLabel = calendarMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  function postsForDay(day: number) {
    return posts.filter(p => p.day === day &&
      (filters.platform === PlatformFilter.ALL || p.platform === (filters.platform === PlatformFilter.INSTAGRAM ? SocialPlatform.INSTAGRAM : SocialPlatform.YOUTUBE)) &&
      (filters.status === PlatformFilter.ALL || p.status === filters.status)
    );
  }

  function handleSavePost(data: Omit<Post, "id">) {
    if (modal?.post) {
      setPosts(prev => prev.map(p => p.id === modal.post!.id ? { ...p, ...data } : p));
    } else {
      setPosts(prev => [...prev, { id: nextId++, ...data }]);
    }
  }

  function handleDelete(id: number) {
    setPosts(prev => prev.filter(p => p.id !== id));
    setSelectedId(null);
  }

  function handleStatusChange(id: number, status: PostStatus) {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  }

  const published = posts.filter(p => p.status === PostStatusEnum.PUBLISHED).length;
  const scheduled = posts.filter(p => p.status === PostStatusEnum.SCHEDULED).length;
  const drafts    = posts.filter(p => p.status === PostStatusEnum.DRAFT).length;

  return (
    <div className="w-full max-w-[1280px] px-[36px] py-[28px]">
      {modal && (
        <PostModal
          state={modal}
          onSave={handleSavePost}
          onClose={() => setModal(null)}
        />
      )}
      <Dialog open={!!selectedPost} onOpenChange={(open) => { if (!open) setSelectedId(null); }}>
        <DialogContent
          showCloseButton={false}
          className="max-w-[340px] border-none bg-transparent p-0 ring-0"
        >
          {selectedPost && (
            <>
              <DialogTitle className="sr-only">{selectedPost.title}</DialogTitle>
              <PostPanel
                post={selectedPost}
                inDialog
                onClose={() => setSelectedId(null)}
                onEdit={() => { setModal({ day: selectedPost.day, post: selectedPost }); setSelectedId(null); }}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="mb-[24px] flex items-start justify-between">
        <div>
          <h1 className={`mb-[4px] ${PRO_FONT} text-[24px] font-extrabold tracking-[-0.04em] text-white`}>Content Calendar</h1>
          <div className={`${PRO_FONT} text-[13px] text-[rgba(255,255,255,0.4)]`}>Plan and track every post across all platforms</div>
        </div>
        <button onClick={() => setModal({ day: today + 1 })} className={`flex cursor-pointer items-center gap-[8px] rounded-[11px] border-none bg-(--cos-primary) px-[20px] py-[10px] ${PRO_FONT} text-[13px] font-bold text-white`}>
          <Plus size={15} /> New Post
        </button>
      </div>

      {/* Stats */}
      <div className="mb-[24px] flex gap-[12px]">
        {[
          { label: "Published", count: published, color: "#16a34a", icon: CheckCircle },
          { label: "Scheduled", count: scheduled, color: "#E8402A", icon: Clock },
          { label: "Drafts",    count: drafts,    color: "#717171", icon: Edit3 },
            { label: "Total",     count: posts.length, color: "#111111", icon: CalendarIcon },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-[8px] rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] px-[16px] py-[8px]">
            <s.icon size={13} color={s.color} />
            <span className={`${PRO_FONT} text-[14px] font-extrabold tracking-[-0.03em] text-white`}>{s.count}</span>
            <span className={`${PRO_FONT} text-[12px] text-[rgba(255,255,255,0.4)]`}>{s.label}</span>
          </div>
        ))}
      </div>

      <div>
          {/* Month nav + filters */}
          <div className="mb-[14px] flex items-center justify-between">
            <div className="flex items-center gap-[10px]">
              <button
                onClick={() =>
                  setCalendarState(prev => ({
                    ...prev,
                    currentMonth: new Date(prev.currentMonth.getFullYear(), prev.currentMonth.getMonth() - 1, 1),
                  }))
                }
                className="flex cursor-pointer rounded-[8px] border border-[rgba(255,255,255,0.07)] px-[10px] py-[6px] text-[rgba(255,255,255,0.4)]"
              >
                <ChevronLeft size={14} />
              </button>
              <span className={`${PRO_FONT} text-[16px] font-extrabold tracking-[-0.03em] text-white`}>{monthLabel}</span>
              <button
                onClick={() =>
                  setCalendarState(prev => ({
                    ...prev,
                    currentMonth: new Date(prev.currentMonth.getFullYear(), prev.currentMonth.getMonth() + 1, 1),
                  }))
                }
                className="flex cursor-pointer rounded-[8px] border border-[rgba(255,255,255,0.07)] px-[10px] py-[6px] text-[rgba(255,255,255,0.4)]"
              >
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="flex gap-[8px]">
              <div className="flex rounded-[9px] bg-[rgba(255,255,255,0.05)] p-[3px]">
                {[PlatformFilter.ALL, PlatformFilter.INSTAGRAM, PlatformFilter.YOUTUBE].map(p => (
                  <button
                    key={p}
                    onClick={() => setFilters(prev => ({ ...prev, platform: p }))}
                    className={`cursor-pointer rounded-[6px] px-[12px] py-[5px] ${MONO_FONT} text-[10px] transition-all duration-150 ${filters.platform === p ? "bg-[#0D0D0D] font-bold text-white shadow-[0_1px_4px_rgba(0,0,0,0.1)]" : "bg-transparent font-normal text-[rgba(255,255,255,0.4)]"}`}
                  >
                    {p === PlatformFilter.ALL ? "All" : p === PlatformFilter.INSTAGRAM ? "IG" : "YT"}
                  </button>
                ))}
              </div>
              <div className="flex rounded-[9px] bg-[rgba(255,255,255,0.05)] p-[3px]">
                {[PlatformFilter.ALL, PostStatusEnum.PUBLISHED, PostStatusEnum.SCHEDULED, PostStatusEnum.DRAFT].map(s => (
                  <button
                    key={s}
                    onClick={() => setFilters(prev => ({ ...prev, status: s }))}
                    className={`cursor-pointer rounded-[6px] px-[10px] py-[5px] ${MONO_FONT} text-[10px] capitalize transition-all duration-150 ${filters.status === s ? "bg-[#0D0D0D] font-bold text-white shadow-[0_1px_4px_rgba(0,0,0,0.1)]" : "bg-transparent font-normal text-[rgba(255,255,255,0.4)]"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D]">
            <Calendar
              month={calendarMonth}
              disableNavigation
              showOutsideDays={false}
              classNames={{
                month_grid: "w-full border-collapse",
                week: "",
                day: "relative p-0 align-top",
                weekdays: "border-b border-[rgba(255,255,255,0.07)]",
              }}
              components={{
                Day: ({ day, modifiers }: CalendarDayProps) => {
                  if (modifiers.outside) {
                    return <td className="p-0" />;
                  }

                  const dayNumber = day.date.getDate();
                  const dayPosts = postsForDay(dayNumber);
                  const isToday = dayNumber === today;
                  const jsDay = day.date.getDay();
                  const isWeekend = jsDay === 0 || jsDay === 6;
                  const colIndex = (jsDay + 6) % 7;
                  const rowIndex = Math.floor((dayNumber + firstDayOffset - 1) / 7);

                  return (
                    <td
                      className={`align-top ${(colIndex < 6) ? "border-r border-[rgba(255,255,255,0.07)]" : ""} ${rowIndex < lastRowIndex ? "border-b border-[rgba(255,255,255,0.07)]" : ""} ${isWeekend ? "bg-[rgba(255,255,255,0.015)]" : "bg-transparent"}`}
                    >
                      <div className="group relative min-h-[110px] px-[8px] pb-[6px] pt-[8px]">
                        <div className={`mb-[4px] flex h-[24px] w-[24px] items-center justify-center rounded-full ${MONO_FONT} text-[12px] ${isToday ? "bg-[#E8402A] font-extrabold text-white" : "bg-transparent font-medium text-[rgba(255,255,255,0.65)]"}`}>
                          {dayNumber}
                        </div>
                        <div>
                          {dayPosts.slice(0, 3).map(p => (
                            <PostChip key={p.id} post={p} onClick={() => setSelectedId(p.id)} />
                          ))}
                          {dayPosts.length > 3 && <div className={`pl-[4px] ${MONO_FONT} text-[9px] text-[rgba(255,255,255,0.4)]`}>+{dayPosts.length - 3} more</div>}
                        </div>
                        {/* Add button on hover */}
                        <button
                          onClick={() => setModal({ day: dayNumber })}
                          className="absolute bottom-[6px] right-[6px] flex h-[18px] w-[18px] cursor-pointer items-center justify-center rounded-full border border-dashed border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] p-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                        >
                          <Plus size={10} color="rgba(255,255,255,0.4)" />
                        </button>
                      </div>
                    </td>
                  );
                },
              }}
            />
          </div>

          {/* Upcoming */}
          <div className="mt-[24px]">
            <div className={`mb-[12px] ${PRO_FONT} text-[13px] font-bold tracking-[-0.02em] text-white`}>Upcoming this week</div>
            <div className="flex flex-col gap-[8px]">
              {posts.filter(p => p.status !== PostStatusEnum.DRAFT && p.day >= today && p.day <= today + 7)
                .sort((a, b) => a.day - b.day || a.time.localeCompare(b.time))
                .map(post => {
                  const S = STATUS_CFG[post.status];
                  const PlatformIcon = post.platform === SocialPlatform.INSTAGRAM ? Instagram : Youtube;
                  const platformColor = post.platform === SocialPlatform.INSTAGRAM ? "#E8402A" : "#111111";
                  const platformPillBg = post.platform === SocialPlatform.INSTAGRAM ? "bg-[#E8402A12]" : "bg-[#11111112]";
                  return (
                    <div key={post.id} className="flex cursor-pointer items-center gap-[14px] rounded-[12px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] px-[18px] py-[13px] transition-colors duration-150 hover:border-[rgba(232,64,42,0.3)]"
                      onClick={() => setSelectedId(post.id)}
                    >
                      <div className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] ${platformPillBg}`}>
                        <PlatformIcon size={15} color={platformColor} />
                      </div>
                      <div className="flex-1">
                        <div className={`${PRO_FONT} text-[13px] font-semibold text-white`}>{post.title}</div>
                        <div className={`mt-[2px] ${MONO_FONT} text-[11px] text-[rgba(255,255,255,0.4)]`}>June {post.day} · {post.time || "—"}</div>
                      </div>
                      <div className={`inline-flex items-center gap-[5px] rounded-[99px] px-[10px] py-[4px] ${S.bgClass}`}>
                        <S.icon size={10} color={S.color} />
                        <span className={`${MONO_FONT} ${S.textClass} text-[10px] font-semibold`}>{S.label}</span>
                      </div>
                      <button onClick={e => { e.stopPropagation(); setModal({ day: post.day, post }); }} className="flex cursor-pointer items-center rounded-[7px] border border-[rgba(255,255,255,0.07)] px-[8px] py-[5px] text-[rgba(255,255,255,0.4)]">
                        <Edit3 size={12} />
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
      </div>
    </div>
  );
}
