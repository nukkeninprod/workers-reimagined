export type AccountType = 'worker' | 'company'

export interface OnboardingState {
  accountType: AccountType | null
  firstName: string
  lastName: string
  email: string
  location: string
  // Worker
  workTypes: string[]
  skills: string[]
  // Company
  jobOfferMode: 'import' | 'create' | null
  companyName: string
  sector: string
  companySize: string
}
