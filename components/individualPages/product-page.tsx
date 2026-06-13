import { BarChart3, Link2, ShieldCheck } from "lucide-react";

import { MarketingPageShell } from "./marketing-page-shell";
import { MadeFor } from "../modules/Landing/made-for";
import { SplitSection } from "../modules/Landing/split-section";
import { StatsSection } from "../modules/Landing/stats-section";
import { SubpageHero } from "../modules/Landing/subpage-hero";
import { ValuePillars } from "../modules/Landing/value-pillars";
import { WideSection } from "../modules/Landing/wide-section";
import { DIM } from "../modules/Landing/constants";
import {
  IMG_FEATURE_CALENDAR,
  IMG_FEATURE_DASHBOARD,
  IMG_INVOICING_SCREEN,
  IMG_PIPELINE_SCREEN,
} from "../modules/Landing/image-urls";

export function ProductPage() {
  return (
    <MarketingPageShell>
      <SubpageHero
        eyebrow="Product"
        title="A unified operating system for creator businesses"
        body="CreatorOS connects planning, analytics, deals, invoicing, and AI workflows in one shared workspace so creators can make faster decisions and grow predictable revenue."
        primaryCta="Start for free"
        secondaryCta="Explore demo"
      />

      <ValuePillars
        eyebrow="Built for outcomes"
        title="One platform, measurable business impact"
        body="Everything in CreatorOS is designed to help creators spend less time on operations and more time on growth. Teams get a clear source of truth across every stage of the revenue cycle."
        pillars={[
          {
            icon: <Link2 size={15} color={DIM} />,
            title: "Connected workflow",
            body: "Move from planning to publishing to invoicing without context switching across disconnected tools.",
          },
          {
            icon: <BarChart3 size={15} color={DIM} />,
            title: "Decision-grade visibility",
            body: "Track performance, conversion, and payout signals in one place to prioritize what moves revenue.",
          },
          {
            icon: <ShieldCheck size={15} color={DIM} />,
            title: "Reliable operations",
            body: "Use standardized pipelines, reminders, and billing flows that keep client commitments on schedule.",
          },
        ]}
      />

      <MadeFor />

      <SplitSection
        eyebrow="Performance Analytics"
        title="Know where growth comes from"
        body="Consolidated dashboards reveal the content and channels driving meaningful engagement, revenue, and repeat sponsorship opportunities."
        bullets={[
          "Cross-platform performance snapshots",
          "AI pattern detection for top posts",
          "Audience and engagement trend breakdowns",
          "Clear weekly growth reporting",
        ]}
        img={IMG_FEATURE_DASHBOARD}
        imgAlt="CreatorOS analytics dashboard"
      />

      <WideSection
        eyebrow="Revenue Operations"
        title="Run campaigns and payments from one place"
        body="Coordinate every sponsorship lifecycle from intake to payout while keeping your team and brand partners aligned."
        img={IMG_PIPELINE_SCREEN}
        imgAlt="Sponsorship pipeline and revenue workflow"
        cols={[
          {
            label: "Deal Pipeline",
            desc: "Visual stages for lead qualification, negotiation, and execution.",
          },
          {
            label: "Workflow Tracking",
            desc: "Track assets, approvals, and due dates tied to each campaign.",
          },
          {
            label: "Invoicing",
            desc: "Generate branded invoices from live deal data in one click.",
          },
          {
            label: "Forecasting",
            desc: "Project pipeline value and expected payouts by month.",
          },
        ]}
      />

      <SplitSection
        eyebrow="Creator Planning"
        title="Plan content and campaigns with confidence"
        body="Keep editorial, paid partnerships, and internal milestones aligned with a shared calendar and status-based execution."
        bullets={[
          "Month-level scheduling visibility",
          "Status workflows from draft to published",
          "Sync strategy with campaign deadlines",
          "Reduce missed deliverables",
        ]}
        img={IMG_FEATURE_CALENDAR}
        imgAlt="Content planning calendar"
        reverse
      />

      <SplitSection
        eyebrow="Billing Experience"
        title="Deliver a professional close on every deal"
        body="Turn signed opportunities into cash flow quickly with high-quality invoicing and payment follow-up workflows."
        bullets={[
          "Auto-filled invoices from deal records",
          "On-brand invoice templates",
          "Payment status visibility",
          "Automated follow-up reminders",
        ]}
        img={IMG_INVOICING_SCREEN}
        imgAlt="Invoice generation workflow"
      />

      <StatsSection />
    </MarketingPageShell>
  );
}
