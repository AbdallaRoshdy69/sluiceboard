import type { AlarmArea } from '../types'

export const AREA_LABELS: Record<AlarmArea, string> = {
  intake: 'Intake',
  filtration: 'Filtration',
  disinfection: 'Disinfection',
  storage: 'Storage',
}

export function formatRaisedAt(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}
