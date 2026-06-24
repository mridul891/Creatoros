
import Link from "next/link";

import { WRAP_CLASS } from "./constants";
import Image from "next/image";

export function Nav() {
  const links = [
    { label: "Product", href: "/product" },
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
  ];

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex h-14 items-center border-b border-[rgba(255,255,255,0.07)] bg-[rgba(5,5,5,0.82)] backdrop-blur-xl sm:h-16">
      <div className={`${WRAP_CLASS} flex items-center justify-between gap-3`}>
        <Link href="/" className="flex items-center gap-2 no-underline">
          <Image src="/logo.svg" alt="logo" width={96} height={96} className="sm:w-[100px]" />
        </Link>

        <div className="mx-auto hidden items-center gap-0.5 md:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-[7px] px-[13px] py-1.5 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[13px] font-medium text-[rgba(255,255,255,0.84)] no-underline transition-colors duration-150 hover:text-white"
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
            className="rounded-[7px] bg-white px-3 py-[7px] text-center font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[12px] font-semibold tracking-[-0.02em] text-black no-underline shadow-[0_1px_2px_rgba(0,0,0,0.3)] sm:px-4 sm:text-[13px]"
          >
            <span className="sm:hidden">Join Waitlist</span>
            <span className="hidden sm:inline">Join The Waitlist</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
