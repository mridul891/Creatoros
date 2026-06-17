export interface User {
  id: string
  supabaseUserId: string
  email: string
  name: string | null
  avatarUrl: string | null
  lastSignInAt: Date | null
  isOnboardingComplete: boolean
  createdAt: Date
  updatedAt: Date
}
