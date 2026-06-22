import { useState, useRef, useEffect } from 'react'
import { X, Plus } from 'lucide-react'

const MOCK_SKILLS = ['Agile', 'Scrum', 'Kanban', 'Jira', 'Confluence', 'Power BI']
const COMMON_LANGS = ['French', 'Dutch', 'English', 'German', 'Spanish', 'Italian']

interface Props {
  initialSkills: string[]
  onChange: (skills: string[]) => void
  jobLanguages?: string[]
  onLanguages?: (v: string[]) => void
}

export function StepAIExtract({ initialSkills, onChange, jobLanguages, onLanguages }: Props) {
  const [skills, setSkills] = useState<string[]>(initialSkills.length ? initialSkills : MOCK_SKILLS)
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const langRef = useRef<HTMLInputElement>(null)
  const [langInput, setLangInput] = useState('')

  useEffect(() => { onChange(skills) }, [skills])

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

  function addLang(lang?: string) {
    const val = (lang ?? langInput).trim()
    if (val && onLanguages && jobLanguages && !jobLanguages.map(l => l.toLowerCase()).includes(val.toLowerCase())) {
      onLanguages([...jobLanguages, val])
    }
    setLangInput('')
    langRef.current?.focus()
  }

  function removeLang(lang: string) {
    if (onLanguages && jobLanguages) onLanguages(jobLanguages.filter(l => l !== lang))
  }

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-10 text-center tracking-tight">
        These are the skills I detected.
      </h1>

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

      {/* Languages — flexi route only */}
      {onLanguages && jobLanguages !== undefined && (
        <div className="w-full">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-widest mb-3">Languages</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {jobLanguages.map(lang => (
              <span key={lang} className="flex items-center gap-2 bg-white border-2 border-slate-200 hover:border-brand/30 text-slate-700 font-semibold text-sm px-4 py-2 rounded-full transition-all group">
                {lang}
                <button onClick={() => removeLang(lang)} className="w-4 h-4 rounded-full bg-slate-200 group-hover:bg-red-100 flex items-center justify-center flex-shrink-0">
                  <X size={10} className="text-slate-400 group-hover:text-red-500" strokeWidth={3} />
                </button>
              </span>
            ))}
            {COMMON_LANGS.filter(l => !jobLanguages.map(x => x.toLowerCase()).includes(l.toLowerCase())).slice(0, 5).map(lang => (
              <button key={lang} onClick={() => addLang(lang)}
                className="flex items-center gap-1 px-4 py-2 border-2 border-dashed border-slate-200 text-slate-400 hover:border-brand hover:text-brand text-sm font-semibold rounded-full transition-all">
                <Plus size={12} strokeWidth={2.5} />{lang}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              ref={langRef}
              type="text"
              placeholder="Add a language…"
              value={langInput}
              onChange={e => setLangInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addLang()}
              className="flex-1 bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all"
            />
            <button onClick={() => addLang()} disabled={!langInput.trim()}
              className="px-4 py-3 rounded-2xl bg-brand text-white text-sm font-bold disabled:opacity-30 hover:bg-brand-dark transition-all">
              <Plus size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
