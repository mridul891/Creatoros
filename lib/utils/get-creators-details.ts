import { prisma } from "../db/prisma";
import { getCurrentUserId } from "../auth/get-current-user";
import { CreatorUpsertInput } from "@/features/onboarding/services/creatorService";

export async function getCreatorsDetails() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return null;
  }

  const creatorsDetails = await prisma.creator.findUnique({
    where: {
      userId: userId,
    },
    select: {
      creatorType: true,
      niche: true,
      instagramHandle: true,
      youtubeHandle: true,
      bio: true,
      user : {
        select: {
          name: true,
          avatarUrl: true,
        },
      },
    },
  });
  return creatorsDetails as
    | (CreatorUpsertInput & {
        user: {
          name: string | null;
          avatarUrl: string | null;
        };
      })
    | null;
}
