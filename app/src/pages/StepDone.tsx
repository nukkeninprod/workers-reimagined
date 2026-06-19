import { Check } from 'lucide-react'
import type { AccountType } from '../types/onboarding'

interface Props {
  accountType: AccountType | null
  firstName: string
  onRestart: () => void
}

export function StepDone({ accountType, firstName, onRestart }: Props) {
  const name = firstName || 'there'
  const message = accountType === 'company'
    ? `Welcome, ${name}! Your company profile is ready. Start posting your first job.`
    : `Welcome, ${name}! Your profile is ready. Let's find the right match for you.`

  return (
    <div className="flex flex-col items-center w-full text-center">
      <div className="w-20 h-20 rounded-full bg-brand/10 flex items-center justify-center mb-8">
        <Check className="w-10 h-10 text-brand" strokeWidth={2.5} />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 tracking-tight">
        You're all set!
      </h1>
      <p className="text-slate-500 text-lg mb-10 max-w-sm">{message}</p>
      <button
        onClick={onRestart}
        className="bg-brand hover:bg-brand-dark text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-lg"
        style={{ boxShadow: '0 10px 25px -5px rgba(222,107,107,.25)' }}
      >
        Start over (demo)
      </button>
    </div>
  )
}
