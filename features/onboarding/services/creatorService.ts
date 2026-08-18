import type { CreatorType } from "@/features/onboarding/enums/creators"
import { prisma } from "@/lib/db/prisma"

export type CreatorOnboardingProfile = {
  creatorType: CreatorType | null
  niche: string | null
  instagramHandle: string | null
  youtubeHandle: string | null
  bio: string | null
}

export type CreatorUpsertInput = {
  creatorType: CreatorType
  niche: string
  instagramHandle?: string
  youtubeHandle?: string
  bio?: string
}

export async function getCreatorForUser(userId: string) {
  return prisma.creator.findUnique({
    where: { userId },
    select: {
      creatorType: true,
      niche: true,
      instagramHandle: true,
      youtubeHandle: true,
      bio: true,
    },
  })
}

export async function upsertCreatorAndCompleteOnboarding(
  userId: string,
  input: CreatorUpsertInput
) {
  await prisma.$transaction([
    prisma.creator.upsert({
      where: { userId },
      update: {
        creatorType: input.creatorType,
        niche: input.niche,
        instagramHandle: input.instagramHandle ?? null,
        youtubeHandle: input.youtubeHandle ?? null,
        bio: input.bio ?? null,
      },
      create: {
        id: userId,
        userId,
        creatorType: input.creatorType,
        niche: input.niche,
        instagramHandle: input.instagramHandle ?? null,
        youtubeHandle: input.youtubeHandle ?? null,
        bio: input.bio ?? null,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: {
        isOnboardingComplete: true,
      },
    }),
  ])
}
