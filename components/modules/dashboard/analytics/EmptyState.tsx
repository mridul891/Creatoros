import { InstagramLogo as Instagram, YoutubeLogo as Youtube, Lightning } from "@phosphor-icons/react/dist/ssr";

export function EmptyState() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 p-10 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-[18px] border border-[rgba(232,64,42,0.18)] bg-[rgba(232,64,42,0.08)]">
        <Lightning size={28} color="#E8402A" />
      </div>
      <div>
        <h3 className="mb-2 text-xl font-bold text-foreground">No platforms connected</h3>
        <p className="mx-auto max-w-[360px] text-sm leading-[1.7] text-muted-foreground">
          Connect your Instagram or YouTube account to start seeing analytics, insights, and growth data.
        </p>
      </div>
      <div className="flex gap-3">
        {[
          { icon: Instagram, label: "Connect Instagram" },
          { icon: Youtube, label: "Connect YouTube" },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            className={`flex cursor-pointer items-center gap-2 rounded-[9px] border-none px-[18px] py-[10px] text-[13px] font-semibold text-foreground ${label === "Connect Instagram" ? "bg-[#E8402A]" : "bg-[#333]"}`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>
    </div>
  );
}
