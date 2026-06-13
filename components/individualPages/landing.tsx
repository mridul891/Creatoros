import { FooterCTA } from "../modules/Landing/footer-cta";
import { Hero } from "../modules/Landing/hero";
import { MadeFor } from "../modules/Landing/made-for";
import { Nav } from "../modules/Landing/nav";
import { Pricing } from "../modules/Landing/pricing";
import { SplitSection } from "../modules/Landing/split-section";
import { StatsSection } from "../modules/Landing/stats-section";
import {
  IMG_FEATURE_CALENDAR,
  IMG_FEATURE_DASHBOARD,
  IMG_INVOICING_SCREEN,
  IMG_PIPELINE_SCREEN,
} from "../modules/Landing/image-urls";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505]">
      <Nav />
      <Hero />
      <MadeFor />

      <SplitSection
        eyebrow="Analytics Dashboard"
        title="Know exactly what drives your growth"
        body="Connect Instagram and YouTube and get AI-powered insights on every post. Stop guessing — start optimizing with data that actually matters."
        bullets={[
          "Auto-syncs every 6 hours from all platforms",
          "Engagement rate, reach, and watch time tracking",
          "AI identifies your top-performing content patterns",
          "Best time to post recommendations",
        ]}
        img={IMG_FEATURE_DASHBOARD}
        imgAlt="Analytics dashboard"
      />

      <SplitSection
        eyebrow="Content Calendar"
        title="Plan months ahead, never miss a beat"
        body="A full-featured content planning workspace with drag-and-drop scheduling, status workflows, and AI-suggested posting times for maximum impact."
        img={IMG_FEATURE_CALENDAR}
        imgAlt="Content calendar"
        bullets={[
          "Drag-and-drop scheduling",
          "Status workflows",
          "AI-suggested posting times",
          "Maximum impact",
        ]}
        reverse
      />

      <SplitSection
        eyebrow="Sponsorship Pipeline"
        title="Turn brand outreach into closed deals"
        body="A visual Kanban pipeline built for creators — track every sponsorship from first email to final payment with full CRM capabilities."
        bullets={[
          "Visual pipeline: Lead → Negotiation → Signed → Paid",
          "Store contracts, briefs, and deliverables per deal",
          "Revenue forecasting and win-rate analytics",
          "Automated follow-up reminders",
        ]}
        img={IMG_PIPELINE_SCREEN}
        imgAlt="Sponsorship pipeline"

      />

      <SplitSection
        eyebrow="Invoicing"
        title="Get paid faster, look professional"
        body="Generate stunning, branded invoices directly from your deal data with one click. Track payments and send automated reminders."
        img={IMG_INVOICING_SCREEN}
        imgAlt="Invoicing"
        bullets={[
          "One-click creation",
          "Auto-branded",
          "Email tracking",
          "Overdue reminders",
        ]}
        reverse
      />

      <StatsSection />
      <Pricing />
      <FooterCTA />
    </div>
  );
}
