export function StepPricing() {
  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto">

      <h1 className="text-4xl font-extrabold text-slate-900 mb-3 text-center tracking-tight">
        The simplest and most transparent<br />solution for recruitment
      </h1>
      <p className="text-slate-500 text-base mb-10 text-center max-w-xl">
        A clear platform, no hidden fees, for recruiting permanent, fixed-term or freelance staff —
        with a <span className="font-semibold text-slate-700">100% performance-based model</span>.
      </p>

      {/* Pricing cards */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

        {/* Permanent */}
        <div className="bg-white border-2 border-slate-100 rounded-3xl p-8 flex flex-col gap-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-center">
            <div className="relative w-20 h-16">
              {/* back card */}
              <div className="absolute left-3 top-1 w-14 h-14 rounded-2xl bg-violet-300/60 rotate-6" />
              {/* front card */}
              <div className="absolute left-0 top-0 w-14 h-14 rounded-2xl bg-violet-500 flex flex-col items-center justify-center shadow-lg shadow-violet-400/30">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mb-0.5">
                  <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-white text-[9px] font-bold leading-tight text-center">No Cure<br/>No Pay</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-lg font-bold text-slate-800 mb-2 leading-snug">
              Recruit a Permanent Employee
              <span className="block text-sm font-medium text-slate-500 mt-0.5">(permanent or fixed-term contract)</span>
            </h2>
            <p className="text-slate-500 text-sm">
              Quickly recruit a permanent employee thanks to our database of qualified talent.
            </p>
          </div>

          <div className="border-t border-slate-100 pt-4 flex flex-col gap-2">
            <p className="text-center font-bold text-slate-800">Fee : 1 000 € per recruitment</p>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#de6b6b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Ideal for the long term
            </div>
          </div>
        </div>

        {/* Freelance */}
        <div className="bg-white border-2 border-slate-100 rounded-3xl p-8 flex flex-col gap-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-center">
            <div className="w-20 h-16 relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-400 flex flex-col items-center justify-center shadow-lg shadow-emerald-400/30 relative">
                <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-white border-2 border-emerald-400" />
                <span className="text-white font-extrabold text-xl leading-none">25€</span>
                <span className="text-white/80 text-xs font-semibold">/day</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-lg font-bold text-slate-800 mb-2 leading-snug">
              Hiring a Freelancer for a Project
            </h2>
            <p className="text-slate-500 text-sm">
              Access freelancers immediately available for all your projects.
            </p>
          </div>

          <div className="border-t border-slate-100 pt-4 flex flex-col gap-2">
            <p className="text-center font-bold text-slate-800">Fee : 25 € / day</p>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#de6b6b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Ideal for occasional needs
            </div>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-8 py-5 text-center">
        <p className="font-bold text-slate-700 text-base">
          No Cure No Pay : You only pay if a contract is signed.
        </p>
      </div>

    </div>
  )
}
