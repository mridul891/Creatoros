"use client";

import { Camera as Instagram, CirclePlay as Youtube } from "lucide-react";
import { SocialPlatform } from "@/enums/post";
import { Post, PRO_FONT, STATUS_CFG } from "./shared";

export function PostChip({ post, onClick }: { post: Post; onClick: () => void }) {
  const S = STATUS_CFG[post.status];
  const platformColor = post.platform === SocialPlatform.INSTAGRAM ? "#E8402A" : "#111111";
  const PlatformIcon = post.platform === SocialPlatform.INSTAGRAM ? Instagram : Youtube;
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`mb-[2px] flex cursor-pointer items-center gap-[4px] rounded-[5px] px-[7px] py-[3px] transition-opacity duration-150 hover:opacity-75 ${S.bgClass}`}
    >
      <PlatformIcon size={9} color={platformColor} />
      <span className={`${PRO_FONT} ${S.textClass} max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap text-[9.5px] font-medium`}>
        {post.title}
      </span>
    </div>
  );
}
