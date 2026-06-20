import type { Metadata } from "next"
import "../styles/index.css";
import { Inter } from "next/font/google";
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const siteUrl = "https://www.notyetlaunched.xyz"
const siteName = "NotYetLaunched"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "NotYetLaunched — Brand Deal Tracker & Creator CRM for Content Creators",
    template: "%s | NotYetLaunched",
  },
  description:
    "NotYetLaunched is the brand deal tracker and creator CRM for content creators. Manage brand deals, influencer sponsorships, invoices, payments, and deadlines in one app — track your brand partnership pipeline and never miss a deadline.",
  applicationName: siteName,
  category: "Business Software",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  keywords: [
    // Primary keywords
    "brand deal tracker for creators",
    "creator CRM",
    "content creator brand deal management",
    "influencer sponsorship tracker",
    "brand deal management app",
    "creator invoice generator",
    "CRM for content creators",
    // Secondary keywords
    "sponsorship tracker for influencers",
    "influencer payment tracker",
    "brand deal pipeline creator",
    "content creator brand partnership tools",
    "influencer brand deal spreadsheet",
    "YouTube creator brand deal tracker",
    "TikTok creator sponsorship management",
    // Long-tail keywords
    "how to track brand deals as a content creator",
    "best app to manage brand sponsorships for influencers",
    "brand deal spreadsheet alternative for YouTubers",
    "how do creators manage their brand deals",
    "never miss a brand deal deadline app",
    "invoice generator for content creators",
    "how to organize brand partnerships as an influencer",
    "CRM for micro influencers",
    "brand deal tracker that sends reminders",
    "tool for tracking influencer payment status",
    "creator business management software",
    // Entity / semantic keywords
    "content creator",
    "influencer",
    "YouTuber",
    "TikToker",
    "Instagram creator",
    "podcaster",
    "UGC creator",
    "micro-influencer",
    "nano-influencer",
    "brand partnership",
    "sponsorship",
    "brand deal",
    "brand collaboration",
    "paid promotion",
    "invoice",
    "earnings",
    "deliverable",
    "deadline reminder",
    "sponsorship pipeline",
  ],
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title:
      "NotYetLaunched — Brand Deal Tracker & Creator CRM for Content Creators",
    description:
      "The brand deal tracker and creator CRM built for content creators. Manage brand deals, influencer sponsorships, invoices, payments, and deadlines from one streamlined workspace.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "NotYetLaunched — Brand Deal Tracker & Creator CRM for Content Creators",
    description:
      "Track brand deals, influencer sponsorships, invoices, and payments in one creator CRM. Never miss a brand deal deadline.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: siteName,
      url: siteUrl,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "NotYetLaunched is a brand deal tracker and creator CRM that helps content creators, YouTubers, TikTokers, and influencers manage brand deals, sponsorships, invoices, payments, and deadlines.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Creator business management software for solo creators",
      },
      audience: {
        "@type": "Audience",
        audienceType:
          "Content creators, influencers, YouTubers, TikTokers, micro-influencers",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is the best CRM for content creators?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "NotYetLaunched is a creator CRM built specifically for content creators and influencers. Unlike generic CRMs, it tracks brand deals, sponsorships, invoices, payments, and deadlines in one place so solo creators can manage their entire brand partnership pipeline.",
          },
        },
        {
          "@type": "Question",
          name: "How do influencers manage their brand deals?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Most influencers start with a brand deal spreadsheet, then move to a dedicated brand deal tracker like NotYetLaunched. It organizes every sponsorship and brand collaboration into a pipeline, sends deadline reminders, and tracks payment status so nothing slips through the cracks.",
          },
        },
        {
          "@type": "Question",
          name: "What app do YouTubers use for brand deals?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "YouTubers use NotYetLaunched as a brand deal tracker to manage sponsorships, deliverables, invoices, and payments. It works as a spreadsheet alternative for creators on YouTube, TikTok, Instagram, and other platforms.",
          },
        },
        {
          "@type": "Question",
          name: "What is a brand deal CRM?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A brand deal CRM is creator-focused software for managing brand partnerships. It tracks each brand deal from outreach to payment, including sponsorship terms, deliverables, deadlines, invoices, and earnings — purpose-built for creators rather than sales teams.",
          },
        },
        {
          "@type": "Question",
          name: "How do I track brand deal payments?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "With NotYetLaunched you can track influencer payment status for every brand deal, generate invoices, and see outstanding and paid earnings on a single dashboard, so you always know which sponsorships have paid.",
          },
        },
        {
          "@type": "Question",
          name: "How do I create invoices as a content creator?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "NotYetLaunched includes an invoice generator for content creators. Create a branded invoice for any brand deal in a few clicks, attach it to the sponsorship, and track its payment status automatically.",
          },
        },
      ],
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(inter.variable, "font-sans")}
    >
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster richColors />
      </body>
    </html>
  )
}