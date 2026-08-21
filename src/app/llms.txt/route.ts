import { getSiteUrl } from "@/lib/infrastructure/site-url"

export const dynamic = "force-static"

export function GET() {
  const siteUrl = getSiteUrl()

  const llmsTxt = `# NotYetLaunched

> NotYetLaunched is a brand deal tracker and creator CRM for content creators. It helps solo creators, YouTubers, TikTokers, Instagram creators, podcasters, and UGC creators manage brand deals, sponsorships, invoices, payments, and deadlines in one workspace — replacing scattered spreadsheets, inboxes, DMs, and notes apps with a single sponsorship pipeline.

NotYetLaunched (also known as DealFlow) organizes every brand partnership around the real lifecycle of a paid collaboration: lead, negotiation, contract, deliverables, approval, publishing, invoice, and payment. A creator always knows what deals are active, what is due next, who owes money, and what to charge next time.

## Core capabilities

- [Visual deal pipeline](${siteUrl}/features): Track every sponsorship as a card moving through stages from first outreach to final payment.
- [Brand & contact CRM](${siteUrl}/features): Centralize brand contacts, campaign history, agreed rates, and collaboration notes so no context is lost between deals.
- [Deadline tracking](${siteUrl}/features): Content drafts, approval windows, publish dates, exclusivity dates, invoice dates, and payment due dates are tracked as part of each deal.
- [Invoice generation](${siteUrl}/features): Generate professional invoices from existing deal data, track their status, and mark payments as received.
- [Earnings dashboard](${siteUrl}/features): See monthly revenue, outstanding invoices, overdue payments, pipeline value, average deal value, and rate history.
- [Creator media kits](${siteUrl}/kit): Build a shareable public media kit with audience stats, rates, past work, and contact details.

## Pages

- [Home](${siteUrl}/): Product overview and positioning.
- [Features](${siteUrl}/features): Detailed breakdown of pipeline, CRM, deadlines, invoicing, and earnings tools.
- [Product](${siteUrl}/product): How the product works end to end.
- [Pricing](${siteUrl}/pricing): Plans and pricing for solo creators.
- [Join waitlist](${siteUrl}/waitlist): Early access signup.

## Legal

- [Privacy Policy](${siteUrl}/privacy-policy)
- [Terms and Conditions](${siteUrl}/terms-and-conditions)

## Optional

- [Sitemap](${siteUrl}/sitemap.xml): Full list of public pages.
- [robots.txt](${siteUrl}/robots.txt): Crawler rules — all major AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot) are explicitly allowed.
`

  return new Response(llmsTxt, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  })
}
