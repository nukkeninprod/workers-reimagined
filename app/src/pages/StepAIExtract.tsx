import { Check, MapPin, Globe, Tag, GraduationCap, FileText, Sparkles, type LucideIcon } from 'lucide-react'
import type { ParsedJobData } from '../types/onboarding'

// Mock data — will be replaced by real Claude API response
export const MOCK_PARSED: ParsedJobData = {
  jobTitle: 'Business Analyst (H/F)',
  specialty: 'IT Consultant',
  skills: ['Agile', 'Scrum', 'Kanban', 'Jira', 'Confluence', 'Power BI'],
  location: 'Brussels',
  workMode: 'Both',
  languages: ['FR', 'NL', 'EN'],
  experienceLevel: 'Medior',
  description: 'Looking for a Business Analyst to join NovaTech Solutions in Brussels. This permanent role allows for both onsite and remote work, targeting candidates with moderate IT consultancy experience.',
}

interface Props {
  parsed: ParsedJobData | null
  onNext: () => void
}

export function StepAIExtract({ parsed, onNext }: Props) {
  const data = parsed ?? MOCK_PARSED

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fade-up 0.45s ease both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.15s; }
        .fade-up-3 { animation-delay: 0.25s; }
      `}</style>

      {/* AI agent header */}
      <div className="fade-up fade-up-1 w-full flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-2xl bg-purple-100 flex items-center justify-center flex-shrink-0">
          <Sparkles size={20} className="text-purple-600" strokeWidth={1.8} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-sm">Workers AI</span>
            <span className="text-xs bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full font-semibold tracking-tight">
              ✓ Parsing complete
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Extracted from your job description</p>
        </div>
      </div>

      {/* Result card */}
      <div className="fade-up fade-up-2 w-full bg-white border-2 border-slate-100 rounded-3xl shadow-sm overflow-hidden mb-6">

        {/* Card header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-50">
          <h2 className="font-extrabold text-slate-900 text-2xl leading-tight">{data.jobTitle}</h2>
          <p className="text-slate-500 text-sm mt-1">{data.specialty}</p>
        </div>

        {/* Extracted fields */}
        <div className="px-6 py-2 divide-y divide-slate-50">
          <Row icon={Tag} label="Skills">
            <div className="flex flex-wrap gap-1.5 py-0.5">
              {data.skills.map(s => (
                <span key={s} className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-full">{s}</span>
              ))}
            </div>
          </Row>

          <Row icon={MapPin} label="Location">
            <span className="text-sm font-semibold text-slate-800">{data.location} · {data.workMode}</span>
          </Row>

          <Row icon={Globe} label="Languages">
            <div className="flex gap-1.5">
              {data.languages.map(l => (
                <span key={l} className="text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-full">{l}</span>
              ))}
            </div>
          </Row>

          <Row icon={GraduationCap} label="Experience">
            <span className="text-sm font-semibold text-slate-800">{data.experienceLevel}</span>
          </Row>

          <Row icon={FileText} label="Description">
            <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{data.description}</p>
          </Row>
        </div>

        {/* Footer summary */}
        <div className="px-6 py-4 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">
            {data.skills.length} skills · {data.languages.length} languages · 1 location
          </span>
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
            {[data.jobTitle, data.specialty, ...data.skills, ...data.languages, data.location, data.experienceLevel, data.description].filter(Boolean).length} fields filled
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="fade-up fade-up-3 flex flex-col items-center gap-3">
        <button
          onClick={onNext}
          className="bg-brand hover:bg-brand-dark text-white px-10 py-3.5 rounded-2xl font-semibold transition-all hover:scale-105 shadow-lg shadow-brand/20 text-sm"
        >
          Looks good, continue →
        </button>
        <p className="text-xs text-slate-400">You'll be able to edit any field in the next steps</p>
      </div>
    </div>
  )
}

function Row({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 py-3.5">
      <div className="flex items-center gap-2 w-32 flex-shrink-0">
        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <Check size={11} className="text-green-600" strokeWidth={3} />
        </div>
        <div className="flex items-center gap-1.5">
          <Icon size={12} className="text-slate-400" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</span>
        </div>
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}
