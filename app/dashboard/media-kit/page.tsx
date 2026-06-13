import { MediaKitPage } from "@/components/modules/dashboard/MediaKitPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Kit",
  alternates: {
    canonical: "/dashboard/media-kit",
  },
};

export default function DashboardMediaKitPage() {
  return <MediaKitPage />;
}
