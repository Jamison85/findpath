# FindTrail 2.1 QA report

Run date: 2026-09-13

## Automated release checks

| Check | Result |
| --- | --- |
| TypeScript typecheck | Pass |
| Vitest unit and component tests | 27 passed across 5 files |
| Vite production build | Pass |
| Production dependency audit | 0 vulnerabilities |
| Browser console and uncaught errors | 0 |
| Axe accessibility scan | 0 violations across 13 screen and viewport states |
| Hosted GitHub Actions | Pending release branch |

## Browser and resilience checks

- Home layout inspected at 360 × 800, 412 × 915, 430 × 932, and 768 × 1024.
- Clue, trail, found, settings, breathing reset, pinned-item home, saved-home trail, and item-specific ending inspected at 412 × 915.
- 200% text enlargement reflows without horizontal overflow or lost controls.
- Keyboard entry reaches the skip link first, then exposes visible focus on controls.
- Reduced-motion preference suppresses the breathing animation.
- Active search survives reload.
- Saving a found place adds history and promotes that location on the next matching search.
- Saved home spots outrank learned guesses while urgent safety guidance remains first.
- Successful search-area history promotes the useful stop on later matching trails.
- Custom items can be pinned and relaunched from Home.
- Backups round-trip and malformed nested backup data is rejected.
- App shell reloads successfully with the browser forced offline after one online visit.
- Social sharing artwork is exactly 1200 × 630; install screenshots are exactly 412 × 915.

## Still required before final production approval

- Install on Jamo's Galaxy S25 Ultra and complete one real search.
- Confirm microphone permission and speech behavior on the actual device/browser.
