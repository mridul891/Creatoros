import {
  CheckCircle,
  Clock,
  InstagramLogo,
  PencilSimple,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";
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
export const INPUT_CLASS = `w-full box-border rounded-md border border-border bg-muted px-3.5 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground outline-none transition-colors duration-150 focus:border-primary/40 focus:ring-2 focus:ring-primary/15`;

export const PLATFORM_CFG: Record<
  Platform,
  { icon: Icon; color: string; pillBg: string; label: string }
> = {
  [SocialPlatform.INSTAGRAM]: {
    icon: InstagramLogo,
    color: "#E1306C",
    pillBg: "bg-[#E1306C]/10",
    label: "Instagram",
  },
  [SocialPlatform.YOUTUBE]: {
    icon: YoutubeLogo,
    color: "var(--foreground)",
    pillBg: "bg-foreground/10",
    label: "YouTube",
  },
};

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
    bgClass: "bg-[#16a34a]/10",
    borderClass: "border-[#16a34a]/25",
    label: "Published",
    icon: CheckCircle,
  },
  [PostStatusEnum.SCHEDULED]: {
    color: "var(--primary)",
    textClass: "text-primary",
    bgClass: "bg-primary/10",
    borderClass: "border-primary/25",
    label: "Scheduled",
    icon: Clock,
  },
  [PostStatusEnum.DRAFT]: {
    color: "var(--muted-foreground)",
    textClass: "text-muted-foreground",
    bgClass: "bg-muted-foreground/10",
    borderClass: "border-muted-foreground/25",
    label: "Draft",
    icon: PencilSimple,
  },
};
