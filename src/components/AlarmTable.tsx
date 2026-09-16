import { AREA_LABELS, formatRaisedAt } from '../lib/labels'
import type { ProcessAlarm } from '../types'

interface AlarmTableProps {
  alarms: ProcessAlarm[]
  selectedIds: Set<string>
  onToggle: (alarmId: string) => void
}

const readingFormatter = new Intl.NumberFormat('en', {
  maximumFractionDigits: 2,
})

export function AlarmTable({ alarms, selectedIds, onToggle }: AlarmTableProps) {
  return (
    <div className="alarm-table-shell">
      <table className="alarm-table">
        <caption>Alarm queue for the active station</caption>
        <thead>
          <tr>
            <th scope="col" className="select-column">
              <span className="sr-only">Select</span>
            </th>
            <th scope="col">Alarm</th>
            <th scope="col">Area</th>
            <th scope="col">Reading</th>
            <th scope="col">Raised</th>
            <th scope="col">Severity</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {alarms.map((alarm) => (
            <tr key={alarm.id} className={selectedIds.has(alarm.id) ? 'is-selected' : undefined}>
              <td className="select-column">
                <input
                  type="checkbox"
                  checked={selectedIds.has(alarm.id)}
                  aria-label={`Select ${alarm.title} (${alarm.tag})`}
                  onChange={() => onToggle(alarm.id)}
                />
              </td>
              <th scope="row">
                <span className="alarm-title">{alarm.title}</span>
                <span className="alarm-tag">{alarm.tag}</span>
                <span className="alarm-note">{alarm.notes}</span>
              </th>
              <td>{AREA_LABELS[alarm.area]}</td>
              <td className="reading-cell">
                <strong>{readingFormatter.format(alarm.reading)}</strong>
                <span>{alarm.unit}</span>
              </td>
              <td>
                <time dateTime={alarm.raisedAt}>{formatRaisedAt(alarm.raisedAt)}</time>
              </td>
              <td>
                <span className={`severity-label ${alarm.critical ? 'critical' : 'watch'}`}>
                  {alarm.critical ? 'Critical' : 'Watch'}
                </span>
              </td>
              <td>
                <span
                  className={`status-label ${alarm.acknowledged ? 'acknowledged' : 'open'}`}
                >
                  <span aria-hidden="true">{alarm.acknowledged ? '✓' : '!'}</span>{' '}
                  {alarm.acknowledged ? 'Acknowledged' : 'Open'}
                </span>
              </td>
            </tr>
          ))}
          {alarms.length === 0 ? (
            <tr>
              <td colSpan={7} className="empty-row">
                <strong>No alarms match these controls.</strong>
                <span>Clear a filter to restore the station queue.</span>
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  )
}
