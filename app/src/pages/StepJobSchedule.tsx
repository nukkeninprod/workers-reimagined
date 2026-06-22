import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Calendar, Clock, Users, Coffee, X, Plus, Copy, List, CalendarPlus, Pencil, Check } from 'lucide-react'

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
export interface Shift { start: string; end: string; people: number; breakMin: number }
export type ShiftsByDay = Record<DayKey, Shift[]>

const DAYS: { key: DayKey; short: string; long: string }[] = [
  { key: 'mon', short: 'Mon', long: 'Monday' },
  { key: 'tue', short: 'Tue', long: 'Tuesday' },
  { key: 'wed', short: 'Wed', long: 'Wednesday' },
  { key: 'thu', short: 'Thu', long: 'Thursday' },
  { key: 'fri', short: 'Fri', long: 'Friday' },
  { key: 'sat', short: 'Sat', long: 'Saturday' },
  { key: 'sun', short: 'Sun', long: 'Sunday' },
]

const DEFAULT_SHIFT: Shift = { start: '09:00', end: '17:00', people: 1, breakMin: 0 }

interface Props {
  startDate: string
  endDate: string
  typicalWeek: DayKey[]
  shiftsByDay: ShiftsByDay
  detected?: boolean
  onStartDate: (v: string) => void
  onEndDate: (v: string) => void
  onTypicalWeek: (v: DayKey[]) => void
  onShifts: (v: ShiftsByDay) => void
}

function dayKeyFromDate(d: Date): DayKey {
  // JS: 0 = Sunday, 1 = Monday … 6 = Saturday
  const map: DayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  return map[d.getDay()]
}

function fmtShort(d: Date) {
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}
function fmtLong(d: Date) {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function StepJobSchedule({
  startDate, endDate, typicalWeek, shiftsByDay, detected,
  onStartDate, onEndDate, onTypicalWeek, onShifts,
}: Props) {
  const [showAll, setShowAll] = useState(false)
  const [mode, setMode] = useState<'review' | 'edit'>(detected ? 'review' : 'edit')
  const [editingShift, setEditingShift] = useState<{ day: DayKey; idx: number } | null>(null)

  // draft state for the modal
  const [draft, setDraft] = useState<Shift>(DEFAULT_SHIFT)

  function openShiftModal(day: DayKey, idx: number) {
    const s = shiftsByDay[day]?.[idx] ?? DEFAULT_SHIFT
    setDraft({ ...s })
    setEditingShift({ day, idx })
  }

  function openNewShiftModal(day: DayKey) {
    addShift(day)
    const idx = (shiftsByDay[day] ?? []).length
    setDraft({ ...DEFAULT_SHIFT })
    setEditingShift({ day, idx })
  }

  function saveShiftModal() {
    if (!editingShift) return
    updateShift(editingShift.day, editingShift.idx, draft)
    setEditingShift(null)
  }

  function deleteShiftModal() {
    if (!editingShift) return
    removeShift(editingShift.day, editingShift.idx)
    setEditingShift(null)
  }

  const start = startDate ? new Date(startDate) : null
  const end = endDate ? new Date(endDate) : null

  function toggleDay(key: DayKey) {
    const active = typicalWeek.includes(key)
    if (active) {
      onTypicalWeek(typicalWeek.filter(k => k !== key))
      const next = { ...shiftsByDay }
      delete (next as Record<string, unknown>)[key]
      onShifts(next as ShiftsByDay)
    } else {
      onTypicalWeek([...typicalWeek, key])
      onShifts({ ...shiftsByDay, [key]: shiftsByDay[key]?.length ? shiftsByDay[key] : [{ ...DEFAULT_SHIFT }] })
    }
  }

  function updateShift(day: DayKey, i: number, patch: Partial<Shift>) {
    const list = (shiftsByDay[day] ?? []).map((s, idx) => idx === i ? { ...s, ...patch } : s)
    onShifts({ ...shiftsByDay, [day]: list })
  }
  function addShift(day: DayKey) {
    onShifts({ ...shiftsByDay, [day]: [...(shiftsByDay[day] ?? []), { ...DEFAULT_SHIFT }] })
  }
  function removeShift(day: DayKey, i: number) {
    onShifts({ ...shiftsByDay, [day]: (shiftsByDay[day] ?? []).filter((_, idx) => idx !== i) })
  }
  function copyToOthers(day: DayKey) {
    const src = shiftsByDay[day] ?? []
    const next = { ...shiftsByDay }
    typicalWeek.filter(d => d !== day).forEach(d => { next[d] = src.map(s => ({ ...s })) })
    onShifts(next)
  }

  // Generated calendar days within [start, end] matching typicalWeek
  const generatedDays = useMemo(() => {
    if (!start || !end || end < start) return [] as { date: Date; day: DayKey; shifts: Shift[] }[]
    const out: { date: Date; day: DayKey; shifts: Shift[] }[] = []
    const cursor = new Date(start)
    while (cursor <= end) {
      const dk = dayKeyFromDate(cursor)
      if (typicalWeek.includes(dk)) {
        out.push({ date: new Date(cursor), day: dk, shifts: shiftsByDay[dk] ?? [] })
      }
      cursor.setDate(cursor.getDate() + 1)
    }
    return out
  }, [start?.getTime(), end?.getTime(), typicalWeek, shiftsByDay])

  // Months to render for the overview calendar
  const months = useMemo(() => {
    if (!start || !end) return [] as Date[]
    const list: Date[] = []
    const cur = new Date(start.getFullYear(), start.getMonth(), 1)
    const last = new Date(end.getFullYear(), end.getMonth(), 1)
    while (cur <= last) { list.push(new Date(cur)); cur.setMonth(cur.getMonth() + 1) }
    return list
  }, [start?.getTime(), end?.getTime()])

  function isWithin(d: Date) {
    if (!start || !end) return false
    return d >= new Date(start.getFullYear(), start.getMonth(), start.getDate())
      && d <= new Date(end.getFullYear(), end.getMonth(), end.getDate())
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-12">
      {mode === 'review' ? (
        <>
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-2 tracking-tight">Are these dates and shifts correct?</h2>

          {/* Grouped data card */}
          <div className="relative rounded-2xl p-6 sm:p-8 mb-6">

            {/* Modify CTA (top right) — for editing hours */}
            <button onClick={() => setMode('edit')}
              className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-brand hover:bg-brand-dark text-white text-xs font-semibold shadow-md shadow-brand/25 transition-all hover:scale-105">
              <Pencil size={13} /> Edit hours
            </button>

            {/* Period */}
            {start && end && (
              <>
                <div className="flex items-center justify-between pr-28">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Calendar size={14} /> Period
                  </h3>
                  <span className="text-sm font-semibold text-slate-700">
                    {fmtLong(start)} <span className="text-slate-300 mx-1">→</span> {fmtLong(end)}
                  </span>
                </div>
                <hr className="border-slate-200 my-6" />
              </>
            )}

            {/* Working days — interactive */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                <Calendar size={14} /> Working days
              </h3>
              <p className="text-xs text-slate-400 mb-4">Tap a day to add or remove it.</p>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {DAYS.map(d => {
                  const active = typicalWeek.includes(d.key)
                  return (
                    <button key={d.key} onClick={() => toggleDay(d.key)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all
                        ${active
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 ring-2 ring-emerald-500 ring-offset-2 ring-offset-white hover:bg-emerald-600'
                          : 'bg-white border border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'}`}>
                      {d.short}
                    </button>
                  )
                })}
              </div>
            </div>

            {typicalWeek.length > 0 && (
              <>
                <hr className="border-slate-200 my-8" />

                {/* Shifts */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Clock size={14} /> Detected shifts
                    </h3>
                    <span className="text-xs font-medium text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                      {typicalWeek.length} day{typicalWeek.length !== 1 ? 's' : ''} planned
                    </span>
                  </div>
                  <div>
                    {DAYS.filter(d => typicalWeek.includes(d.key)).map((d, idx) => (
                      <div key={d.key} className={`flex flex-col sm:flex-row sm:items-start py-3 ${idx > 0 ? 'border-t border-slate-200/70' : ''}`}>
                        <div className="w-32 font-medium text-slate-700 pt-1.5 mb-2 sm:mb-0">{d.long}</div>
                        <div className="flex flex-wrap gap-2 flex-1">
                          {(shiftsByDay[d.key] ?? []).length === 0 && (
                            <button onClick={() => openNewShiftModal(d.key)}
                              className="text-xs text-slate-400 italic hover:text-brand transition-colors">
                              + Add shift
                            </button>
                          )}
                          {(shiftsByDay[d.key] ?? []).map((s, i) => (
                            // Chip — click opens modal
                            <button key={i} onClick={() => openShiftModal(d.key, i)}
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 hover:bg-emerald-100 transition-colors">
                              <Clock size={14} className="text-emerald-500" /> {s.start} – {s.end}
                              <span className="text-emerald-300">|</span>
                              <Users size={14} className="text-emerald-600" /> {s.people}
                              {s.breakMin > 0 && (<><span className="text-emerald-300">|</span> {s.breakMin}m</>)}
                              <Pencil size={11} className="text-emerald-400 ml-0.5" />
                            </button>
                          ))}
                          {/* Add shift button */}
                          {(shiftsByDay[d.key] ?? []).length > 0 && (
                            <button onClick={() => openNewShiftModal(d.key)}
                              className="w-7 h-7 rounded-full border-2 border-dashed border-slate-300 hover:border-brand text-slate-400 hover:text-brand flex items-center justify-center transition-colors">
                              <Plus size={13} strokeWidth={2.5} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {start && end && (
                    <div className="mt-4 pt-4 border-t border-slate-200/70 flex justify-between items-center">
                      <button onClick={() => setShowAll(true)} className="text-xs font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1.5">
                        <List size={14} /> View all shifts
                      </button>
                      <span className="text-xs text-slate-500">{generatedDays.length} day{generatedDays.length !== 1 ? 's' : ''} scheduled in period</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          {!detected && (
            <div className="flex justify-center mb-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                <CalendarPlus size={13} /> No schedule detected in your offer
              </div>
            </div>
          )}
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-2">
            {detected ? 'Edit your schedule' : 'Select your job dates'}
          </h2>
          <p className="text-sm text-slate-500 text-center mb-6">
            {detected ? 'Tweak dates, days and shifts below.' : 'Pick a start and end date — like booking a stay.'}
          </p>
          {detected && (
            <div className="flex justify-center mb-6">
              <button onClick={() => setMode('review')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors">
                <Check size={14} /> Done editing — back to review
              </button>
            </div>
          )}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <DateField label="Job start date" value={startDate} onChange={onStartDate} display={start ? fmtShort(start) : 'Pick a date'} />
        <DateField label="Job end date" value={endDate} onChange={onEndDate} min={startDate} display={end ? fmtShort(end) : 'Pick a date'} />
      </div>

      {start && end && end >= start && (
        <div className="w-full bg-slate-100 text-slate-600 text-sm text-center font-medium rounded-2xl py-3 mb-6">
          From {fmtLong(start)} to {fmtLong(end)}
        </div>
      )}

      {/* Typical week */}
      <div className="bg-white border-2 border-slate-100 rounded-3xl p-5 mb-6 shadow-sm">
        <p className="text-center text-sm font-bold text-slate-900 mb-1">Typical week</p>
        <p className="text-center text-xs text-slate-500 mb-4">Select the days you'll be open during this period.</p>
        <div className="flex flex-wrap justify-center gap-2">
          {DAYS.map(d => {
            const active = typicalWeek.includes(d.key)
            const hasShifts = active && (shiftsByDay[d.key]?.length ?? 0) > 0
            return (
              <button
                key={d.key}
                onClick={() => toggleDay(d.key)}
                className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all
                  ${active ? 'bg-brand text-white shadow-md shadow-brand/20 hover:bg-brand-dark' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                {d.short}
                {hasShifts && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />}
              </button>
            )
          })}
        </div>
        {typicalWeek.length > 0 && (
          <p className="text-center text-xs text-emerald-600 mt-3 flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Shifts defined
          </p>
        )}
      </div>

      {/* Shifts editor */}
      {typicalWeek.length > 0 && (
        <div className="bg-white border-2 border-slate-100 rounded-3xl p-5 mb-6 shadow-sm">
          <p className="text-center text-sm font-bold text-slate-900 mb-1">Shifts</p>
          <p className="text-center text-xs text-slate-500 mb-5">Define one or more shifts per day. Use the copy icon to apply to other days.</p>
          <div className="space-y-3">
            {DAYS.filter(d => typicalWeek.includes(d.key)).map(d => (
              <div key={d.key} className="flex items-start gap-3">
                <div className="w-24 pt-2.5 text-sm font-semibold text-slate-700">{d.long}</div>
                <div className="flex-1 space-y-2">
                  {(shiftsByDay[d.key] ?? []).map((shift, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                      <Clock size={14} className="text-slate-400 flex-shrink-0" />
                      <input type="time" value={shift.start} onChange={e => updateShift(d.key, i, { start: e.target.value })}
                        className="bg-white border border-slate-200 rounded-md px-2 py-1 text-xs font-medium text-slate-700 outline-none focus:border-brand w-20" />
                      <span className="text-slate-400 text-xs">→</span>
                      <input type="time" value={shift.end} onChange={e => updateShift(d.key, i, { end: e.target.value })}
                        className="bg-white border border-slate-200 rounded-md px-2 py-1 text-xs font-medium text-slate-700 outline-none focus:border-brand w-20" />
                      <Users size={14} className="text-slate-400 ml-2 flex-shrink-0" />
                      <input type="number" min={1} value={shift.people} onChange={e => updateShift(d.key, i, { people: Math.max(1, +e.target.value || 1) })}
                        className="bg-white border border-slate-200 rounded-md px-2 py-1 text-xs font-medium text-slate-700 outline-none focus:border-brand w-12" />
                      <Coffee size={14} className="text-slate-400 ml-2 flex-shrink-0" />
                      <input type="number" min={0} step={5} value={shift.breakMin} onChange={e => updateShift(d.key, i, { breakMin: Math.max(0, +e.target.value || 0) })}
                        className="bg-white border border-slate-200 rounded-md px-2 py-1 text-xs font-medium text-slate-700 outline-none focus:border-brand w-14" />
                      <button onClick={() => removeShift(d.key, i)} className="ml-auto w-6 h-6 rounded-full hover:bg-red-100 text-slate-400 hover:text-red-500 flex items-center justify-center">
                        <X size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={() => addShift(d.key)} className="pt-2 text-xs font-semibold text-brand hover:text-brand-dark flex items-center gap-1">
                  <Plus size={12} strokeWidth={3} /> Add
                </button>
                <button onClick={() => copyToOthers(d.key)} title="Copy to other active days"
                  className="pt-2 text-slate-400 hover:text-brand">
                  <Copy size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-100">
            <button onClick={() => setShowAll(true)} className="text-xs font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1.5">
              <List size={14} /> View all shifts
            </button>
            <div className="text-xs text-slate-500">
              {generatedDays.length} day{generatedDays.length !== 1 ? 's' : ''} scheduled
            </div>
          </div>
        </div>
      )}

      {/* Calendar overview */}
      {mode === 'edit' && months.length > 0 && months.length <= 6 && (
        <div className="bg-white border-2 border-slate-100 rounded-3xl p-5 shadow-sm">
          <p className="text-xs text-slate-500 mb-4">Click any day to edit its shifts. Each dot represents one shift.</p>
          <div className={`grid gap-5 ${months.length === 1 ? 'grid-cols-1' : months.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {months.map(m => <MiniMonth key={m.toISOString()} month={m} typicalWeek={typicalWeek} shiftsByDay={shiftsByDay} isWithin={isWithin} />)}
          </div>
        </div>
      )}
        </>
      )}

      {/* Shift edit modal — rendered via portal to escape CSS zoom */}
      {editingShift && createPortal((() => {
        const dayLabel = DAYS.find(d => d.key === editingShift.day)?.long ?? ''
        return (
          <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setEditingShift(null)}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Edit shift</p>
                  <h3 className="text-lg font-bold text-slate-900">{dayLabel}</h3>
                </div>
                <button onClick={() => setEditingShift(null)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
                  <X size={16} />
                </button>
              </div>

              {/* Time range */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5"><Clock size={12} /> Hours</p>
                <div className="flex items-center gap-3">
                  <input type="time" value={draft.start}
                    onChange={e => setDraft(d => ({ ...d, start: e.target.value }))}
                    className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-brand" />
                  <span className="text-slate-300 font-bold">→</span>
                  <input type="time" value={draft.end}
                    onChange={e => setDraft(d => ({ ...d, end: e.target.value }))}
                    className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-brand" />
                </div>
              </div>

              {/* People */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5"><Users size={12} /> Number of people</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setDraft(d => ({ ...d, people: Math.max(1, d.people - 1) }))}
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-lg flex items-center justify-center">−</button>
                  <span className="flex-1 text-center text-xl font-bold text-slate-900">{draft.people}</span>
                  <button onClick={() => setDraft(d => ({ ...d, people: d.people + 1 }))}
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-lg flex items-center justify-center">+</button>
                </div>
              </div>

              {/* Break */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5"><Coffee size={12} /> Break (minutes)</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setDraft(d => ({ ...d, breakMin: Math.max(0, d.breakMin - 5) }))}
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-lg flex items-center justify-center">−</button>
                  <span className="flex-1 text-center text-xl font-bold text-slate-900">{draft.breakMin}<span className="text-base font-medium text-slate-400 ml-1">min</span></span>
                  <button onClick={() => setDraft(d => ({ ...d, breakMin: d.breakMin + 5 }))}
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-lg flex items-center justify-center">+</button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button onClick={deleteShiftModal}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 border border-red-100 transition-colors">
                  Delete
                </button>
                <button onClick={saveShiftModal}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-brand hover:bg-brand-dark shadow-md shadow-brand/25 transition-all">
                  Save
                </button>
              </div>
            </div>
          </div>
        )
      })(), document.body)}

      {/* All shifts modal */}
      {showAll && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowAll(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-6 pt-6 pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">All shifts <span className="text-slate-400 font-medium text-sm">({generatedDays.reduce((n, d) => n + d.shifts.length, 0)} across {generatedDays.length} days)</span></h3>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-3 space-y-2">
              {generatedDays.map((d, i) => (
                <div key={i} className="flex items-start justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{d.date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    <p className="text-xs text-slate-400">{d.shifts.length} shift{d.shifts.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-xs text-slate-500 text-right space-y-0.5">
                    {d.shifts.map((s, j) => (
                      <div key={j}>{s.start}–{s.end} ×{s.people} · {s.breakMin}m</div>
                    ))}
                  </div>
                </div>
              ))}
              {generatedDays.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-8">No days scheduled yet.</p>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
              <button onClick={() => setShowAll(false)} className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DateField({ label, value, onChange, display, min }: { label: string; value: string; onChange: (v: string) => void; display: string; min?: string }) {
  return (
    <label className="relative block bg-white border-2 border-slate-200 hover:border-slate-300 rounded-2xl px-4 py-3 cursor-pointer transition-all">
      <div className="flex items-center gap-3">
        <Calendar size={18} className="text-slate-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
          <p className="text-sm font-semibold text-slate-800 truncate">{display}</p>
        </div>
      </div>
      <input type="date" value={value} min={min} onChange={e => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer" />
    </label>
  )
}

function MiniMonth({ month, typicalWeek, shiftsByDay, isWithin }: { month: Date; typicalWeek: DayKey[]; shiftsByDay: ShiftsByDay; isWithin: (d: Date) => boolean }) {
  const year = month.getFullYear()
  const m = month.getMonth()
  const firstWeekday = (new Date(year, m, 1).getDay() + 6) % 7 // Mo=0
  const daysInMonth = new Date(year, m + 1, 0).getDate()
  const cells: (Date | null)[] = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, m, d))
  while (cells.length % 7 !== 0) cells.push(null)
  const weekHeaders = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
  return (
    <div>
      <p className="text-sm font-bold text-slate-900 mb-2">{month.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
      <div className="grid grid-cols-7 text-[10px] text-slate-400 font-semibold mb-1">
        {weekHeaders.map(h => <div key={h} className="text-center">{h}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />
          const dk = dayKeyFromDate(d)
          const within = isWithin(d)
          const active = within && typicalWeek.includes(dk)
          const shiftCount = active ? (shiftsByDay[dk]?.length ?? 0) : 0
          return (
            <div key={i} className={`aspect-square rounded-md flex flex-col items-center justify-center text-[11px] font-semibold
              ${active ? 'bg-emerald-100 text-slate-800' : within ? 'text-slate-700' : 'text-slate-300'}`}>
              {d.getDate()}
              {shiftCount > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {Array.from({ length: Math.min(shiftCount, 3) }).map((_, k) => <span key={k} className="w-1 h-1 rounded-full bg-emerald-500" />)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
