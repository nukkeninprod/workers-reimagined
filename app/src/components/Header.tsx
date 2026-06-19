import { ChevronDown } from 'lucide-react'

export function Header() {
  return (
    <header className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-md z-10 sticky top-0">
      <div className="cursor-pointer">
        <img src="/workers-logo.svg" alt="Workers" className="h-8" />
      </div>
      <button className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 text-slate-600 px-4 py-2 rounded-lg font-medium transition-colors border border-gray-200">
        <span>EN</span>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>
    </header>
  )
}
