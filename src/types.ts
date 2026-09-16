export const ALARM_AREAS = ['intake', 'filtration', 'disinfection', 'storage'] as const

export type AlarmArea = (typeof ALARM_AREAS)[number]

export interface ProcessAlarm {
  id: string
  title: string
  tag: string
  area: AlarmArea
  reading: number
  unit: string
  acknowledged: boolean
  critical: boolean
  notes: string
  raisedAt: string
}

export interface Station {
  id: string
  name: string
  location: string
  shiftStart: string
  shiftEnd: string
  alarms: ProcessAlarm[]
}

export interface AlarmFilters {
  query: string
  area: 'all' | AlarmArea
  status: 'all' | 'open' | 'acknowledged'
  criticalOnly: boolean
}

export type NewProcessAlarm = Omit<ProcessAlarm, 'id' | 'acknowledged'>

export interface AcknowledgementProgress {
  acknowledged: number
  open: number
  total: number
  percentage: number
}
