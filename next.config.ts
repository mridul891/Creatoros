import { withPostHogConfig } from "@posthog/nextjs-config"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  allowedDevOrigins: ["clayton-nondeprecative-lauralee.ngrok-free.dev"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
}

// Uploads production source maps so Error Tracking stack traces are
// de-minified. Requires POSTHOG_API_KEY (personal API key with error
// tracking:write) and POSTHOG_PROJECT_ID to be set in the build env;
// upload is skipped when they're missing (e.g. local/preview builds).
export default withPostHogConfig(nextConfig, {
  personalApiKey: process.env.POSTHOG_API_KEY ?? "",
  projectId: process.env.POSTHOG_PROJECT_ID,
  host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.posthog.com",
  sourcemaps: {
    enabled: Boolean(
      process.env.POSTHOG_API_KEY && process.env.POSTHOG_PROJECT_ID
    ),
    deleteAfterUpload: true,
  },
})
