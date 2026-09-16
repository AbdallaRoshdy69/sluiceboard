import { describe, expect, it } from 'vitest'
import { SAMPLE_STATIONS } from './storage'
import {
  countOpenAlarmsByArea,
  DEFAULT_FILTERS,
  filterAlarms,
  getAcknowledgementProgress,
} from './filters'

const alarms = SAMPLE_STATIONS[0].alarms

describe('filterAlarms', () => {
  it('returns every alarm for the default controls', () => {
    expect(filterAlarms(alarms, DEFAULT_FILTERS)).toHaveLength(5)
  })

  it('matches title, tag, and notes without case sensitivity', () => {
    expect(filterAlarms(alarms, { ...DEFAULT_FILTERS, query: 'CHLORINE' })).toHaveLength(1)
    expect(filterAlarms(alarms, { ...DEFAULT_FILTERS, query: 'pdi-104' })).toHaveLength(1)
    expect(filterAlarms(alarms, { ...DEFAULT_FILTERS, query: 'rainfall upstream' })).toHaveLength(1)
  })

  it('narrows the queue by process area', () => {
    const result = filterAlarms(alarms, { ...DEFAULT_FILTERS, area: 'intake' })
    expect(result.map((alarm) => alarm.id)).toEqual(['screen-differential', 'raw-turbidity'])
  })

  it('separates open and acknowledged alarms', () => {
    expect(filterAlarms(alarms, { ...DEFAULT_FILTERS, status: 'open' })).toHaveLength(3)
    expect(filterAlarms(alarms, { ...DEFAULT_FILTERS, status: 'acknowledged' })).toHaveLength(2)
  })

  it('shows only critical alarms when requested', () => {
    const result = filterAlarms(alarms, { ...DEFAULT_FILTERS, criticalOnly: true })
    expect(result.map((alarm) => alarm.id)).toEqual(['screen-differential', 'chlorine-residual'])
  })

  it('combines independent controls', () => {
    const result = filterAlarms(alarms, {
      query: 'filter',
      area: 'filtration',
      status: 'open',
      criticalOnly: false,
    })
    expect(result.map((alarm) => alarm.id)).toEqual(['filter-four-headloss'])
  })
})

describe('alarm summaries', () => {
  it('calculates acknowledgement progress', () => {
    expect(getAcknowledgementProgress(alarms)).toEqual({
      acknowledged: 2,
      open: 3,
      total: 5,
      percentage: 40,
    })
    expect(getAcknowledgementProgress([]).percentage).toBe(0)
  })

  it('counts open alarms by treatment area', () => {
    expect(countOpenAlarmsByArea(alarms)).toEqual({
      intake: 1,
      filtration: 1,
      disinfection: 1,
      storage: 0,
    })
  })
})
