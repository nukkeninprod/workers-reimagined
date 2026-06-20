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
import { StepImportJobOffer } from './pages/StepImportJobOffer'
import { StepAIExtract } from './pages/StepAIExtract'
import { StepConfirmExperience } from './pages/StepConfirmExperience'
import { StepSalary } from './pages/StepSalary'
import { StepContractType } from './pages/StepContractType'
import { StepCompanyDetails } from './pages/StepCompanyDetails'
import { StepCompanyDescription } from './pages/StepCompanyDescription'
import { StepLogo } from './pages/StepLogo'
import { StepLegal } from './pages/StepLegal'
import { StepDone } from './pages/StepDone'

const TOTAL_WORKER = 4
const TOTAL_COMPANY = 12

const WORKER_LABELS = ['Account type', 'Your details', 'Your profile', 'Done!']
const COMPANY_LABELS = ['Account', 'Method', 'Import', 'AI Review', 'Experience', 'Salary', 'Contract', 'Company', 'Description', 'Logo', 'Legal', 'Done']

const INITIAL: OnboardingState = {
  accountType: null,
  firstName: '', lastName: '', email: '', location: '',
  workTypes: [], skills: [],
  jobOfferMode: null,
  parsedJob: null,
  jobSkills: [],
  experienceLevel: 'medior',
  salary: 3292,
  contractType: null,
  companyName: '', companyAddress: '', companyVAT: '', companyWebsite: '',
  sector: '', companySize: '',
  companyDescription: '',
  contactFunction: '',
  agreeFees: false, agreeTerms: false,
}

export default function App() {
  const [step, setStep] = useState(1)
  const [state, setState] = useState<OnboardingState>(INITIAL)
  const [agreeMarketing, setAgreeMarketing] = useState(false)

  function update(fields: Partial<OnboardingState>) {
    setState(s => ({ ...s, ...fields }))
  }

  function toggle<K extends 'workTypes' | 'skills'>(key: K, value: string) {
    setState(s => ({
      ...s,
      [key]: s[key].includes(value) ? s[key].filter(v => v !== value) : [...s[key], value],
    }))
  }

  const maxStep = state.accountType === 'worker' ? TOTAL_WORKER : TOTAL_COMPANY
  const [visible, setVisible] = useState(true)

  function next() {
    setVisible(false)
    setTimeout(() => { setStep(s => Math.min(s + 1, maxStep)); setVisible(true) }, 260)
  }
  function back() {
    setVisible(false)
    setTimeout(() => { setStep(s => Math.max(s - 1, 1)); setVisible(true) }, 260)
  }

  return (
    <div className="bg-white text-slate-800 font-sans min-h-screen flex flex-col relative overflow-x-hidden">
      <Background />
      <Header />

      <main className="flex-grow flex flex-col px-6 z-10 relative">
        <div className="w-full max-w-3xl mx-auto pt-10 pb-0">
          <ProgressBar
            current={step}
            total={maxStep}
            labels={state.accountType === 'company' ? COMPANY_LABELS : WORKER_LABELS}
          />
        </div>

        <div
          className="flex-grow flex flex-col items-center pt-0 pb-8"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.26s ease, transform 0.26s ease',
          }}
        >

          {step === 1 && (
            <StepAccountType
              value={state.accountType}
              onSelect={v => { update({ accountType: v }); next() }}
            />
          )}

          {/* Worker flow */}
          {step === 2 && state.accountType === 'worker' && (
            <StepBasicInfo
              firstName={state.firstName} lastName={state.lastName}
              email={state.email} location={state.location}
              onChange={(field, value) => update({ [field]: value })}
            />
          )}
          {step === 3 && state.accountType === 'worker' && (
            <StepWorkerProfile
              workTypes={state.workTypes} skills={state.skills}
              onToggleWorkType={v => toggle('workTypes', v)}
              onToggleSkill={v => toggle('skills', v)}
            />
          )}
          {step === 4 && state.accountType === 'worker' && (
            <StepDone accountType={state.accountType} firstName={state.firstName}
              onRestart={() => { setState(INITIAL); setStep(1) }} />
          )}

          {/* Company flow */}
          {step === 2 && state.accountType === 'company' && (
            <StepJobOffer mode={state.jobOfferMode}
              onSelect={mode => { update({ jobOfferMode: mode }); next() }} />
          )}
          {step === 3 && state.accountType === 'company' && (
            <StepImportJobOffer onNext={next} />
          )}
          {step === 4 && state.accountType === 'company' && (
            <StepAIExtract
              initialSkills={state.parsedJob?.skills ?? []}
              onConfirm={skills => update({ jobSkills: skills })}
              onNext={next}
            />
          )}
          {step === 5 && state.accountType === 'company' && (
            <StepConfirmExperience
              value={state.experienceLevel}
              onChange={v => update({ experienceLevel: v })}
              onNext={next}
            />
          )}
          {step === 6 && state.accountType === 'company' && (
            <StepSalary
              value={state.salary}
              onChange={v => update({ salary: v })}
              onNext={next}
            />
          )}
          {step === 7 && state.accountType === 'company' && (
            <StepContractType
              value={state.contractType}
              onChange={v => update({ contractType: v })}
              onNext={next}
            />
          )}
          {step === 8 && state.accountType === 'company' && (
            <StepCompanyDetails
              companyName={state.companyName} companyAddress={state.companyAddress}
              companyVAT={state.companyVAT} companyWebsite={state.companyWebsite}
              sector={state.sector}
              onChange={(field, value) => update({ [field]: value })}
              onNext={next}
            />
          )}
          {step === 9 && state.accountType === 'company' && (
            <StepCompanyDescription
              value={state.companyDescription}
              onChange={v => update({ companyDescription: v })}
              onNext={next}
            />
          )}
          {step === 10 && state.accountType === 'company' && (
            <StepLogo onNext={next} />
          )}
          {step === 11 && state.accountType === 'company' && (
            <StepLegal
              agreeFees={state.agreeFees} agreeTerms={state.agreeTerms}
              agreeMarketing={agreeMarketing}
              onChange={(field, v) => {
                if (field === 'agreeMarketing') setAgreeMarketing(v)
                else update({ [field]: v as boolean })
              }}
              onNext={next}
            />
          )}
          {step === 12 && state.accountType === 'company' && (
            <StepDone accountType={state.accountType} firstName={state.firstName}
              onRestart={() => { setState(INITIAL); setStep(1) }} />
          )}

        </div>
      </main>

      <Footer />

      <NavButtons
        onNext={next}
        onBack={back}
        showBack={step > 1}
        nextLabel="Continue"
        hideNext={true}
      />
    </div>
  )
}
