import { describe, expect, it } from 'vitest'
import { DEFAULT_SETTINGS, EMPTY_DATA, STORAGE_KEY, createActiveSearch, loadData, saveData } from './storage'

function memoryStorage(seed?: string) {
  let value = seed ?? null
  return {
    getItem: (key: string) => key === STORAGE_KEY ? value : null,
    setItem: (key: string, next: string) => { if (key === STORAGE_KEY) value = next },
    value: () => value,
  }
}

describe('storage', () => {
  it('recovers safely from corrupt data', () => {
    expect(loadData(memoryStorage('{definitely-not-json'))).toEqual(EMPTY_DATA)
  })

  it('merges missing settings with defaults', () => {
    const storage = memoryStorage(JSON.stringify({ version: 2, history: [], activeSearch: null, settings: { speakSteps: true } }))
    expect(loadData(storage).settings).toEqual({ ...DEFAULT_SETTINGS, speakSteps: true })
  })

  it('persists and restores an active search', () => {
    const storage = memoryStorage()
    const activeSearch = createActiveSearch('wallet', 'Wallet')
    expect(saveData({ version: 2, history: [], activeSearch, settings: DEFAULT_SETTINGS }, storage)).toBe(true)
    expect(loadData(storage).activeSearch?.id).toBe(activeSearch.id)
  })

  it('drops malformed nested active-search data', () => {
    const activeSearch = {
      ...createActiveSearch('keys', 'Keys'),
      stops: [{ id: 'entry', title: 'Entry', instruction: 'Look carefully', spots: ['Hook'] }],
      checkedSpots: { entry: 'not-an-array' },
    }
    const storage = memoryStorage(JSON.stringify({ version: 2, history: [], activeSearch, settings: DEFAULT_SETTINGS }))
    expect(loadData(storage).activeSearch).toBeNull()
  })

  it('keeps valid history and discards malformed entries', () => {
    const validEntry = {
      id: 'found-1',
      itemId: 'wallet',
      itemLabel: 'Wallet',
      foundLocation: 'Jacket pocket',
      foundAt: '2026-09-12T12:00:00.000Z',
      answers: { lastPlace: 'home' },
      stopsChecked: 2,
      durationSeconds: 91,
    }
    const malformedEntry = { ...validEntry, id: 'found-2', durationSeconds: -1 }
    const storage = memoryStorage(JSON.stringify({ version: 2, history: [validEntry, malformedEntry], activeSearch: null, settings: DEFAULT_SETTINGS }))
    expect(loadData(storage).history).toEqual([validEntry])
  })
})
