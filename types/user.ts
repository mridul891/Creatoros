export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  lastSignInAt: Date | null;
  isOnboardingComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactInfo {
  email: string;
  phone: string;
  website?: string;
}

export enum CreatorType {
  Micro = "Micro",
  Macro = "Macro",
  Influencer = "Influencer",
  Brand = "Brand",
  Other = "Other",
}
