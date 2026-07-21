import { DealPriority, SponsorshipStage } from "@/enums/sponsorship";
import type { Deal } from "@/types/sponsorship";
import type { MonthlyRevenueDatum } from "./data";
import { STAGES, type Stage } from "./shared";

export interface PipelineSummary {
  totalPipeline: number;
  totalPaid: number;
  totalSigned: number;
  totalDeals: number;
  activeDeals: number;
  plannedCount: number;
  shootingCount: number;
  pendingReviewCount: number;
  publishedCount: number;
  highPriorityOpenCount: number;
}

export interface FunnelDatum {
  stage: Stage;
  count: number;
  value: number;
}

export interface CategoryDatum {
  cat: string;
  val: number;
}

export interface InsightMetrics {
  overdue: number;
  negotiationVal: number;
  topCat: string;
  signedPct: number;
}

export interface RevenueTrendMetrics {
  ytd: number;
  avgDeal: number;
}

export function calculatePipelineSummary(deals: Deal[]): PipelineSummary {
  const totalPipeline = deals.reduce((sum, deal) => sum + deal.value, 0);
  const totalPaid = deals
    .filter((deal) => deal.stage === SponsorshipStage.PAID)
    .reduce((sum, deal) => sum + deal.value, 0);
  const totalSigned = deals
    .filter((deal) => deal.stage === SponsorshipStage.SIGNED)
    .reduce((sum, deal) => sum + deal.value, 0);
  const plannedCount = deals.filter((deal) => deal.stage === SponsorshipStage.LEAD).length;
  const shootingCount = deals.filter((deal) => deal.stage === SponsorshipStage.OUTREACH).length;
  const pendingReviewCount = deals.filter((deal) => deal.stage === SponsorshipStage.SIGNED).length;
  const publishedCount = deals.filter((deal) => deal.stage === SponsorshipStage.PAID).length;
  const activeDeals = deals.filter((deal) => deal.stage !== SponsorshipStage.PAID).length;
  const highPriorityOpenCount = deals.filter(
    (deal) => deal.priority === DealPriority.HIGH && deal.stage !== SponsorshipStage.PAID,
  ).length;

  return {
    totalPipeline,
    totalPaid,
    totalSigned,
    totalDeals: deals.length,
    activeDeals,
    plannedCount,
    shootingCount,
    pendingReviewCount,
    publishedCount,
    highPriorityOpenCount,
  };
}

export function buildFunnelData(deals: Deal[]): FunnelDatum[] {
  return STAGES.map((stage) => ({
    stage,
    count: deals.filter((deal) => deal.stage === stage).length,
    value: deals
      .filter((deal) => deal.stage === stage)
      .reduce((sum, deal) => sum + deal.value, 0),
  }));
}

export function buildCategoryBreakdown(deals: Deal[]): CategoryDatum[] {
  const categoryMap: Record<string, number> = {};
  deals.forEach((deal) => {
    categoryMap[deal.category] = (categoryMap[deal.category] ?? 0) + deal.value;
  });

  return Object.entries(categoryMap)
    .map(([cat, val]) => ({ cat: cat === "Food & Bev" ? "Food" : cat, val }))
    .sort((a, b) => b.val - a.val)
    .slice(0, 6);
}

export function calculateInsightMetrics(deals: Deal[]): InsightMetrics {
  const overdue = deals.filter(
    (deal) => deal.priority === DealPriority.HIGH && deal.stage !== SponsorshipStage.PAID,
  ).length;
  const negotiationVal = deals
    .filter((deal) => deal.stage === SponsorshipStage.NEGOTIATION)
    .reduce((sum, deal) => sum + deal.value, 0);
  const topCat = Object.entries(
    deals.reduce<Record<string, number>>((acc, deal) => {
      acc[deal.category] = (acc[deal.category] ?? 0) + deal.value;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
  const signedPct =
    deals.length > 0
      ? Math.round(
          (deals.filter(
            (deal) =>
              deal.stage === SponsorshipStage.SIGNED || deal.stage === SponsorshipStage.PAID,
          ).length /
            deals.length) *
            100,
        )
      : 0;

  return { overdue, negotiationVal, topCat, signedPct };
}

export function getValueRankedDeals(deals: Deal[]): Deal[] {
  return [...deals].sort((a, b) => b.value - a.value);
}

export function calculateRevenueTrendMetrics(data: MonthlyRevenueDatum[]): RevenueTrendMetrics {
  const ytd = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalDeals = data.filter((item) => item.deals > 0).reduce((sum, item) => sum + item.deals, 0);
  return {
    ytd,
    avgDeal: totalDeals > 0 ? Math.round(ytd / totalDeals) : 0,
  };
}
