import { Component, type ErrorInfo, type ReactNode } from 'react'

interface State { hasError: boolean }

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('FindTrail could not render', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <main className="fatal-error">
        <span>FindTrail</span>
        <h1>The trail hit a snag.</h1>
        <p>Your saved history should still be safe on this device. Reload the app to try again.</p>
        <button onClick={() => window.location.reload()}>Reload FindTrail</button>
      </main>
    )
  }
}
