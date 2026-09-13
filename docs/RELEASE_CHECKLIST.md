# Release checklist

## Automated

- [x] Typecheck passes
- [x] Unit and component tests pass
- [x] Production build passes
- [x] Dependency audit has no high or critical production vulnerability
- [x] CI passes on the production branch

## Functional

- [x] Home custom-item sheet opens and submits without changing page height
- [x] Home recent-find card opens the matching history detail
- [x] First-use Home state remains useful without saved history
- [x] Common-item and custom-item searches complete
- [x] Clue answers visibly change trail order
- [x] Refresh restores the active search
- [x] Found location is saved and promoted on the next matching search
- [x] Saved home outranks learned guesses but not safety guidance
- [x] Successful search areas improve later trail order
- [x] Custom item can be pinned and launched from Home
- [x] Item-specific next actions appear after the first trail
- [x] Backup round-trips and malformed backups are rejected
- [x] Installed-app update notice preserves user control
- [x] History can be cleared only after confirmation
- [x] Calm reset resumes the correct screen
- [x] Speech features fail gracefully when browser support is absent
- [x] Offline app shell opens after one successful online visit

## Visual and accessibility

- [ ] Home 2.2 at 360 × 800 Android viewport
- [ ] Home 2.2 at 412 × 915 Galaxy-class viewport
- [ ] Home 2.2 at 430 × 932 iPhone-class viewport
- [ ] Home 2.2 at 768 × 1024 tablet viewport
- [x] Keyboard-only navigation
- [x] Visible focus states and logical focus order
- [x] 200% text zoom without lost controls
- [x] Reduced-motion preference
- [x] Screen-reader labels and live announcements
- [x] 1200 × 630 social preview and 412 × 915 install screenshots

## Device approval

- [ ] Install on Jamo's Galaxy S25 Ultra
- [ ] Complete one real lost-item search
- [ ] Confirm home screen, voice behavior, and app restart recovery
