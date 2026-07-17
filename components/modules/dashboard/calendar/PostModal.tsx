"use client";

import { useState } from "react";
import { InstagramLogo as Instagram, YoutubeLogo as Youtube, X } from "@phosphor-icons/react/dist/ssr";
import {
  PostStatus as PostStatusEnum,
  PostType as PostTypeEnum,
  SocialPlatform,
} from "@/enums/post";
import type { PostFormState } from "@/types/post";
import {
  INPUT_CLASS,
  ModalState,
  MONO_FONT,
  Platform,
  Post,
  PostStatus,
  PostType,
  STATUS_CFG,
} from "./shared";

export function PostModal({
  state,
  onSave,
  onClose,
}: {
  state: ModalState;
  onSave: (post: Omit<Post, "id">) => void;
  onClose: () => void;
}) {
  const existing = state.post;
  const [form, setForm] = useState<PostFormState>({
    title: existing?.title ?? "",
    caption: existing?.caption ?? "",
    platform: existing?.platform ?? SocialPlatform.INSTAGRAM,
    type: existing?.type ?? PostTypeEnum.REEL,
    status: existing?.status ?? PostStatusEnum.SCHEDULED,
    time: existing?.time ?? "12:00",
    day: existing?.day ?? state.day,
  });
  const [err, setErr] = useState("");

  const typesByPlatform: Record<Platform, PostType[]> = {
    [SocialPlatform.INSTAGRAM]: [PostTypeEnum.REEL, PostTypeEnum.PHOTO, PostTypeEnum.STORY],
    [SocialPlatform.YOUTUBE]: [PostTypeEnum.VIDEO],
  };

  function handleSave() {
    if (!form.title.trim()) {
      setErr("Title is required.");
      return;
    }
    onSave({ ...form, title: form.title.trim(), views: existing?.views });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-200 flex items-center justify-center bg-muted backdrop-blur-[6px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[90vh] w-[560px] overflow-y-auto rounded-[22px] bg-card shadow-[0_32px_80px_rgba(0,0,0,0.22)]">
        <div className="flex items-center justify-between border-b border-border px-[28px] py-[22px]">
          <div>
            <div className={` text-[17px] font-extrabold tracking-[-0.03em] text-foreground`}>{existing ? "Edit Post" : "New Post"}</div>
            <div className={`mt-[2px] ${MONO_FONT} text-[11px] text-muted-foreground`}>June {form.day}, 2026</div>
          </div>
          <button onClick={onClose} className="cursor-pointer rounded-[8px] p-[6px] text-muted-foreground">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-[18px] px-[28px] py-[24px]">
          <div>
            <label className={`mb-[6px] block  text-[12px] font-semibold text-muted-foreground`}>Post title *</label>
            <input
              value={form.title}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, title: e.target.value }));
                setErr("");
              }}
              placeholder="e.g. Morning Routine Reel"
              className={INPUT_CLASS}
            />
            {err && <div className={`mt-[4px] ${MONO_FONT} text-[11px] text-[#E8402A]`}>{err}</div>}
          </div>

          <div>
            <label className={`mb-[6px] block  text-[12px] font-semibold text-muted-foreground`}>Caption / description</label>
            <textarea value={form.caption} onChange={(e) => setForm((prev) => ({ ...prev, caption: e.target.value }))} placeholder="Write your caption here…" rows={3} className={`${INPUT_CLASS} resize-y`} />
          </div>

          <div className="grid grid-cols-2 gap-[14px]">
            <div>
              <label className={`mb-[6px] block  text-[12px] font-semibold text-muted-foreground`}>Platform</label>
              <div className="flex rounded-[11px] bg-muted p-[3px]">
                {[SocialPlatform.INSTAGRAM, SocialPlatform.YOUTUBE].map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setForm((prev) => ({
                        ...prev,
                        platform: p,
                        type: typesByPlatform[p][0],
                      }));
                    }}
                    className={`flex flex-1 cursor-pointer items-center justify-center gap-[6px] rounded-[8px] px-[10px] py-[8px] text-[12px] transition-all duration-150  ${form.platform === p ? "bg-card font-semibold text-foreground shadow-[0_1px_4px_rgba(0,0,0,0.1)]" : "bg-transparent font-normal text-muted-foreground"}`}
                  >
                    {p === SocialPlatform.INSTAGRAM ? <Instagram size={13} color={form.platform === p ? "#E8402A" : "var(--muted-foreground)"} /> : <Youtube size={13} color={form.platform === p ? "#111111" : "var(--muted-foreground)"} />}
                    {p === SocialPlatform.INSTAGRAM ? "Instagram" : "YouTube"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={`mb-[6px] block  text-[12px] font-semibold text-muted-foreground`}>Content type</label>
              <div className="flex gap-[2px] rounded-[11px] bg-muted p-[3px]">
                {typesByPlatform[form.platform].map((t) => (
                  <button
                    key={t}
                    onClick={() => setForm((prev) => ({ ...prev, type: t }))}
                    className={`flex-1 cursor-pointer rounded-[8px] px-[6px] py-[8px] text-[11px] capitalize transition-all duration-150  ${form.type === t ? "bg-card font-semibold text-foreground shadow-[0_1px_4px_rgba(0,0,0,0.1)]" : "bg-transparent font-normal text-muted-foreground"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-[14px]">
            <div>
              <label className={`mb-[6px] block  text-[12px] font-semibold text-muted-foreground`}>Day in June</label>
              <input
                type="number"
                min={1}
                max={30}
                value={form.day}
                onChange={(e) => setForm((prev) => ({ ...prev, day: Math.min(30, Math.max(1, parseInt(e.target.value, 10) || 1)) }))}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className={`mb-[6px] block  text-[12px] font-semibold text-muted-foreground`}>Time</label>
              <input type="time" value={form.time} onChange={(e) => setForm((prev) => ({ ...prev, time: e.target.value }))} className={INPUT_CLASS} />
            </div>
          </div>

          <div>
            <label className={`mb-[6px] block  text-[12px] font-semibold text-muted-foreground`}>Status</label>
            <div className="flex gap-[8px]">
              {[PostStatusEnum.DRAFT, PostStatusEnum.SCHEDULED, PostStatusEnum.PUBLISHED].map((s) => {
                const C = STATUS_CFG[s];
                return (
                  <button
                    key={s}
                    onClick={() => setForm((prev) => ({ ...prev, status: s }))}
                    className={`flex flex-1 cursor-pointer items-center justify-center gap-[6px] rounded-[10px] border-[1.5px] px-[9px] py-[9px] text-[12px] capitalize transition-all duration-150  ${form.status === s ? `${C.bgClass} ${C.borderClass} ${C.textClass} font-bold` : "border-border bg-transparent font-normal text-muted-foreground"}`}
                  >
                    <C.icon size={12} />
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-[10px] px-[28px] pb-[24px] pt-[16px]">
          <button onClick={onClose} className={`cursor-pointer rounded-[10px] border border-border bg-transparent px-[20px] py-[10px]  text-[13px] text-muted-foreground`}>
            Cancel
          </button>
          <button onClick={handleSave} className={`cursor-pointer rounded-[10px] border-none bg-primary px-[24px] py-[10px]  text-[13px] font-bold text-primary-foreground`}>
            {existing ? "FloppyDisk Changes" : "Add Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
