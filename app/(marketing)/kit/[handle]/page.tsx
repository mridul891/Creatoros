import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MediaKitPublicView } from "@/features/media-kit/components/MediaKitPublicView";
import { getMediaKitByHandle } from "@/features/media-kit/services/mediaKitService";
import { formatHandle } from "@/features/media-kit/utils/mediaKitFormatters";
import { normalizeMediaKitHandle } from "@/features/media-kit/utils/normalizeMediaKitHandle";

type PublicMediaKitPageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({
  params,
}: PublicMediaKitPageProps): Promise<Metadata> {
  const { handle } = await params;
  const mediaKit = await getMediaKitByHandle(handle);

  if (!mediaKit) {
    return {
      title: "Media kit not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const name = mediaKit.formData.profile.name.trim();
  const formattedHandle = formatHandle(mediaKit.formData.profile.handle);

  return {
    title: `${name} — Media Kit`,
    description: `View ${name}'s (${formattedHandle}) creator media kit with stats, audience insights, and rate card.`,
    alternates: {
      canonical: `/kit/${normalizeMediaKitHandle(handle)}`,
    },
    openGraph: {
      title: `${name} — Media Kit`,
      description: `Creator media kit for ${formattedHandle}.`,
      type: "profile",
    },
  };
}

export default async function PublicMediaKitPage({
  params,
}: PublicMediaKitPageProps) {
  const { handle } = await params;
  const mediaKit = await getMediaKitByHandle(handle);

  if (!mediaKit) {
    notFound();
  }

  const name = mediaKit.formData.profile.name.trim();

  return (
    <main className="min-h-svh bg-muted/30 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto mb-8 max-w-3xl space-y-1 text-center">
        <p className="font-semibold text-[11px] text-muted-foreground uppercase tracking-[0.11em]">
          Creator media kit
        </p>
        <h1 className="font-heading font-semibold text-2xl tracking-tight">
          {name}
        </h1>
      </div>

      <MediaKitPublicView
        data={mediaKit.formData}
        updatedAt={mediaKit.updatedAt}
      />

      <footer className="mx-auto mt-10 max-w-3xl text-center text-muted-foreground text-xs">
        Powered by NotYetLaunched
      </footer>
    </main>
  );
}
