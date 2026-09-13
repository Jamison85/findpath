import { useEffect, useMemo, useRef, useState } from 'react'
import { BottomNav } from './components/BottomNav'
import { CalmReset } from './components/CalmReset'
import { Icon } from './components/Icon'
import { Scenery } from './components/Scenery'
import { TrailView } from './components/TrailView'
import { ITEMS, ITEM_BY_ID } from './data'
import { buildTrail, getFoundSuggestions, mostLikelyLocation } from './trailEngine'
import { createActiveSearch, loadData, saveData } from './storage'
import type { ActiveSearch, ClueQuestion, FoundEntry, ItemId, PersistedData, Screen, Settings } from './types'

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

interface FoundSummary { itemLabel: string; location: string; seconds: number }

function stamp(search: ActiveSearch): ActiveSearch {
  return { ...search, lastUpdatedAt: new Date().toISOString() }
}

function secondsBetween(start: string, end = new Date()): number {
  const value = Math.round((end.getTime() - Date.parse(start)) / 1000)
  return Number.isFinite(value) ? Math.max(0, value) : 0
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} sec`
  const minutes = Math.round(seconds / 60)
  return `${minutes} min`
}

function dateLabel(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Recently'
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(date)
}

export default function App() {
  const [data, setData] = useState<PersistedData>(() => loadData())
  const [screen, setScreen] = useState<Screen>(() => new URLSearchParams(window.location.search).get('screen') === 'calm' ? 'calm' : 'home')
  const [clueIndex, setClueIndex] = useState(0)
  const [customOpen, setCustomOpen] = useState(false)
  const [customName, setCustomName] = useState('')
  const [foundLocation, setFoundLocation] = useState('')
  const [foundSummary, setFoundSummary] = useState<FoundSummary | null>(null)
  const [returnScreen, setReturnScreen] = useState<Screen>('home')
  const [storageError, setStorageError] = useState(false)
  const [online, setOnline] = useState(() => navigator.onLine)
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null)
  const previousScreen = useRef(screen)

  const active = data.activeSearch
  const activeItem = active ? ITEM_BY_ID[active.itemId] : null

  useEffect(() => {
    if (!saveData(data)) setStorageError(true)
  }, [data])

  useEffect(() => {
    const onlineHandler = () => setOnline(true)
    const offlineHandler = () => setOnline(false)
    const installHandler = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as InstallPromptEvent)
    }
    window.addEventListener('online', onlineHandler)
    window.addEventListener('offline', offlineHandler)
    window.addEventListener('beforeinstallprompt', installHandler)
    return () => {
      window.removeEventListener('online', onlineHandler)
      window.removeEventListener('offline', offlineHandler)
      window.removeEventListener('beforeinstallprompt', installHandler)
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.motion = data.settings.motion
    document.documentElement.dataset.textSize = data.settings.textSize
  }, [data.settings])

  useEffect(() => {
    if (previousScreen.current !== screen) {
      window.scrollTo({ top: 0, behavior: 'auto' })
      window.setTimeout(() => document.getElementById('view-heading')?.focus({ preventScroll: true }), 0)
      previousScreen.current = screen
    }
  }, [screen])

  function navigate(next: Screen) {
    if (next === 'calm') setReturnScreen(active?.stops.length ? 'trail' : 'home')
    setScreen(next)
  }

  function updateActive(updater: (current: ActiveSearch) => ActiveSearch) {
    setData((current) => current.activeSearch ? { ...current, activeSearch: stamp(updater(current.activeSearch)) } : current)
  }

  function startSearch(itemId: ItemId, label?: string) {
    const item = ITEM_BY_ID[itemId]
    const itemLabel = label?.trim() || item.shortLabel
    if (data.activeSearch && !window.confirm(`Replace the current ${data.activeSearch.itemLabel} search with a new one?`)) return
    setData((current) => ({ ...current, activeSearch: createActiveSearch(itemId, itemLabel) }))
    setClueIndex(0)
    setFoundSummary(null)
    setFoundLocation('')
    setCustomOpen(false)
    setCustomName('')
    setScreen('clues')
  }

  function answerClue(value: string) {
    if (!active || !activeItem) return
    const question = activeItem.questions[clueIndex]
    const answers = { ...active.answers, [question.id]: value }
    if (clueIndex < activeItem.questions.length - 1) {
      updateActive((current) => ({ ...current, answers }))
      setClueIndex((current) => current + 1)
      return
    }
    const stops = buildTrail(active.itemId, active.itemLabel, answers, data.history)
    updateActive((current) => ({ ...current, answers, stops, currentIndex: 0, checkedSpots: {} }))
    setScreen('trail')
  }

  function resumeSearch() {
    if (!active) return
    if (active.stops.length) {
      setScreen('trail')
      return
    }
    const questions = ITEM_BY_ID[active.itemId].questions
    const nextUnanswered = questions.findIndex((question) => !active.answers[question.id])
    setClueIndex(nextUnanswered < 0 ? questions.length - 1 : nextUnanswered)
    setScreen('clues')
  }

  function toggleSpot(spot: string) {
    if (!active?.stops[active.currentIndex]) return
    const stopId = active.stops[active.currentIndex].id
    updateActive((current) => {
      const existing = current.checkedSpots[stopId] ?? []
      const next = existing.includes(spot) ? existing.filter((value) => value !== spot) : [...existing, spot]
      return { ...current, checkedSpots: { ...current.checkedSpots, [stopId]: next } }
    })
  }

  function nextStop() {
    if (!active) return
    if (active.currentIndex >= active.stops.length - 1) {
      setScreen('end')
      return
    }
    const nextIndex = active.currentIndex + 1
    updateActive((current) => ({ ...current, currentIndex: nextIndex }))
    if (data.settings.calmPause && nextIndex > 0 && nextIndex % 3 === 0) {
      setReturnScreen('trail')
      setScreen('calm')
    }
  }

  function openFound() {
    setFoundLocation('')
    setScreen('found')
  }

  function saveFound() {
    if (!active || !foundLocation.trim()) return
    const now = new Date()
    const durationSeconds = secondsBetween(active.startedAt, now)
    const entry: FoundEntry = {
      id: crypto.randomUUID?.() ?? `${Date.now()}`,
      itemId: active.itemId,
      itemLabel: active.itemLabel,
      foundLocation: foundLocation.trim(),
      foundAt: now.toISOString(),
      answers: active.answers,
      stopsChecked: active.currentIndex + 1,
      durationSeconds,
    }
    setFoundSummary({ itemLabel: active.itemLabel, location: entry.foundLocation, seconds: durationSeconds })
    setData((current) => ({ ...current, history: [entry, ...current.history].slice(0, 100), activeSearch: null }))
    setScreen('complete')
  }

  function discardActive() {
    if (!active || !window.confirm(`End the current ${active.itemLabel} search? Your found-item history will stay.`)) return
    setData((current) => ({ ...current, activeSearch: null }))
    setScreen('home')
  }

  function updateSettings(next: Partial<Settings>) {
    setData((current) => ({ ...current, settings: { ...current.settings, ...next } }))
  }

  function clearHistory() {
    if (!data.history.length || !window.confirm('Clear all found-item history from this device? This cannot be undone.')) return
    setData((current) => ({ ...current, history: [] }))
  }

  async function installApp() {
    if (!installPrompt) return
    await installPrompt.prompt()
    await installPrompt.userChoice
    setInstallPrompt(null)
  }

  const rootScreen = ['home', 'history', 'settings'].includes(screen)

  return (
    <div className="app-shell">
      <a className="skip-link" href="#app-content">Skip to content</a>
      {!online && <div className="offline-banner" role="status">Offline mode · your saved trail still works</div>}
      {storageError && <div className="storage-banner" role="alert">This browser blocked saving. Keep this tab open until your search is finished.<button onClick={() => setStorageError(false)} aria-label="Dismiss"><Icon name="close" size={17} /></button></div>}
      <main id="app-content" className={rootScreen ? 'app-content app-content--with-nav' : 'app-content'}>
        {screen === 'home' && <HomeView data={data} customOpen={customOpen} customName={customName} setCustomOpen={setCustomOpen} setCustomName={setCustomName} onStart={startSearch} onResume={resumeSearch} onDiscard={discardActive} />}
        {screen === 'clues' && active && activeItem && <ClueView search={active} question={activeItem.questions[clueIndex]} index={clueIndex} total={activeItem.questions.length} onAnswer={answerClue} onBack={() => clueIndex === 0 ? setScreen('home') : setClueIndex((value) => value - 1)} />}
        {screen === 'trail' && active && active.stops[active.currentIndex] && <TrailView search={active} settings={data.settings} onBack={() => setScreen('home')} onToggleSpot={toggleSpot} onNext={nextStop} onFound={openFound} onCalm={() => { setReturnScreen('trail'); setScreen('calm') }} onEditClues={() => { setClueIndex(0); setScreen('clues') }} />}
        {screen === 'found' && active && <FoundView search={active} value={foundLocation} onChange={setFoundLocation} onSave={saveFound} onBack={() => setScreen('trail')} />}
        {screen === 'complete' && foundSummary && <CompleteView summary={foundSummary} onHome={() => setScreen('home')} onAnother={() => setScreen('home')} />}
        {screen === 'history' && <HistoryView history={data.history} onStart={startSearch} onClear={clearHistory} />}
        {screen === 'calm' && <CalmReset hasSearch={Boolean(active?.stops.length)} onResume={() => setScreen(returnScreen === 'trail' && !active ? 'home' : returnScreen)} />}
        {screen === 'settings' && <SettingsView settings={data.settings} historyCount={data.history.length} canInstall={Boolean(installPrompt)} onUpdate={updateSettings} onInstall={installApp} onClear={clearHistory} />}
        {screen === 'end' && active && <EndView search={active} onFound={openFound} onReset={() => { setReturnScreen('end'); setScreen('calm') }} onRestart={() => { updateActive((current) => ({ ...current, currentIndex: 0, checkedSpots: {} })); setScreen('trail') }} onHome={() => setScreen('home')} />}
      </main>
      {rootScreen && <BottomNav active={screen} onNavigate={navigate} />}
    </div>
  )
}

interface HomeViewProps {
  data: PersistedData
  customOpen: boolean
  customName: string
  setCustomOpen: (value: boolean) => void
  setCustomName: (value: string) => void
  onStart: (itemId: ItemId, label?: string) => void
  onResume: () => void
  onDiscard: () => void
}

function HomeView({ data, customOpen, customName, setCustomOpen, setCustomName, onStart, onResume, onDiscard }: HomeViewProps) {
  const latest = data.history[0]
  return (
    <section className="view home-view" aria-labelledby="view-heading">
      <header className="brand-header">
        <div className="brand-lockup"><span className="brand-mark"><Icon name="trail" /></span><strong>FindTrail</strong></div>
        <span className="local-pill">Private on this device</span>
      </header>

      {data.activeSearch ? (
        <article className="resume-card">
          <div className="resume-card__icon"><Icon name={ITEM_BY_ID[data.activeSearch.itemId].icon} /></div>
          <div>
            <span>Trail in progress</span>
            <h1 id="view-heading" tabIndex={-1}>Keep looking for {data.activeSearch.itemLabel.toLocaleLowerCase()}?</h1>
            <p>{data.activeSearch.stops.length ? `Ready at stop ${data.activeSearch.currentIndex + 1}.` : 'Your clues are saved.'}</p>
          </div>
          <button className="button button--primary" onClick={onResume}>Resume trail</button>
          <button className="text-button text-button--muted" onClick={onDiscard}>End this search</button>
        </article>
      ) : (
        <div className="hero-copy">
          <span className="eyebrow">A calmer path to what’s missing</span>
          <h1 id="view-heading" tabIndex={-1}>Lost the thing?<br /><em>Keep your head.</em></h1>
          <p>FindTrail holds the search plan so you only have to check the next sensible place. No frantic house tornado required.</p>
        </div>
      )}

      {!data.activeSearch && <Scenery />}

      <div className="item-picker">
        <div className="section-heading">
          <div><span>Start here</span><h2>What went missing?</h2></div>
          <small>One tap</small>
        </div>
        <div className="item-grid">
          {ITEMS.map((item) => (
            <button key={item.id} className={item.id === 'other' && customOpen ? 'item-button is-active' : 'item-button'} onClick={() => item.id === 'other' ? setCustomOpen(!customOpen) : onStart(item.id)}>
              <span><Icon name={item.icon} size={23} /></span>
              <strong>{item.label}</strong>
              <small>{item.hint}</small>
            </button>
          ))}
        </div>
        {customOpen && (
          <form className="custom-item" onSubmit={(event) => { event.preventDefault(); if (customName.trim()) onStart('other', customName) }}>
            <label htmlFor="custom-name">What are we finding?</label>
            <div><input id="custom-name" value={customName} onChange={(event) => setCustomName(event.target.value)} placeholder="Example: work badge" autoFocus maxLength={40} /><button className="button button--primary" disabled={!customName.trim()}>Start</button></div>
          </form>
        )}
      </div>

      {latest && !data.activeSearch && <button className="recent-strip" onClick={() => onStart(latest.itemId, latest.itemLabel)}><Icon name="history" size={19} /><span>Last found</span><strong>{latest.itemLabel}</strong><small>{latest.foundLocation}</small></button>}
    </section>
  )
}

function ClueView({ search, question, index, total, onAnswer, onBack }: { search: ActiveSearch; question: ClueQuestion; index: number; total: number; onAnswer: (value: string) => void; onBack: () => void }) {
  return (
    <section className="view clue-view" aria-labelledby="view-heading">
      <header className="topbar">
        <button className="icon-button" onClick={onBack} aria-label="Go back"><Icon name="back" /></button>
        <div className="topbar__trail"><span>{search.itemLabel}</span><strong>Clue {index + 1} of {total}</strong></div>
        <span />
      </header>
      <div className="clue-progress" aria-hidden="true">{Array.from({ length: total }).map((_, value) => <span key={value} className={value <= index ? 'is-active' : ''} />)}</div>
      <div className="clue-copy">
        <span className="eyebrow">Closest answer wins</span>
        <h1 id="view-heading" tabIndex={-1}>{question.title}</h1>
        <p>{question.helper}</p>
      </div>
      <div className="choice-list">
        {question.options.map((option) => (
          <button key={option.value} className={search.answers[question.id] === option.value ? 'choice-button is-selected' : 'choice-button'} onClick={() => onAnswer(option.value)}>
            <span><strong>{option.label}</strong>{option.detail && <small>{option.detail}</small>}</span>
            <span className="choice-button__arrow">→</span>
          </button>
        ))}
      </div>
      <p className="reassurance"><Icon name="calm" size={17} /> No perfect remembering required. We are just choosing a useful first direction.</p>
    </section>
  )
}

function FoundView({ search, value, onChange, onSave, onBack }: { search: ActiveSearch; value: string; onChange: (value: string) => void; onSave: () => void; onBack: () => void }) {
  const stop = search.stops[search.currentIndex]
  const options = getFoundSuggestions(search.itemId, stop)
  return (
    <section className="view found-view" aria-labelledby="view-heading">
      <button className="icon-button found-view__back" onClick={onBack} aria-label="Back to search"><Icon name="back" /></button>
      <div className="success-mark"><Icon name="spark" size={35} /></div>
      <span className="eyebrow">Crisis demoted</span>
      <h1 id="view-heading" tabIndex={-1}>There it is.</h1>
      <p>Save the exact spot. FindTrail will treat it as a usual suspect next time.</p>
      <div className="location-chips" role="group" aria-label="Where the item was found">
        {options.map((option) => <button key={option} className={value === option ? 'chip is-selected' : 'chip'} onClick={() => onChange(option)}>{option}</button>)}
      </div>
      <label className="field"><span>Or type the exact place</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Example: black hoodie pocket" maxLength={80} /></label>
      <button className="button button--primary button--wide" onClick={onSave} disabled={!value.trim()}>Save found place</button>
    </section>
  )
}

function CompleteView({ summary, onHome, onAnother }: { summary: FoundSummary; onHome: () => void; onAnother: () => void }) {
  return (
    <section className="view complete-view" aria-labelledby="view-heading">
      <Scenery compact />
      <span className="eyebrow">Trail complete</span>
      <h1 id="view-heading" tabIndex={-1}>Found and remembered.</h1>
      <p><strong>{summary.itemLabel}</strong> was hiding at <strong>{summary.location}</strong>.</p>
      <div className="complete-stat"><span>Search time</span><strong>{formatDuration(summary.seconds)}</strong><small>Useful data, not a speed contest</small></div>
      <button className="button button--primary button--wide" onClick={onHome}>Back home</button>
      <button className="button button--quiet button--wide" onClick={onAnother}>Find something else</button>
    </section>
  )
}

function HistoryView({ history, onStart, onClear }: { history: FoundEntry[]; onStart: (itemId: ItemId, label?: string) => void; onClear: () => void }) {
  const pattern = useMemo(() => {
    if (!history.length) return null
    const latest = history[0]
    return { item: latest, likely: mostLikelyLocation(history, latest.itemId, latest.itemLabel) }
  }, [history])
  return (
    <section className="view history-view" aria-labelledby="view-heading">
      <header className="page-heading"><span className="eyebrow">Patterns, not judgment</span><h1 id="view-heading" tabIndex={-1}>Found history</h1><p>Your device remembers the useful part: where things actually turned up.</p></header>
      {pattern?.likely && <article className="pattern-card"><Icon name="spark" /><div><span>Current usual suspect</span><strong>{pattern.item.itemLabel}: {pattern.likely.location}</strong><small>Found there {pattern.likely.count} {pattern.likely.count === 1 ? 'time' : 'times'}</small></div></article>}
      {!history.length ? <div className="empty-state"><Icon name="history" size={34} /><h2>No found places yet</h2><p>Complete one search and the helpful patterns begin here.</p></div> : (
        <div className="history-list">
          {history.map((entry) => <button key={entry.id} className="history-row" onClick={() => onStart(entry.itemId, entry.itemLabel)}><span className="history-row__icon"><Icon name={ITEM_BY_ID[entry.itemId].icon} size={20} /></span><span><strong>{entry.itemLabel}</strong><small>{entry.foundLocation}</small></span><time dateTime={entry.foundAt}>{dateLabel(entry.foundAt)}</time></button>)}
        </div>
      )}
      {history.length > 0 && <button className="text-button danger-link" onClick={onClear}>Clear found history</button>}
    </section>
  )
}

function SettingsView({ settings, historyCount, canInstall, onUpdate, onInstall, onClear }: { settings: Settings; historyCount: number; canInstall: boolean; onUpdate: (next: Partial<Settings>) => void; onInstall: () => void; onClear: () => void }) {
  return (
    <section className="view settings-view" aria-labelledby="view-heading">
      <header className="page-heading"><span className="eyebrow">Make it yours</span><h1 id="view-heading" tabIndex={-1}>Settings</h1><p>Useful controls. No cockpit full of switches.</p></header>
      {canInstall && <button className="install-card" onClick={onInstall}><span><Icon name="download" /></span><div><strong>Install FindTrail</strong><small>Add it to your home screen for quicker access.</small></div><b>Install</b></button>}
      <div className="settings-group">
        <h2>During a search</h2>
        <SettingToggle label="Read new stops aloud" detail="Uses your device’s built-in voice." checked={settings.speakSteps} onChange={(value) => onUpdate({ speakSteps: value })} />
        <SettingToggle label="Offer a reset every 3 stops" detail="A pause, not a forced timeout." checked={settings.calmPause} onChange={(value) => onUpdate({ calmPause: value })} />
      </div>
      <div className="settings-group">
        <h2>Appearance</h2>
        <label className="select-setting"><span><strong>Motion</strong><small>System follows your phone setting.</small></span><select value={settings.motion} onChange={(event) => onUpdate({ motion: event.target.value as Settings['motion'] })}><option value="system">Use system setting</option><option value="full">Full motion</option><option value="reduced">Reduced motion</option></select></label>
        <SettingToggle label="Larger text" detail="Adds breathing room and a little more scrolling." checked={settings.textSize === 'large'} onChange={(value) => onUpdate({ textSize: value ? 'large' : 'standard' })} />
      </div>
      <div className="settings-group settings-group--privacy">
        <h2>Your data</h2>
        <p>Everything stays in this browser on this device. No account, analytics, ads, or mystery cloud bucket.</p>
        <div className="data-count"><span>Saved finds</span><strong>{historyCount}</strong></div>
        <button className="button button--danger-outline" onClick={onClear} disabled={!historyCount}>Clear found history</button>
      </div>
      <footer className="version-note">FindTrail 2.0 · A calmer path to what’s missing.</footer>
    </section>
  )
}

function SettingToggle({ label, detail, checked, onChange }: { label: string; detail: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="toggle-setting"><span><strong>{label}</strong><small>{detail}</small></span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><i aria-hidden="true" /></label>
}

function EndView({ search, onFound, onReset, onRestart, onHome }: { search: ActiveSearch; onFound: () => void; onReset: () => void; onRestart: () => void; onHome: () => void }) {
  return (
    <section className="view end-view" aria-labelledby="view-heading">
      <div className="end-view__mark"><Icon name="trail" size={36} /></div>
      <span className="eyebrow">First trail complete</span>
      <h1 id="view-heading" tabIndex={-1}>Don’t search harder yet.</h1>
      <p>You checked {search.stops.length} sensible stops. A reset or another set of eyes usually beats turning the house upside down.</p>
      <button className="button button--found button--wide" onClick={onFound}>Actually, I found it</button>
      <button className="button button--primary button--wide" onClick={onReset}>Take a 30-second reset</button>
      <button className="button button--secondary button--wide" onClick={onRestart}>Repeat the trail slowly</button>
      <button className="button button--quiet button--wide" onClick={onHome}>Save it for later</button>
    </section>
  )
}
