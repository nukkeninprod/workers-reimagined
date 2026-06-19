export function Footer() {
  return (
    <footer className="flex flex-col md:flex-row justify-between items-center px-8 py-6 border-t border-gray-200 bg-white z-10">
      <div className="mb-4 md:mb-0 opacity-80">
        <img src="/workers-logo.svg" alt="Workers" className="h-6" />
      </div>
      <div className="text-slate-500 text-sm font-medium mb-4 md:mb-0">© Workers.be 2026</div>
      <a href="#" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
        Terms and Conditions
      </a>
    </footer>
  )
}
