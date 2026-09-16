import { ALARM_AREAS, type ProcessAlarm, type Station } from '../types'

export const STORAGE_KEY = 'sluiceboard-stations-v1'

export const SAMPLE_STATIONS: Station[] = [
  {
    id: 'north-intake-works',
    name: 'North Intake Works',
    location: 'River Gate · Line A',
    shiftStart: '06:00',
    shiftEnd: '14:00',
    alarms: [
      {
        id: 'screen-differential',
        title: 'Screen differential pressure high',
        tag: 'PDI-104',
        area: 'intake',
        reading: 78,
        unit: 'kPa',
        acknowledged: false,
        critical: true,
        notes: 'Inspect the north rake before the next automatic cycle.',
        raisedAt: '2026-09-17T06:18',
      },
      {
        id: 'raw-turbidity',
        title: 'Raw water turbidity above watch limit',
        tag: 'AIT-118',
        area: 'intake',
        reading: 34.6,
        unit: 'NTU',
        acknowledged: true,
        critical: false,
        notes: 'Rainfall upstream is still affecting the inlet channel.',
        raisedAt: '2026-09-17T06:41',
      },
      {
        id: 'filter-four-headloss',
        title: 'Filter four headloss rising',
        tag: 'PDT-244',
        area: 'filtration',
        reading: 2.4,
        unit: 'mH₂O',
        acknowledged: false,
        critical: false,
        notes: 'Compare with the backwash queue after the 08:00 sample.',
        raisedAt: '2026-09-17T07:06',
      },
      {
        id: 'chlorine-residual',
        title: 'Chlorine residual below target',
        tag: 'AIT-322',
        area: 'disinfection',
        reading: 0.42,
        unit: 'mg/L',
        acknowledged: false,
        critical: true,
        notes: 'Confirm analyzer calibration before changing the dosing rate.',
        raisedAt: '2026-09-17T07:29',
      },
      {
        id: 'clearwell-level',
        title: 'Clearwell level nearing upper band',
        tag: 'LIT-405',
        area: 'storage',
        reading: 87,
        unit: '%',
        acknowledged: true,
        critical: false,
        notes: 'Distribution demand is expected to increase after 09:00.',
        raisedAt: '2026-09-17T07:52',
      },
    ],
  },
  {
    id: 'east-clarifier-hall',
    name: 'East Clarifier Hall',
    location: 'Process Block · Train 2',
    shiftStart: '14:00',
    shiftEnd: '22:00',
    alarms: [
      {
        id: 'flocculator-torque',
        title: 'Flocculator drive torque unstable',
        tag: 'TQI-207',
        area: 'filtration',
        reading: 61,
        unit: '%',
        acknowledged: false,
        critical: false,
        notes: 'Check for ragging at the gearbox inspection point.',
        raisedAt: '2026-09-17T14:22',
      },
      {
        id: 'clarifier-blanket',
        title: 'Clarifier blanket depth high',
        tag: 'LIT-231',
        area: 'filtration',
        reading: 2.8,
        unit: 'm',
        acknowledged: false,
        critical: true,
        notes: 'Coordinate a sludge draw before flow steps up.',
        raisedAt: '2026-09-17T14:47',
      },
      {
        id: 'uv-bank-output',
        title: 'UV bank output derated',
        tag: 'PWR-337',
        area: 'disinfection',
        reading: 72,
        unit: '%',
        acknowledged: true,
        critical: false,
        notes: 'Bank B remains available while lamp three cools.',
        raisedAt: '2026-09-17T15:03',
      },
    ],
  },
  {
    id: 'south-reservoir',
    name: 'South Reservoir',
    location: 'High Zone · Cell 1',
    shiftStart: '22:00',
    shiftEnd: '06:00',
    alarms: [
      {
        id: 'outlet-pressure',
        title: 'Outlet pressure below service band',
        tag: 'PIT-511',
        area: 'storage',
        reading: 3.1,
        unit: 'bar',
        acknowledged: false,
        critical: true,
        notes: 'Verify booster pump two is available before dispatch.',
        raisedAt: '2026-09-17T22:11',
      },
      {
        id: 'cell-one-level',
        title: 'Cell one drawdown faster than forecast',
        tag: 'LIT-504',
        area: 'storage',
        reading: 46,
        unit: '%',
        acknowledged: false,
        critical: false,
        notes: 'Compare the district meter total with the overnight plan.',
        raisedAt: '2026-09-17T22:38',
      },
    ],
  },
]

function cloneStations(stations: Station[]): Station[] {
  return stations.map((station) => ({
    ...station,
    alarms: station.alarms.map((alarm) => ({ ...alarm })),
  }))
}

function isProcessAlarm(value: unknown): value is ProcessAlarm {
  if (!value || typeof value !== 'object') return false
  const alarm = value as Record<string, unknown>

  return (
    typeof alarm.id === 'string' &&
    typeof alarm.title === 'string' &&
    typeof alarm.tag === 'string' &&
    typeof alarm.area === 'string' &&
    ALARM_AREAS.includes(alarm.area as ProcessAlarm['area']) &&
    typeof alarm.reading === 'number' &&
    Number.isFinite(alarm.reading) &&
    typeof alarm.unit === 'string' &&
    typeof alarm.acknowledged === 'boolean' &&
    typeof alarm.critical === 'boolean' &&
    typeof alarm.notes === 'string' &&
    typeof alarm.raisedAt === 'string'
  )
}

function isStation(value: unknown): value is Station {
  if (!value || typeof value !== 'object') return false
  const station = value as Record<string, unknown>

  return (
    typeof station.id === 'string' &&
    typeof station.name === 'string' &&
    typeof station.location === 'string' &&
    typeof station.shiftStart === 'string' &&
    typeof station.shiftEnd === 'string' &&
    Array.isArray(station.alarms) &&
    station.alarms.every(isProcessAlarm)
  )
}

export function loadStations(
  storage: Pick<Storage, 'getItem'> = window.localStorage,
): Station[] {
  try {
    const stored = storage.getItem(STORAGE_KEY)
    if (!stored) return cloneStations(SAMPLE_STATIONS)

    const parsed: unknown = JSON.parse(stored)
    if (!Array.isArray(parsed) || !parsed.every(isStation)) {
      return cloneStations(SAMPLE_STATIONS)
    }

    return cloneStations(parsed)
  } catch {
    return cloneStations(SAMPLE_STATIONS)
  }
}

export function saveStations(
  stations: Station[],
  storage: Pick<Storage, 'setItem'> = window.localStorage,
): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(stations))
}
