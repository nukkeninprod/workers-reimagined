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
        headers: { 'content-type': 'application/json' },
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
