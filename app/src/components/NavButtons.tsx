import { ChevronLeft, ArrowRight } from 'lucide-react'

interface Props {
  onNext: () => void
  onBack: () => void
  showBack: boolean
  nextLabel?: string
  hideNext?: boolean
}

export function NavButtons({ onNext, onBack, showBack, nextLabel = 'Continue', hideNext }: Props) {
  return (
    <>
      <style>{`
        @keyframes float-left {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-10px); }
        }
        .animate-float-left {
          animation: float-left 2s ease-in-out infinite;
        }
      `}</style>

      {/* Large left-screen floating back button (very close to CTA, very big, animated, wrapped to guarantee vertical centering) */}
      {showBack && (
        <div className="fixed left-16 md:left-24 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
          <button
            onClick={onBack}
            className="text-slate-800 hover:text-brand transition-all hover:scale-125 focus:outline-none animate-float-left pointer-events-auto"
          >
            <ChevronLeft className="w-24 h-24" strokeWidth={1} />
          </button>
        </div>
      )}

      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 flex items-center gap-3 z-50">
        {!hideNext && (
          <button
            onClick={onNext}
            className="bg-brand hover:bg-brand-dark text-white h-14 px-6 rounded-full flex items-center gap-2 shadow-lg transition-all hover:scale-105 font-semibold"
            style={{ boxShadow: '0 10px 25px -5px rgba(222,107,107,.3)' }}
          >
            <span>{nextLabel}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </>
  )
}
