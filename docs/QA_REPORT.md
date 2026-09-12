# FindTrail 2.0 QA report

Run date: 2026-09-12

## Automated release checks

| Check | Result |
| --- | --- |
| TypeScript typecheck | Pass |
| Vitest unit and component tests | 19 passed across 4 files |
| Vite production build | Pass |
| Production dependency audit | 0 vulnerabilities |
| Browser console and uncaught errors | 0 |
| Axe accessibility scan | 0 violations across 10 screen and viewport states |
| Hosted GitHub Actions | Pass |

## Browser and resilience checks

- Home layout inspected at 360 × 800, 412 × 915, 430 × 932, and 768 × 1024.
- Clue, trail, found, settings, and breathing-reset screens inspected at 412 × 915.
- 200% text enlargement reflows without horizontal overflow or lost controls.
- Keyboard entry reaches the skip link first, then exposes visible focus on controls.
- Reduced-motion preference suppresses the breathing animation.
- Active search survives reload.
- Saving a found place adds history and promotes that location on the next matching search.
- App shell reloads successfully with the browser forced offline after one online visit.

## Still required before final production approval

- Install on Jamo's Galaxy S25 Ultra and complete one real search.
- Confirm microphone permission and speech behavior on the actual device/browser.
