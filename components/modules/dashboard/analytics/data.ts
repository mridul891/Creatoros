import {InstagramLogo as Instagram, YoutubeLogo as Youtube} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react/dist/lib/types";
import {
  AnalyticsRange,
  AnalyticsSortBy,
  AnalyticsViewMode,
} from "@/enums/analytics";
import {
  PlatformFilter as PlatformFilterEnum,
  PostType,
  SocialPlatform,
} from "@/enums/post";

export type Range = AnalyticsRange;
export type PlatformFilter = PlatformFilterEnum;
export type ViewMode = AnalyticsViewMode;
export type SortBy = AnalyticsSortBy;

type PlatformMeta = {
  id: SocialPlatform;
  label: string;
  icon: Icon;
  connected: boolean;
  color: string;
};

type RecentContentItem = {
  id: number;
  title: string;
  platform: SocialPlatform;
  type: Exclude<PostType, PostType.STORY>;
  views: number;
  er: number;
  thumb: string;
};

export const DIM = "var(--muted-foreground)";
export const ACCENT = "#E8402A";
export const MONO = "'SF Mono', 'Menlo', 'Monaco', monospace";

export const PLATFORMS: PlatformMeta[] = [
  {
    id: SocialPlatform.INSTAGRAM,
    label: "Instagram",
    icon: Instagram,
    connected: true,
    color: ACCENT,
  },
  {
    id: SocialPlatform.YOUTUBE,
    label: "YouTube",
    icon: Youtube,
    connected: true,
    color: "#aaa",
  },
];

function makeLineSeries(seed: number, base: number, trend: number, points: number) {
  let value = base;
  return Array.from({ length: points }, (_, i) => {
    value += Math.sin(i * 0.7 + seed) * base * 0.04 + trend;
    return Math.round(value);
  });
}

const followerSeries90 = makeLineSeries(1, 820000, 1100, 90);
const viewsSeries90 = makeLineSeries(2, 4200000, 18000, 90);

const labels7 = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const labels30 = Array.from({ length: 30 }, (_, i) => `${i + 1}`);
const labels90 = Array.from({ length: 90 }, (_, i) => {
  const date = new Date(2026, 2, 11 + i);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
});

export function buildChartData(range: Range) {
  const points =
    range === AnalyticsRange.SEVEN_DAYS
      ? 7
      : range === AnalyticsRange.THIRTY_DAYS
        ? 30
        : 90;
  const labels =
    range === AnalyticsRange.SEVEN_DAYS
      ? labels7
      : range === AnalyticsRange.THIRTY_DAYS
        ? labels30
        : labels90;
  const followerSlice = followerSeries90.slice(90 - points);
  const viewsSlice = viewsSeries90.slice(90 - points);

  return labels.map((label, i) => ({
    label,
    followers: followerSlice[i] ?? followerSlice[followerSlice.length - 1],
    views: viewsSlice[i] ?? viewsSlice[viewsSlice.length - 1],
  }));
}

export const BAR_DATA = [
  { title: "Morning Coffee Vlog", views: 142000, er: 6.8, type: PostType.VIDEO },
  { title: "Desk Setup Tour", views: 98000, er: 5.1, type: PostType.VIDEO },
  { title: "Productivity Tips", views: 210000, er: 8.2, type: PostType.REEL },
  { title: "Brand Collab #1", views: 74000, er: 3.9, type: PostType.PHOTO },
  { title: "Study With Me", views: 187000, er: 7.4, type: PostType.VIDEO },
  { title: "Tokyo BTS Reel", views: 265000, er: 9.1, type: PostType.REEL },
  { title: "Q&A Session", views: 56000, er: 4.3, type: PostType.VIDEO },
];

export const RADAR_DATA = [
  { axis: "Likes", ig: 88, yt: 72 },
  { axis: "Comments", ig: 62, yt: 54 },
  { axis: "Shares", ig: 71, yt: 45 },
  { axis: "Saves", ig: 84, yt: 0 },
  { axis: "CTR", ig: 0, yt: 68 },
  { axis: "Watch %", ig: 0, yt: 79 },
];

export const AI_INSIGHTS = [
  {
    id: 1,
    emoji: "📅",
    title: "Best posting windows",
    body: "Post Reels on Tue & Thu between 6–8 PM — your audience shows 2.3× higher engagement during those slots.",
    tag: "Scheduling",
    age: "2h ago",
  },
  {
    id: 2,
    emoji: "🎬",
    title: "Format opportunity",
    body: "Short-form vertical video (< 60s) is generating 4.1× more saves than static posts. Consider increasing Reels cadence.",
    tag: "Content",
    age: "2h ago",
  },
  {
    id: 3,
    emoji: "💰",
    title: "Sponsorship rate signal",
    body: "Your CPM ($14.20) is in the top 8% for lifestyle creators. Consider raising rates on your next pitch deck.",
    tag: "Monetisation",
    age: "2h ago",
  },
  {
    id: 4,
    emoji: "📈",
    title: "Retention drop-off",
    body: "YouTube videos > 12 min lose 40% of viewers at the 7-min mark. Try splitting into a two-part series.",
    tag: "YouTube",
    age: "2h ago",
  },
] as const;

export const RECENT_CONTENT: RecentContentItem[] = [
  {
    id: 1,
    title: "Tokyo BTS Reel",
    platform: SocialPlatform.INSTAGRAM,
    type: PostType.REEL,
    views: 265000,
    er: 9.1,
    thumb: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Productivity Tips",
    platform: SocialPlatform.INSTAGRAM,
    type: PostType.REEL,
    views: 210000,
    er: 8.2,
    thumb: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=300&h=300&fit=crop",
  },
  {
    id: 3,
    title: "Study With Me",
    platform: SocialPlatform.YOUTUBE,
    type: PostType.VIDEO,
    views: 187000,
    er: 7.4,
    thumb: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=300&fit=crop",
  },
  {
    id: 4,
    title: "Morning Coffee Vlog",
    platform: SocialPlatform.YOUTUBE,
    type: PostType.VIDEO,
    views: 142000,
    er: 6.8,
    thumb: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop",
  },
  {
    id: 5,
    title: "Desk Setup Tour",
    platform: SocialPlatform.YOUTUBE,
    type: PostType.VIDEO,
    views: 98000,
    er: 5.1,
    thumb: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=300&h=300&fit=crop",
  },
  {
    id: 6,
    title: "Brand Collab #1",
    platform: SocialPlatform.INSTAGRAM,
    type: PostType.PHOTO,
    views: 74000,
    er: 3.9,
    thumb: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop",
  },
];

export function formatMetricNumber(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
}
