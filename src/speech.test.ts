import { describe, expect, it } from 'vitest'
import { parseCommand } from './speech'

describe('parseCommand', () => {
  it.each([
    ['I found it', 'found'],
    ['nothing here, next', 'next'],
    ['say that again please', 'repeat'],
    ['check the couch', 'unknown'],
  ])('maps “%s” to %s', (transcript, command) => {
    expect(parseCommand(transcript)).toBe(command)
  })
})
