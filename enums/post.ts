export enum SocialPlatform {
  INSTAGRAM = "instagram",
  YOUTUBE = "youtube",
}

export enum PostStatus {
  PUBLISHED = "published",
  SCHEDULED = "scheduled",
  DRAFT = "draft",
}

export enum PostType {
  REEL = "reel",
  VIDEO = "video",
  PHOTO = "photo",
  STORY = "story",
}

export enum PlatformFilter {
  ALL = "all",
  INSTAGRAM = SocialPlatform.INSTAGRAM,
  YOUTUBE = SocialPlatform.YOUTUBE,
}
