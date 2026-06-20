interface Props {
  agreeFees: boolean
  agreeTerms: boolean
  agreeMarketing: boolean
  onChange: (field: string, v: boolean) => void
  onNext: () => void
}

export function StepLegal({ agreeFees, agreeTerms, agreeMarketing, onChange, onNext }: Props) {
  const canContinue = agreeFees && agreeTerms

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-2 text-center tracking-tight">
        Legal consents
      </h1>
      <p className="text-slate-500 mb-8 text-center text-base">
        Two are required to publish your offer.
      </p>

      <div className="w-full bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4 mb-8">
        <Consent
          required
          checked={agreeFees}
          onChange={v => onChange('agreeFees', v)}
          label="I accept the applicable fee in the event of a match and hiring of a candidate."
        />
        <Consent
          required
          checked={agreeTerms}
          onChange={v => onChange('agreeTerms', v)}
          label="I have read and understood the General Terms of Use (GTU) for Employers – Workers.be."
        />
        <Consent
          checked={agreeMarketing}
          onChange={v => onChange('agreeMarketing', v)}
          label="I accept to receive product news from Workers (optional)."
          optional
        />
      </div>

      <button
        onClick={onNext}
        disabled={!canContinue}
        className="bg-brand hover:bg-brand-dark text-white px-10 py-3.5 rounded-2xl font-semibold transition-all hover:scale-105 shadow-lg shadow-brand/20 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Publish my offer →
      </button>
    </div>
  )
}

function Consent({ checked, onChange, label, required, optional }: {
  checked: boolean; onChange: (v: boolean) => void
  label: string; required?: boolean; optional?: boolean
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="mt-0.5 w-4 h-4 accent-brand"
      />
      <span className="text-sm text-slate-600 leading-relaxed">
        {required && <span className="text-brand font-semibold mr-1">*</span>}
        {label}
        {optional && <span className="text-slate-400 ml-1">(optional)</span>}
      </span>
    </label>
  )
}
