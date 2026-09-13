import { describe, expect, it } from 'vitest'
import { getRecoveryActions } from './recovery'
import { createActiveSearch } from './storage'

describe('recovery actions', () => {
  it('gives urgent medicine an immediate safety action', () => {
    const search = { ...createActiveSearch('medicine', 'Medicine'), answers: { itemDetail: 'urgent' } }
    expect(getRecoveryActions(search)[0].detail).toContain('Do not wait')
  })

  it('uses the custom item name in the next-step guidance', () => {
    const search = createActiveSearch('other', 'Work badge')
    expect(getRecoveryActions(search)[0].detail).toContain('work badge')
  })
})
