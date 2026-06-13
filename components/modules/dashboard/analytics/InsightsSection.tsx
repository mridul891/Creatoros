import { RotateCcw, Zap } from "lucide-react";

import { ACCENT, AI_INSIGHTS } from "./data";
import { InsightCard } from "./InsightCard";

type InsightItem = (typeof AI_INSIGHTS)[number];

export function InsightsSection({
  insights,
  regenerating,
  onRegenerate,
}: {
  insights: readonly InsightItem[];
  regenerating: number | null;
  onRegenerate: (id: number) => void;
}) {
  return (
    <div className="mb-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold tracking-[-0.02em] text-white">
            AI Insights
          </div>
          <div className="mt-0.5 font-mono text-xs text-[rgba(255,255,255,0.4)]">
            Powered by CreatorOS AI · Refreshes daily
          </div>
        </div>
        <button className="flex cursor-pointer items-center gap-[7px] rounded-lg border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.05)] px-[13px] py-[7px] font-mono text-[11px] text-[rgba(255,255,255,0.4)]">
          <Zap size={11} color={ACCENT} />
          Regenerate all
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {insights.map((insight) => (
          <div key={insight.id} className="relative">
            {regenerating === insight.id && (
              <div className="absolute inset-0 z-[2] flex items-center justify-center gap-2 rounded-xl bg-[rgba(0,0,0,0.7)] font-mono text-xs text-[rgba(255,255,255,0.4)] backdrop-blur-[4px]">
                <RotateCcw size={13} className="animate-[spin_0.8s_linear_infinite]" />
                Generating…
              </div>
            )}
            <InsightCard insight={insight} onRegenerate={() => onRegenerate(insight.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
