import type { AcknowledgementProgress, AlarmFilters, ProcessAlarm } from '../types'

export const DEFAULT_FILTERS: AlarmFilters = {
  query: '',
  area: 'all',
  status: 'all',
  criticalOnly: false,
}

export function filterAlarms(
  alarms: ProcessAlarm[],
  filters: AlarmFilters,
): ProcessAlarm[] {
  const query = filters.query.trim().toLocaleLowerCase()

  return alarms.filter((alarm) => {
    const matchesQuery =
      query.length === 0 ||
      alarm.title.toLocaleLowerCase().includes(query) ||
      alarm.tag.toLocaleLowerCase().includes(query) ||
      alarm.notes.toLocaleLowerCase().includes(query)
    const matchesArea = filters.area === 'all' || alarm.area === filters.area
    const matchesStatus =
      filters.status === 'all' ||
      (filters.status === 'acknowledged' && alarm.acknowledged) ||
      (filters.status === 'open' && !alarm.acknowledged)
    const matchesCritical = !filters.criticalOnly || alarm.critical

    return matchesQuery && matchesArea && matchesStatus && matchesCritical
  })
}

export function getAcknowledgementProgress(
  alarms: ProcessAlarm[],
): AcknowledgementProgress {
  const acknowledged = alarms.filter((alarm) => alarm.acknowledged).length
  const total = alarms.length

  return {
    acknowledged,
    open: total - acknowledged,
    total,
    percentage: total === 0 ? 0 : Math.round((acknowledged / total) * 100),
  }
}

export function countOpenAlarmsByArea(
  alarms: ProcessAlarm[],
): Record<ProcessAlarm['area'], number> {
  return alarms.reduce<Record<ProcessAlarm['area'], number>>(
    (counts, alarm) => {
      if (!alarm.acknowledged) counts[alarm.area] += 1
      return counts
    },
    { intake: 0, filtration: 0, disinfection: 0, storage: 0 },
  )
}
