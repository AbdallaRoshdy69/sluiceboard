import { useEffect, useMemo, useState } from 'react'
import {
  countOpenAlarmsByArea,
  DEFAULT_FILTERS,
  filterAlarms,
  getAcknowledgementProgress,
} from '../lib/filters'
import { createId } from '../lib/id'
import { loadStations, saveStations } from '../lib/storage'
import type { AlarmFilters, NewProcessAlarm, Station } from '../types'

export function useSluiceboard() {
  const [stations, setStations] = useState<Station[]>(loadStations)
  const [activeStationId, setActiveStationId] = useState<string | null>(null)
  const [filters, setFilters] = useState<AlarmFilters>(DEFAULT_FILTERS)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const [announcement, setAnnouncement] = useState('')

  const activeStation = useMemo(
    () => stations.find((station) => station.id === activeStationId) ?? stations[0],
    [activeStationId, stations],
  )
  const visibleAlarms = useMemo(
    () => filterAlarms(activeStation?.alarms ?? [], filters),
    [activeStation, filters],
  )
  const progress = useMemo(
    () => getAcknowledgementProgress(activeStation?.alarms ?? []),
    [activeStation],
  )
  const openByArea = useMemo(
    () => countOpenAlarmsByArea(activeStation?.alarms ?? []),
    [activeStation],
  )
  const visibleSelectedCount = useMemo(
    () => visibleAlarms.filter((alarm) => selectedIds.has(alarm.id)).length,
    [selectedIds, visibleAlarms],
  )

  useEffect(() => {
    saveStations(stations)
  }, [stations])

  function switchStation(stationId: string) {
    setActiveStationId(stationId)
    setFilters(DEFAULT_FILTERS)
    setSelectedIds(new Set())
    setAnnouncement('Station changed. Filters and selection cleared.')
  }

  function updateFilters(nextFilters: AlarmFilters) {
    setFilters(nextFilters)
  }

  function toggleSelection(alarmId: string) {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(alarmId)) next.delete(alarmId)
      else next.add(alarmId)
      return next
    })
  }

  function selectVisible() {
    setSelectedIds((current) => {
      const next = new Set(current)
      visibleAlarms.forEach((alarm) => next.add(alarm.id))
      return next
    })
  }

  function clearSelection() {
    setSelectedIds(new Set())
  }

  function setSelectedAcknowledged(acknowledged: boolean) {
    if (!activeStation || selectedIds.size === 0) return
    const selectedCount = selectedIds.size

    setStations((current) =>
      current.map((station) =>
        station.id === activeStation.id
          ? {
              ...station,
              alarms: station.alarms.map((alarm) =>
                selectedIds.has(alarm.id) ? { ...alarm, acknowledged } : alarm,
              ),
            }
          : station,
      ),
    )
    setSelectedIds(new Set())
    setAnnouncement(
      `${selectedCount} ${selectedCount === 1 ? 'alarm' : 'alarms'} marked ${acknowledged ? 'acknowledged' : 'open'}.`,
    )
  }

  function addAlarm(newAlarm: NewProcessAlarm) {
    if (!activeStation) return

    setStations((current) =>
      current.map((station) =>
        station.id === activeStation.id
          ? {
              ...station,
              alarms: [
                ...station.alarms,
                {
                  ...newAlarm,
                  id: createId('alarm'),
                  acknowledged: false,
                },
              ],
            }
          : station,
      ),
    )
    setAnnouncement(`${newAlarm.title} added to the open alarm queue.`)
  }

  return {
    stations,
    activeStation,
    filters,
    visibleAlarms,
    progress,
    openByArea,
    selectedIds,
    visibleSelectedCount,
    announcement,
    switchStation,
    updateFilters,
    toggleSelection,
    selectVisible,
    clearSelection,
    setSelectedAcknowledged,
    addAlarm,
  }
}
