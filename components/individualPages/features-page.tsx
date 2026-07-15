import { Robot, Calendar, Handshake } from "@phosphor-icons/react/dist/ssr";

import { MarketingPageShell } from "./marketing-page-shell";
import { SplitSection } from "../modules/Landing/split-section";
import { SubpageHero } from "../modules/Landing/subpage-hero";
import { ValuePillars } from "../modules/Landing/value-pillars";
import { DIM } from "../modules/Landing/constants";
import {
  IMG_FEATURE_CALENDAR,
  IMG_FEATURE_DASHBOARD,
  IMG_INVOICING_SCREEN,
  IMG_PIPELINE_SCREEN,
} from "../modules/Landing/image-urls";

export function FeaturesPage() {
  return (
    <MarketingPageShell>
      <SubpageHero
        eyebrow="Features"
        title="Everything creators need to scale with less overhead"
        body="CreatorOS combines the core tools of a modern creator business into modular workflows that are easy to adopt, simple to manage, and built for measurable growth."
        primaryCta="Try all features"
        secondaryCta="See feature walkthrough"
      />

      <ValuePillars
        eyebrow="Core capabilities"
        title="Designed around the creator revenue lifecycle"
        body="From planning and publishing to sponsorship operations and invoicing, each feature is built to reduce operational drag and improve consistency."
        pillars={[
          {
            icon: <Calendar size={15} color={DIM} />,
            title: "Planning & publishing",
            body: "Align content strategy with campaign timelines using a shared calendar and clear statuses.",
          },
          {
            icon: <Handshake size={15} color={DIM} />,
            title: "Deal execution",
            body: "Manage partnership conversations, approvals, deliverables, and payout readiness in one pipeline.",
          },
          {
            icon: <Robot size={15} color={DIM} />,
            title: "AI assistance",
            body: "Use automated insights and recommendations to improve performance without heavy manual analysis.",
          },
        ]}
      />

      <SplitSection
        eyebrow="Analytics Dashboard"
        title="Track channel performance in real time"
        body="Understand what content performs best with unified visibility into engagement, growth trends, and platform-level outcomes."
        bullets={[
          "Performance views across major channels",
          "Engagement trend monitoring",
          "Audience behavior insights",
          "Actionable weekly recommendations",
        ]}
        img={IMG_FEATURE_DASHBOARD}
        imgAlt="Feature: analytics dashboard"
      />

      <SplitSection
        eyebrow="Content Calendar"
        title="Coordinate your publishing workflow"
        body="Plan upcoming posts, campaign milestones, and team handoffs with a centralized visual calendar that keeps everyone synchronized."
        bullets={[
          "Drag-and-drop planning",
          "Editorial status workflows",
          "Visibility into upcoming deadlines",
          "Cross-team collaboration support",
        ]}
        img={IMG_FEATURE_CALENDAR}
        imgAlt="Feature: content calendar"
        reverse
      />

      <SplitSection
        eyebrow="Sponsorship Pipeline"
        title="Systematize deal management from lead to paid"
        body="Keep partnership operations organized with a clear lifecycle for conversations, contracts, approvals, and final payment."
        bullets={[
          "Custom stages for each pipeline step",
          "Deal-level notes and documentation",
          "Deliverable tracking",
          "Forecasted revenue visibility",
        ]}
        img={IMG_PIPELINE_SCREEN}
        imgAlt="Feature: sponsorship pipeline"
      />

      <SplitSection
        eyebrow="Invoicing"
        title="Turn completed work into revenue faster"
        body="Generate polished invoices from live deal records, follow payment status, and reduce delays with built-in reminders."
        bullets={[
          "One-click invoice generation",
          "Consistent brand presentation",
          "Payment status tracking",
          "Automated reminder workflows",
        ]}
        img={IMG_INVOICING_SCREEN}
        imgAlt="Feature: invoicing"
        reverse
      />

    </MarketingPageShell>
  );
}
