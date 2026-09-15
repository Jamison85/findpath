# FindTrail 2.4.1 QA report

Run date: 2026-09-15

## Automated release checks

| Check | Result |
| --- | --- |
| TypeScript typecheck | Pass |
| Vitest unit and component tests | 35 passed across 6 files |
| Vite production build | Pass |
| Production dependency audit | 0 vulnerabilities |
| Home artwork optimization | Pass: 1536 × 1024 WebP, 132 KB |
| Offline shell inclusion | Pass: versioned artwork is pre-cached |
| Home motion regression | Pass: plays once per session and settles |
| Item handoff regression | Pass: selected tile settles before the first clue appears |
| Clue journey regression | Pass: answers settle before advancing and reduced motion skips the delay |
| Found-place carry-forward | Pass: the last checked exact spot is ready to save automatically |
| Recovery ending | Pass: the final stop leads to an item-specific next-moves panel |
| Ambient reset regression | Pass: three timed phases, progress semantics, skip, and trail return remain functional |
| Reset rendering | Pass: lightweight Canvas waves with a CSS/static reduced-motion fallback |
| Reset audio | Pass: opt-in only; Off is the default and no sound asset or network request is required |
| Focused-screen notices | Pass: update notices wait until Home, History, or Settings instead of shrinking a reset or active search |
| Hosted GitHub Actions | Pass: PR #11 and live-QA fix PR #12 |

## Browser and resilience checks

- The Home layout uses a fixed no-scroll composition at standard text sizes and deliberately restores scrolling for large-text accessibility mode.
- Custom-item entry opens in a focused modal sheet instead of increasing the Home page height.
- The latest-found card opens the exact expandable history entry; first use has a purposeful empty state.
- Clue, trail, found, settings, ambient reset, pinned-item home, saved-home trail, and item-specific ending retain responsive max-width and overflow safeguards.
- 200% text enlargement reflows without horizontal overflow or lost controls.
- Keyboard entry reaches the skip link first, then exposes visible focus on controls.
- Reduced-motion preference replaces the moving horizon with a still composition and suppresses the Home guide.
- The reset uses three honest 10-second cycles: 4 seconds in, 2 seconds open, and 4 seconds out.
- Wind and chime are generated locally only after a user selects them; sound defaults to Off and stops when the reset ends or closes.
- The live 2.4.1 reset completes without application console errors, switches all three sound modes, reacts to touch, and returns to the exact active trail stop.
- The Home search guide uses brief, non-looping motion and does not replay after returning Home in the same session.
- Item tiles use a tightened shadow and sage icon well while handing the selection into the first clue.
- Clue choices use a compact two-column route at standard text size and return to a single column for large-text mode.
- Active-stop headings receive focus as each new search area appears.
- A checked exact spot carries into the found-place field instead of asking the user to remember it again.
- Active search survives reload.
- Saving a found place adds history and promotes that location on the next matching search.
- Saved home spots outrank learned guesses while urgent safety guidance remains first.
- Successful search-area history promotes the useful stop on later matching trails.
- Custom items can be pinned and relaunched from Home.
- Backups round-trip and malformed nested backup data is rejected.
- App shell reloads successfully with the browser forced offline after one online visit.
- Social sharing artwork is exactly 1200 × 630; install screenshots are exactly 412 × 915.

## Still required before final production approval

- Confirm the 2.4 reset screen on the hosted build at 360 × 800, 412 × 915, 430 × 932, and 768 × 1024.
- Install on Jamo's Galaxy S25 Ultra and complete one real search.
- Confirm microphone permission and speech behavior on the actual device/browser.
