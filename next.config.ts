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

export default nextConfig
