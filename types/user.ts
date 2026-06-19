export interface User {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  lastSignInAt: Date | null
  isOnboardingComplete: boolean
  onboardingStep: number
  createdAt: Date
  updatedAt: Date
}
