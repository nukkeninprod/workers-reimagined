import { Laptop, Clock, Briefcase } from 'lucide-react'

const WORK_TYPES = [
  { value: 'freelance', label: 'Freelance', icon: Laptop },
  { value: 'flex', label: 'Flex job', icon: Clock },
  { value: 'employee', label: 'Employee', icon: Briefcase },
]

const SKILLS = [
  'JavaScript', 'TypeScript', 'Python', 'React', 'Vue', 'Node.js',
  'Design', 'Marketing', 'Sales', 'DevOps', 'Data', 'Finance',
  'HR', 'Customer support', 'Logistics', 'Management',
]

interface Props {
  workTypes: string[]
  skills: string[]
  onToggleWorkType: (v: string) => void
  onToggleSkill: (v: string) => void
}

export function StepWorkerProfile({ workTypes, skills, onToggleWorkType, onToggleSkill }: Props) {
  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2 text-center tracking-tight">
        What are you looking for?
      </h1>
      <p className="text-slate-500 mb-8 text-center">Pick all that apply.</p>

      <div className="w-full max-w-2xl">
        {/* Work type */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {WORK_TYPES.map(({ value, label, icon: Icon }) => {
            const active = workTypes.includes(value)
            return (
              <button
                key={value}
                onClick={() => onToggleWorkType(value)}
                className={[
                  'flex flex-col items-center justify-center p-6 border-2 rounded-2xl transition-all duration-200',
                  active ? 'border-brand bg-[#fffafb]' : 'bg-white border-gray-200 hover:border-brand/40',
                ].join(' ')}
              >
                <Icon className={`w-8 h-8 mb-3 transition-colors ${active ? 'text-brand' : 'text-slate-400'}`} strokeWidth={1.5} />
                <span className={`font-semibold text-sm ${active ? 'text-brand' : 'text-slate-700'}`}>{label}</span>
              </button>
            )
          })}
        </div>

        {/* Skills */}
        <p className="text-sm font-semibold text-slate-700 mb-3">Your top skills</p>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map(skill => {
            const active = skills.includes(skill)
            return (
              <button
                key={skill}
                onClick={() => onToggleSkill(skill)}
                className={[
                  'border-2 text-sm font-semibold px-4 py-2 rounded-full transition-all',
                  active ? 'bg-brand border-brand text-white' : 'border-gray-200 text-slate-600 hover:border-brand/40',
                ].join(' ')}
              >
                {skill}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
