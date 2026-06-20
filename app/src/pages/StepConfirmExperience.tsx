const LEVELS = [
  { value: 'junior',  label: 'Junior',  sub: '0 – 2 years' },
  { value: 'medior',  label: 'Medior',  sub: '2 – 5 years' },
  { value: 'senior',  label: 'Senior',  sub: '5 – 10 years' },
  { value: 'expert',  label: 'Expert',  sub: '10+ years' },
]

interface Props {
  value: string
  onChange: (v: string) => void
  onNext: () => void
}

export function StepConfirmExperience({ value, onChange, onNext }: Props) {
  const selected = value || 'medior'

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-2 text-center tracking-tight">
        Experience level
      </h1>
      <p className="text-slate-500 mb-8 text-center text-base">
        I deduced <strong className="text-slate-700">{selected.charAt(0).toUpperCase() + selected.slice(1)}</strong> from your job description. Does that match?
      </p>

      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {LEVELS.map(({ value: v, label, sub }) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={[
              'flex flex-col items-center justify-center p-5 border-2 rounded-2xl transition-all duration-200 gap-2',
              selected === v
                ? 'border-brand bg-[#fffafb] shadow-md shadow-brand/10'
                : 'bg-white border-gray-200 hover:border-brand/40',
            ].join(' ')}
          >
            <span className={`font-bold text-base ${selected === v ? 'text-brand' : 'text-slate-700'}`}>{label}</span>
            <span className="text-xs text-slate-400 font-medium">{sub}</span>
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={!selected}
        className="bg-brand hover:bg-brand-dark text-white px-10 py-3.5 rounded-2xl font-semibold transition-all hover:scale-105 shadow-lg shadow-brand/20 text-sm"
      >
        Confirm →
      </button>
    </div>
  )
}
