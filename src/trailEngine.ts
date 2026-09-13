import { CLUE_PROMOTIONS, ITEM_BY_ID, STOPS } from './data'
import type { FoundEntry, ItemId, SearchStop } from './types'

function normalized(value: string): string {
  return value.trim().toLocaleLowerCase()
}

function slug(value: string): string {
  return normalized(value).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'place'
}

export function mostLikelyLocation(history: FoundEntry[], itemId: ItemId, itemLabel: string): { location: string; count: number } | null {
  const counts = new Map<string, { location: string; count: number; latest: number }>()
  history
    .filter((entry) => entry.itemId === itemId && (itemId !== 'other' || normalized(entry.itemLabel) === normalized(itemLabel)))
    .forEach((entry) => {
      const key = normalized(entry.foundLocation)
      if (!key) return
      const current = counts.get(key)
      const latest = Date.parse(entry.foundAt) || 0
      counts.set(key, { location: entry.foundLocation, count: (current?.count ?? 0) + 1, latest: Math.max(current?.latest ?? 0, latest) })
    })

  const best = [...counts.values()].sort((a, b) => b.count - a.count || b.latest - a.latest)[0]
  return best ? { location: best.location, count: best.count } : null
}

function historyStop(history: FoundEntry[], itemId: ItemId, itemLabel: string): SearchStop | null {
  const likely = mostLikelyLocation(history, itemId, itemLabel)
  if (!likely) return null
  return {
    id: `history-${slug(likely.location)}`,
    title: 'Your usual suspect',
    instruction: `Check ${likely.location} first. That is where ${itemLabel.toLocaleLowerCase()} turned up ${likely.count === 1 ? 'last time' : `${likely.count} times`}.`,
    spots: [likely.location, 'The surface beside it', 'The floor directly below'],
    reason: 'Suggested from your own found-item history.',
    kind: 'history',
  }
}

export function buildTrail(itemId: ItemId, itemLabel: string, answers: Record<string, string>, history: FoundEntry[]): SearchStop[] {
  const item = ITEM_BY_ID[itemId]
  const orderedIds: string[] = []

  if (itemId === 'medicine' && ['urgent', 'unsure'].includes(answers.itemDetail)) orderedIds.push('safety-help')
  if (itemId === 'money' && ['card', 'both'].includes(answers.itemDetail)) orderedIds.push('card-safety')

  for (const questionId of ['lastPlace', 'lastAction', 'itemDetail']) {
    const value = answers[questionId]
    if (value) orderedIds.push(...(CLUE_PROMOTIONS[questionId]?.[value] ?? []))
  }

  orderedIds.push(...item.baseStops)
  if (!orderedIds.includes('slow-sweep')) orderedIds.push('slow-sweep')

  const seen = new Set<string>()
  const standardStops = orderedIds
    .filter((id) => STOPS[id] && !seen.has(id) && seen.add(id))
    .map((id) => ({ ...STOPS[id], spots: [...STOPS[id].spots] }))

  const learned = historyStop(history, itemId, itemLabel)
  return learned ? [learned, ...standardStops] : standardStops
}

export function getFoundSuggestions(itemId: ItemId, stop: SearchStop | undefined): string[] {
  const fromStop = stop ? [stop.title, ...stop.spots] : []
  return [...new Set([...fromStop, ...ITEM_BY_ID[itemId].foundSuggestions])].slice(0, 10)
}
