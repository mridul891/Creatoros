import {
  FlashIcon,
  InstagramIcon,
  YoutubeIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export function EmptyState() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 p-10 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-[18px] border border-[rgba(232,64,42,0.18)] bg-[rgba(232,64,42,0.08)]">
        <HugeiconsIcon icon={FlashIcon} size={28} color="#E8402A" />
      </div>
      <div>
        <h3 className="mb-2 font-bold text-foreground text-xl">
          No platforms connected
        </h3>
        <p className="mx-auto max-w-[360px] text-muted-foreground text-sm leading-[1.7]">
          Connect your Instagram or YouTube account to start seeing analytics,
          insights, and growth data.
        </p>
      </div>
      <div className="flex gap-3">
        {[
          { icon: InstagramIcon, label: "Connect Instagram" },
          { icon: YoutubeIcon, label: "Connect YouTube" },
        ].map(({ icon, label }) => (
          <button
            key={label}
            className={`flex cursor-pointer items-center gap-2 rounded-[9px] border-none px-[18px] py-[10px] font-semibold text-[13px] text-foreground ${label === "Connect Instagram" ? "bg-[#E8402A]" : "bg-[#333]"}`}
          >
            <HugeiconsIcon icon={icon} size={14} /> {label}
          </button>
        ))}
      </div>
    </div>
  )
}
