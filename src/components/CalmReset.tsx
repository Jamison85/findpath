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
  const phaseCue = seconds === 0
    ? 'Pick one place and continue from there.'
    : phaseClass === 'inhale'
      ? 'Slowly fill the circle.'
      : phaseClass === 'hold'
        ? 'Stay here for a moment.'
        : 'Let the tension leave with it.'

  useEffect(() => {
    if (seconds <= 0) return
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [seconds])

  return (
    <section className="view calm-view" aria-labelledby="view-heading">
      <div className="calm-view__wash" aria-hidden="true" />
      <svg className="calm-view__trail" viewBox="0 0 540 920" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-28 760C90 700 58 566 168 522C275 479 236 353 350 311C426 283 465 212 572 128" />
      </svg>

      <div className="calm-view__content">
        <header className="calm-view__intro">
          <span className="eyebrow eyebrow--light"><Icon name="calm" size={17} /> 30-second reset</span>
          <h1 id="view-heading" tabIndex={-1}>The search can wait one breath.</h1>
          <p>Attention gets noisy when the search gets frantic. Follow the light, then return to one place.</p>
        </header>

        <section className="calm-stage" aria-label="Guided breathing reset">
          <div className="calm-stage__topline">
            <span><Icon name="trail" size={15} /> Follow the light</span>
            <strong>{seconds}s</strong>
          </div>

          <div className={`breath-orb ${phaseClass}`} aria-hidden="true">
            <svg viewBox="0 0 120 120">
              <circle className="breath-orb__track" cx="60" cy="60" r="52" />
              <circle className="breath-orb__progress" cx="60" cy="60" r="52" style={{ strokeDasharray: circumference, strokeDashoffset: offset }} />
            </svg>
            <span className="breath-orb__core"><i /></span>
          </div>

          <div className="calm-stage__status">
            <strong className="breath-phase" aria-live="polite">{seconds === 0 ? 'Ready when you are' : phase}</strong>
            <span>{phaseCue}</span>
          </div>

          <div className="breath-rhythm" aria-label="Breathing pattern: breathe in for 4 seconds, hold for 2 seconds, breathe out for 6 seconds">
            <span className={seconds > 0 && phaseClass === 'inhale' ? 'is-active' : ''}><b>4</b> in</span>
            <span className={seconds > 0 && phaseClass === 'hold' ? 'is-active' : ''}><b>2</b> hold</span>
            <span className={seconds > 0 && phaseClass === 'exhale' ? 'is-active' : ''}><b>6</b> out</span>
          </div>
        </section>

        <div className="calm-actions">
          <button className="button button--paper" onClick={onResume}><Icon name="trail" size={18} />{hasSearch ? 'Return to my trail' : 'Back home'}</button>
          <button className="calm-restart" onClick={() => setSeconds(TOTAL_SECONDS)}><Icon name="refresh" size={16} /> Restart reset</button>
        </div>
      </div>
    </section>
  )
}
