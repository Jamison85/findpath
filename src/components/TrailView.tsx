import { useEffect, useMemo, useRef, useState } from 'react'
import { createRecognition, speak, stopSpeaking } from '../speech'
import type { ActiveSearch, Settings } from '../types'
import { Icon } from './Icon'

interface TrailViewProps {
  search: ActiveSearch
  settings: Settings
  onBack: () => void
  onToggleSpot: (spot: string) => void
  onNext: () => void
  onFound: () => void
  onCalm: () => void
  onEditClues: () => void
}

export function TrailView({ search, settings, onBack, onToggleSpot, onNext, onFound, onCalm, onEditClues }: TrailViewProps) {
  const stop = search.stops[search.currentIndex]
  const checked = search.checkedSpots[stop.id] ?? []
  const totalChecked = Object.values(search.checkedSpots).reduce((total, spots) => total + spots.length, 0)
  const isLastStop = search.currentIndex === search.stops.length - 1
  const [listening, setListening] = useState(false)
  const [heard, setHeard] = useState('')
  const [voiceError, setVoiceError] = useState('')
  const recognitionRef = useRef<ReturnType<typeof createRecognition>>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const voiceSupported = typeof window !== 'undefined' && Boolean(window.SpeechRecognition ?? window.webkitSpeechRecognition)
  const spokenText = useMemo(() => `${stop.title}. ${stop.instruction}. Check ${stop.spots.join(', ')}.`, [stop])

  function readCurrent() {
    speak(spokenText)
  }

  useEffect(() => {
    if (settings.speakSteps) readCurrent()
    headingRef.current?.focus({ preventScroll: true })
    return stopSpeaking
    // Reading should happen only when the trail stop changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stop.id, settings.speakSteps])

  useEffect(() => () => recognitionRef.current?.stop(), [])

  function toggleListening() {
    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }
    setVoiceError('')
    const recognition = createRecognition((command) => {
      if (command === 'next') onNext()
      if (command === 'found') onFound()
      if (command === 'repeat') readCurrent()
    }, (next) => {
      if (typeof next.listening === 'boolean') setListening(next.listening)
      if (typeof next.heard === 'string') setHeard(next.heard)
      if (typeof next.error === 'string') setVoiceError(next.error)
    })
    if (!recognition) {
      setVoiceError('Voice commands are not available in this browser. Read aloud still works.')
      return
    }
    recognitionRef.current = recognition
    try {
      recognition.start()
      setListening(true)
    } catch {
      setVoiceError('Voice commands could not start. Tap to try again.')
    }
  }

  return (
    <section className="view trail-view" aria-labelledby="view-heading">
      <header className="topbar">
        <button className="icon-button" onClick={onBack} aria-label="Return home"><Icon name="back" /></button>
        <div className="topbar__trail">
          <span>{search.itemLabel}</span>
          <strong>Stop {search.currentIndex + 1} of {search.stops.length}</strong>
        </div>
        <button className="text-button" onClick={onEditClues}>Clues</button>
      </header>

      <div className="trail-route">
        <div className="trail-progress" role="progressbar" aria-label="Search trail progress" aria-valuemin={1} aria-valuemax={search.stops.length} aria-valuenow={search.currentIndex + 1}>
          <span style={{ width: `${((search.currentIndex + 1) / search.stops.length) * 100}%` }} />
        </div>
        <span>{totalChecked ? `${totalChecked} exact ${totalChecked === 1 ? 'spot' : 'spots'} checked` : 'One focused area at a time'}</span>
      </div>

      <article key={stop.id} className={`stop-card stop-card--${stop.kind ?? 'standard'}`}>
        <div className="stop-card__heading">
          <span className="stop-number"><small>Stop</small><strong>{search.currentIndex + 1}</strong></span>
          <div><p className="kicker">Search this area only</p><h1 ref={headingRef} id="view-heading" tabIndex={-1}>{stop.title}</h1></div>
        </div>
        {stop.reason && <p className="reason"><Icon name={stop.kind === 'home' ? 'pin' : ['history', 'learned'].includes(stop.kind ?? '') ? 'history' : stop.kind === 'safety' ? 'spark' : 'trail'} size={17} />{stop.reason}</p>}
        <p className="stop-card__instruction">{stop.instruction}</p>

        <div className="spot-list__heading"><strong>Check these exact spots</strong><span aria-live="polite">{checked.length} of {stop.spots.length}</span></div>
        <div className="spot-list" role="group" aria-label={`Places to check at ${stop.title}`}>
          {stop.spots.map((spot) => {
            const isChecked = checked.includes(spot)
            return (
              <button key={spot} className={isChecked ? 'spot-row is-checked' : 'spot-row'} onClick={() => onToggleSpot(spot)} aria-pressed={isChecked}>
                <span className="spot-row__check"><Icon name="check" size={17} /></span>
                <span>{spot}</span>
              </button>
            )
          })}
        </div>

        <aside className="side-quest-note">
          <strong>Side-quest shield</strong>
          <span>Do not organize, clean, or “quickly check” another room yet. Sneaky bastard.</span>
        </aside>
      </article>

      <div className="voice-tools">
        <button className="voice-tool" onClick={readCurrent}><Icon name="volume" size={19} /> Read this step</button>
        <button className={listening ? 'voice-tool is-listening' : 'voice-tool'} onClick={toggleListening} disabled={!voiceSupported} title={!voiceSupported ? 'Not supported by this browser' : undefined}>
          <Icon name="voice" size={19} /> {listening ? 'Listening…' : 'Hands-free'}
        </button>
      </div>
      {(heard || voiceError) && <p className={voiceError ? 'voice-status is-error' : 'voice-status'} aria-live="polite">{voiceError || `Heard: “${heard}”`}</p>}

      <div className="sticky-actions">
        <button className="button button--found" onClick={onFound}><Icon name="spark" size={20} /> Found it</button>
        <button className="button button--primary" onClick={onNext}>{isLastStop ? 'Still missing · next steps' : 'Nothing here · next stop'}</button>
        <button className="button button--quiet" onClick={onCalm}>I need a reset</button>
      </div>
    </section>
  )
}
