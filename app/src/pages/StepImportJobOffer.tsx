import { useState } from 'react'
import { Link } from 'lucide-react'

interface Props {
  onNext: () => void
}

export function StepImportJobOffer({ onNext }: Props) {
  const [textInput, setTextInput] = useState('')
  const [urlInput, setUrlInput] = useState('')

  const canContinue = textInput.trim().length > 0 || urlInput.trim().length > 0

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-3 text-center tracking-tight">
        Import your job offer
      </h1>
      <p className="text-slate-500 text-base mb-10 text-center">
        Paste the job description or a link — we'll extract the details automatically.
      </p>

      {/* Text paste area */}
      <textarea
        placeholder="Paste your job description here…"
        value={textInput}
        onChange={e => setTextInput(e.target.value)}
        rows={8}
        className="w-full bg-white border-2 border-slate-200 rounded-3xl px-6 py-5 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all resize-none mb-4 leading-relaxed"
      />

      {/* URL input row */}
      <div className="w-full flex items-center gap-3 mb-8">
        <div className="flex-1 relative">
          <Link size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="url"
            placeholder="Or paste a job listing URL…"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && canContinue && onNext()}
            className="w-full bg-white border-2 border-slate-200 rounded-2xl pl-10 pr-4 py-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all"
          />
        </div>
      </div>

      {/* Continue CTA */}
      <button
        onClick={onNext}
        disabled={!canContinue}
        className="bg-brand hover:bg-brand-dark text-white px-10 py-3.5 rounded-2xl font-semibold transition-all hover:scale-105 shadow-lg shadow-brand/20 text-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        Continue →
      </button>
    </div>
  )
}
