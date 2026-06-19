import { useState } from 'react'
import { FileText, Sparkles, Plus, type LucideIcon } from 'lucide-react'

interface Props {
  mode: 'import' | 'create' | null
  onSelect: (mode: 'import' | 'create') => void
}

export function StepJobOffer({ onSelect: _onSelect }: Props) {
  return (
    <div className="flex flex-col items-center w-full">
      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-reverse-slow { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes spin-pulse { 
          0%, 100% { transform: rotate(0deg) scale(1); } 
          50% { transform: rotate(180deg) scale(1.08); } 
        }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.3; transform: scale(0.98); } 50% { opacity: 0.6; transform: scale(1.02); } }
        @keyframes aurora {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .ring-forward { animation: spin-slow 24s linear infinite; }
        .ring-reverse { animation: spin-reverse-slow 18s linear infinite; }
        .ring-ai-pulse { animation: spin-pulse 10s ease-in-out infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }
        .animate-aurora {
          background: linear-gradient(270deg, #9b51e0, #f65599, #6366f1);
          background-size: 600% 600%;
          animation: aurora 12s ease infinite;
        }
      `}</style>

      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center justify-center">
        <SelectionCircle
          onClick={() => {}}
          icon={FileText}
          badge={Sparkles}
          badgeColor="text-white bg-purple-600 shadow-md shadow-purple-500/30"
          title="I import my job offer"
          description="Go 3× faster with AI auto-fill"
          isAI
        />
        <SelectionCircle
          onClick={() => {}}
          icon={Plus}
          title="I complete manually"
          description="Create and tailor a new offer"
        />
      </div>

      <h1 className="text-4xl font-extrabold text-slate-900 mt-8 text-center tracking-tight">
        How do you want to start?
      </h1>
    </div>
  )
}

interface CircleProps {
  onClick: () => void
  icon: LucideIcon
  badge?: LucideIcon
  badgeColor?: string
  title: string
  description: string
  isAI?: boolean
}

function SelectionCircle({ onClick, icon: Icon, badge: Badge, badgeColor, title, description, isAI }: CircleProps) {
  const [isHovered, setIsHovered] = useState(false)

  // 30% d'augmentation de taille si c'est la carte AI
  const sizeClass = isAI
    ? 'relative w-[418px] h-[418px] rounded-full cursor-pointer transition-all duration-300 ease-out flex items-center justify-center'
    : 'relative w-[342px] h-[342px] rounded-full cursor-pointer transition-all duration-300 ease-out flex items-center justify-center'

  const centerCardSizeClass = isAI
    ? 'relative w-[340px] h-[340px] rounded-full bg-white flex flex-col items-center justify-center p-10 text-center shadow-2xl transition-all duration-300'
    : 'relative w-[280px] h-[280px] rounded-full bg-white flex flex-col items-center justify-center p-8 text-center shadow-2xl transition-all duration-300'

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={[
        sizeClass,
        isHovered ? 'animate-float scale-105 z-10' : 'scale-100',
      ].join(' ')}
    >
      {/* Background Neon Glow – Aurora gradient sweep for AI */}
      <div className={[
        'absolute inset-[-14px] rounded-full blur-2xl transition-all duration-500',
        isHovered
          ? (isAI ? 'animate-aurora animate-pulse-glow opacity-80' : 'bg-brand/20 animate-pulse-glow opacity-100')
          : 'bg-slate-200/50 opacity-0',
      ].join(' ')} />

      {/* Outer dashed ring (special pulsing spin for AI) */}
      <div className={[
        'absolute inset-0 rounded-full border-2 border-dashed transition-all duration-300',
        isAI ? 'ring-ai-pulse' : 'ring-forward',
        isHovered ? (isAI ? 'border-purple-500/80' : 'border-brand/50') : 'border-slate-900/70',
      ].join(' ')} />

      {/* Inner rotating arc */}
      <div className={[
        'absolute inset-[19px] rounded-full ring-reverse border-[3px] border-t-transparent border-b-transparent transition-all duration-300',
        isHovered ? (isAI ? 'border-l-purple-500/50 border-r-purple-500/50' : 'border-l-brand/40 border-r-brand/40') : 'border-l-slate-900/60 border-r-slate-900/60',
      ].join(' ')} />

      {/* Center card */}
      <div className={[
        centerCardSizeClass,
        isHovered
          ? (isAI ? 'border-2 border-purple-500/80 shadow-purple-500/30' : 'border-2 border-brand/80 shadow-brand/20')
          : 'border-2 border-slate-900/20 shadow-slate-200/50',
      ].join(' ')}>
        
        {/* Optional small floating AI Badge */}
        {Badge && (
          <div className={`absolute top-14 right-14 p-2.5 rounded-full transition-transform ${badgeColor} ${isHovered ? 'scale-120 rotate-12' : ''}`}>
            <Badge size={20} className="text-white" />
          </div>
        )}

        <div className={`mb-4 transition-all duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}>
          <Icon
            size={isAI ? 58 : 48}
            strokeWidth={1.5}
            className={`transition-colors duration-300 ${isHovered ? (isAI ? 'text-purple-600 drop-shadow-md' : 'text-brand drop-shadow-md') : 'text-slate-900'}`}
          />
        </div>
        <h3 className={`${isAI ? 'text-[22px]' : 'text-[18px]'} font-bold text-slate-900 mb-1 leading-tight`}>{title}</h3>
        <p className={`${isAI ? 'text-[14px]' : 'text-[13px]'} font-medium transition-colors duration-300 ${isHovered ? 'text-slate-600' : 'text-slate-800'}`}>
          {description}
        </p>
      </div>
    </div>
  )
}
