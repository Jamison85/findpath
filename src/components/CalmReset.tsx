import { useEffect, useMemo, useRef, useState } from 'react'
import type { Settings } from '../types'
import { HorizonRipples } from './HorizonRipples'
import { Icon } from './Icon'

const TOTAL_SECONDS = 30
const CYCLE_SECONDS = 10

type SoundMode = 'off' | 'wind' | 'chime'
type ResetPhase = 'Breathe in' | 'Stay open' | 'Breathe out'

interface SoundRig {
  context: AudioContext
  stop: () => void
}

function useReducedMotion(motion: Settings['motion']) {
  const [systemReduced, setSystemReduced] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!media) return
    const update = () => setSystemReduced(media.matches)
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])

  return motion === 'reduced' || (motion === 'system' && systemReduced)
}

function playChime(context: AudioContext) {
  const now = context.currentTime
  const gain = context.createGain()
  gain.gain.setValueAtTime(.0001, now)
  gain.gain.exponentialRampToValueAtTime(.035, now + .035)
  gain.gain.exponentialRampToValueAtTime(.0001, now + 1.35)
  gain.connect(context.destination)

  ;[523.25, 659.25].forEach((frequency, index) => {
    const oscillator = context.createOscillator()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequency, now)
    oscillator.detune.setValueAtTime(index * 4, now)
    oscillator.connect(gain)
    oscillator.start(now + (index * .045))
    oscillator.stop(now + 1.4)
  })
}

function createWind(context: AudioContext) {
  const duration = 2
  const buffer = context.createBuffer(1, context.sampleRate * duration, context.sampleRate)
  const channel = buffer.getChannelData(0)
  let smoothNoise = 0
  for (let index = 0; index < channel.length; index += 1) {
    smoothNoise = (smoothNoise * .985) + ((Math.random() * 2 - 1) * .015)
    channel[index] = smoothNoise
  }

  const source = context.createBufferSource()
  const filter = context.createBiquadFilter()
  const gain = context.createGain()
  source.buffer = buffer
  source.loop = true
  filter.type = 'lowpass'
  filter.frequency.value = 720
  gain.gain.value = .035
  source.connect(filter)
  filter.connect(gain)
  gain.connect(context.destination)
  source.start()
  return () => source.stop()
}

function phaseFor(elapsed: number): ResetPhase {
  const withinCycle = elapsed % CYCLE_SECONDS
  if (withinCycle < 4) return 'Breathe in'
  if (withinCycle < 6) return 'Stay open'
  return 'Breathe out'
}

export function CalmReset({ onResume, hasSearch, motion }: { onResume: () => void; hasSearch: boolean; motion: Settings['motion'] }) {
  const [run, setRun] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [soundMode, setSoundMode] = useState<SoundMode>('off')
  const soundRig = useRef<SoundRig | null>(null)
  const lastChimeCycle = useRef(-1)
  const reducedMotion = useReducedMotion(motion)

  const seconds = Math.max(0, Math.ceil(TOTAL_SECONDS - elapsed))
  const complete = seconds === 0
  const cycle = Math.min(3, Math.floor(elapsed / CYCLE_SECONDS) + 1)
  const phase = complete ? 'Awareness reset' : phaseFor(elapsed)
  const phaseSeconds = useMemo(() => {
    if (complete) return ''
    const withinCycle = elapsed % CYCLE_SECONDS
    if (withinCycle < 4) return `${Math.max(1, Math.ceil(4 - withinCycle))}s`
    if (withinCycle < 6) return `${Math.max(1, Math.ceil(6 - withinCycle))}s`
    return `${Math.max(1, Math.ceil(10 - withinCycle))}s`
  }, [complete, elapsed])

  useEffect(() => {
    const startedAt = performance.now()
    setElapsed(0)
    const timer = window.setInterval(() => {
      const next = Math.min(TOTAL_SECONDS, (performance.now() - startedAt) / 1000)
      setElapsed(next)
      if (next >= TOTAL_SECONDS) window.clearInterval(timer)
    }, 100)
    return () => window.clearInterval(timer)
  }, [run])

  useEffect(() => () => {
    soundRig.current?.stop()
    soundRig.current?.context.close().catch(() => undefined)
  }, [])

  useEffect(() => {
    if (soundMode !== 'chime' || complete || !soundRig.current) return
    const currentCycle = Math.floor(elapsed / CYCLE_SECONDS)
    if (currentCycle <= lastChimeCycle.current) return
    lastChimeCycle.current = currentCycle
    playChime(soundRig.current.context)
  }, [complete, elapsed, soundMode])

  useEffect(() => {
    if (!complete || !soundRig.current) return
    const current = soundRig.current
    soundRig.current = null
    current.stop()
    current.context.close().catch(() => undefined)
    setSoundMode('off')
  }, [complete])

  function stopSound() {
    const current = soundRig.current
    soundRig.current = null
    current?.stop()
    current?.context.close().catch(() => undefined)
  }

  function chooseSound(next: SoundMode) {
    stopSound()
    setSoundMode(next)
    lastChimeCycle.current = -1
    if (next === 'off') return

    const AudioContextConstructor = window.AudioContext
      || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextConstructor) {
      setSoundMode('off')
      return
    }

    const context = new AudioContextConstructor()
    context.resume().catch(() => undefined)
    const stopWind = next === 'wind' ? createWind(context) : () => undefined
    soundRig.current = {
      context,
      stop: () => {
        try { stopWind() } catch { /* The source may already be stopped. */ }
      },
    }
    if (next === 'chime') {
      lastChimeCycle.current = Math.floor(elapsed / CYCLE_SECONDS)
      playChime(context)
    }
  }

  function restart() {
    stopSound()
    setSoundMode('off')
    lastChimeCycle.current = -1
    setRun((value) => value + 1)
  }

  return (
    <section className="view calm-view" aria-labelledby="view-heading">
      <HorizonRipples reducedMotion={reducedMotion} restartKey={run} />
      <div className="calm-view__veil" aria-hidden="true" />

      <header className="calm-topbar">
        <span className="eyebrow eyebrow--light"><Icon name="calm" size={17} /> 30-second reset</span>
        <button className="calm-skip" onClick={onResume}>Skip <Icon name="close" size={15} /></button>
      </header>

      <div className="calm-view__content">
        <div className="calm-copy">
          <h1 id="view-heading" tabIndex={-1}>The search can wait <em>one breath.</em></h1>
          <p>Attention gets noisy when the search gets frantic. Let the light widen your awareness.</p>
        </div>

        <div className="breath-guide">
          <div className={`breath-guide__phase breath-guide__phase--${phase.toLowerCase().replaceAll(' ', '-')}`}>
            <span aria-hidden="true" />
            <strong aria-live="polite">{phase}</strong>
            {phaseSeconds && <small aria-hidden="true">{phaseSeconds}</small>}
          </div>
          <div className="breath-guide__bar" role="progressbar" aria-label="Mental reset progress" aria-valuemin={0} aria-valuemax={TOTAL_SECONDS} aria-valuenow={Math.round(elapsed)}>
            <span style={{ width: `${Math.min(100, (elapsed / TOTAL_SECONDS) * 100)}%` }} />
          </div>
          <div className="breath-guide__meta">
            <span>{complete ? 'Three cycles complete' : `Cycle ${cycle} of 3`}</span>
            <span>{complete ? 'Ready when you are' : `${seconds}s remaining`}</span>
          </div>
          <small className="breath-guide__rhythm">4 in <i /> 2 open <i /> 4 out</small>
        </div>
      </div>

      <footer className="calm-controls">
        <div className="sound-control">
          <span>Optional sound</span>
          <div role="group" aria-label="Reset sound">
            {(['off', 'wind', 'chime'] as SoundMode[]).map((option) => (
              <button key={option} className={soundMode === option ? 'is-active' : ''} aria-pressed={soundMode === option} onClick={() => chooseSound(option)}>
                {option[0].toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <button className="button button--paper calm-resume" onClick={onResume}>
          {hasSearch ? 'Return to my trail' : 'Back home'} <Icon name="forward" size={18} />
        </button>
        {complete && <button className="calm-restart" onClick={restart}><Icon name="refresh" size={15} /> Run the reset again</button>}
      </footer>
    </section>
  )
}
