import { describe, expect, it } from 'vitest'
import { buildTrail, getFoundSuggestions, mostLikelyLocation } from './trailEngine'
import type { FoundEntry } from './types'

const history: FoundEntry[] = [
  { id: '1', itemId: 'keys', itemLabel: 'Keys', foundLocation: 'Blue hoodie pocket', foundAt: '2026-09-10T10:00:00.000Z', answers: {}, stopsChecked: 2, durationSeconds: 80 },
  { id: '2', itemId: 'keys', itemLabel: 'Keys', foundLocation: 'Kitchen counter', foundAt: '2026-09-09T10:00:00.000Z', answers: {}, stopsChecked: 4, durationSeconds: 200 },
  { id: '3', itemId: 'keys', itemLabel: 'Keys', foundLocation: 'Blue hoodie pocket', foundAt: '2026-09-08T10:00:00.000Z', answers: {}, stopsChecked: 3, durationSeconds: 110 },
]

describe('buildTrail', () => {
  it('uses situational clues before the generic item route', () => {
    const trail = buildTrail('keys', 'Keys', { itemDetail: 'car', lastPlace: 'home', lastAction: 'arrived' }, [])
    expect(trail[0].id).toBe('drop-zone')
    expect(trail.map((stop) => stop.id)).toContain('car')
  })

  it('promotes the user’s most common found location', () => {
    const trail = buildTrail('keys', 'Keys', { itemDetail: 'ring', lastPlace: 'unsure', lastAction: 'unsure' }, history)
    expect(trail[0].kind).toBe('history')
    expect(trail[0].instruction).toContain('Blue hoodie pocket')
    expect(mostLikelyLocation(history, 'keys', 'Keys')).toEqual({ location: 'Blue hoodie pocket', count: 2 })
  })

  it('puts safety guidance first for urgent medicine and missing cards', () => {
    expect(buildTrail('medicine', 'Medicine', { itemDetail: 'urgent' }, [])[0].id).toBe('safety-help')
    expect(buildTrail('money', 'Money', { itemDetail: 'card' }, [])[0].id).toBe('card-safety')
  })

  it('never repeats stops and always ends with a slow sweep', () => {
    const trail = buildTrail('wallet', 'Wallet', { itemDetail: 'pocket', lastPlace: 'car', lastAction: 'carried' }, [])
    expect(new Set(trail.map((stop) => stop.id)).size).toBe(trail.length)
    expect(trail.at(-1)?.id).toBe('slow-sweep')
  })

  it('offers current-stop and item suggestions without duplicates', () => {
    const trail = buildTrail('keys', 'Keys', {}, [])
    const suggestions = getFoundSuggestions('keys', trail[0])
    expect(new Set(suggestions).size).toBe(suggestions.length)
    expect(suggestions.length).toBeLessThanOrEqual(10)
  })
})
