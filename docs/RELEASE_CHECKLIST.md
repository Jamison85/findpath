# Release checklist

## Automated

- [x] Typecheck passes
- [x] Unit and component tests pass
- [x] Production build passes
- [x] Dependency audit has no high or critical production vulnerability
- [x] CI passes on the production branch

## Functional

- [x] Common-item and custom-item searches complete
- [x] Clue answers visibly change trail order
- [x] Refresh restores the active search
- [x] Found location is saved and promoted on the next matching search
- [x] History can be cleared only after confirmation
- [x] Calm reset resumes the correct screen
- [x] Speech features fail gracefully when browser support is absent
- [x] Offline app shell opens after one successful online visit

## Visual and accessibility

- [x] 360 × 800 Android viewport
- [x] 412 × 915 Galaxy-class viewport
- [x] 430 × 932 iPhone-class viewport
- [x] 768 × 1024 tablet viewport
- [x] Keyboard-only navigation
- [x] Visible focus states and logical focus order
- [x] 200% text zoom without lost controls
- [x] Reduced-motion preference
- [x] Screen-reader labels and live announcements

## Device approval

- [ ] Install on Jamo's Galaxy S25 Ultra
- [ ] Complete one real lost-item search
- [ ] Confirm home screen, voice behavior, and app restart recovery
