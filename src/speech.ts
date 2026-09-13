type Command = 'next' | 'found' | 'repeat' | 'unknown'
type RecognitionStatus = { listening?: boolean; heard?: string; error?: string }

interface RecognitionEventLike extends Event {
  results: ArrayLike<{ 0: { transcript: string } }>
}

interface RecognitionErrorLike extends Event {
  error: string
}

interface RecognitionLike extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onresult: ((event: RecognitionEventLike) => void) | null
  onerror: ((event: RecognitionErrorLike) => void) | null
  onend: (() => void) | null
}

type RecognitionConstructor = new () => RecognitionLike

declare global {
  interface Window {
    SpeechRecognition?: RecognitionConstructor
    webkitSpeechRecognition?: RecognitionConstructor
  }
}

export function speak(text: string): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.92
  utterance.pitch = 1
  window.speechSynthesis.speak(utterance)
  return true
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel()
}

export function parseCommand(transcript: string): Command {
  const value = transcript.toLocaleLowerCase().trim()
  if (/\b(found|got it|there it is|found it)\b/.test(value)) return 'found'
  if (/\b(next|nothing here|keep going|not here)\b/.test(value)) return 'next'
  if (/\b(repeat|say (?:that )?again|read it)\b/.test(value)) return 'repeat'
  return 'unknown'
}

export function createRecognition(onCommand: (command: Exclude<Command, 'unknown'>) => void, onStatus: (status: RecognitionStatus) => void): RecognitionLike | null {
  if (typeof window === 'undefined') return null
  const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition
  if (!Recognition) return null
  const instance = new Recognition()
  instance.continuous = false
  instance.interimResults = false
  instance.lang = 'en-US'
  instance.onresult = (event) => {
    const transcript = event.results[0]?.[0]?.transcript?.trim() ?? ''
    onStatus({ heard: transcript })
    const command = parseCommand(transcript)
    if (command === 'unknown') {
      onStatus({ error: 'Try “next,” “found it,” or “repeat.”' })
      return
    }
    onCommand(command)
  }
  instance.onerror = (event) => {
    const message = event.error === 'not-allowed' ? 'Microphone permission was not granted.' : 'Voice command stopped. Tap to try again.'
    onStatus({ listening: false, error: message })
  }
  instance.onend = () => onStatus({ listening: false })
  return instance
}
