import type { AcknowledgementProgress, Station } from '../types'

interface ShiftSummaryProps {
  station: Station
  progress: AcknowledgementProgress
}

export function ShiftSummary({ station, progress }: ShiftSummaryProps) {
  const criticalOpen = station.alarms.filter(
    (alarm) => alarm.critical && !alarm.acknowledged,
  ).length

  return (
    <section className="shift-summary" aria-labelledby="shift-summary-heading">
      <div className="summary-title">
        <div>
          <p className="eyebrow">Shift handover</p>
          <h2 id="shift-summary-heading">Alarm acknowledgement</h2>
        </div>
        <span className="shift-window">
          {station.shiftStart}–{station.shiftEnd}
        </span>
      </div>

      <div className="summary-metrics">
        <div>
          <strong>{progress.open}</strong>
          <span>open</span>
        </div>
        <div>
          <strong>{criticalOpen}</strong>
          <span>critical and open</span>
        </div>
        <div>
          <strong>{progress.acknowledged}</strong>
          <span>acknowledged</span>
        </div>
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-label={`${progress.acknowledged} of ${progress.total} alarms acknowledged`}
        aria-valuemin={0}
        aria-valuemax={progress.total}
        aria-valuenow={progress.acknowledged}
      >
        <span style={{ width: `${progress.percentage}%` }} />
      </div>
      <p className="progress-copy">
        {progress.acknowledged} of {progress.total} alarms acknowledged ({progress.percentage}%)
      </p>
    </section>
  )
}
