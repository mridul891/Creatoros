"use client";

import { useState } from "react";
import {
  CaretLeft, CaretRight, Plus, Calendar as CalendarIcon,
  Clock, CheckCircle, PencilSimple,
} from "@phosphor-icons/react/dist/ssr";
import {
  PlatformFilter,
  PostStatus as PostStatusEnum,
  PostType as PostTypeEnum,
  SocialPlatform,
} from "@/enums/post";
import type { CalendarFiltersState } from "@/types/post";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ModalState, Post, PostStatus, MONO_FONT, PLATFORM_CFG, STATUS_CFG } from "./calendar/shared";
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
  // Sunday-first offset to match react-day-picker's default week start
  const firstDayOffset = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay();
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

  const stats = [
    { label: "Published", count: published,    color: STATUS_CFG[PostStatusEnum.PUBLISHED].color, icon: CheckCircle },
    { label: "Scheduled", count: scheduled,    color: STATUS_CFG[PostStatusEnum.SCHEDULED].color, icon: Clock },
    { label: "Drafts",    count: drafts,       color: STATUS_CFG[PostStatusEnum.DRAFT].color,     icon: PencilSimple },
    { label: "Total",     count: posts.length, color: "var(--foreground)",                        icon: CalendarIcon },
  ];

  return (
    <div className="w-full max-w-[1280px] px-4 py-6 md:px-9 md:py-7">
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
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 text-2xl font-bold tracking-tight text-foreground">Content Calendar</h1>
          <p className="text-[13px] text-muted-foreground">Plan and track every post across all platforms</p>
        </div>
        <Button onClick={() => setModal({ day: today + 1 })} className="shrink-0 gap-1.5 px-4 font-semibold">
          <Plus size={15} weight="bold" /> New Post
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6 flex flex-wrap gap-3">
        {stats.map(s => (
          <div key={s.label} className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 shadow-xs">
            <s.icon size={14} color={s.color} weight="bold" />
            <span className="text-sm font-bold tracking-tight text-foreground">{s.count}</span>
            <span className="text-xs text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>

      <div>
          {/* Month nav + filters */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Previous month"
                onClick={() =>
                  setCalendarState(prev => ({
                    ...prev,
                    currentMonth: new Date(prev.currentMonth.getFullYear(), prev.currentMonth.getMonth() - 1, 1),
                  }))
                }
              >
                <CaretLeft size={14} />
              </Button>
              <span className="min-w-[120px] text-center text-base font-semibold tracking-tight text-foreground">{monthLabel}</span>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Next month"
                onClick={() =>
                  setCalendarState(prev => ({
                    ...prev,
                    currentMonth: new Date(prev.currentMonth.getFullYear(), prev.currentMonth.getMonth() + 1, 1),
                  }))
                }
              >
                <CaretRight size={14} />
              </Button>
            </div>
            <div className="flex gap-2">
              <div className="flex rounded-lg bg-muted p-[3px]">
                {[PlatformFilter.ALL, PlatformFilter.INSTAGRAM, PlatformFilter.YOUTUBE].map(p => (
                  <button
                    key={p}
                    onClick={() => setFilters(prev => ({ ...prev, platform: p }))}
                    className={`cursor-pointer rounded-md px-3 py-1 text-[11px] transition-all duration-150 ${filters.platform === p ? "bg-card font-semibold text-foreground shadow-sm" : "bg-transparent font-medium text-muted-foreground hover:text-foreground"}`}
                  >
                    {p === PlatformFilter.ALL ? "All" : p === PlatformFilter.INSTAGRAM ? "IG" : "YT"}
                  </button>
                ))}
              </div>
              <div className="flex rounded-lg bg-muted p-[3px]">
                {[PlatformFilter.ALL, PostStatusEnum.PUBLISHED, PostStatusEnum.SCHEDULED, PostStatusEnum.DRAFT].map(s => (
                  <button
                    key={s}
                    onClick={() => setFilters(prev => ({ ...prev, status: s }))}
                    className={`cursor-pointer rounded-md px-2.5 py-1 text-[11px] capitalize transition-all duration-150 ${filters.status === s ? "bg-card font-semibold text-foreground shadow-sm" : "bg-transparent font-medium text-muted-foreground hover:text-foreground"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <Calendar
              month={calendarMonth}
              disableNavigation
              showOutsideDays={false}
              className="w-full p-0"
              classNames={{
                root: "w-full",
                month: "flex w-full flex-col",
                nav: "hidden",
                month_caption: "hidden",
                month_grid: "w-full border-collapse",
                weekdays: "border-b border-border",
                weekday: "py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
                week: "",
                day: "relative p-0 align-top",
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
                  // Sunday-first columns/rows, matching the rendered weekday header
                  const colIndex = jsDay;
                  const rowIndex = Math.floor((dayNumber + firstDayOffset - 1) / 7);

                  return (
                    <td
                      className={`w-[14.2857%] align-top ${(colIndex < 6) ? "border-r border-border" : ""} ${rowIndex < lastRowIndex ? "border-b border-border" : ""} ${isWeekend ? "bg-muted/40" : "bg-transparent"}`}
                    >
                      <div className="group relative min-h-[110px] px-2 pb-1.5 pt-2">
                        <div className={`mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs ${isToday ? "bg-primary font-bold text-primary-foreground" : "bg-transparent font-medium text-muted-foreground"}`}>
                          {dayNumber}
                        </div>
                        <div>
                          {dayPosts.slice(0, 3).map(p => (
                            <PostChip key={p.id} post={p} onClick={() => setSelectedId(p.id)} />
                          ))}
                          {dayPosts.length > 3 && <div className="pl-1 text-[10px] font-medium text-muted-foreground">+{dayPosts.length - 3} more</div>}
                        </div>
                        {/* Add button on hover */}
                        <button
                          onClick={() => setModal({ day: dayNumber })}
                          aria-label={`Add post on June ${dayNumber}`}
                          className="absolute bottom-1.5 right-1.5 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-dashed border-border bg-card p-0 text-muted-foreground opacity-0 transition-opacity duration-150 hover:border-primary/40 hover:text-primary focus-visible:opacity-100 group-hover:opacity-100"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                    </td>
                  );
                },
              }}
            />
          </div>

          {/* Upcoming */}
          <div className="mt-6">
            <div className="mb-3 text-[13px] font-semibold tracking-tight text-foreground">Upcoming this week</div>
            <div className="flex flex-col gap-2">
              {posts.filter(p => p.status !== PostStatusEnum.DRAFT && p.day >= today && p.day <= today + 7)
                .sort((a, b) => a.day - b.day || a.time.localeCompare(b.time))
                .map(post => {
                  const S = STATUS_CFG[post.status];
                  const P = PLATFORM_CFG[post.platform];
                  return (
                    <div key={post.id} className="flex cursor-pointer items-center gap-3.5 rounded-lg border border-border bg-card px-4 py-3 shadow-xs transition-all duration-150 hover:border-ring/50 hover:shadow-sm"
                      onClick={() => setSelectedId(post.id)}
                    >
                      <div className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg ${P.pillBg}`}>
                        <P.icon size={15} color={P.color} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-semibold text-foreground">{post.title}</div>
                        <div className={`mt-0.5 ${MONO_FONT} text-[11px] text-muted-foreground`}>June {post.day} · {post.time || "—"}</div>
                      </div>
                      <div className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 ${S.bgClass}`}>
                        <S.icon size={10} color={S.color} weight="bold" />
                        <span className={`${S.textClass} text-[10px] font-semibold`}>{S.label}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        aria-label={`Edit ${post.title}`}
                        onClick={e => { e.stopPropagation(); setModal({ day: post.day, post }); }}
                      >
                        <PencilSimple size={12} />
                      </Button>
                    </div>
                  );
                })}
            </div>
          </div>
      </div>
    </div>
  );
}
