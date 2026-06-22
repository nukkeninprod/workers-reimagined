import { useState } from 'react'
import { Link, Sparkles, Loader2 } from 'lucide-react'
import type { ParsedJobData } from '../types/onboarding'
import { ALL_SPECIALTIES } from '../data/domains'

interface Props {
  onParsed: (data: ParsedJobData) => void
  onNext: () => void
}

const SYSTEM_PROMPT = `You are a job offer parser. Extract structured data from the given job description and return ONLY valid JSON with these exact keys:
{
  "jobTitle": "string (exact job title from the offer)",
  "specialty": "string (pick the single best match from this list, use the exact string):\n${ALL_SPECIALTIES.join(', ')}",
  "skills": ["array", "of", "technical", "and", "soft", "skills"],
  "location": "string (city/country where the job is located, or empty string)",
  "workMode": "remote | hybrid | on-site",
  "languages": ["array of required languages"],
  "experienceLevel": "junior | medior | senior | expert",
  "description": "2-3 sentence summary of the role",
  "companyName": "string (company name if mentioned, or empty string)",
  "companyAddress": "string (company address if mentioned, or empty string)",
  "contractType": "permanent | freelance | flexi | student | null (permanent for CDI/full-time/employee; freelance for contractor/mission/independent; flexi for flexi-job/flexi worker/jobiste flexi; student for student job/job étudiant/jobiste étudiant/kot-job; null if unclear)",
  "jobCategory": "student_flexi | permanent_freelance — reason through the offer: if it mentions student job, jobiste, étudiant, flexi, interim, flexi-job, casual hours, limited hours per week, low hourly rate typical of student work → student_flexi; if it mentions CDI, CDD, permanent, full-time professional, freelance mission, consultant, contractor → permanent_freelance; when in doubt lean toward permanent_freelance",
  "schedule": {
    "startDate": "YYYY-MM-DD or null (extract only if a clear start date is mentioned; today is 2026-06-22 — resolve relative dates like 'starting July' → 2026-07-01)",
    "endDate": "YYYY-MM-DD or null (extract only if a clear end date or duration is mentioned; if 'for 2 months' from July, compute 2026-08-31)",
    "workingDays": "array of day keys (mon|tue|wed|thu|fri|sat|sun) — include a day only if explicitly mentioned (e.g. 'Mon-Fri' → [mon,tue,wed,thu,fri]; 'weekends' → [sat,sun]); empty array if not specified",
    "shifts": "object mapping day key → array of {start: HH:MM, end: HH:MM} — EXTRACT AGGRESSIVELY. Examples: 'Mon-Fri 9am-5pm' → {mon:[{start:'09:00',end:'17:00'}], tue:[...], ...}. 'lunch service 11h-15h and dinner 18h-23h' → each working day gets both shifts. 'weekends 14h-22h' → sat & sun each with that shift. If a single uniform time range is mentioned (e.g. '9 to 5' or 'shifts of 8h'), apply it to all workingDays. If hours mentioned but no specific days, still populate workingDays default (mon-fri for office; sat-sun for events; mon-sun for hospitality). Return null ONLY if absolutely no time range can be inferred. Always include all referenced working days as keys."
  }
}
Return ONLY the JSON object, no explanation, no markdown.`

export function StepImportJobOffer({ onParsed, onNext }: Props) {
  const [textInput, setTextInput] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canAnalyze = textInput.trim().length > 0 || urlInput.trim().length > 0

  async function handleAnalyze() {
    if (!canAnalyze || loading) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5',
          max_tokens: 2048,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: textInput || `Job listing URL: ${urlInput}` }],
        }),
      })

      if (!res.ok) throw new Error(`API error ${res.status}`)

      const data = await res.json()
      const raw: string = data.content?.[0]?.text ?? '{}'
      const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
      const parsed: ParsedJobData = JSON.parse(cleaned)
      onParsed(parsed)
    } catch (e) {
      console.error('Claude parse error:', e)
      setError(`Parsing failed: ${e instanceof Error ? e.message : String(e)}`)
      setLoading(false)
      return
    }

    setLoading(false)
    onNext()
  }

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-10 text-center tracking-tight">
        Import your job offer
      </h1>

      <textarea
        placeholder="Paste your job description here…"
        value={textInput}
        onChange={e => setTextInput(e.target.value)}
        rows={8}
        disabled={loading}
        className="w-full bg-white border-2 border-slate-200 rounded-3xl px-6 py-5 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all resize-none mb-4 leading-relaxed disabled:opacity-50"
      />

      <div className="w-full flex items-center gap-3 mb-8">
        <div className="flex-1 relative">
          <Link size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="url"
            placeholder="Or paste a job listing URL…"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            disabled={loading}
            className="w-full bg-white border-2 border-slate-200 rounded-2xl pl-10 pr-4 py-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all disabled:opacity-50"
          />
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4 font-medium">{error}</p>
      )}

      <div className="w-full flex justify-end">
        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze || loading}
          className="flex items-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #de6b6b)', boxShadow: '0 8px 24px -4px rgba(124,58,237,.35)' }}
        >
          {loading
            ? <><Loader2 size={16} className="animate-spin" /> Analyzing…</>
            : <><Sparkles size={16} /> Analyze with AI</>}
        </button>
      </div>
    </div>
  )
}
