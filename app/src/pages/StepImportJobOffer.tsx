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
  "contractType": "permanent | freelance | null (permanent for CDI/full-time/employee contracts, freelance for freelance/contractor/independent/mission contracts, null if unclear)"
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
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5',
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: textInput || `Job listing URL: ${urlInput}` }],
        }),
      })

      if (!res.ok) throw new Error(`API error ${res.status}`)

      const data = await res.json()
      const raw: string = data.content?.[0]?.text ?? '{}'
      // Strip potential markdown code fences
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

      {/* Social import shortcuts */}
      <div className="w-full flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">or import from</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <div className="w-full flex gap-3 mb-6">
        {/* Gmail */}
        <button
          onClick={() => { onParsed({ jobTitle: '', specialty: '', skills: [], location: '', workMode: 'hybrid', languages: [], experienceLevel: 'medior', description: '', companyName: '', companyAddress: '', contractType: null }); onNext() }}
          className="flex-1 flex items-center justify-center gap-3 py-3.5 rounded-2xl border-2 border-slate-200 bg-white hover:border-[#EA4335]/40 hover:bg-[#EA4335]/5 transition-all group"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 7h12v10H6z" fill="white"/>
            <path d="M2 6.5C2 5.67 2.67 5 3.5 5h17c.83 0 1.5.67 1.5 1.5v11c0 .83-.67 1.5-1.5 1.5h-17C2.67 19 2 18.33 2 17.5v-11z" fill="white" stroke="#e5e7eb" strokeWidth="1.5"/>
            <path d="M2 7l10 7 10-7" stroke="#EA4335" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M2 7l10 7" stroke="#34A853" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M22 7l-10 7" stroke="#FBBC05" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <span className="text-sm font-semibold text-slate-700 group-hover:text-[#EA4335] transition-colors">Gmail</span>
        </button>

        {/* LinkedIn */}
        <button
          onClick={() => { onParsed({ jobTitle: '', specialty: '', skills: [], location: '', workMode: 'hybrid', languages: [], experienceLevel: 'medior', description: '', companyName: '', companyAddress: '', contractType: null }); onNext() }}
          className="flex-1 flex items-center justify-center gap-3 py-3.5 rounded-2xl border-2 border-slate-200 bg-white hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/5 transition-all group"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#0A66C2"/>
            <path d="M7 9.5H5v9h2v-9zM6 8.5a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5zM19 14c0-2.5-1.3-4.5-3.5-4.5-1 0-1.9.5-2.5 1.3V9.5h-2v9h2v-4.8c0-1.4.8-2.2 2-2.2s1.5.8 1.5 2.2v4.8h2.5V14z" fill="white"/>
          </svg>
          <span className="text-sm font-semibold text-slate-700 group-hover:text-[#0A66C2] transition-colors">LinkedIn</span>
        </button>
      </div>

      <div className="w-full flex justify-end">
        <AnalyzeCircle
          onAnalyze={handleAnalyze}
          loading={loading}
          disabled={!canAnalyze || loading}
        />
      </div>
    </div>
  )
}

function AnalyzeCircle({ onAnalyze, loading, disabled }: { onAnalyze: () => void; loading: boolean; disabled: boolean }) {
  return (
    <button
      onClick={onAnalyze}
      disabled={disabled}
      className="flex items-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
      style={{ background: 'linear-gradient(135deg, #7c3aed, #de6b6b)', boxShadow: '0 8px 24px -4px rgba(124,58,237,.35)' }}
    >
      {loading
        ? <Loader2 size={16} className="animate-spin" />
        : <Sparkles size={16} />}
      {loading ? 'Analyzing…' : 'Analyze with AI'}
    </button>
  )
}
