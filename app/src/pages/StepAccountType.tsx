import { useState } from 'react'
import { User, Building2, type LucideIcon } from 'lucide-react'
import type { AccountType } from '../types/onboarding'

interface Props {
  value: AccountType | null
  onSelect: (v: AccountType) => void
}

export function StepAccountType({ value, onSelect }: Props) {
  return (
    <div className="flex flex-col items-center w-full">
      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-reverse-slow { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.3; transform: scale(0.98); } 50% { opacity: 0.6; transform: scale(1.02); } }
        .ring-forward { animation: spin-slow 24s linear infinite; }
        .ring-reverse { animation: spin-reverse-slow 18s linear infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }
      `}</style>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-center">
        <SelectionCircle
          selected={value === 'worker'}
          onClick={() => {}}
          icon={User}
          title="I'm looking for work"
          description="Freelance · Flex · Employee"
        />
        <SelectionCircle
          selected={value === 'company'}
          onClick={() => onSelect('company')}
          icon={Building2}
          title="I'm hiring"
          description="I represent a company"
        />
      </div>

      <h1 className="text-4xl font-extrabold text-slate-900 mt-8 text-center tracking-tight flex items-center justify-center gap-3 flex-wrap">
        What brings you to <img src="/workers-logo.svg" alt="Workers" className="h-9 inline-block" />?
      </h1>
    </div>
  )
}

interface CircleProps {
  selected: boolean
  onClick: () => void
  icon: LucideIcon
  title: string
  description: string
}

function SelectionCircle({ selected: _selected, onClick, icon: Icon, title, description }: CircleProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={[
        'relative w-[382px] h-[382px] rounded-full cursor-pointer transition-all duration-300 ease-out flex items-center justify-center',
        isHovered ? 'animate-float scale-105' : 'scale-100',
      ].join(' ')}
    >
      {/* Glow halo */}
      <div className={[
        'absolute inset-[-14px] rounded-full blur-2xl transition-all duration-500',
        isHovered ? 'bg-brand/20 animate-pulse-glow opacity-100' : 'bg-slate-200/50 opacity-0',
      ].join(' ')} />

      {/* Outer dashed ring */}
      <div className={[
        'absolute inset-0 rounded-full ring-forward border-2 border-dashed transition-all duration-300',
        isHovered ? 'border-brand/50' : 'border-slate-900/70',
      ].join(' ')} />

      {/* Inner rotating arc */}
      <div className={[
        'absolute inset-[19px] rounded-full ring-reverse border-[3px] border-t-transparent border-b-transparent transition-all duration-300',
        isHovered ? 'border-l-brand/40 border-r-brand/40' : 'border-l-slate-900/60 border-r-slate-900/60',
      ].join(' ')} />

      {/* Center card */}
      <div className={[
        'relative w-[312px] h-[312px] rounded-full bg-white flex flex-col items-center justify-center p-8 text-center shadow-2xl transition-all duration-300',
        isHovered ? 'border-2 border-brand/80 shadow-brand/20' : 'border-2 border-slate-900/20 shadow-slate-200/50',
      ].join(' ')}>
        <div className={`mb-4 transition-all duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}>
          <Icon
            size={48}
            strokeWidth={1.5}
            className={`transition-colors duration-300 ${isHovered ? 'text-brand drop-shadow-md' : 'text-slate-900'}`}
          />
        </div>
        <h3 className="text-[18px] font-bold text-slate-900 mb-1 leading-tight">{title}</h3>
        <p className={`text-[13px] font-medium transition-colors duration-300 ${isHovered ? 'text-slate-600' : 'text-slate-800'}`}>
          {description}
        </p>
      </div>
    </div>
  )
}
