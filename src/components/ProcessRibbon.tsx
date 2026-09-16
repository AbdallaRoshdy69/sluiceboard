import { AREA_LABELS } from '../lib/labels'
import { ALARM_AREAS, type ProcessAlarm } from '../types'

interface ProcessRibbonProps {
  openByArea: Record<ProcessAlarm['area'], number>
}

export function ProcessRibbon({ openByArea }: ProcessRibbonProps) {
  return (
    <section className="process-ribbon" aria-labelledby="process-heading">
      <div className="ribbon-heading">
        <p className="eyebrow">Live process path</p>
        <h2 id="process-heading">Open alarms by area</h2>
      </div>
      <ol>
        {ALARM_AREAS.map((area, index) => {
          const count = openByArea[area]
          return (
            <li key={area} className={count > 0 ? 'has-open-alarm' : 'is-clear'}>
              <span className="stage-number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="stage-copy">
                <strong>{AREA_LABELS[area]}</strong>
                <span>{count === 0 ? 'No open alarms' : `${count} open ${count === 1 ? 'alarm' : 'alarms'}`}</span>
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
