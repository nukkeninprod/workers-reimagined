import { useState, useRef, type DragEvent, type ChangeEvent } from 'react'
import { Upload, FileText, X, Plus, Link } from 'lucide-react'

interface Props {
  onNext: () => void
}

export function StepImportJobOffer({ onNext }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [droppedFile, setDroppedFile] = useState<File | null>(null)
  const [urlInput, setUrlInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleDragOver(e: DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) setDroppedFile(file)
  }

  function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setDroppedFile(file)
  }

  function handleUrlAdd() {
    if (urlInput.trim()) onNext()
  }

  const canContinue = !!droppedFile || urlInput.trim().length > 0

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-3 text-center tracking-tight">
        Import your job offer
      </h1>
      <p className="text-slate-500 text-base mb-10 text-center">
        Drop a file or paste a link — we'll extract the details automatically.
      </p>

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !droppedFile && fileInputRef.current?.click()}
        className={[
          'w-full rounded-3xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center py-16 px-8 mb-6',
          droppedFile
            ? 'border-brand bg-brand/5 cursor-default'
            : isDragging
              ? 'border-brand bg-brand/8 scale-[1.01] cursor-copy'
              : 'border-slate-300 bg-slate-50 hover:border-brand/50 hover:bg-slate-100 cursor-pointer',
        ].join(' ')}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          className="hidden"
          onChange={handleFileInput}
        />

        {droppedFile ? (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center">
              <FileText size={24} className="text-brand" strokeWidth={1.5} />
            </div>
            <div className="text-left">
              <p className="font-semibold text-slate-800 text-sm">{droppedFile.name}</p>
              <p className="text-slate-400 text-xs mt-0.5">{(droppedFile.size / 1024).toFixed(0)} KB</p>
            </div>
            <button
              onClick={e => { e.stopPropagation(); setDroppedFile(null) }}
              className="ml-4 p-1.5 rounded-full hover:bg-slate-200 transition-colors text-slate-400 hover:text-slate-700"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className={[
              'w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-200',
              isDragging ? 'bg-brand/20 scale-110' : 'bg-slate-200',
            ].join(' ')}>
              <Upload size={28} className={isDragging ? 'text-brand' : 'text-slate-400'} strokeWidth={1.5} />
            </div>
            <p className="font-semibold text-slate-700 text-base mb-1">
              {isDragging ? 'Release to upload' : 'Drag & drop your file here'}
            </p>
            <p className="text-slate-400 text-sm">PDF, DOCX, TXT — or click to browse</p>
          </>
        )}
      </div>

      {/* URL input row */}
      <div className="w-full flex items-center gap-3 mb-8">
        <div className="flex-1 relative">
          <Link size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="url"
            placeholder="Or paste a job listing URL…"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleUrlAdd()}
            className="w-full border-2 border-slate-200 rounded-2xl pl-10 pr-4 py-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all"
          />
        </div>
        <button
          onClick={handleUrlAdd}
          disabled={!urlInput.trim()}
          className="w-12 h-12 rounded-2xl bg-brand text-white flex items-center justify-center flex-shrink-0 transition-all hover:bg-brand-dark hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md shadow-brand/20"
        >
          <Plus size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* Continue CTA */}
      {canContinue && (
        <button
          onClick={onNext}
          className="bg-brand hover:bg-brand-dark text-white px-10 py-3.5 rounded-2xl font-semibold transition-all hover:scale-105 shadow-lg shadow-brand/20 text-sm"
        >
          Continue →
        </button>
      )}
    </div>
  )
}
