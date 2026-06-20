import { Briefcase, Clock } from 'lucide-react'

interface Props {
  value: 'permanent' | 'freelance' | null
  onChange: (v: 'permanent' | 'freelance') => void
  onNext: () => void
}

export function StepContractType({ value, onChange, onNext }: Props) {
  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-2 text-center tracking-tight">
        Type of recruitment
      </h1>
      <p className="text-slate-500 mb-10 text-center text-base">
        Permanent hire or freelance mission?
      </p>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        <button
          onClick={() => onChange('permanent')}
          className={[
            'flex flex-col items-start p-6 border-2 rounded-3xl transition-all duration-200 text-left',
            value === 'permanent'
              ? 'border-brand bg-[#fffafb] shadow-md shadow-brand/10'
              : 'bg-white border-gray-200 hover:border-brand/40',
          ].join(' ')}
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${value === 'permanent' ? 'bg-brand/10' : 'bg-slate-100'}`}>
            <Briefcase size={20} className={value === 'permanent' ? 'text-brand' : 'text-slate-500'} strokeWidth={1.5} />
          </div>
          <span className={`font-bold text-lg mb-1 ${value === 'permanent' ? 'text-brand' : 'text-slate-800'}`}>Permanent</span>
          <span className="text-sm text-slate-500">€1,000 / hire · No Cure No Pay</span>
        </button>

        <button
          onClick={() => onChange('freelance')}
          className={[
            'flex flex-col items-start p-6 border-2 rounded-3xl transition-all duration-200 text-left',
            value === 'freelance'
              ? 'border-brand bg-[#fffafb] shadow-md shadow-brand/10'
              : 'bg-white border-gray-200 hover:border-brand/40',
          ].join(' ')}
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${value === 'freelance' ? 'bg-brand/10' : 'bg-slate-100'}`}>
            <Clock size={20} className={value === 'freelance' ? 'text-brand' : 'text-slate-500'} strokeWidth={1.5} />
          </div>
          <span className={`font-bold text-lg mb-1 ${value === 'freelance' ? 'text-brand' : 'text-slate-800'}`}>Freelance</span>
          <span className="text-sm text-slate-500">€25 / day · occasional need</span>
        </button>
      </div>

      <button
        onClick={onNext}
        disabled={!value}
        className="bg-brand hover:bg-brand-dark text-white px-10 py-3.5 rounded-2xl font-semibold transition-all hover:scale-105 shadow-lg shadow-brand/20 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Continue →
      </button>
    </div>
  )
}
