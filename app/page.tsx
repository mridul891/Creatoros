import { LandingPage } from "@/components/individualPages/landing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return <LandingPage />;
}
