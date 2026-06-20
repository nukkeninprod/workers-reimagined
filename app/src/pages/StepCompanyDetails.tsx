const SECTORS = ['Technology', 'Finance', 'Healthcare', 'Retail & E-commerce', 'Logistics', 'Hospitality', 'Construction', 'Other']

interface Props {
  companyName: string
  companyAddress: string
  companyVAT: string
  companyWebsite: string
  sector: string
  onChange: (field: string, value: string) => void
  onNext: () => void
}

export function StepCompanyDetails({ companyName, companyAddress, companyVAT, companyWebsite, sector, onChange, onNext }: Props) {
  const canContinue = companyName.trim() && companyAddress.trim() && companyVAT.trim()

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-2 text-center tracking-tight">
        Your company
      </h1>
      <p className="text-slate-500 mb-8 text-center text-base">
        Name and address were found in your job post. I still need your <strong className="text-slate-700">VAT number</strong>.
      </p>

      <div className="w-full bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col gap-5 mb-8">
        <Field label="Company name" required placeholder="NovaTech Solutions" value={companyName} onChange={v => onChange('companyName', v)} />
        <Field label="Address in Belgium" required placeholder="Rue de la Loi 1, 1000 Brussels" value={companyAddress} onChange={v => onChange('companyAddress', v)} />

        <div className="grid grid-cols-2 gap-4">
          <Field label="VAT number" required highlight placeholder="BE 0123.456.789" value={companyVAT} onChange={v => onChange('companyVAT', v)} />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Sector</label>
            <select
              value={sector}
              onChange={e => onChange('sector', e.target.value)}
              className="bg-white border-2 border-slate-200 rounded-xl px-3 py-3 text-sm font-medium text-slate-800 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all"
            >
              <option value="">Select…</option>
              {SECTORS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <Field
          label="Website URL"
          placeholder="https://"
          hint="Useful for generating your company description"
          value={companyWebsite}
          onChange={v => onChange('companyWebsite', v)}
        />
      </div>

      <button
        onClick={onNext}
        disabled={!canContinue}
        className="bg-brand hover:bg-brand-dark text-white px-10 py-3.5 rounded-2xl font-semibold transition-all hover:scale-105 shadow-lg shadow-brand/20 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Continue →
      </button>
    </div>
  )
}

function Field({ label, placeholder, value, onChange, required, hint, highlight }: {
  label: string; placeholder?: string; value: string
  onChange: (v: string) => void; required?: boolean; hint?: string; highlight?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={`text-xs font-semibold uppercase tracking-wide flex items-center gap-1 ${highlight ? 'text-brand' : 'text-slate-500'}`}>
        {label}{required && <span className="text-brand">*</span>}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`bg-white border-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:ring-4 focus:ring-brand/10 focus:border-brand ${highlight ? 'border-brand/40' : 'border-slate-200'}`}
      />
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  )
}
