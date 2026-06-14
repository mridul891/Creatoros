import { Sparkles } from "lucide-react";
import Link from "next/link";

import { wrap } from "./constants";

export function Nav() {
  const links = [
    { label: "Product", href: "/product" },
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
  ];

  return (
    <nav className="fixed inset-x-0 top-0 z-100 flex h-14 items-center border-b border-[rgba(255,255,255,0.07)] bg-[rgba(5,5,5,0.82)] backdrop-blur-[24px]">
      <div className="flex items-center" style={wrap}>
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-white">
            <Sparkles size={13} color="#000" />
          </div>
          <span className="font-['SF_Pro_Display',_-apple-system,_BlinkMacSystemFont,_'Helvetica_Neue',_system-ui,_sans-serif] text-[15px] font-bold tracking-[-0.02em] text-white">
            NotYetLaunchedOS
          </span>
        </Link>

        <div className="mx-auto flex items-center gap-0.5">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-[7px] px-[13px] py-1.5 font-['SF_Pro_Display',_-apple-system,_BlinkMacSystemFont,_'Helvetica_Neue',_system-ui,_sans-serif] text-[13px] font-medium text-[rgba(255,255,255,0.84)] no-underline transition-colors duration-150 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* <Link
            href="/dashboard"
            className="rounded-[7px] border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.06)] px-[14px] py-1.5 font-['SF_Pro_Display',_-apple-system,_BlinkMacSystemFont,_'Helvetica_Neue',_system-ui,_sans-serif] text-[13px] font-medium tracking-[-0.01em] text-[rgba(255,255,255,0.65)] transition-colors duration-150 hover:bg-[rgba(255,255,255,0.1)] hover:text-white"
          >
            Dashboard →
          </Link> */}
          <Link
            href="/waitlist"
            className="rounded-[7px] bg-white px-4 py-[7px] font-['SF_Pro_Display',_-apple-system,_BlinkMacSystemFont,_'Helvetica_Neue',_system-ui,_sans-serif] text-[13px] font-semibold tracking-[-0.02em] text-black no-underline shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
          >
            Join The Waitlist
          </Link>
        </div>
      </div>
    </nav>
  );
}
