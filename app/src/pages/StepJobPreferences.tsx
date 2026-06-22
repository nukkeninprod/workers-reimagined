import { useState, useEffect, useRef } from 'react'
import { Briefcase, Clock, GraduationCap, Zap, X, Plus } from 'lucide-react'

const COMMON_LANGS = ['French', 'Dutch', 'English', 'German', 'Spanish', 'Italian']

const LEVELS = [
  { value: 'junior', label: 'Junior', sub: '0 – 2 yrs' },
  { value: 'medior', label: 'Medior', sub: '2 – 5 yrs' },
  { value: 'senior', label: 'Senior', sub: '5 – 10 yrs' },
  { value: 'expert', label: 'Expert', sub: '10+ yrs' },
]

const SALARY_CONFIG = {
  permanent: { min: 2200, max: 6000, step: 50,   default: 3292, avg: 3292, unit: '/mo gross',  label: 'Salary' },
  freelance:  { min: 200,  max: 1200, step: 25,   default: 500,  avg: 500,  unit: '/day',       label: 'Daily rate' },
  flexi:      { min: 10,   max: 30,   step: 0.5,  default: 14,   avg: 14,   unit: '/hr gross',  label: 'Hourly rate' },
  student:    { min: 400,  max: 1500, step: 25,   default: 650,  avg: 650,  unit: '/mo gross',  label: 'Salary' },
}

const PERM_CONTRACTS = [
  { value: 'permanent' as const, label: 'Permanent', Icon: Briefcase },
  { value: 'freelance' as const, label: 'Freelance',  Icon: Clock },
]
const FLEXI_CONTRACTS = [
  { value: 'flexi'   as const, label: 'Flexi-job', Icon: Zap },
  { value: 'student' as const, label: 'Student job', Icon: GraduationCap },
]

interface Props {
  experienceLevel: string
  salary: number
  contractType: 'permanent' | 'freelance' | 'flexi' | 'student' | null
  jobCategory?: 'student_flexi' | 'permanent_freelance' | null
  jobLocation?: string
  jobLanguages?: string[]
  onExperience: (v: string) => void
  onSalary: (v: number) => void
  onContract: (v: 'permanent' | 'freelance' | 'flexi' | 'student') => void
  onLocation?: (v: string) => void
  onLanguages?: (v: string[]) => void
}

export function StepJobPreferences({ experienceLevel, salary, contractType, jobCategory, jobLocation, jobLanguages, onExperience, onSalary, onContract, onLocation, onLanguages }: Props) {
  const isFlexi = jobCategory === 'student_flexi'
  const contracts = isFlexi ? FLEXI_CONTRACTS : PERM_CONTRACTS
  // If arriving on this step with a perm/freelance contractType from Claude but we're on flexi route, ignore it
  const effectiveContract = isFlexi && (contractType === 'permanent' || contractType === 'freelance')
    ? null
    : contractType
  const cfg = SALARY_CONFIG[effectiveContract ?? (isFlexi ? 'flexi' : 'permanent')]
  const [localSalary, setLocalSalary] = useState(salary || cfg.default)
  const selected = experienceLevel || 'medior'
  const [langInput, setLangInput] = useState('')
  const langRef = useRef<HTMLInputElement>(null)

  function addLang(lang?: string) {
    const val = (lang ?? langInput).trim()
    if (val && onLanguages && jobLanguages && !jobLanguages.map(l => l.toLowerCase()).includes(val.toLowerCase())) {
      onLanguages([...jobLanguages, val])
    }
    setLangInput('')
    langRef.current?.focus()
  }
  function removeLang(lang: string) {
    if (onLanguages && jobLanguages) onLanguages(jobLanguages.filter(l => l !== lang))
  }

  // Reset slider when contract type changes
  useEffect(() => {
    const key = effectiveContract ?? (isFlexi ? 'flexi' : 'permanent')
    const next = SALARY_CONFIG[key].default
    setLocalSalary(next)
    onSalary(next)
  }, [contractType, isFlexi])

  function handleSalary(v: number) {
    setLocalSalary(v)
    onSalary(v)
  }

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto gap-8">

      <h1 className="text-4xl font-extrabold text-slate-900 text-center tracking-tight">
        Are these job details correct?
      </h1>

      {/* Experience */}
      {!isFlexi && (
      <div>
        <p className="text-xs font-semibold text-slate-700 uppercase tracking-widest mb-3">Experience</p>
        <div className="grid grid-cols-4 gap-3">
          {LEVELS.map(({ value, label, sub }) => (
            <button
              key={value}
              onClick={() => onExperience(value)}
              className={[
                'flex flex-col items-center justify-center py-4 border-2 rounded-2xl transition-all gap-1',
                selected === value
                  ? 'border-brand bg-[#fffafb] shadow-sm shadow-brand/10'
                  : 'bg-white border-slate-200 hover:border-brand/40',
              ].join(' ')}
            >
              <span className={`font-bold text-sm ${selected === value ? 'text-brand' : 'text-slate-700'}`}>{label}</span>
              <span className="text-xs text-slate-400">{sub}</span>
            </button>
          ))}
        </div>
      </div>
      )}

      {/* Contract */}
      <div>
        <p className="text-xs font-semibold text-slate-700 uppercase tracking-widest mb-3">Contract</p>
        <div className="grid grid-cols-2 gap-3">
          {contracts.map(({ value, label, Icon }) => (
            <button
              key={value}
              onClick={() => onContract(value)}
              className={[
                'flex items-center gap-3 p-4 border-2 rounded-2xl transition-all text-left',
                contractType === value
                  ? 'border-brand bg-[#fffafb] shadow-sm shadow-brand/10'
                  : 'bg-white border-slate-200 hover:border-brand/40',
              ].join(' ')}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${contractType === value ? 'bg-brand/10' : 'bg-slate-100'}`}>
                <Icon size={18} className={contractType === value ? 'text-brand' : 'text-slate-500'} strokeWidth={1.5} />
              </div>
              <span className={`font-bold text-sm ${contractType === value ? 'text-brand' : 'text-slate-700'}`}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Salary — adapts to contract type */}
      <div>
        <div className="flex items-baseline justify-between mb-3">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-widest">
            {cfg.label}
          </p>
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
            €{localSalary.toLocaleString('fr-BE')}
            <span className="text-sm font-medium text-slate-400 ml-1">{cfg.unit}</span>
          </span>
        </div>
        <input
          type="range"
          min={cfg.min} max={cfg.max} step={cfg.step}
          value={localSalary}
          onChange={e => handleSalary(Number(e.target.value))}
          className="w-full accent-brand"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>€{cfg.min.toLocaleString('fr-BE')}</span>
          <span>market avg €{cfg.avg.toLocaleString('fr-BE')}</span>
          <span>€{cfg.max.toLocaleString('fr-BE')}</span>
        </div>
      </div>

      {/* Location & Languages — flexi route only */}
      {isFlexi && onLocation && (
        <div>
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-widest mb-3">Location</p>
          <input
            type="text"
            placeholder="City, Belgium"
            value={jobLocation ?? ''}
            onChange={e => onLocation(e.target.value)}
            className="w-full bg-white border-2 border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all"
          />
        </div>
      )}
      {isFlexi && onLanguages && jobLanguages !== undefined && (
        <div>
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-widest mb-3">Languages</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {jobLanguages.map(lang => (
              <span key={lang} className="flex items-center gap-2 bg-white border-2 border-slate-200 hover:border-brand/30 text-slate-700 font-semibold text-sm px-4 py-2 rounded-full transition-all group">
                {lang}
                <button onClick={() => removeLang(lang)} className="w-4 h-4 rounded-full bg-slate-200 group-hover:bg-red-100 flex items-center justify-center flex-shrink-0">
                  <X size={10} className="text-slate-400 group-hover:text-red-500" strokeWidth={3} />
                </button>
              </span>
            ))}
            {COMMON_LANGS.filter(l => !jobLanguages.map(x => x.toLowerCase()).includes(l.toLowerCase())).slice(0, 5).map(lang => (
              <button key={lang} onClick={() => addLang(lang)}
                className="flex items-center gap-1 px-4 py-2 border-2 border-dashed border-slate-200 text-slate-400 hover:border-brand hover:text-brand text-sm font-semibold rounded-full transition-all">
                <Plus size={12} strokeWidth={2.5} />{lang}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              ref={langRef}
              type="text"
              placeholder="Add a language…"
              value={langInput}
              onChange={e => setLangInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addLang()}
              className="flex-1 bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all"
            />
            <button onClick={() => addLang()} disabled={!langInput.trim()}
              className="px-4 py-3 rounded-2xl bg-brand text-white text-sm font-bold disabled:opacity-30 hover:bg-brand-dark transition-all">
              <Plus size={16} />
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
