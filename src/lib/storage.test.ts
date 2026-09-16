import { describe, expect, it } from 'vitest'
import { loadStations, SAMPLE_STATIONS, saveStations, STORAGE_KEY } from './storage'

function createStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial))
  return {
    getItem(key: string) {
      return values.get(key) ?? null
    },
    setItem(key: string, value: string) {
      values.set(key, value)
    },
  }
}

describe('station storage', () => {
  it('returns independent sample data when storage is empty', () => {
    const first = loadStations(createStorage())
    first[0].alarms[0].title = 'Changed in memory'

    expect(loadStations(createStorage())[0].alarms[0].title).toBe(
      SAMPLE_STATIONS[0].alarms[0].title,
    )
  })

  it('round-trips valid station data', () => {
    const storage = createStorage()
    saveStations(SAMPLE_STATIONS, storage)

    expect(loadStations(storage)).toEqual(SAMPLE_STATIONS)
  })

  it('falls back after corrupt JSON', () => {
    const storage = createStorage({ [STORAGE_KEY]: '{broken' })
    expect(loadStations(storage)).toEqual(SAMPLE_STATIONS)
  })

  it('rejects an unknown process area', () => {
    const invalid = structuredClone(SAMPLE_STATIONS) as unknown as Array<Record<string, unknown>>
    const alarms = invalid[0].alarms as Array<Record<string, unknown>>
    alarms[0].area = 'boiler-room'
    const storage = createStorage({ [STORAGE_KEY]: JSON.stringify(invalid) })

    expect(loadStations(storage)).toEqual(SAMPLE_STATIONS)
  })

  it('rejects a non-numeric process reading', () => {
    const invalid = structuredClone(SAMPLE_STATIONS) as unknown as Array<Record<string, unknown>>
    const alarms = invalid[0].alarms as Array<Record<string, unknown>>
    alarms[0].reading = 'high'
    const storage = createStorage({ [STORAGE_KEY]: JSON.stringify(invalid) })

    expect(loadStations(storage)).toEqual(SAMPLE_STATIONS)
  })
})
