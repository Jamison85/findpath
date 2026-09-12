# FindTrail 2.0 product specification

## Job to be done

When an item goes missing and attention starts scattering, FindTrail should hold the search plan so the user only has to check the next sensible place.

## Primary flow

1. Choose the missing item, or name a custom item.
2. Answer at most three short clue questions.
3. Follow one ranked search stop at a time.
4. Mark the exact place where the item was found.
5. Use that history to improve later search order.

An interrupted search must survive a refresh or app restart.

## Release features

- Eight common item categories plus custom items
- Context-aware trail ranking using location, recent activity, item type, and found history
- One-stop-at-a-time search with optional sub-place checkmarks
- Active-search recovery
- Local found-item history and simple pattern summaries
- Thirty-second visual breathing reset
- Optional spoken instructions and browser-supported hands-free commands
- Reduced motion and larger text settings
- Offline PWA shell with install metadata
- Destructive-data confirmation and storage error recovery

## Explicit non-goals

- Accounts, cloud sync, social features, ads, or analytics
- Pretending deterministic ranking is artificial intelligence
- Whole-home organization, inventory, or chore management
- Medical diagnosis or emergency decision-making
- A mascot, game economy, points, streaks, or guilt loops

## Voice and tone

FindTrail is steady, capable, and lightly funny. It says “Nothing here. Good, we ruled it out,” not “You failed this step.” It redirects search-related side quests instead of rewarding them.

## Visual direction

An adult field guide, softened for a stressful moment: deep evergreen, warm paper, moss, clay, and plum. Rounded geometry is paired with editorial type scale, trail-line illustrations, generous touch targets, and restrained animation. It must not look clinical, childish, or like a generic AI dashboard.
