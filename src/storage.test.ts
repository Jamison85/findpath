import { describe, expect, it } from 'vitest'
import { BACKUP_FORMAT, DEFAULT_SETTINGS, EMPTY_DATA, LEGACY_STORAGE_KEY, STORAGE_KEY, createActiveSearch, loadData, parseBackup, saveData, serializeBackup } from './storage'

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
    expect(saveData({ version: 3, history: [], activeSearch, settings: DEFAULT_SETTINGS, savedItems: [] }, storage)).toBe(true)
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

  it('migrates version 2 data without losing history or an active search', () => {
    const activeSearch = { ...createActiveSearch('keys', 'Keys'), version: 2 }
    const legacy = JSON.stringify({ version: 2, history: [], activeSearch, settings: { speakSteps: true } })
    const storage = {
      getItem: (key: string) => key === LEGACY_STORAGE_KEY ? legacy : null,
    }
    const migrated = loadData(storage)
    expect(migrated.version).toBe(3)
    expect(migrated.activeSearch?.version).toBe(3)
    expect(migrated.settings.speakSteps).toBe(true)
    expect(migrated.savedItems).toEqual([])
  })

  it('round-trips a complete, validated backup', () => {
    const data = {
      ...EMPTY_DATA,
      savedItems: [{
        id: 'other:work badge', itemId: 'other' as const, itemLabel: 'Work badge', homeSpot: 'Entry bowl', pinned: true,
        createdAt: '2026-09-13T12:00:00.000Z', updatedAt: '2026-09-13T12:00:00.000Z',
      }],
    }
    const parsed = parseBackup(serializeBackup(data))
    expect(parsed.ok && parsed.data.savedItems[0].homeSpot).toBe('Entry bowl')
  })

  it('rejects a backup with malformed nested data', () => {
    const raw = JSON.stringify({ format: BACKUP_FORMAT, version: 3, data: { ...EMPTY_DATA, savedItems: [{ nope: true }] } })
    expect(parseBackup(raw)).toEqual({ ok: false, error: 'The backup is damaged or uses an unsupported version.' })
  })
})
