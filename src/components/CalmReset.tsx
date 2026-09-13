import { useEffect, useMemo, useState } from 'react'
import { Icon } from './Icon'

const TOTAL_SECONDS = 30

export function CalmReset({ onResume, hasSearch }: { onResume: () => void; hasSearch: boolean }) {
  const [seconds, setSeconds] = useState(TOTAL_SECONDS)
  const elapsed = TOTAL_SECONDS - seconds
  const cycle = elapsed % 12
  const phase = cycle < 4 ? 'Breathe in' : cycle < 6 ? 'Hold' : 'Breathe out'
  const phaseClass = cycle < 4 ? 'inhale' : cycle < 6 ? 'hold' : 'exhale'
  const circumference = 2 * Math.PI * 52
  const offset = useMemo(() => circumference * (seconds / TOTAL_SECONDS), [circumference, seconds])

  useEffect(() => {
    if (seconds <= 0) return
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [seconds])

  return (
    <section className="view calm-view" aria-labelledby="view-heading">
      <div className="calm-view__wash" aria-hidden="true" />
      <div className="calm-view__content">
        <span className="eyebrow eyebrow--light"><Icon name="calm" size={17} /> 30-second reset</span>
        <h1 id="view-heading" tabIndex={-1}>The search can wait one breath.</h1>
        <p>You are not failing. Your attention is overloaded. Follow the circle, then return to one place.</p>
        <div className={`breath-orb ${phaseClass}`} aria-hidden="true">
          <svg viewBox="0 0 120 120">
            <circle className="breath-orb__track" cx="60" cy="60" r="52" />
            <circle className="breath-orb__progress" cx="60" cy="60" r="52" style={{ strokeDasharray: circumference, strokeDashoffset: offset }} />
          </svg>
          <span />
        </div>
        <strong className="breath-phase" aria-live="polite">{seconds === 0 ? 'Ready when you are' : phase}</strong>
        <small>{seconds}s</small>
        <button className="button button--paper" onClick={onResume}>{hasSearch ? 'Return to my trail' : 'Back home'}</button>
        <button className="button button--ghost-light" onClick={() => setSeconds(TOTAL_SECONDS)}>Restart</button>
      </div>
    </section>
  )
}
