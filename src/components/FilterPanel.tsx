import { DEFAULT_FILTERS } from '../lib/filters'
import { AREA_LABELS } from '../lib/labels'
import { ALARM_AREAS, type AlarmFilters } from '../types'

interface FilterPanelProps {
  filters: AlarmFilters
  resultCount: number
  onChange: (filters: AlarmFilters) => void
}

export function FilterPanel({ filters, resultCount, onChange }: FilterPanelProps) {
  const hasActiveFilters =
    filters.query !== '' ||
    filters.area !== 'all' ||
    filters.status !== 'all' ||
    filters.criticalOnly

  return (
    <section className="filter-panel" aria-labelledby="filter-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Queue controls</p>
          <h2 id="filter-heading">Narrow the alarm list</h2>
        </div>
        <span className="result-count" aria-live="polite">
          {resultCount} {resultCount === 1 ? 'alarm' : 'alarms'}
        </span>
      </div>

      <div className="filter-grid">
        <div className="field search-field">
          <label htmlFor="alarm-search">Search title, tag, or operator note</label>
          <input
            id="alarm-search"
            type="search"
            value={filters.query}
            onChange={(event) => onChange({ ...filters, query: event.target.value })}
            placeholder="Try chlorine or PIT-511"
          />
        </div>

        <div className="field">
          <label htmlFor="area-filter">Process area</label>
          <select
            id="area-filter"
            value={filters.area}
            onChange={(event) =>
              onChange({ ...filters, area: event.target.value as AlarmFilters['area'] })
            }
          >
            <option value="all">All areas</option>
            {ALARM_AREAS.map((area) => (
              <option key={area} value={area}>
                {AREA_LABELS[area]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="filter-lower-row">
        <fieldset className="status-filter">
          <legend>Alarm status</legend>
          <div className="segmented-control">
            {([
              ['all', 'All'],
              ['open', 'Open'],
              ['acknowledged', 'Acknowledged'],
            ] as const).map(([value, label]) => (
              <label key={value}>
                <input
                  type="radio"
                  name="alarm-status"
                  value={value}
                  checked={filters.status === value}
                  onChange={() => onChange({ ...filters, status: value })}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="check-field" htmlFor="critical-filter">
          <input
            id="critical-filter"
            type="checkbox"
            checked={filters.criticalOnly}
            onChange={(event) =>
              onChange({ ...filters, criticalOnly: event.target.checked })
            }
          />
          Critical alarms only
        </label>

        <button
          className="text-button"
          type="button"
          disabled={!hasActiveFilters}
          onClick={() => onChange(DEFAULT_FILTERS)}
        >
          Clear filters
        </button>
      </div>
    </section>
  )
}
