import type { ReactNode } from "react";

import { FooterCTA } from "../modules/landing/footer-cta";
import { Nav } from "../modules/landing/nav";

type MarketingPageShellProps = {
  children: ReactNode;
};

export function MarketingPageShell({ children }: MarketingPageShellProps) {
  return (
    <div className="min-h-screen bg-[#050505]">
      <Nav />
      <main className="pt-14">{children}</main>
      <FooterCTA />
    </div>
  );
}
