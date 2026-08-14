"use client"

import {
  Cancel01Icon,
  Clock01Icon,
  Delete02Icon,
  Edit02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { PostStatus as PostStatusEnum } from "@/enums/post"
import {
  MONO_FONT,
  PLATFORM_CFG,
  type Post,
  type PostStatus,
  STATUS_CFG,
} from "./shared"

export function PostPanel({
  post,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
  inDialog = false,
}: {
  post: Post
  onClose: () => void
  onEdit: () => void
  onDelete: (id: number) => void
  onStatusChange: (id: number, s: PostStatus) => void
  inDialog?: boolean
}) {
  const S = STATUS_CFG[post.status]
  const P = PLATFORM_CFG[post.platform]
  const fmtTime = (t: string) => {
    if (!t) return "—"
    const [h, m] = t.split(":")
    const hr = parseInt(h, 10)
    return `${hr % 12 || 12}:${m} ${hr < 12 ? "AM" : "PM"}`
  }

  return (
    <div
      className={
        inDialog
          ? "flex w-full flex-col gap-4 rounded-xl border border-border bg-card p-5"
          : "sticky top-7 flex w-[300px] shrink-0 flex-col gap-4 self-start rounded-xl border border-border bg-card p-5 shadow-xs"
      }
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${P.pillBg}`}
          >
            <HugeiconsIcon icon={P.icon} size={18} color={P.color} />
          </div>
          <div>
            <div className="font-medium text-[11px] text-muted-foreground capitalize">
              {post.platform} · {post.type}
            </div>
            <div
              className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${S.bgClass}`}
            >
              <HugeiconsIcon
                icon={S.icon}
                size={9}
                color={S.color}
                strokeWidth={2}
              />
              <span className={`${S.textClass} font-semibold text-[10px]`}>
                {S.label}
              </span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Close"
          onClick={onClose}
        >
          <HugeiconsIcon icon={Cancel01Icon} size={15} />
        </Button>
      </div>

      <div className="font-bold text-[15px] text-foreground leading-snug tracking-tight">
        {post.title}
      </div>
      {post.caption && (
        <div className="rounded-lg bg-muted px-3 py-2.5 text-muted-foreground text-xs leading-relaxed">
          {post.caption}
        </div>
      )}

      <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2.5">
        <HugeiconsIcon
          icon={Clock01Icon}
          size={13}
          color="var(--muted-foreground)"
        />
        <span className={`${MONO_FONT} text-muted-foreground text-xs`}>
          June {post.day} · {post.time ? fmtTime(post.time) : "No time set"}
        </span>
      </div>

      {post.views && (
        <div className="rounded-lg border border-primary/15 bg-primary/5 p-3.5">
          <div className="mb-1 font-medium text-[10px] text-muted-foreground uppercase tracking-wide">
            Performance
          </div>
          <div className="font-bold text-2xl text-primary tracking-tight">
            {post.views}
          </div>
          <div className="text-[11px] text-muted-foreground">total views</div>
        </div>
      )}

      <div>
        <div className="mb-2 font-medium text-[10px] text-muted-foreground uppercase tracking-wide">
          Change status
        </div>
        <div className="flex gap-1.5">
          {[
            PostStatusEnum.DRAFT,
            PostStatusEnum.SCHEDULED,
            PostStatusEnum.PUBLISHED,
          ].map((s) => {
            const C = STATUS_CFG[s]
            return (
              <button
                key={s}
                onClick={() => onStatusChange(post.id, s)}
                className={`flex-1 cursor-pointer rounded-md border px-1 py-1.5 text-[11px] capitalize transition-all duration-150 ${post.status === s ? `${C.bgClass} ${C.borderClass} ${C.textClass} font-semibold` : "border-border bg-transparent font-medium text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                {s}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="gap-1.5"
        >
          <HugeiconsIcon icon={Edit02Icon} size={12} /> Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            onDelete(post.id)
            onClose()
          }}
          className="gap-1.5"
        >
          <HugeiconsIcon icon={Delete02Icon} size={12} /> Delete
        </Button>
      </div>
    </div>
  )
}
