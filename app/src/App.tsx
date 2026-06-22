import { useState } from 'react'
import type { OnboardingState } from './types/onboarding'
import { Header } from './components/Header'
import { ProgressBar } from './components/ProgressBar'
import { Background } from './components/Background'
import { NavButtons } from './components/NavButtons'
import { StepAccountType } from './pages/StepAccountType'
import { StepBasicInfo } from './pages/StepBasicInfo'
import { StepJobOffer } from './pages/StepJobOffer'
import { StepWorkerProfile } from './pages/StepWorkerProfile'
import { StepImportJobOffer } from './pages/StepImportJobOffer'
import { StepAIExtract } from './pages/StepAIExtract'
import { StepConfirmJobTitle } from './pages/StepConfirmJobTitle'
import { StepJobPreferences } from './pages/StepJobPreferences'
import { StepJobSchedule } from './pages/StepJobSchedule'
import { StepWorkConditions } from './pages/StepWorkConditions'
import { StepSignup } from './pages/StepSignup'
import { StepPricing } from './pages/StepPricing'
import { StepDone } from './pages/StepDone'
import { resolveSpecialty } from './data/domains'

const TOTAL_WORKER = 5
const TOTAL_COMPANY_FLEXI = 9
const TOTAL_COMPANY = 10

const WORKER_LABELS = ['Account type', 'Your details', 'Your profile', 'Sign up', 'Done!']
const COMPANY_LABELS_FLEXI = ['Account', 'Method', 'Import', 'Role', 'Skills', 'Contract', 'Schedule', 'Sign up', 'Done']
const COMPANY_LABELS = ['Account', 'Method', 'Import', 'Role', 'Skills', 'Preferences', 'Conditions', 'Sign up', 'Pricing', 'Done']

const INITIAL: OnboardingState = {
  accountType: null,
  firstName: '', lastName: '', email: '', location: '',
  workTypes: [], skills: [],
  jobOfferMode: null,
  parsedJob: null,
  jobCategory: null,
  jobTitle: '',
  specialty: '',
  jobSkills: [],
  jobLocation: '',
  workMode: 'hybrid',
  jobLanguages: [],
  experienceLevel: 'medior',
  salary: 3292,
  contractType: null,
  jobStartDate: '',
  jobEndDate: '',
  typicalWeek: ['mon', 'tue', 'wed', 'thu', 'fri'],
  shiftsByDay: {
    mon: [{ start: '09:00', end: '17:00', people: 1, breakMin: 0 }],
    tue: [{ start: '09:00', end: '17:00', people: 1, breakMin: 0 }],
    wed: [{ start: '09:00', end: '17:00', people: 1, breakMin: 0 }],
    thu: [{ start: '09:00', end: '17:00', people: 1, breakMin: 0 }],
    fri: [{ start: '09:00', end: '17:00', people: 1, breakMin: 0 }],
  },
  scheduleDetected: false,
  companyName: '', companyAddress: '', companyVAT: '', companyWebsite: '',
  sector: '', companySize: '',
  companyDescription: '',
  contactFunction: '',
  agreeFees: false, agreeTerms: false,
}

export default function App() {
  const [step, setStep] = useState(1)
  const [state, setState] = useState<OnboardingState>(INITIAL)
  const [signupValid, setSignupValid] = useState(false)

  function update(fields: Partial<OnboardingState>) {
    setState(s => ({ ...s, ...fields }))
  }

  function toggle<K extends 'workTypes' | 'skills'>(key: K, value: string) {
    setState(s => ({
      ...s,
      [key]: s[key].includes(value) ? s[key].filter(v => v !== value) : [...s[key], value],
    }))
  }

  const isFlexi = state.jobCategory === 'student_flexi'
  const maxStep = state.accountType === 'worker'
    ? TOTAL_WORKER
    : isFlexi ? TOTAL_COMPANY_FLEXI : TOTAL_COMPANY
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
            labels={state.accountType === 'company' ? (isFlexi ? COMPANY_LABELS_FLEXI : COMPANY_LABELS) : WORKER_LABELS}
          />
        </div>

        <div
          className="flex-grow flex flex-col items-center pt-0 pb-8"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.26s ease, transform 0.26s ease',
            zoom: (state.accountType === 'company' && step >= 4 && step <= 7) ? 1.13 : 1,
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
            <StepSignup initialEmail={state.email} onValidChange={setSignupValid} />
          )}
          {step === 5 && state.accountType === 'worker' && (
            <StepDone accountType={state.accountType} firstName={state.firstName}
              onRestart={() => { setState(INITIAL); setStep(1) }} />
          )}

          {/* Company flow */}
          {step === 2 && state.accountType === 'company' && (
            <StepJobOffer mode={state.jobOfferMode}
              onSelect={mode => { update({ jobOfferMode: mode }); next() }} />
          )}
          {step === 3 && state.accountType === 'company' && (
            <StepImportJobOffer
              onParsed={data => {
                const sched = data.schedule
                const workingDays = (sched?.workingDays ?? []) as ('mon'|'tue'|'wed'|'thu'|'fri'|'sat'|'sun')[]
                const shiftsMap = sched?.shifts ?? null
                const hasShifts = !!shiftsMap && Object.keys(shiftsMap).length > 0
                const hasSched = !!sched && (!!sched.startDate || !!sched.endDate || workingDays.length > 0 || hasShifts)
                const updates: Partial<OnboardingState> = {
                  parsedJob: data,
                  jobCategory: data.jobCategory ?? 'permanent_freelance',
                  jobTitle: data.jobTitle ?? '',
                  specialty: resolveSpecialty(data.specialty ?? ''),
                  jobSkills: data.skills ?? [],
                  jobLocation: data.location ?? '',
                  workMode: data.workMode ?? 'hybrid',
                  jobLanguages: data.languages ?? [],
                  companyName: data.companyName ?? '',
                  companyAddress: data.companyAddress ?? '',
                  contractType: data.contractType ?? null,
                  scheduleDetected: hasSched,
                }
                if (hasSched && sched) {
                  if (sched.startDate) updates.jobStartDate = sched.startDate
                  if (sched.endDate) updates.jobEndDate = sched.endDate
                  // Derive typical week: union of explicit workingDays + keys of shifts map
                  const week = new Set<string>(workingDays)
                  if (shiftsMap) Object.keys(shiftsMap).forEach(k => week.add(k))
                  if (week.size > 0) updates.typicalWeek = Array.from(week) as typeof workingDays
                  // Build shiftsByDay
                  if (hasShifts) {
                    const built: Record<string, { start: string; end: string; people: number; breakMin: number }[]> = {}
                    Object.entries(shiftsMap!).forEach(([day, list]) => {
                      built[day] = (list ?? []).map(s => ({ start: s.start, end: s.end, people: 1, breakMin: 0 }))
                    })
                    updates.shiftsByDay = built
                  }
                }
                update(updates)
              }}
              onNext={next}
            />
          )}
          {step === 4 && state.accountType === 'company' && (
            <StepConfirmJobTitle
              initialTitle={state.jobTitle}
              initialSpecialty={state.specialty}
              jobCategory={state.jobCategory}
              onChange={(title, specialty) => update({ jobTitle: title, specialty })}
            />
          )}
          {/* Company flow – step 5+ branches on jobCategory */}
          {step === 5 && state.accountType === 'company' && isFlexi && (
            <StepAIExtract
              initialSkills={state.jobSkills.length ? state.jobSkills : (state.parsedJob?.skills ?? [])}
              onChange={skills => update({ jobSkills: skills })}
              jobLanguages={state.jobLanguages}
              onLanguages={v => update({ jobLanguages: v })}
            />
          )}
          {step === 6 && state.accountType === 'company' && isFlexi && (
            <StepJobPreferences
              experienceLevel={state.experienceLevel}
              salary={state.salary}
              contractType={state.contractType}
              jobCategory={state.jobCategory}
              jobLocation={state.jobLocation}
              onExperience={v => update({ experienceLevel: v })}
              onSalary={v => update({ salary: v })}
              onContract={v => update({ contractType: v })}
              onLocation={v => update({ jobLocation: v })}
            />
          )}
          {step === 7 && state.accountType === 'company' && isFlexi && (
            <StepJobSchedule
              startDate={state.jobStartDate}
              endDate={state.jobEndDate}
              typicalWeek={state.typicalWeek}
              shiftsByDay={state.shiftsByDay as never}
              detected={state.scheduleDetected}
              onStartDate={v => update({ jobStartDate: v })}
              onEndDate={v => update({ jobEndDate: v })}
              onTypicalWeek={v => update({ typicalWeek: v })}
              onShifts={v => update({ shiftsByDay: v })}
            />
          )}
          {step === 8 && state.accountType === 'company' && isFlexi && (
            <StepSignup initialEmail={state.email} onValidChange={setSignupValid} onSocialLogin={next} />
          )}
          {step === 9 && state.accountType === 'company' && isFlexi && (
            <StepDone accountType={state.accountType} firstName={state.firstName}
              onRestart={() => { setState(INITIAL); setStep(1) }} />
          )}
          {step === 5 && state.accountType === 'company' && !isFlexi && (
            <StepAIExtract
              initialSkills={state.jobSkills.length ? state.jobSkills : (state.parsedJob?.skills ?? [])}
              onChange={skills => update({ jobSkills: skills })}
            />
          )}
          {step === 6 && state.accountType === 'company' && !isFlexi && (
            <StepJobPreferences
              experienceLevel={state.experienceLevel}
              salary={state.salary}
              contractType={state.contractType}
              jobCategory={state.jobCategory}
              onExperience={v => update({ experienceLevel: v })}
              onSalary={v => update({ salary: v })}
              onContract={v => update({ contractType: v })}
            />
          )}
          {step === 7 && state.accountType === 'company' && !isFlexi && (
            <StepWorkConditions
              jobLocation={state.jobLocation}
              workMode={state.workMode}
              jobLanguages={state.jobLanguages}
              onLocation={v => update({ jobLocation: v })}
              onWorkMode={v => update({ workMode: v })}
              onLanguages={v => update({ jobLanguages: v })}
            />
          )}
          {step === 8 && state.accountType === 'company' && !isFlexi && (
            <StepSignup initialEmail={state.email} onValidChange={setSignupValid} onSocialLogin={next} />
          )}
          {step === 9 && state.accountType === 'company' && !isFlexi && (
            <StepPricing />
          )}
          {step === 10 && state.accountType === 'company' && !isFlexi && (
            <StepDone accountType={state.accountType} firstName={state.firstName}
              onRestart={() => { setState(INITIAL); setStep(1) }} />
          )}

        </div>
      </main>

      <NavButtons
        onNext={next}
        onBack={back}
        showBack={step > 1}
        nextLabel="Continue"
        hideNext={true}
        onConfirm={
          (state.accountType === 'worker' && step >= 2 && step <= 4) ||
          (state.accountType === 'company' && step >= 4 && step <= 9)
            ? next : undefined
        }
        confirmDisabled={
          step === 4 && state.accountType === 'worker' ? !signupValid :
          step === 4 ? (!state.jobTitle.trim() || !state.specialty) :
          step === 5 && isFlexi ? state.jobSkills.length === 0 :
          step === 6 && isFlexi ? !state.contractType :
          step === 7 && isFlexi ? (!state.jobStartDate || !state.jobEndDate || state.typicalWeek.length === 0) :
          step === 8 && isFlexi ? !signupValid :
          step === 5 ? state.jobSkills.length === 0 :
          step === 6 ? !state.contractType :
          step === 8 ? !signupValid :
          false
        }
      />
    </div>
  )
}
