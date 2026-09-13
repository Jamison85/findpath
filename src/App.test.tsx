import { fireEvent, render, screen, within } from '@testing-library/react'
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
    expect(screen.getByText('A calmer path to what’s missing')).toBeInTheDocument()
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

  it('saves a custom home spot, pins the item, and promotes that home next time', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /other item/i }))
    fireEvent.change(screen.getByLabelText('What are we finding?'), { target: { value: 'Work badge' } })
    fireEvent.click(screen.getByRole('button', { name: 'Start' }))
    fireEvent.click(screen.getByText('Carried in a hand'))
    fireEvent.click(screen.getByText('At home'))
    fireEvent.click(screen.getByText('Came in or left'))
    fireEvent.click(screen.getByRole('button', { name: 'Found it' }))
    fireEvent.change(screen.getByLabelText('Or type the exact place'), { target: { value: 'Entry tray' } })
    fireEvent.click(screen.getByRole('checkbox', { name: /make this work badge’s home spot/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Save found place' }))
    fireEvent.click(screen.getByRole('button', { name: 'Back home' }))

    const pinned = screen.getByRole('group', { name: 'Pinned items' })
    fireEvent.click(within(pinned).getByRole('button', { name: 'Work badge' }))
    fireEvent.click(screen.getByText('Carried in a hand'))
    fireEvent.click(screen.getByText('At home'))
    fireEvent.click(screen.getByText('Came in or left'))
    expect(screen.getByRole('heading', { name: 'Its saved home' })).toBeInTheDocument()
    expect(screen.getByText(/start at entry tray/i)).toBeInTheDocument()
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

  it('announces an installed-app update and applies it on request', () => {
    const postMessage = vi.fn()
    render(<App />)
    fireEvent(window, new CustomEvent('findtrail:update-ready', { detail: { worker: { postMessage } } }))
    expect(screen.getByText('FindTrail update ready')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Update now' }))
    expect(postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' })
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
