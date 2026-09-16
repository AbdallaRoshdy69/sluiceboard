import { type FormEvent, useEffect, useRef, useState } from 'react'
import { AREA_LABELS } from '../lib/labels'
import { ALARM_AREAS, type AlarmArea, type NewProcessAlarm } from '../types'

interface AlarmFormState {
  title: string
  tag: string
  area: AlarmArea
  reading: string
  unit: string
  notes: string
  raisedAt: string
  critical: boolean
}

const EMPTY_FORM: AlarmFormState = {
  title: '',
  tag: '',
  area: 'intake',
  reading: '',
  unit: '',
  notes: '',
  raisedAt: '',
  critical: false,
}

interface AddAlarmFormProps {
  onAdd: (alarm: NewProcessAlarm) => void
}

export function AddAlarmForm({ onAdd }: AddAlarmFormProps) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<AlarmFormState>(EMPTY_FORM)
  const [error, setError] = useState('')
  const triggerRef = useRef<HTMLButtonElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) titleRef.current?.focus()
  }, [open])

  function closeForm() {
    setOpen(false)
    setError('')
    triggerRef.current?.focus()
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const reading = Number(form.reading)
    const requiredText = [form.title, form.tag, form.unit, form.notes, form.raisedAt]

    if (requiredText.some((value) => value.trim() === '') || !Number.isFinite(reading)) {
      setError('Complete every required field with a valid process reading.')
      return
    }

    onAdd({
      title: form.title.trim(),
      tag: form.tag.trim().toUpperCase(),
      area: form.area,
      reading,
      unit: form.unit.trim(),
      notes: form.notes.trim(),
      raisedAt: form.raisedAt,
      critical: form.critical,
    })
    setForm(EMPTY_FORM)
    closeForm()
  }

  return (
    <section className="add-alarm-shell" aria-labelledby="add-alarm-heading">
      <div className="add-alarm-heading">
        <div>
          <p className="eyebrow">Operator entry</p>
          <h2 id="add-alarm-heading">Log an observed alarm</h2>
        </div>
        <button
          ref={triggerRef}
          type="button"
          className="secondary-button"
          aria-expanded={open}
          aria-controls="add-alarm-form"
          onClick={() => (open ? closeForm() : setOpen(true))}
        >
          {open ? 'Close report' : 'Add alarm report'}
        </button>
      </div>

      {open ? (
        <form id="add-alarm-form" className="add-alarm-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field wide-field">
              <label htmlFor="alarm-title">Alarm title</label>
              <input
                ref={titleRef}
                id="alarm-title"
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="alarm-tag">Instrument tag</label>
              <input
                id="alarm-tag"
                value={form.tag}
                onChange={(event) => setForm({ ...form, tag: event.target.value })}
                placeholder="PIT-000"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="alarm-area">Process area</label>
              <select
                id="alarm-area"
                value={form.area}
                onChange={(event) =>
                  setForm({ ...form, area: event.target.value as AlarmArea })
                }
              >
                {ALARM_AREAS.map((area) => (
                  <option key={area} value={area}>
                    {AREA_LABELS[area]}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="alarm-reading">Current reading</label>
              <input
                id="alarm-reading"
                type="number"
                step="any"
                value={form.reading}
                onChange={(event) => setForm({ ...form, reading: event.target.value })}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="alarm-unit">Unit</label>
              <input
                id="alarm-unit"
                value={form.unit}
                onChange={(event) => setForm({ ...form, unit: event.target.value })}
                placeholder="bar, %, NTU"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="alarm-raised-at">Raised at</label>
              <input
                id="alarm-raised-at"
                type="datetime-local"
                value={form.raisedAt}
                onChange={(event) => setForm({ ...form, raisedAt: event.target.value })}
                required
              />
            </div>

            <div className="field wide-field">
              <label htmlFor="alarm-notes">Operator note</label>
              <textarea
                id="alarm-notes"
                rows={3}
                value={form.notes}
                onChange={(event) => setForm({ ...form, notes: event.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-footer">
            <label className="check-field" htmlFor="alarm-critical">
              <input
                id="alarm-critical"
                type="checkbox"
                checked={form.critical}
                onChange={(event) => setForm({ ...form, critical: event.target.checked })}
              />
              Mark as critical
            </label>
            <div className="form-actions">
              <button type="button" className="text-button" onClick={closeForm}>
                Cancel
              </button>
              <button type="submit" className="primary-button">
                Add to open queue
              </button>
            </div>
          </div>
          {error ? <p role="alert" className="form-error">{error}</p> : null}
        </form>
      ) : null}
    </section>
  )
}
