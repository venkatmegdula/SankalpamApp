# SANKALPAM Pujari App — Guided Walkthrough

A click-by-click tour of the whole product. Roughly 15 minutes end to end.
Start at **http://localhost:8081**.

**Two things to know before you begin**

- **Demo controls** sits at the bottom of Home, Profile, and the verification hub. It jumps
  to any point in the journey, toggles dark theme, and simulates going offline. Onboarding
  spans one to three weeks in reality, so those states can't be reached by normal use.
- **Mock inputs:** OTP is any 6 digits (`000000` shows the error state). Devotee check-in
  code is `1234`.

---

## Stage 1 · Entry — 2 minutes

> Demo controls → **Fresh applicant**

| Step | What to notice |
|---|---|
| **Language gate** | Comes *before* everything else, not buried in settings. Each option is written in its own script and nothing is pre-selected — an explicit choice, not an opt-out. |
| **Welcome** | Three promises: bookings in your zone, fixed transparent rates, weekly payouts. Plus an honest "before you begin" list of what documents to have ready. |
| **Mobile number** | `9848012345`. Note the line about calls being masked in both directions. |
| **OTP** | Enter `000000` first to see the error. Then any 6 digits. Wait out the 30-second timer for **"Call me with the code instead"** — SMS delivery in India is unreliable enough that a voice fallback is a requirement, not a nicety. |

---

## Stage 2 · The application — 4 minutes

The 13-step wizard. **Progress saves on every keystroke** — reload the page mid-way and
nothing is lost.

Watch for **"Need help? Request a callback"** on every single step. The assisted path is a
first-class flow, because a 58-year-old pujari with high ritual authority and low
technology comfort is a core user, not an edge case.

| Step | Try this |
|---|---|
| **Intro** | Four stages with honest timings — "30 minutes now, then 1–3 weeks of checks." Naming the wait up front is deliberate. |
| **3 · Experience** | Set it to **1 year** → eligibility block appears with an explanation and the callback offer, rather than a dead end. |
| **7 · Languages** | Deselect Telugu and Hindi → *"Telugu or Hindi is required to serve Hyderabad."* |
| **8 · Poojas** | Minimum 5, grouped and searchable. Prices are shown but **read-only** — a capability declaration, not a price list. |
| **10 · Coverage** | Pick *Remote Archana* on step 9 first, and the travel-radius control disappears here. |
| **11 · Documents** | Open one to see the capture flow — it fails the quality check once and tells you *why*. Then use **"Demo: fill in all six"** to move on. |
| **12 · Bank** | Type IFSC `HDFC0000545` → bank and branch auto-fill. Enter a holder name **different** from step 1 → mismatch warning that lets you continue but flags it for review. |
| **13 · Review** | Every line is tappable and jumps back to that step. |

---

## Stage 3 · The waiting — 3 minutes

**This is where priest-onboarding products lose people**, and it isn't a visual problem —
it's days of silence. So the verification hub *is* the home screen for one to three weeks.

Every stage shows a **real date**, never a bare "Pending". Every transition fires push and
SMS. And there's genuinely useful "While you wait" content that also pre-teaches the
booking flow, so Stage 4 is easier.

> Demo controls → each of these in turn

| Jump to | What it shows |
|---|---|
| **Stage 1 · Document rejected** | A *specific* reason — "the address doesn't match what you entered" — and re-upload of **only** that document. Never redo the whole application. |
| **Stage 2 · Ready to schedule** | Slot picker, plus a card explaining exactly what will be discussed. Removing the fear of an "exam" is the design job here. |
| **Stage 3 · Trial scheduled** | The supervised pooja appears as a normal booking, because correct use of the app is itself part of what's assessed. |
| **Stage 4 · Agreement** | Accept is gated on scrolling to the end. An "at a glance" card states the commercial terms in one sentence before the legal text. Then a **profile preview** — "this is exactly how devotees will see you" — before going live. |

---

## Stage 4 · The daily loop — 5 minutes

> Demo controls → **Active pujari**

This is the flow a pujari runs several times a week for years. Everything else is
scaffolding around it.

**Home** — availability toggle as a first-class action, today's ceremony with *"Leave by
5:15 pm"* computed from travel time, requests sorted by expiry with live countdowns,
week-to-date earnings.

### The three requests each demonstrate something different

| Request | What it exercises |
|---|---|
| **Ganapati Pooja** → Accept | **Conflict detection.** "Griha Pravesh runs from 6:00 am to 9:00 am the same day in Manikonda." It *warns* — a pujari may know a route the estimate doesn't, and blocking a professional from their own judgement is the wrong default. |
| **Satyanarayana Vratam** | Booked by Ananya **for her parents**, with the person who'll actually be present named — and the **missing nakshatra flagged, not hidden**. Try *Ask a question first*: the response countdown **pauses** while you wait for a reply. Try *Decline*: a closed, respectful reason set and no penalty. |
| **Rudrabhishekam** | Remote Archana and urgent — no address, no travel, ~8-minute countdown in the urgent hue. |

### Then the ceremony itself

> Today's ceremony → **Preparation checklist**

Split into *You bring* and *Devotee provides*. The single most common on-the-day failure in
this business is a disagreement about who was bringing what.

> Back → **I'm on my way** → *Tell the devotee I'm delayed* → **I have arrived**

Enter **any code except `1234`** → it fails → tap **"Having trouble?"** for the five
fallbacks: resend · someone else is here · their phone is unreachable · nobody is at the
address · (and offline check-in if you toggle offline). **The ceremony is never blocked by
the app.**

> Verify with `1234` → **ceremony mode**

One screen, one action, notifications suppressed, and nothing counting up — ritual is not a
stopwatch task. This screen is where cultural respect is either demonstrated or violated.

> **Ceremony complete** → confirm

The photo is **consent-gated**, because the code of conduct forbids photographing a
devotee's household without permission. Full earnings breakdown before you leave.

---

## Stage 5 · Money and reputation — 3 minutes

| Where | What to notice |
|---|---|
| **Earnings tab** | A payout **held pending PAN**, with a direct fix. Every figure shows gross → 15% → net. A pujari who can't reconcile their own earnings won't trust the platform, and that mistrust is unrecoverable. |
| **Any payout row** | "How this was calculated" plus every ceremony included. |
| **Profile → See how devotees see you** | Exactly the public profile, with a note that phone, documents and earnings are never shown. |
| **Profile → Ratings & reviews** | The 2-star review has **Respond** and **Dispute** — a real path when a rating is unfair. |
| **Profile → Bank account → Change** | Re-authentication first. Changing where money goes is treated as high-risk, and held payouts are stated upfront. |
| **Any booking → Cancel** | **Consequences before you confirm** — hours of notice, rating effect, penalty in rupees, and what repeat cancellations mean. Vague penalties are the fastest route to churn. |
| **Any booking → Report a safety concern** | One tap, never framed as an accusation. Off-platform payment requests are named explicitly. |

---

## Stage 6 · Cross-cutting behaviour — 2 minutes

> Demo controls → **Simulate offline**

- **Requests tab** — accepting is *blocked*, and says why: acceptance is a race against
  other pujaris, so the app won't claim success when it can't know.
- **Chat** — messages queue visibly rather than silently failing.
- **Document capture** — take the photo anyway; it uploads when you reconnect.

> Demo controls → **Dark theme**

Not a nicety. Many house ceremonies fall between 4:00 and 7:00 am.

Also worth a look: **Availability** (early-muhurtham toggle, max-per-day that warns but
never blocks), **Rate card** with an earnings estimator, and **Help** — the FAQ answers
"Can I set my own price?" and "A devotee asked me to take cash directly."

---

## What this is meant to prove

Not that the flow works. That it holds up in the conditions it's actually used in — in
transit, at 4:30 am, inside a stranger's home mid-ritual, on a mid-range Android with
patchy data, by someone whose income depends on responding fast.
