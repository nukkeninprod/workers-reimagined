import { useState, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface Props {
  initialEmail?: string
  onValidChange: (valid: boolean) => void
  onSocialLogin?: () => void
}

export function StepSignup({ initialEmail = '', onValidChange, onSocialLogin }: Props) {
  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreeMarketing, setAgreeMarketing] = useState(false)

  const canSubmit = !!(email.trim() && password.length >= 6 && agreeTerms)

  useEffect(() => { onValidChange(canSubmit) }, [canSubmit])

  return (
    <div className="flex flex-col w-full max-w-md mx-auto gap-6">

      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Last step, sign-up to post !
        </h1>
      </div>

      {/* Social buttons */}
      <div className="flex gap-3">
        <button
          onClick={onSocialLogin}
          className="flex-1 flex items-center justify-center gap-2.5 bg-white border-2 border-slate-200 hover:border-slate-300 rounded-2xl py-3.5 text-sm font-semibold text-slate-700 transition-all shadow-sm hover:shadow"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Google
        </button>
        <button
          onClick={onSocialLogin}
          className="flex-1 flex items-center justify-center gap-2.5 bg-[#0A66C2] hover:bg-[#0958a8] border-2 border-[#0A66C2] hover:border-[#0958a8] rounded-2xl py-3.5 text-sm font-semibold text-white transition-all shadow-sm hover:shadow"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          LinkedIn
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400 font-medium">or</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</label>
        <input
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="bg-white border-2 border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all"
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Password</label>
        <div className="relative">
          <input
            type={showPw ? 'text' : 'password'}
            placeholder="Min. 6 characters"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-3.5 pr-12 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPw(v => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Terms */}
      <div className="flex flex-col gap-3 pt-1">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div
            onClick={() => setAgreeTerms(v => !v)}
            className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${agreeTerms ? 'bg-brand border-brand' : 'bg-white border-slate-300 group-hover:border-brand/50'}`}
          >
            {agreeTerms && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <span className="text-sm text-slate-600 leading-snug">
            I agree to the <span className="text-brand font-medium cursor-pointer hover:underline">Terms of Service</span> and <span className="text-brand font-medium cursor-pointer hover:underline">Privacy Policy</span>
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer group">
          <div
            onClick={() => setAgreeMarketing(v => !v)}
            className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${agreeMarketing ? 'bg-brand border-brand' : 'bg-white border-slate-300 group-hover:border-brand/50'}`}
          >
            {agreeMarketing && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <span className="text-sm text-slate-500 leading-snug">
            Keep me updated with platform news and offers
          </span>
        </label>
      </div>

    </div>
  )
}
