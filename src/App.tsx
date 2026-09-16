import './App.css'
import { AddAlarmForm } from './components/AddAlarmForm'
import { AlarmTable } from './components/AlarmTable'
import { BulkActions } from './components/BulkActions'
import { FilterPanel } from './components/FilterPanel'
import { ProcessRibbon } from './components/ProcessRibbon'
import { ShiftSummary } from './components/ShiftSummary'
import { StationSwitcher } from './components/StationSwitcher'
import { useSluiceboard } from './hooks/useSluiceboard'

export default function App() {
  const sluiceboard = useSluiceboard()
  const { activeStation } = sluiceboard

  if (!activeStation) {
    return <main className="empty-app">No treatment stations are available.</main>
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <a className="brand" href="#main-content" aria-label="Sluiceboard home">
          <span className="brand-mark" aria-hidden="true">SB</span>
          <span>
            <strong>Sluiceboard</strong>
            <small>Water operations desk</small>
          </span>
        </a>
        <div className="header-controls">
          <span className="training-badge">Training data</span>
          <StationSwitcher
            stations={sluiceboard.stations}
            activeStationId={activeStation.id}
            onChange={sluiceboard.switchStation}
          />
        </div>
      </header>

      <main id="main-content" className="main-content">
        <section className="station-banner" aria-labelledby="station-heading">
          <div>
            <p className="eyebrow">{activeStation.location}</p>
            <h1 id="station-heading">{activeStation.name}</h1>
            <p>
              Review active process alarms, capture operator context, and leave a clear handover for the next shift.
            </p>
          </div>
          <div className="station-stamp" aria-label={`Shift ${activeStation.shiftStart} to ${activeStation.shiftEnd}`}>
            <span>Shift window</span>
            <strong>{activeStation.shiftStart}</strong>
            <span aria-hidden="true">→</span>
            <strong>{activeStation.shiftEnd}</strong>
          </div>
        </section>

        <div className="overview-grid">
          <ProcessRibbon openByArea={sluiceboard.openByArea} />
          <ShiftSummary station={activeStation} progress={sluiceboard.progress} />
        </div>

        <FilterPanel
          filters={sluiceboard.filters}
          resultCount={sluiceboard.visibleAlarms.length}
          onChange={sluiceboard.updateFilters}
        />

        <BulkActions
          selectedCount={sluiceboard.selectedIds.size}
          visibleSelectedCount={sluiceboard.visibleSelectedCount}
          visibleCount={sluiceboard.visibleAlarms.length}
          onSelectVisible={sluiceboard.selectVisible}
          onClear={sluiceboard.clearSelection}
          onAcknowledge={() => sluiceboard.setSelectedAcknowledged(true)}
          onReopen={() => sluiceboard.setSelectedAcknowledged(false)}
        />

        <AlarmTable
          alarms={sluiceboard.visibleAlarms}
          selectedIds={sluiceboard.selectedIds}
          onToggle={sluiceboard.toggleSelection}
        />

        <AddAlarmForm onAdd={sluiceboard.addAlarm} />
      </main>

      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {sluiceboard.announcement}
      </div>
    </div>
  )
}
