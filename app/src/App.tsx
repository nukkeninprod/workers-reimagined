import { useState } from 'react'
import type { OnboardingState } from './types/onboarding'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { ProgressBar } from './components/ProgressBar'
import { Background } from './components/Background'
import { NavButtons } from './components/NavButtons'
import { StepAccountType } from './pages/StepAccountType'
import { StepBasicInfo } from './pages/StepBasicInfo'
import { StepJobOffer } from './pages/StepJobOffer'
import { StepWorkerProfile } from './pages/StepWorkerProfile'
import { StepCompanyProfile } from './pages/StepCompanyProfile'
import { StepDone } from './pages/StepDone'

const TOTAL = 4

const WORKER_LABELS = ['Account type', 'Your details', 'Your profile', 'All done!']
const COMPANY_LABELS = ['Account type', 'Job offer', 'Company details', 'All done!']

const INITIAL: OnboardingState = {
  accountType: null,
  firstName: '', lastName: '', email: '', location: '',
  workTypes: [], skills: [],
  jobOfferMode: null,
  companyName: '', sector: '', companySize: '',
}

export default function App() {
  const [step, setStep] = useState(1)
  const [state, setState] = useState<OnboardingState>(INITIAL)

  function update(fields: Partial<OnboardingState>) {
    setState(s => ({ ...s, ...fields }))
  }

  function toggle<K extends 'workTypes' | 'skills'>(key: K, value: string) {
    setState(s => ({
      ...s,
      [key]: s[key].includes(value) ? s[key].filter(v => v !== value) : [...s[key], value],
    }))
  }

  const next = () => setStep(s => Math.min(s + 1, TOTAL))
  const back = () => setStep(s => Math.max(s - 1, 1))

  return (
    <div className="bg-white text-slate-800 font-sans min-h-screen flex flex-col relative overflow-x-hidden">
      <Background />

      <Header />

      <main className="flex-grow flex flex-col px-6 z-10 relative">
        <div className="w-full max-w-3xl mx-auto pt-10 pb-0">
          <ProgressBar
            current={step}
            total={TOTAL}
            labels={state.accountType === 'company' ? COMPANY_LABELS : WORKER_LABELS}
          />
        </div>

        <div className="flex-grow flex flex-col items-center pt-0 pb-8">

        {step === 1 && (
          <StepAccountType
            value={state.accountType}
            onSelect={v => { update({ accountType: v }); next() }}
          />
        )}

        {/* Worker flow */}
        {step === 2 && state.accountType === 'worker' && (
          <StepBasicInfo
            firstName={state.firstName}
            lastName={state.lastName}
            email={state.email}
            location={state.location}
            onChange={(field, value) => update({ [field]: value })}
          />
        )}
        {step === 3 && state.accountType === 'worker' && (
          <StepWorkerProfile
            workTypes={state.workTypes}
            skills={state.skills}
            onToggleWorkType={v => toggle('workTypes', v)}
            onToggleSkill={v => toggle('skills', v)}
          />
        )}

        {/* Company flow */}
        {step === 2 && state.accountType === 'company' && (
          <StepJobOffer
            mode={state.jobOfferMode}
            onSelect={mode => { update({ jobOfferMode: mode }); next() }}
          />
        )}
        {step === 3 && state.accountType === 'company' && (
          <StepCompanyProfile
            companyName={state.companyName}
            sector={state.sector}
            companySize={state.companySize}
            onChange={(field, value) => update({ [field]: value })}
          />
        )}

        {step === 4 && (
          <StepDone
            accountType={state.accountType}
            firstName={state.firstName}
            onRestart={() => { setState(INITIAL); setStep(1) }}
          />
        )}
        </div>
      </main>

      <Footer />

      <NavButtons
        onNext={next}
        onBack={back}
        showBack={step > 1}
        nextLabel={step === TOTAL - 1 ? 'Finish' : 'Continue'}
        hideNext={step === TOTAL || step === 1 || (step === 2 && state.accountType === 'company')}
      />
    </div>
  )
}
