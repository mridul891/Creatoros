import {CheckCircle, Clock, PencilSimple} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react/dist/lib/types";
import {
  PostStatus as PostStatusEnum,
  PostType as PostTypeEnum,
  SocialPlatform,
} from "@/enums/post";
import type {
  Post,
  PostModalState,
} from "@/types/post";

export type PostStatus = PostStatusEnum;
export type PostType = PostTypeEnum;
export type Platform = SocialPlatform;
export type ModalState = PostModalState;
export type { Post };

export const MONO_FONT = "font-mono";
export const INPUT_CLASS = `w-full box-border rounded-[10px] border border-border bg-muted px-[14px] py-[10px] text-[13px] text-muted-foreground outline-none  focus:border-[#E8402A]`;

export const STATUS_CFG: Record<
  PostStatus,
  {
    color: string;
    textClass: string;
    bgClass: string;
    borderClass: string;
    label: string;
    icon: Icon;
  }
> = {
  [PostStatusEnum.PUBLISHED]: {
    color: "#16a34a",
    textClass: "text-[#16a34a]",
    bgClass: "bg-[rgba(22,163,74,0.08)]",
    borderClass: "border-[rgba(22,163,74,0.2)]",
    label: "Published",
    icon: CheckCircle,
  },
  [PostStatusEnum.SCHEDULED]: {
    color: "#E8402A",
    textClass: "text-[#E8402A]",
    bgClass: "bg-[rgba(232,64,42,0.08)]",
    borderClass: "border-[rgba(232,64,42,0.2)]",
    label: "Scheduled",
    icon: Clock,
  },
  [PostStatusEnum.DRAFT]: {
    color: "#717171",
    textClass: "text-[#717171]",
    bgClass: "bg-[rgba(113,113,113,0.08)]",
    borderClass: "border-[rgba(113,113,113,0.2)]",
    label: "Draft",
    icon: PencilSimple,
  },
};
