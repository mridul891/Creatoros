"use client";

import { useState } from "react";
import { X } from "@phosphor-icons/react/dist/ssr";
import {
  PostStatus as PostStatusEnum,
  PostType as PostTypeEnum,
  SocialPlatform,
} from "@/enums/post";
import type { PostFormState } from "@/types/post";
import { Button } from "@/components/ui/button";
import {
  INPUT_CLASS,
  ModalState,
  MONO_FONT,
  PLATFORM_CFG,
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

  const labelClass = "mb-1.5 block text-xs font-medium text-foreground";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[90vh] w-[560px] overflow-y-auto rounded-xl bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <div className="text-[17px] font-bold tracking-tight text-foreground">{existing ? "Edit Post" : "New Post"}</div>
            <div className={`mt-0.5 ${MONO_FONT} text-[11px] text-muted-foreground`}>June {form.day}, 2026</div>
          </div>
          <Button variant="ghost" size="icon-sm" aria-label="Close" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5">
          <div>
            <label className={labelClass}>Post title *</label>
            <input
              value={form.title}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, title: e.target.value }));
                setErr("");
              }}
              placeholder="e.g. Morning Routine Reel"
              className={INPUT_CLASS}
            />
            {err && <div className="mt-1 text-[11px] font-medium text-destructive">{err}</div>}
          </div>

          <div>
            <label className={labelClass}>Caption / description</label>
            <textarea value={form.caption} onChange={(e) => setForm((prev) => ({ ...prev, caption: e.target.value }))} placeholder="Write your caption here…" rows={3} className={`${INPUT_CLASS} resize-y`} />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className={labelClass}>Platform</label>
              <div className="flex rounded-lg bg-muted p-[3px]">
                {[SocialPlatform.INSTAGRAM, SocialPlatform.YOUTUBE].map((p) => {
                  const P = PLATFORM_CFG[p];
                  return (
                    <button
                      key={p}
                      onClick={() => {
                        setForm((prev) => ({
                          ...prev,
                          platform: p,
                          type: typesByPlatform[p][0],
                        }));
                      }}
                      className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md px-2.5 py-2 text-xs transition-all duration-150 ${form.platform === p ? "bg-card font-semibold text-foreground shadow-sm" : "bg-transparent font-medium text-muted-foreground hover:text-foreground"}`}
                    >
                      <P.icon size={13} color={form.platform === p ? P.color : "var(--muted-foreground)"} />
                      {P.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className={labelClass}>Content type</label>
              <div className="flex gap-0.5 rounded-lg bg-muted p-[3px]">
                {typesByPlatform[form.platform].map((t) => (
                  <button
                    key={t}
                    onClick={() => setForm((prev) => ({ ...prev, type: t }))}
                    className={`flex-1 cursor-pointer rounded-md px-1.5 py-2 text-xs capitalize transition-all duration-150 ${form.type === t ? "bg-card font-semibold text-foreground shadow-sm" : "bg-transparent font-medium text-muted-foreground hover:text-foreground"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className={labelClass}>Day in June</label>
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
              <label className={labelClass}>Time</label>
              <input type="time" value={form.time} onChange={(e) => setForm((prev) => ({ ...prev, time: e.target.value }))} className={INPUT_CLASS} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Status</label>
            <div className="flex gap-2">
              {[PostStatusEnum.DRAFT, PostStatusEnum.SCHEDULED, PostStatusEnum.PUBLISHED].map((s) => {
                const C = STATUS_CFG[s];
                return (
                  <button
                    key={s}
                    onClick={() => setForm((prev) => ({ ...prev, status: s }))}
                    className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border px-2 py-2 text-xs capitalize transition-all duration-150 ${form.status === s ? `${C.bgClass} ${C.borderClass} ${C.textClass} font-semibold` : "border-border bg-transparent font-medium text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                  >
                    <C.icon size={12} />
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2.5 border-t border-border px-6 py-4">
          <Button variant="outline" onClick={onClose} className="px-4">
            Cancel
          </Button>
          <Button onClick={handleSave} className="px-5 font-semibold">
            {existing ? "Save Changes" : "Add Post"}
          </Button>
        </div>
      </div>
    </div>
  );
}
