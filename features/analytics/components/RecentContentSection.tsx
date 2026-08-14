import {
  ArrowUpRight02Icon,
  Image02Icon,
  InstagramIcon,
  PlayIcon,
  ViewIcon,
  YoutubeIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import {
  PlatformFilter as PlatformFilterEnum,
  PostType,
  SocialPlatform,
} from "@/enums/post"

import { formatMetricNumber, type PlatformFilter, RECENT_CONTENT } from "./data"

export function RecentContentSection({
  platform,
  onChangePlatform,
}: {
  platform: PlatformFilter
  onChangePlatform: (platform: PlatformFilter) => void
}) {
  const selectedPlatform =
    platform === PlatformFilterEnum.ALL
      ? null
      : platform === PlatformFilterEnum.INSTAGRAM
        ? SocialPlatform.INSTAGRAM
        : SocialPlatform.YOUTUBE

  return (
    <div className="mb-10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-semibold text-foreground text-sm tracking-[-0.02em]">
            Recent Content
          </div>
          <div className="mt-0.5 font-mono text-muted-foreground text-xs">
            Sorted by performance
          </div>
        </div>
        <div className="flex rounded-[9px] border border-border bg-muted p-[3px]">
          {[
            PlatformFilterEnum.ALL,
            PlatformFilterEnum.INSTAGRAM,
            PlatformFilterEnum.YOUTUBE,
          ].map((itemPlatform) => (
            <button
              key={itemPlatform}
              onClick={() => onChangePlatform(itemPlatform)}
              className={`cursor-pointer rounded-md border-none px-[13px] py-[5px] font-mono text-[11px] capitalize transition-all duration-150 ${platform === itemPlatform ? "bg-muted font-semibold text-foreground" : "bg-transparent font-normal text-muted-foreground"}`}
            >
              {itemPlatform === PlatformFilterEnum.ALL
                ? "All"
                : itemPlatform === PlatformFilterEnum.INSTAGRAM
                  ? "Instagram"
                  : "YouTube"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-[14px]">
        {RECENT_CONTENT.filter(
          (content) =>
            selectedPlatform == null || content.platform === selectedPlatform
        ).map((post) => (
          <div
            key={post.id}
            className="cursor-pointer overflow-hidden rounded-xl border border-border bg-card transition-colors duration-200 hover:border-border"
          >
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={post.thumb}
                alt={post.title}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="block h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.7)_0%,transparent_50%)]" />
              <div
                className={`absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-md ${post.platform === SocialPlatform.INSTAGRAM ? "bg-[#E8402A]" : "bg-[#222]"}`}
              >
                {post.platform === SocialPlatform.INSTAGRAM ? (
                  <HugeiconsIcon icon={InstagramIcon} size={12} color="white" />
                ) : (
                  <HugeiconsIcon icon={YoutubeIcon} size={12} color="white" />
                )}
              </div>
              <div className="absolute top-2 right-2 flex items-center gap-1 rounded-[99px] bg-muted px-[7px] py-[2px] backdrop-blur-[6px]">
                {post.type === PostType.VIDEO || post.type === PostType.REEL ? (
                  <HugeiconsIcon icon={PlayIcon} size={8} color="white" />
                ) : (
                  <HugeiconsIcon icon={Image02Icon} size={8} color="white" />
                )}
                <span className="font-mono text-[9px] text-foreground uppercase tracking-[0.06em]">
                  {post.type}
                </span>
              </div>
              <div className="absolute right-[10px] bottom-2 left-[10px] flex items-center justify-between">
                <div className="font-bold text-[13px] text-foreground">
                  {formatMetricNumber(post.views)}
                </div>
                <div className="rounded-[99px] bg-[rgba(232,64,42,0.85)] px-[7px] py-[2px] font-mono font-semibold text-[11px] text-foreground">
                  {post.er}% ER
                </div>
              </div>
            </div>

            <div className="px-[14px] py-3">
              <div className="mb-2 font-semibold text-[13px] text-foreground leading-[1.4]">
                {post.title}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                  <HugeiconsIcon icon={ViewIcon} size={10} />{" "}
                  {formatMetricNumber(post.views)} views
                </div>
                <button className="flex cursor-pointer items-center gap-1 rounded-md border-none bg-[rgba(232,64,42,0.08)] px-[9px] py-[3px] font-mono font-semibold text-[#E8402A] text-[11px]">
                  Details <HugeiconsIcon icon={ArrowUpRight02Icon} size={9} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
