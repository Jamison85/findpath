# FindTrail 2.2 QA report

Run date: 2026-09-13

## Automated release checks

| Check | Result |
| --- | --- |
| TypeScript typecheck | Pass |
| Vitest unit and component tests | 29 passed across 5 files |
| Vite production build | Pass |
| Production dependency audit | 0 vulnerabilities |
| Home artwork optimization | Pass: 1536 × 1024 WebP, 132 KB |
| Offline shell inclusion | Pass: versioned artwork is pre-cached |
| Hosted GitHub Actions | Required before merge |

## Browser and resilience checks

- The Home layout uses a fixed no-scroll composition at standard text sizes and deliberately restores scrolling for large-text accessibility mode.
- Custom-item entry opens in a focused modal sheet instead of increasing the Home page height.
- The latest-found card opens the exact expandable history entry; first use has a purposeful empty state.
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

- Confirm the Home 2.2 layout on the hosted build at 360 × 800, 412 × 915, 430 × 932, and 768 × 1024.
- Install on Jamo's Galaxy S25 Ultra and complete one real search.
- Confirm microphone permission and speech behavior on the actual device/browser.
