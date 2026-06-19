interface Props {
  firstName: string
  lastName: string
  email: string
  location: string
  onChange: (field: string, value: string) => void
}

export function StepBasicInfo({ firstName, lastName, email, location, onChange }: Props) {
  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-10 text-center tracking-tight">
        Tell us a bit about you
      </h1>
      <div className="w-full max-w-lg flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <Field label="First name" placeholder="Emma" value={firstName} onChange={v => onChange('firstName', v)} />
          <Field label="Last name" placeholder="Dupont" value={lastName} onChange={v => onChange('lastName', v)} />
        </div>
        <Field label="Email" placeholder="emma@example.com" type="email" value={email} onChange={v => onChange('email', v)} />
        <Field label="Location" placeholder="Brussels, Belgium" value={location} onChange={v => onChange('location', v)} />
      </div>
    </div>
  )
}

function Field({ label, placeholder, value, onChange, type = 'text' }: {
  label: string; placeholder: string; value: string
  onChange: (v: string) => void; type?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="border-2 border-gray-200 rounded-xl px-4 py-3 text-slate-800 font-medium transition-all outline-none focus:border-brand focus:ring-3 focus:ring-brand/15"
      />
    </div>
  )
}
