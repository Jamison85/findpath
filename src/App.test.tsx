import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { DEFAULT_SETTINGS, STORAGE_KEY } from './storage'

describe('FindTrail app', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  it('turns three clues into a focused trail', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /keys/i }))
    fireEvent.click(screen.getByText('Car keys'))
    fireEvent.click(screen.getByText('At home'))
    fireEvent.click(screen.getByText('Came in or left'))
    expect(screen.getByRole('heading', { name: 'The landing zone' })).toBeInTheDocument()
    expect(screen.getByText('Search this spot. Not the whole universe.')).toBeInTheDocument()
  })

  it('accepts a custom item name', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /other item/i }))
    fireEvent.change(screen.getByLabelText('What are we finding?'), { target: { value: 'Work badge' } })
    fireEvent.click(screen.getByRole('button', { name: 'Start' }))
    expect(screen.getByText('Work badge')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'How does this item usually travel?' })).toBeInTheDocument()
  })

  it('returns to the same trail after a reset', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /keys/i }))
    fireEvent.click(screen.getByText('Car keys'))
    fireEvent.click(screen.getByText('At home'))
    fireEvent.click(screen.getByText('Came in or left'))
    fireEvent.click(screen.getByRole('button', { name: 'I need a reset' }))
    expect(screen.getByRole('heading', { name: 'The search can wait one breath.' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Return to my trail' }))
    expect(screen.getByRole('heading', { name: 'The landing zone' })).toBeInTheDocument()
  })

  it('requires confirmation before clearing found history', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: 2,
      activeSearch: null,
      settings: DEFAULT_SETTINGS,
      history: [{
        id: 'found-1', itemId: 'keys', itemLabel: 'Keys', foundLocation: 'Entry hook',
        foundAt: '2026-09-12T12:00:00.000Z', answers: {}, stopsChecked: 1, durationSeconds: 30,
      }],
    }))
    const confirm = vi.mocked(window.confirm)
    confirm.mockReturnValue(false)
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'History' }))
    fireEvent.click(screen.getByRole('button', { name: 'Clear found history' }))
    expect(screen.getByText('Entry hook')).toBeInTheDocument()
    confirm.mockReturnValue(true)
    fireEvent.click(screen.getByRole('button', { name: 'Clear found history' }))
    expect(screen.getByText('No found places yet')).toBeInTheDocument()
  })
})
