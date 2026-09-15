import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CalmReset } from './CalmReset'

describe('CalmReset', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('guides three truthful ten-second cycles and can restart', () => {
    vi.useFakeTimers()
    let now = 0
    vi.spyOn(performance, 'now').mockImplementation(() => now)

    render(<CalmReset hasSearch motion="reduced" onResume={() => undefined} />)
    expect(screen.getByText('Breathe in')).toBeInTheDocument()
    expect(screen.getByText('Cycle 1 of 3')).toBeInTheDocument()

    now = 4_100
    act(() => vi.advanceTimersByTime(100))
    expect(screen.getByText('Stay open')).toBeInTheDocument()

    now = 6_100
    act(() => vi.advanceTimersByTime(100))
    expect(screen.getByText('Breathe out')).toBeInTheDocument()

    now = 20_100
    act(() => vi.advanceTimersByTime(100))
    expect(screen.getByText('Cycle 3 of 3')).toBeInTheDocument()

    now = 30_000
    act(() => vi.advanceTimersByTime(100))
    expect(screen.getByText('Awareness reset')).toBeInTheDocument()
    expect(screen.getByText('Three cycles complete')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Run the reset again' }))
    expect(screen.getByText('Breathe in')).toBeInTheDocument()
    expect(screen.getByText('Cycle 1 of 3')).toBeInTheDocument()
  })
})
