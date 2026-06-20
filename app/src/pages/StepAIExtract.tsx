import { useState, useRef } from 'react'
import { X, Plus, Sparkles } from 'lucide-react'

const MOCK_SKILLS = ['Agile', 'Scrum', 'Kanban', 'Jira', 'Confluence', 'Power BI']

interface Props {
  initialSkills: string[]
  onConfirm: (skills: string[]) => void
  onNext: () => void
}

export function StepAIExtract({ initialSkills, onConfirm, onNext }: Props) {
  const [skills, setSkills] = useState<string[]>(initialSkills.length ? initialSkills : MOCK_SKILLS)
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function addSkill() {
    const trimmed = input.trim()
    if (trimmed && !skills.map(s => s.toLowerCase()).includes(trimmed.toLowerCase())) {
      setSkills(s => [...s, trimmed])
    }
    setInput('')
    inputRef.current?.focus()
  }

  function removeSkill(skill: string) {
    setSkills(s => s.filter(x => x !== skill))
  }

  function handleContinue() {
    onConfirm(skills)
    onNext()
  }

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      {/* AI badge */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
          <Sparkles size={15} className="text-purple-600" strokeWidth={1.8} />
        </div>
        <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
          AI detected · edit if needed
        </span>
      </div>

      <h1 className="text-4xl font-extrabold text-slate-900 mb-3 text-center tracking-tight">
        What skills are you looking for?
      </h1>
      <p className="text-slate-500 text-base mb-10 text-center">
        I found these in your job description. Remove anything off, add what's missing.
      </p>

      {/* Skill chips */}
      <div className="w-full flex flex-wrap gap-2.5 mb-6 min-h-[52px]">
        {skills.map(skill => (
          <span
            key={skill}
            className="flex items-center gap-2 bg-white border-2 border-slate-200 hover:border-brand/30 text-slate-700 font-semibold text-sm px-4 py-2 rounded-full transition-all group"
          >
            {skill}
            <button
              onClick={() => removeSkill(skill)}
              className="w-4 h-4 rounded-full bg-slate-200 group-hover:bg-red-100 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <X size={10} className="text-slate-400 group-hover:text-red-500" strokeWidth={3} />
            </button>
          </span>
        ))}
        {skills.length === 0 && (
          <p className="text-slate-400 text-sm italic">No skills yet — add some below.</p>
        )}
      </div>

      {/* Add skill input */}
      <div className="w-full flex items-center gap-2.5 mb-10">
        <input
          ref={inputRef}
          type="text"
          placeholder="Add a skill…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
          className="flex-1 bg-white border-2 border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all"
        />
        <button
          onClick={addSkill}
          disabled={!input.trim()}
          className="w-12 h-12 rounded-2xl bg-brand text-white flex items-center justify-center transition-all hover:bg-brand-dark hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-brand/20 flex-shrink-0"
        >
          <Plus size={20} strokeWidth={2.5} />
        </button>
      </div>

      <button
        onClick={handleContinue}
        disabled={skills.length === 0}
        className="bg-brand hover:bg-brand-dark text-white px-10 py-3.5 rounded-2xl font-semibold transition-all hover:scale-105 shadow-lg shadow-brand/20 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Looks good →
      </button>
    </div>
  )
}
