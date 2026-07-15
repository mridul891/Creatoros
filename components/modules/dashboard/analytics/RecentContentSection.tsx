import {
  ArrowUpRight,
  InstagramLogo as Instagram,
  YoutubeLogo as Youtube,
  Eye,
  Image as ImageIcon,
  Play,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import {
  PlatformFilter as PlatformFilterEnum,
  PostType,
  SocialPlatform,
} from "@/enums/post";

import {
  PlatformFilter,
  RECENT_CONTENT,
  formatMetricNumber,
} from "./data";

export function RecentContentSection({
  platform,
  onChangePlatform,
}: {
  platform: PlatformFilter;
  onChangePlatform: (platform: PlatformFilter) => void;
}) {
  const selectedPlatform =
    platform === PlatformFilterEnum.ALL
      ? null
      : platform === PlatformFilterEnum.INSTAGRAM
        ? SocialPlatform.INSTAGRAM
        : SocialPlatform.YOUTUBE;

  return (
    <div className="mb-10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold tracking-[-0.02em] text-white">
            Recent Content
          </div>
          <div className="mt-0.5 font-mono text-xs text-[rgba(255,255,255,0.4)]">
            Sorted by performance
          </div>
        </div>
        <div className="flex rounded-[9px] border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.05)] p-[3px]">
          {[PlatformFilterEnum.ALL, PlatformFilterEnum.INSTAGRAM, PlatformFilterEnum.YOUTUBE].map((itemPlatform) => (
            <button
              key={itemPlatform}
              onClick={() => onChangePlatform(itemPlatform)}
              className={`cursor-pointer rounded-md border-none px-[13px] py-[5px] font-mono text-[11px] capitalize transition-all duration-150 ${platform === itemPlatform ? "bg-[rgba(255,255,255,0.1)] font-semibold text-white" : "bg-transparent font-normal text-[rgba(255,255,255,0.4)]"}`}
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
          (content) => selectedPlatform == null || content.platform === selectedPlatform,
        ).map((post) => (
          <div
            key={post.id}
            className="cursor-pointer overflow-hidden rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] transition-colors duration-200 hover:border-[rgba(255,255,255,0.15)]"
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
                className={`absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-md ${post.platform === SocialPlatform.INSTAGRAM ? "bg-[#E8402A]" : "bg-[#222]"}`}
              >
                {post.platform === SocialPlatform.INSTAGRAM ? (
                  <Instagram size={12} color="white" />
                ) : (
                  <Youtube size={12} color="white" />
                )}
              </div>
              <div className="absolute right-2 top-2 flex items-center gap-1 rounded-[99px] bg-[rgba(0,0,0,0.6)] px-[7px] py-[2px] backdrop-blur-[6px]">
                {post.type === PostType.VIDEO || post.type === PostType.REEL ? (
                  <Play size={8} color="white" />
                ) : (
                  <ImageIcon size={8} color="white" />
                )}
                <span className="font-mono text-[9px] uppercase tracking-[0.06em] text-white">
                  {post.type}
                </span>
              </div>
              <div className="absolute bottom-2 left-[10px] right-[10px] flex items-center justify-between">
                <div className="text-[13px] font-bold text-white">
                  {formatMetricNumber(post.views)}
                </div>
                <div className="rounded-[99px] bg-[rgba(232,64,42,0.85)] px-[7px] py-[2px] font-mono text-[11px] font-semibold text-white">
                  {post.er}% ER
                </div>
              </div>
            </div>

            <div className="px-[14px] py-3">
              <div className="mb-2 text-[13px] font-semibold leading-[1.4] text-white">
                {post.title}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 font-mono text-[11px] text-[rgba(255,255,255,0.4)]">
                  <Eye size={10} /> {formatMetricNumber(post.views)} views
                </div>
                <button className="flex cursor-pointer items-center gap-1 rounded-md border-none bg-[rgba(232,64,42,0.08)] px-[9px] py-[3px] font-mono text-[11px] font-semibold text-[#E8402A]">
                  Details <ArrowUpRight size={9} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
