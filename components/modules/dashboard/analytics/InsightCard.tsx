import { ArrowCounterClockwise } from "@phosphor-icons/react/dist/ssr";

export function InsightCard({
  insight,
  onRegenerate,
}: {
  insight: {
    emoji: string;
    title: string;
    body: string;
    tag: string;
    age: string;
  };
  onRegenerate: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card px-[22px] py-5 transition-colors duration-200 hover:border-[rgba(232,64,42,0.3)]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-[10px]">
          <span className="text-lg">{insight.emoji}</span>
          <div>
            <div className="text-[13px] font-semibold text-foreground">{insight.title}</div>
            <div className="mt-[3px] inline-block rounded-[99px] border border-[rgba(232,64,42,0.2)] bg-[rgba(232,64,42,0.1)] px-2 py-[1px] font-mono text-[10px] text-[#E8402A]">
              {insight.tag}
            </div>
          </div>
        </div>
        <button
          onClick={onRegenerate}
          className="flex cursor-pointer items-center justify-center rounded-[7px] border-none bg-transparent p-1.5 text-muted-foreground transition-colors duration-150 hover:bg-muted"
          title="Regenerate insight"
        >
          <ArrowCounterClockwise size={12} />
        </button>
      </div>
      <p className="m-0 text-[13px] leading-[1.65] text-muted-foreground">{insight.body}</p>
      <div className="font-mono text-[10px] text-muted-foreground">Last generated {insight.age}</div>
    </div>
  );
}
