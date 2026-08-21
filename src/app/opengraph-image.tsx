import { ImageResponse } from "next/og"

export const alt =
  "NotYetLaunched — Brand Deal Tracker & Creator CRM for content creators"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34, 197, 94, 0.35), transparent 70%), #000000",
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 34,
          fontWeight: 600,
          color: "#22c55e",
          marginBottom: 24,
        }}
      >
        NotYetLaunched
      </div>
      <div
        style={{
          fontSize: 76,
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          maxWidth: 980,
        }}
      >
        The Brand Deal Tracker & Creator CRM
      </div>
      <div
        style={{
          fontSize: 34,
          color: "#a1a1aa",
          marginTop: 32,
          maxWidth: 900,
          lineHeight: 1.3,
        }}
      >
        Manage brand deals, sponsorships, invoices, payments, and deadlines —
        built for content creators.
      </div>
    </div>,
    {
      ...size,
    }
  )
}
