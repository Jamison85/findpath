import type { ActiveSearch, FoundEntry, ItemId, PersistedData, SearchStop, Settings } from './types'

export const STORAGE_KEY = 'findtrail:data:v2'

export const DEFAULT_SETTINGS: Settings = {
  motion: 'system',
  textSize: 'standard',
  speakSteps: false,
  calmPause: true,
}

export const EMPTY_DATA: PersistedData = {
  version: 2,
  history: [],
  activeSearch: null,
  settings: DEFAULT_SETTINGS,
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const ITEM_IDS = new Set<ItemId>(['keys', 'wallet', 'money', 'phone', 'medicine', 'glasses', 'remote', 'other'])

function isItemId(value: unknown): value is ItemId {
  return typeof value === 'string' && ITEM_IDS.has(value as ItemId)
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return isObject(value) && Object.values(value).every((entry) => typeof entry === 'string')
}

function isStringArrayRecord(value: unknown): value is Record<string, string[]> {
  return isObject(value) && Object.values(value).every(
    (entry) => Array.isArray(entry) && entry.every((item) => typeof item === 'string'),
  )
}

function isFiniteNonNegative(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

function isDateString(value: unknown): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value))
}

function validStop(value: unknown): value is SearchStop {
  if (!isObject(value) || typeof value.id !== 'string' || typeof value.title !== 'string' || typeof value.instruction !== 'string') return false
  return Array.isArray(value.spots) && value.spots.every((spot) => typeof spot === 'string')
}

function validHistory(value: unknown): FoundEntry[] {
  if (!Array.isArray(value)) return []
  return value.filter((entry): entry is FoundEntry => {
    if (!isObject(entry)) return false
    return typeof entry.id === 'string'
      && isItemId(entry.itemId)
      && typeof entry.itemLabel === 'string'
      && typeof entry.foundLocation === 'string'
      && isDateString(entry.foundAt)
      && isStringRecord(entry.answers)
      && Number.isInteger(entry.stopsChecked)
      && isFiniteNonNegative(entry.stopsChecked)
      && isFiniteNonNegative(entry.durationSeconds)
  }).slice(0, 100)
}

function validActiveSearch(value: unknown): ActiveSearch | null {
  if (!isObject(value) || value.version !== 2 || !Array.isArray(value.stops) || !value.stops.every(validStop)) return null
  if (typeof value.id !== 'string' || !isItemId(value.itemId) || typeof value.itemLabel !== 'string' || !isStringRecord(value.answers)) return null
  if (!Number.isInteger(value.currentIndex) || !isFiniteNonNegative(value.currentIndex) || value.currentIndex >= Math.max(1, value.stops.length)) return null
  if (!isStringArrayRecord(value.checkedSpots) || !isDateString(value.startedAt) || !isDateString(value.lastUpdatedAt)) return null
  return value as unknown as ActiveSearch
}

function validSettings(value: unknown): Settings {
  if (!isObject(value)) return { ...DEFAULT_SETTINGS }
  return {
    motion: ['system', 'full', 'reduced'].includes(String(value.motion)) ? value.motion as Settings['motion'] : DEFAULT_SETTINGS.motion,
    textSize: ['standard', 'large'].includes(String(value.textSize)) ? value.textSize as Settings['textSize'] : DEFAULT_SETTINGS.textSize,
    speakSteps: typeof value.speakSteps === 'boolean' ? value.speakSteps : DEFAULT_SETTINGS.speakSteps,
    calmPause: typeof value.calmPause === 'boolean' ? value.calmPause : DEFAULT_SETTINGS.calmPause,
  }
}

export function loadData(storage: Pick<Storage, 'getItem'> = localStorage): PersistedData {
  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (!raw) return { ...EMPTY_DATA, settings: { ...DEFAULT_SETTINGS } }
    const parsed: unknown = JSON.parse(raw)
    if (!isObject(parsed) || parsed.version !== 2) return { ...EMPTY_DATA, settings: { ...DEFAULT_SETTINGS } }
    return { version: 2, history: validHistory(parsed.history), activeSearch: validActiveSearch(parsed.activeSearch), settings: validSettings(parsed.settings) }
  } catch {
    return { ...EMPTY_DATA, settings: { ...DEFAULT_SETTINGS } }
  }
}

export function saveData(data: PersistedData, storage: Pick<Storage, 'setItem'> = localStorage): boolean {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ ...data, history: data.history.slice(0, 100) }))
    return true
  } catch {
    return false
  }
}

export function createActiveSearch(itemId: ActiveSearch['itemId'], itemLabel: string): ActiveSearch {
  const now = new Date().toISOString()
  return {
    version: 2,
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    itemId,
    itemLabel,
    answers: {},
    stops: [],
    currentIndex: 0,
    checkedSpots: {},
    startedAt: now,
    lastUpdatedAt: now,
  }
}
