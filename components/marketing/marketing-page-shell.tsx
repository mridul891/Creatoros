import type { ReactNode } from "react"

import { FooterCTA } from "./footer-cta"
import { Nav } from "./nav"

type MarketingPageShellProps = {
  children: ReactNode
}

export function MarketingPageShell({ children }: MarketingPageShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-14">{children}</main>
      <FooterCTA />
    </div>
  )
}
