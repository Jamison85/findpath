# FindTrail

FindTrail is a calm, local-first progressive web app for finding misplaced items. It turns a frantic whole-house search into one useful place at a time, remembers where items were found, and gently promotes likely locations during future searches.

Version 2.2 introduces a purpose-built Home experience: original memory-trail artwork, a denser no-scroll phone layout, tactile item shortcuts, a focused custom-item sheet, and a useful recent-find card that opens the exact history entry. Version 2.2.1 refines the artwork motion into one calm, session-only search demonstration that briefly checks the remote and kitchen before finding the keys. Version 2.2.2 completes the tactile Home handoff with sage press feedback and a brief selected-item transition into the first clue. It retains the saved home spots, learned search patterns, local backup and restore, and update-ready notices added in 2.1.

## Product principles

- One decision or search area at a time
- Useful without an account, connection, or setup ritual
- Support attention without talking down to the user
- Remember patterns locally and explain why a stop is suggested
- Humor can lower tension; it must never shame the user
- Accessibility and reduced-motion support are release requirements

## Local development

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run check
```

See [docs/QA_REPORT.md](docs/QA_REPORT.md) for the current release evidence and [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md) for the remaining physical-device approval.

## Deployment

Merges to `main` are verified and published to GitHub Pages by the included workflows. A Cloudflare Workers static-assets configuration is also included for an alternate production host:

```bash
npm run deploy
```

## Privacy

Search progress, preferences, saved home spots, custom-item shortcuts, and found-item history remain in browser storage on the current device. FindTrail has no account system, analytics, advertising, or remote database. A portable JSON backup is created only when the user explicitly exports one.
