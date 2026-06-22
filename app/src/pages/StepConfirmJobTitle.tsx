import { useState, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'
import { getDomainsForCategory, findDomainForSpecialty, FLEXI_DOMAINS } from '../data/domains'

interface Props {
  initialTitle: string
  initialSpecialty: string
  jobCategory?: 'student_flexi' | 'permanent_freelance' | null
  onChange: (title: string, specialty: string) => void
}

export function StepConfirmJobTitle({ initialTitle, initialSpecialty, jobCategory, onChange }: Props) {
  const domains = getDomainsForCategory(jobCategory ?? null)
  const [title, setTitle] = useState(initialTitle || '')
  const [selectedDomain, setSelectedDomain] = useState(
    () => findDomainForSpecialty(initialSpecialty, jobCategory)
  )
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialty || '')
  const [choosingDomain, setChoosingDomain] = useState(false)

  const flexiLabels = new Set(FLEXI_DOMAINS.map(d => d.label))
  const isFlexiDomain = (label: string) => flexiLabels.has(label)

  useEffect(() => { onChange(title.trim(), selectedSpecialty) }, [title, selectedSpecialty])

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-10 text-center tracking-tight">
        Here's the role I detected.
      </h1>

      {/* Job title input */}
      <div className="w-full bg-white border-2 border-slate-200 rounded-2xl px-5 py-4 mb-8 focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10 transition-all">
        <input
          type="text"
          maxLength={100}
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Job title…"
          className="w-full text-slate-800 font-semibold text-base outline-none bg-transparent placeholder:text-slate-400"
        />
        <p className="text-xs text-slate-400 text-right mt-1">{title.length} / 100 characters</p>
      </div>

      {/* Domain + specialty */}
      {!choosingDomain ? (
        <div className="w-full bg-white border-2 border-slate-100 rounded-2xl p-6">
          {/* Domain header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <selectedDomain.Icon size={18} className="text-slate-500" strokeWidth={1.8} />
              <span className="font-bold text-slate-800 text-lg">{selectedDomain.label}</span>
            </div>
            <button
              onClick={() => setChoosingDomain(true)}
              className="flex items-center gap-1 text-sm text-slate-400 hover:text-brand transition-colors"
            >
              <ChevronRight size={14} className="rotate-180" strokeWidth={2} />
              Choose another domain
            </button>
          </div>

          {/* Specialty chips */}
          <p className="text-sm text-slate-400 mb-3 font-medium">Choose your speciality</p>
          <div className="flex flex-wrap gap-2.5">
            {selectedDomain.specialties.map(s => (
              <button
                key={s}
                onClick={() => setSelectedSpecialty(s)}
                className={`px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all ${
                  selectedSpecialty === s
                    ? 'border-brand text-brand bg-brand/5'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Domain picker */
        <div className="w-full bg-white border-2 border-slate-100 rounded-2xl p-6">
          <p className="text-sm text-slate-400 mb-4 font-medium">Choose a domain</p>
          <div className="grid grid-cols-2 gap-3">
            {domains.map(d => (
              <button
                key={d.label}
                onClick={() => {
                  setSelectedDomain(d)
                  setSelectedSpecialty('')
                  setChoosingDomain(false)
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-semibold text-left transition-all ${
                  selectedDomain.label === d.label
                    ? 'border-brand text-brand bg-brand/5'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <d.Icon size={16} strokeWidth={1.8} className="flex-shrink-0" />
                <span className="flex-1">{d.label}</span>
                {jobCategory === 'student_flexi' && isFlexiDomain(d.label) && (
                  <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wide bg-emerald-50 px-1.5 py-0.5 rounded-full">flexi</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="w-full flex justify-end mt-10">
      </div>
    </div>
  )
}
