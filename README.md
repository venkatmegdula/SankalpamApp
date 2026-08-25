# SANKALPAM — Pujari App

Production-quality frontend for the priest-facing side of the Sankalpam marketplace.
Runs entirely on mock data; no backend required.

```bash
npm install
npm run web      # http://localhost:8081
npm run android  # or: npm run ios
```

---

## What this is

A **work tool**, not a marketplace browser. A pujari uses it because their income depends
on it, in the conditions it's actually used in — in transit, at 4:30am, inside a stranger's
home mid-ritual, on a mid-range Android with patchy data. Those constraints drive the whole
design. See [`../pujari-app-plan/00_MASTER_BRIEF.md`](../pujari-app-plan/00_MASTER_BRIEF.md).

## Stack

| | |
|---|---|
| Runtime | Expo SDK 57 · React Native 0.86 · React 19 |
| Routing | expo-router (file-based, `src/app`) |
| Language | TypeScript, `strict` |
| Type | Inter (Latin) · Anek Telugu · Anek Devanagari |
| Icons | Ionicons via `@expo/vector-icons` |
| Data | In-memory mock repository behind an async interface |

Chosen over Flutter and native primarily for OTA updates — a field workforce will not
reliably update from a store — plus existing team capability. The honest risk is Indic
script rendering at UI sizes, which is why Telugu and Devanagari are in the type system
from the start rather than added later.

## Architecture

```
src/
  app/                    expo-router routes — one file per screen
    (tabs)/               Home · Requests · Calendar · Earnings · Profile
    apply/                13-step application wizard + document capture
    verification/         the 4-stage onboarding funnel
    request/[id]          request detail, accept/decline/ask
    booking/[id]/         detail · checklist · checkin · ceremony · complete · chat · cancel · reschedule
  ui/                     design system — tokens, primitives, forms, layout
  components/             composed, app-specific components
  data/
    types.ts              domain contract
    fixtures/             seed data (catalog, zones, bookings, payouts…)
    repository.ts         async data layer — the backend seam
  store/session.tsx       identity, application draft, locale, offline, toasts
  lib/                    formatting and data-fetching hooks
```

### Swapping in a real backend

Everything above the data layer talks only to `src/data/repository.ts`, which exposes async
functions returning plain domain objects. Replacing its body with an HTTP client requires
**no change to any screen**. Nothing in `src/app` imports from `src/data/fixtures`
directly — except the static pooja catalog and zone lists, which are reference data.

`useAsync` gives every screen real loading, error, and offline states, and refetches on
focus. It is shaped to drop into a query client later without touching call sites.

## Design system

Direction: **"Pine & Brass"** — deliberately differentiated from the Devotee app's
maroon/saffron palette, and not derived from the reference website. Deep pine carries the
brand and every primary action; brass is reserved for earnings and credentials; urgency has
its own hue so an expiry countdown can never be mistaken for an ordinary accent.

Tokens live in `src/ui/tokens.ts` — colours (light + dark), type scale, spacing, radii,
shadows, motion. **The pending Sankalpam brand identity is a token swap, not a redesign.**

- 48dp minimum touch targets, enforced through the primitives
- Status is never colour-only — every pill carries an icon or text label
- Font scaling to 200% without layout collapse
- Dark theme treated as a requirement, not a nicety, given 4:30am muhurthams

## Reviewing it

The app opens on the **Home screen of an active pujari**. A **Demo controls** panel sits at
the bottom of Home, Profile, and the verification hub — it jumps to any point in the
journey, since onboarding spans one to three weeks in reality and those states can't be
reached by using the app normally.

| Scenario | Where |
|---|---|
| Full onboarding journey | Demo controls → *Fresh applicant* |
| Document rejected + re-upload | Demo controls → *Stage 1 · Document rejected* |
| Verification waiting states | Demo controls → any Stage 2–4 entry |
| **Conflict detection** | Home → *Ganapati Pooja* request → Accept |
| Missing devotee data | Home → *Satyanarayana Vratam* request |
| Urgent / Remote Archana | Home → *Rudrabhishekam* request |
| **Check-in failure paths** | Today's ceremony → I'm on my way → arrived → enter any code but `1234` |
| Ceremony mode | complete a check-in |
| Cancellation consequences | any upcoming booking → Cancel this booking |
| Payout held on PAN | Earnings tab |
| Offline behaviour | Demo controls → *Simulate offline* |
| Dark theme | Demo controls → *Dark theme* |

Mock inputs: OTP is any 6 digits (`000000` shows the error state). Check-in code is `1234`.

## Known gaps

- **Annexure A is missing.** The client's Onboarding Guide references a 16-pooja catalog
  that wasn't supplied. Items 9–16 in `fixtures/catalog.ts` are marked `provisional` and
  are trivially replaceable.
- Camera, maps, masked calling, and push are stubbed with toasts — they need a device.
- Session persistence stores which scenario is active, not individual records, so seed
  dates stay correct relative to "now". Accepting or completing a booking does not survive
  a page reload.
- Copy is English-only. Telugu and Hindi are wired through the type system and language
  gate, but translation is a content task, not a code one.

## Quality gates

```bash
npm run typecheck   # tsc --noEmit — clean
npm run lint        # eslint — clean
```
