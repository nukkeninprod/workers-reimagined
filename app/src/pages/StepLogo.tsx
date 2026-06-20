import { Upload, SkipForward } from 'lucide-react'

interface Props {
  onNext: () => void
}

export function StepLogo({ onNext }: Props) {
  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-2 text-center tracking-tight">
        Your company logo
      </h1>
      <p className="text-slate-500 mb-10 text-center text-base">
        To dress up your listing. You can always add it later.
      </p>

      <div className="w-full bg-white border-2 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center py-14 px-8 mb-6 hover:border-brand/40 transition-colors cursor-pointer">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <Upload size={24} className="text-slate-400" strokeWidth={1.5} />
        </div>
        <p className="font-semibold text-slate-600 text-base mb-1">Drop your logo here</p>
        <p className="text-sm text-slate-400">PNG, SVG, JPG — or click to browse</p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onNext}
          className="bg-brand hover:bg-brand-dark text-white px-10 py-3.5 rounded-2xl font-semibold transition-all hover:scale-105 shadow-lg shadow-brand/20 text-sm"
        >
          Continue →
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
        >
          <SkipForward size={14} />
          Skip for now
        </button>
      </div>
    </div>
  )
}
