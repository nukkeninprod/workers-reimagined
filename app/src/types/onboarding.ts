export type AccountType = 'worker' | 'company'

export interface ParsedJobData {
  jobTitle: string
  specialty: string
  skills: string[]
  location: string
  workMode: string
  languages: string[]
  experienceLevel: string
  description: string
}

export interface OnboardingState {
  accountType: AccountType | null
  firstName: string
  lastName: string
  email: string
  location: string
  // Worker
  workTypes: string[]
  skills: string[]
  // Company – job offer
  jobOfferMode: 'import' | 'create' | null
  parsedJob: ParsedJobData | null
  jobSkills: string[]
  experienceLevel: string
  salary: number
  contractType: 'permanent' | 'freelance' | null
  // Company – company details
  companyName: string
  companyAddress: string
  companyVAT: string
  companyWebsite: string
  sector: string
  companySize: string
  companyDescription: string
  // Account
  contactFunction: string
  agreeFees: boolean
  agreeTerms: boolean
}
