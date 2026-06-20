import { useState } from 'react'
import { RefreshCw, Check } from 'lucide-react'

const MOCK_DESCRIPTION = 'NovaTech Solutions is an IT consulting firm based in Brussels, specialised in digital transformation. We help companies modernise their operations through agile practices, data-driven decision-making, and cutting-edge technology.'

interface Props {
  value: string
  onChange: (v: string) => void
  onNext: () => void
}

export function StepCompanyDescription({ value, onChange, onNext }: Props) {
  const [editing, setEditing] = useState(false)
  const current = value || MOCK_DESCRIPTION

  function handleRegenerate() {
    onChange(MOCK_DESCRIPTION)
    setEditing(false)
  }

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-2 text-center tracking-tight">
        Company description
      </h1>
      <p className="text-slate-500 mb-8 text-center text-base">
        Here's a description I generated from your website. Validate or adjust.
      </p>

      <div className="w-full bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-sm mb-6">
        {editing ? (
          <textarea
            value={current}
            onChange={e => onChange(e.target.value)}
            rows={5}
            className="w-full bg-white border-2 border-brand/30 rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all resize-none leading-relaxed"
          />
        ) : (
          <p className="text-sm text-slate-700 leading-relaxed">{current}</p>
        )}

        <div className="flex gap-3 mt-5">
          <button
            onClick={() => { onChange(current); setEditing(false); onNext() }}
            className="flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:bg-brand-dark"
          >
            <Check size={16} />
            Validate
          </button>
          <button
            onClick={() => setEditing(e => !e)}
            className="flex items-center gap-2 border-2 border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:border-brand/40"
          >
            Edit
          </button>
          <button
            onClick={handleRegenerate}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 px-3 py-2.5 rounded-xl text-sm transition-colors"
          >
            <RefreshCw size={14} />
            Regenerate
          </button>
        </div>
      </div>
    </div>
  )
}
