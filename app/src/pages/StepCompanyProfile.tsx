const SECTORS = [
  'Technology', 'Finance', 'Healthcare', 'Retail & E-commerce',
  'Logistics', 'Hospitality', 'Construction', 'Other',
]

const SIZES = ['1–10', '11–50', '51+']

interface Props {
  companyName: string
  sector: string
  companySize: string
  onChange: (field: string, value: string) => void
}

export function StepCompanyProfile({ companyName, sector, companySize, onChange }: Props) {
  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-10 text-center tracking-tight">
        About your company
      </h1>
      <div className="w-full max-w-lg flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Company name</label>
          <input
            type="text"
            placeholder="Acme Corp"
            value={companyName}
            onChange={e => onChange('companyName', e.target.value)}
            className="border-2 border-gray-200 rounded-xl px-4 py-3 text-slate-800 font-medium transition-all outline-none focus:border-brand focus:ring-3 focus:ring-brand/15"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Sector</label>
          <select
            value={sector}
            onChange={e => onChange('sector', e.target.value)}
            className="border-2 border-gray-200 rounded-xl px-4 py-3 text-slate-800 font-medium transition-all outline-none focus:border-brand bg-white appearance-none cursor-pointer"
          >
            <option value="">Select a sector…</option>
            {SECTORS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Company size</label>
          <div className="grid grid-cols-3 gap-3">
            {SIZES.map(size => (
              <button
                key={size}
                onClick={() => onChange('companySize', size)}
                className={[
                  'text-center py-3 border-2 rounded-xl text-sm font-semibold transition-all',
                  companySize === size
                    ? 'border-brand bg-[#fffafb] text-brand'
                    : 'border-gray-200 text-slate-600 hover:border-brand/40',
                ].join(' ')}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
