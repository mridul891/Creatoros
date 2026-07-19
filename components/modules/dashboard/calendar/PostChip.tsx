"use client";

import { PLATFORM_CFG, Post, STATUS_CFG } from "./shared";

export function PostChip({ post, onClick }: { post: Post; onClick: () => void }) {
  const S = STATUS_CFG[post.status];
  const P = PLATFORM_CFG[post.platform];
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`mb-0.5 flex w-full cursor-pointer items-center gap-1 rounded px-1.5 py-[3px] text-left transition-opacity duration-150 hover:opacity-75 ${S.bgClass}`}
    >
      <P.icon size={10} color={P.color} className="shrink-0" />
      <span className={`${S.textClass} min-w-0 flex-1 truncate text-[10px] font-medium`}>
        {post.title}
      </span>
    </button>
  );
}
