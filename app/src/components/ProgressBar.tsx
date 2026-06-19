interface Props {
  current: number
  total: number
  labels: string[]
}

export function ProgressBar({ current, total, labels }: Props) {
  const pct = (current / total) * 100

  return (
    <div className="w-full max-w-3xl mb-10">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background: linear-gradient(
            90deg,
            #de6b6b 0%,
            #e48a8a 25%,
            #de6b6b 50%,
            #e48a8a 75%,
            #de6b6b 100%
          );
          background-size: 200% 100%;
          animation: shimmer 3s infinite linear;
        }
      `}</style>
      <div className="flex items-baseline space-x-1.5 mb-2">
        <span className="text-sm font-bold text-slate-800">{labels[current - 1]}</span>
        <span className="text-xs font-bold text-slate-400">
          <span className="text-brand">{current}</span>/{total}
        </span>
      </div>
      <div className="h-3 w-full bg-white border border-slate-900/10 rounded-full relative overflow-hidden">
        {/* Remplissage de la barre (sans rounded-full interne pour un bord droit vertical net, l'overflow-hidden du parent arrondit le bout gauche et droit) */}
        <div
          className="h-full transition-all duration-700 ease-out animate-shimmer shadow-[0_0_8px_rgba(222,107,107,0.5)] absolute top-0 left-0"
          style={{ width: `${pct}%` }}
        />
        {/* Milestones tracés */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: total }).map((_, idx) => {
            // Positionne les milestones exactement au ratio de chaque étape (25%, 50%, 75%)
            const positionPct = ((idx + 1) / total) * 100

            // On ne trace pas la dernière milestone (100%) car c'est l'extrémité droite
            if (idx === total - 1) return null

            const isCompleted = (idx + 1) <= current
            return (
              <div
                key={idx}
                className="w-[2px] h-full transition-all duration-500 absolute top-0 -translate-x-[1px]"
                style={{ left: `${positionPct}%` }}
              >
                <div
                  className={`w-full h-full transition-colors duration-500 ${
                    isCompleted ? 'bg-slate-900/25' : 'bg-slate-900/10'
                  }`}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
