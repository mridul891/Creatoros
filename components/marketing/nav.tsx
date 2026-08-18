import Image from "next/image"
import Link from "next/link"
import { WRAP_CLASS } from "./constants"

export function Nav() {
  const links = [
    { label: "Product", href: "/product" },
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
  ]

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex h-14 items-center border-border border-b bg-background/80 backdrop-blur-xl sm:h-16">
      <div className={`${WRAP_CLASS} flex items-center justify-between gap-3`}>
        <Link href="/" className="flex items-center gap-2 no-underline">
          <Image
            src="/logo.svg"
            alt="logo"
            width={96}
            height={96}
            className="sm:w-[100px]"
          />
        </Link>

        <div className="mx-auto hidden items-center gap-0.5 md:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-[7px] px-[13px] py-1.5 font-medium text-[13px] text-muted-foreground no-underline transition-colors duration-150 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* <Link
            href="/dashboard"
            className="rounded-[7px] border border-border bg-muted px-[14px] py-1.5  text-[13px] font-medium tracking-[-0.01em] text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
          >
            Dashboard →
          </Link> */}
          <Link
            href="/waitlist"
            className="rounded-[7px] bg-primary px-3 py-[7px] text-center font-semibold text-[12px] text-primary-foreground tracking-[-0.02em] no-underline shadow-sm transition-colors hover:bg-primary/90 sm:px-4 sm:text-[13px]"
          >
            <span className="sm:hidden">Join Waitlist</span>
            <span className="hidden sm:inline">Join The Waitlist</span>
          </Link>
          <Link
            href="/login"
            className="rounded-[7px] bg-primary px-3 py-[7px] text-center font-semibold text-[12px] text-primary-foreground tracking-[-0.02em] no-underline shadow-sm transition-colors hover:bg-primary/90 sm:px-4 sm:text-[13px]"
          >
            <span className="sm:hidden">Login</span>
            <span className="hidden sm:inline">Login</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
