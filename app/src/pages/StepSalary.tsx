import { useState } from 'react'
import { Info } from 'lucide-react'

const MARKET_BENCHMARK = 3292

interface Props {
  value: number
  onChange: (v: number) => void
  onNext: () => void
}

export function StepSalary({ value, onChange, onNext }: Props) {
  const current = value || MARKET_BENCHMARK
  const [localVal, setLocalVal] = useState(current)

  function handleChange(v: number) {
    setLocalVal(v)
    onChange(v)
  }

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-2 text-center tracking-tight">
        What salary are you offering?
      </h1>
      <p className="text-slate-500 mb-10 text-center text-base">
        Market average for this profile is around <strong className="text-slate-700">€{MARKET_BENCHMARK.toLocaleString('fr-BE')}/month</strong> gross.
      </p>

      <div className="w-full bg-white border-2 border-slate-100 rounded-3xl p-8 shadow-sm mb-8">
        <div className="flex items-end justify-between mb-6">
          <span className="text-slate-500 text-sm font-semibold">Proposed monthly gross salary</span>
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            €{localVal.toLocaleString('fr-BE')}
          </span>
        </div>

        <input
          type="range"
          min={2200}
          max={6000}
          step={50}
          value={localVal}
          onChange={e => handleChange(Number(e.target.value))}
          className="w-full accent-brand"
        />

        <div className="flex justify-between text-xs text-slate-400 font-medium mt-2">
          <span>€2,200</span>
          <span>€6,000</span>
        </div>

        <div className="mt-6 flex items-start gap-2 bg-slate-50 rounded-xl p-3">
          <Info size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-slate-400 leading-relaxed">
            Figures are for informational purposes only and do not constitute any commitment from Workers.
          </p>
        </div>
      </div>

      <button
        onClick={onNext}
        className="bg-brand hover:bg-brand-dark text-white px-10 py-3.5 rounded-2xl font-semibold transition-all hover:scale-105 shadow-lg shadow-brand/20 text-sm"
      >
        Continue →
      </button>
    </div>
  )
}
