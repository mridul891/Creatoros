"use client";

import { InstagramLogo as Instagram, YoutubeLogo as Youtube, Clock, PencilSimple, Trash, X } from "@phosphor-icons/react/dist/ssr";
import {
  PostStatus as PostStatusEnum,
  SocialPlatform,
} from "@/enums/post";
import { MONO_FONT, Post, PostStatus, STATUS_CFG } from "./shared";

export function PostPanel({
  post,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
  inDialog = false,
}: {
  post: Post;
  onClose: () => void;
  onEdit: () => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, s: PostStatus) => void;
  inDialog?: boolean;
}) {
  const S = STATUS_CFG[post.status];
  const PlatformIcon = post.platform === SocialPlatform.INSTAGRAM ? Instagram : Youtube;
  const platformColor = post.platform === SocialPlatform.INSTAGRAM ? "#E8402A" : "#111111";
  const platformPillBg = post.platform === SocialPlatform.INSTAGRAM ? "bg-[#E8402A15]" : "bg-[#11111115]";
  const fmtTime = (t: string) => {
    if (!t) return "—";
    const [h, m] = t.split(":");
    const hr = parseInt(h, 10);
    return `${hr % 12 || 12}:${m} ${hr < 12 ? "AM" : "PM"}`;
  };

  return (
    <div
      className={
        inDialog
          ? "flex w-full flex-col gap-[16px] rounded-[18px] border border-border bg-card p-[22px]"
          : "sticky top-[28px] flex w-[300px] shrink-0 self-start flex-col gap-[16px] rounded-[18px] border border-border bg-card p-[22px]"
      }
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-[10px]">
          <div className={`flex h-[38px] w-[38px] items-center justify-center rounded-[11px] ${platformPillBg}`}>
            <PlatformIcon size={18} color={platformColor} />
          </div>
          <div>
            <div className={`${MONO_FONT} text-[10px] capitalize text-muted-foreground`}>{post.platform} · {post.type}</div>
            <div className={`mt-[3px] inline-flex items-center gap-[5px] rounded-[99px] px-[8px] py-[2px] ${S.bgClass}`}>
              <S.icon size={9} color={S.color} />
              <span className={`${MONO_FONT} ${S.textClass} text-[9px] font-bold uppercase`}>{S.label}</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="cursor-pointer p-[4px] text-muted-foreground">
          <X size={15} />
        </button>
      </div>

      <div className={` text-[15px] font-extrabold leading-[1.3] tracking-[-0.03em] text-foreground`}>{post.title}</div>
      {post.caption && <div className={` rounded-[10px] bg-muted px-[12px] py-[10px] text-[12px] leading-[1.6] text-muted-foreground`}>{post.caption}</div>}

      <div className="flex items-center gap-[8px] rounded-[10px] bg-muted px-[13px] py-[10px]">
        <Clock size={13} color="var(--muted-foreground)" />
        <span className={`${MONO_FONT} text-[12px] text-muted-foreground`}>June {post.day} · {post.time ? fmtTime(post.time) : "No time set"}</span>
      </div>

      {post.views && (
        <div className="rounded-[12px] border border-[rgba(232,64,42,0.15)] bg-[rgba(232,64,42,0.05)] p-[14px]">
          <div className={`mb-[3px] ${MONO_FONT} text-[10px] text-muted-foreground`}>PERFORMANCE</div>
          <div className={` text-[26px] font-black tracking-[-0.04em] text-[#E8402A]`}>{post.views}</div>
          <div className={`${MONO_FONT} text-[10px] text-muted-foreground`}>total views</div>
        </div>
      )}

      <div>
        <div className={`mb-[8px] ${MONO_FONT} text-[10px] tracking-[0.06em] text-muted-foreground`}>CHANGE STATUS</div>
        <div className="flex gap-[6px]">
          {[PostStatusEnum.DRAFT, PostStatusEnum.SCHEDULED, PostStatusEnum.PUBLISHED].map((s) => {
            const C = STATUS_CFG[s];
            return (
              <button
                key={s}
                onClick={() => onStatusChange(post.id, s)}
                className={`flex-1 cursor-pointer rounded-[9px] border px-[4px] py-[7px] ${MONO_FONT} text-[9px] capitalize transition-all duration-150 ${post.status === s ? `${C.bgClass} ${C.borderClass} ${C.textClass} font-bold` : "border-border bg-transparent font-normal text-muted-foreground"}`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[8px]">
        <button onClick={onEdit} className={`flex cursor-pointer items-center justify-center gap-[6px] rounded-[10px] border border-border bg-card p-[10px]  text-[12px] text-muted-foreground`}>
          <PencilSimple size={12} /> Edit
        </button>
        <button onClick={() => { onDelete(post.id); onClose(); }} className={`flex cursor-pointer items-center justify-center gap-[6px] rounded-[10px] border border-[rgba(232,64,42,0.2)] bg-[rgba(232,64,42,0.05)] p-[10px]  text-[12px] text-[#E8402A]`}>
          <Trash size={12} /> Delete
        </button>
      </div>
    </div>
  );
}
