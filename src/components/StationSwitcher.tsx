import type { Station } from '../types'

interface StationSwitcherProps {
  stations: Station[]
  activeStationId: string
  onChange: (stationId: string) => void
}

export function StationSwitcher({
  stations,
  activeStationId,
  onChange,
}: StationSwitcherProps) {
  return (
    <div className="station-switcher">
      <label htmlFor="station-select">Active station</label>
      <select
        id="station-select"
        value={activeStationId}
        onChange={(event) => onChange(event.target.value)}
      >
        {stations.map((station) => (
          <option key={station.id} value={station.id}>
            {station.name}
          </option>
        ))}
      </select>
    </div>
  )
}
