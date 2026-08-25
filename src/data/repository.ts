import {
  activePujari,
  newApplicant,
  seedBookings,
  seedMessages,
  seedNotifications,
  seedPayouts,
  seedReviews,
  seedTickets,
} from './fixtures/seed';
import { COMMISSION_RATE, poojaById } from './fixtures/catalog';
import type {
  AppNotification,
  Availability,
  Booking,
  BookingStatus,
  ChatMessage,
  ConflictWarning,
  DocumentKind,
  EarningsSummary,
  Payout,
  PujariProfile,
  Review,
  SupportTicket,
  VerificationStage,
} from './types';

/**
 * Mock repository.
 *
 * Every function is async and returns plain domain objects, so replacing this
 * file with an HTTP client requires no change above it. Nothing in the UI
 * reaches into the fixtures directly.
 */

type Db = {
  profile: PujariProfile;
  bookings: Booking[];
  payouts: Payout[];
  notifications: AppNotification[];
  reviews: Review[];
  messages: ChatMessage[];
  tickets: SupportTicket[];
};

/**
 * Session persistence.
 *
 * Seed data is built from dates relative to "now", so persisting whole records
 * would freeze the demo in time. Instead we persist only which scenario is
 * active and reseed on boot — a reload or a deep link then lands on coherent,
 * correctly-dated data rather than an empty app.
 */
const STORE_KEY = 'sankalpam.pujari.session';

type Persisted = { mode: 'new' | 'active'; stage?: VerificationStage; phone?: string };

function readPersisted(): Persisted | null {
  try {
    const raw = globalThis.localStorage?.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as Persisted) : null;
  } catch {
    return null;
  }
}

function writePersisted(p: Persisted) {
  try {
    globalThis.localStorage?.setItem(STORE_KEY, JSON.stringify(p));
  } catch {
    /* storage unavailable — the app still works, it just won't survive a reload */
  }
}

function bootDb(): Db {
  const p = readPersisted();
  if (!p) return freshDb('new');
  const base = freshDb(p.mode);
  if (p.phone) base.profile.phone = p.phone;
  if (p.stage && p.stage !== base.profile.stage) {
    base.profile =
      p.mode === 'active'
        ? { ...base.profile, stage: p.stage }
        : { ...activePujari(), stage: p.stage, bank: undefined };
    if (p.stage === 'docs_rejected') {
      base.profile.documents = base.profile.documents.map((d) =>
        d.kind === 'address_proof'
          ? {
              ...d,
              status: 'rejected',
              rejectionReason:
                "The address on this document doesn't match the address you entered in your application.",
            }
          : d,
      );
    }
  }
  return base;
}

function sync() {
  writePersisted({
    mode: db.bookings.length > 0 || db.profile.stage === 'active' ? 'active' : 'new',
    stage: db.profile.stage,
    phone: db.profile.phone,
  });
}

let db: Db = bootDb();

function freshDb(mode: 'new' | 'active'): Db {
  return {
    profile: mode === 'new' ? newApplicant('') : activePujari(),
    bookings: mode === 'new' ? [] : seedBookings(),
    payouts: mode === 'new' ? [] : seedPayouts(),
    notifications: mode === 'new' ? [] : seedNotifications(),
    reviews: mode === 'new' ? [] : seedReviews(),
    messages: mode === 'new' ? [] : seedMessages(),
    tickets: mode === 'new' ? [] : seedTickets(),
  };
}

/** Simulated latency so loading states are real, not theoretical. */
let simulateOffline = false;
const wait = (ms = 240) => new Promise<void>((r) => setTimeout(r, ms));

async function net<T>(value: T, ms?: number): Promise<T> {
  await wait(ms);
  if (simulateOffline) throw new OfflineError();
  return value;
}

export class OfflineError extends Error {
  constructor() {
    super('You are offline');
    this.name = 'OfflineError';
  }
}

export const connectivity = {
  isOffline: () => simulateOffline,
  set: (v: boolean) => {
    simulateOffline = v;
  },
};

/* ----------------------------------------------------------------- session */

export async function resetTo(mode: 'new' | 'active', phone = '9848012345') {
  db = freshDb(mode);
  if (mode === 'new') db.profile.phone = phone;
  sync();
  await wait(80);
  return db.profile;
}

/** Jump the demo directly to a verification stage with coherent surrounding data. */
export async function jumpToStage(stage: VerificationStage) {
  if (stage === 'active') {
    db = freshDb('active');
    sync();
    return db.profile;
  }
  if (db.profile.stage === 'active' || db.profile.stage === 'not_started') {
    db = freshDb('new');
    db.profile = { ...activePujari(), stage, bank: undefined };
    db.profile.documents = db.profile.documents.map((d) => ({ ...d, status: 'uploaded' }));
  }
  db.profile.stage = stage;

  if (stage === 'docs_rejected') {
    db.profile.documents = db.profile.documents.map((d) =>
      d.kind === 'address_proof'
        ? {
            ...d,
            status: 'rejected',
            rejectionReason:
              "The address on this document doesn't match the address you entered in your application.",
          }
        : d,
    );
  }
  sync();
  await wait(120);
  return db.profile;
}

/* ----------------------------------------------------------------- profile */

export const getProfile = () => net(clone(db.profile));

export async function updateProfile(patch: Partial<PujariProfile>) {
  db.profile = { ...db.profile, ...patch };
  return net(clone(db.profile), 180);
}

export async function setDocumentStatus(
  kind: DocumentKind,
  status: PujariProfile['documents'][number]['status'],
) {
  db.profile.documents = db.profile.documents.map((d) =>
    d.kind === kind
      ? { ...d, status, rejectionReason: undefined, capturedAt: new Date().toISOString() }
      : d,
  );
  return net(clone(db.profile), 420);
}

/**
 * Prototype shortcut. Capturing six documents one at a time is the right flow
 * for a real pujari but pure friction for someone reviewing the journey on a
 * desktop with no camera — this fills them in so the wizard can be walked end
 * to end. It has no production equivalent.
 */
export async function markAllDocumentsUploaded() {
  db.profile.documents = db.profile.documents.map((d) => ({
    ...d,
    status: 'uploaded',
    rejectionReason: undefined,
    capturedAt: new Date().toISOString(),
  }));
  return net(clone(db.profile), 500);
}

export async function submitApplication() {
  db.profile.stage = 'under_review';
  sync();
  return net(clone(db.profile), 700);
}

export async function advanceStage(stage: VerificationStage) {
  db.profile.stage = stage;
  if (stage === 'active' && !db.profile.memberSince) {
    db.profile.memberSince = new Date().toISOString();
    // A newly live pujari sees the real request queue immediately.
    if (db.bookings.length === 0) db.bookings = seedBookings();
    if (db.notifications.length === 0) db.notifications = seedNotifications();
    if (db.payouts.length === 0) db.payouts = seedPayouts();
    if (db.reviews.length === 0) db.reviews = seedReviews();
    if (db.tickets.length === 0) db.tickets = seedTickets();
  }
  sync();
  return net(clone(db.profile), 300);
}

export async function setAvailability(availability: Availability) {
  db.profile.availability = availability;
  return net(clone(db.profile), 200);
}

export async function setPaused(isPaused: boolean, until?: string) {
  db.profile.isPaused = isPaused;
  db.profile.pauseUntil = until;
  return net(clone(db.profile), 200);
}

/* ---------------------------------------------------------------- bookings */

export const getBookings = () => net(clone(db.bookings));

export const getBooking = (id: string) => net(clone(db.bookings.find((b) => b.id === id)) ?? null);

const REQUEST_STATES: BookingStatus[] = ['requested'];
const ACTIVE_STATES: BookingStatus[] = [
  'accepted',
  'confirmed',
  'en_route',
  'arrived',
  'checked_in',
  'in_progress',
  'reschedule_requested',
];

export async function getRequests() {
  const list = db.bookings
    .filter((b) => REQUEST_STATES.includes(b.status))
    .sort((a, b) => new Date(a.expiresAt ?? 0).getTime() - new Date(b.expiresAt ?? 0).getTime());
  return net(clone(list));
}

export async function getUpcoming() {
  const list = db.bookings
    .filter((b) => ACTIVE_STATES.includes(b.status))
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  return net(clone(list));
}

/**
 * Conflict detection runs BEFORE acceptance is confirmed.
 * Overlaps block; infeasible travel warns — a pujari may know a route the
 * estimate doesn't, and blocking a professional from their own judgement is
 * the wrong default.
 */
export async function detectConflicts(bookingId: string): Promise<ConflictWarning[]> {
  const b = db.bookings.find((x) => x.id === bookingId);
  if (!b) return net([]);
  const out: ConflictWarning[] = [];
  const start = new Date(b.scheduledAt).getTime();
  const end = start + b.durationMinutes * 60_000;

  for (const other of db.bookings) {
    if (other.id === b.id || !ACTIVE_STATES.includes(other.status)) continue;
    const oStart = new Date(other.scheduledAt).getTime();
    const oEnd = oStart + other.durationMinutes * 60_000;
    const pooja = poojaById(other.poojaId);

    if (start < oEnd && oStart < end) {
      out.push({
        severity: 'block',
        kind: 'overlap',
        title: 'This overlaps a confirmed booking',
        detail: `${pooja?.name ?? 'A ceremony'} runs from ${fmtTime(oStart)} to ${fmtTime(oEnd)} the same day in ${other.locality}.`,
        relatedBookingId: other.id,
      });
      continue;
    }

    // Travel feasibility against the adjacent booking.
    const gapBefore = (start - oEnd) / 60_000;
    if (gapBefore > 0 && gapBefore < b.travelMinutes + 15) {
      out.push({
        severity: 'warn',
        kind: 'travel',
        title: 'You may not reach in time',
        detail: `${pooja?.name ?? 'A ceremony'} in ${other.locality} ends at ${fmtTime(oEnd)}. This one starts at ${fmtTime(start)} and is about ${b.travelMinutes} minutes away.`,
        relatedBookingId: other.id,
      });
    }
  }

  const sameDay = db.bookings.filter(
    (x) =>
      ACTIVE_STATES.includes(x.status) &&
      new Date(x.scheduledAt).toDateString() === new Date(b.scheduledAt).toDateString(),
  );
  if (sameDay.length >= db.profile.availability.maxPerDay) {
    out.push({
      severity: 'warn',
      kind: 'max_per_day',
      title: 'Above your daily limit',
      detail: `You've set a maximum of ${db.profile.availability.maxPerDay} ceremonies per day and already have ${sameDay.length} that day.`,
    });
  }

  return net(out, 320);
}

export async function acceptBooking(id: string) {
  patchBooking(id, (b) => ({
    ...b,
    status: 'confirmed',
    fullAddress:
      b.fullAddress ??
      `Flat 12B, Silver Oak Residency, ${b.locality}, Hyderabad ${500000 + Math.floor(Math.random() * 99)}`,
  }));
  return net(clone(db.bookings.find((b) => b.id === id))!, 500);
}

export async function declineBooking(id: string, reason: string) {
  patchBooking(id, (b) => ({ ...b, status: 'declined_by_pujari', declineReason: reason }));
  return net(true, 400);
}

export async function setBookingStatus(id: string, status: BookingStatus) {
  patchBooking(id, (b) => ({
    ...b,
    status,
    completedAt: status === 'completed' ? new Date().toISOString() : b.completedAt,
  }));
  return net(clone(db.bookings.find((b) => b.id === id))!, 320);
}

export async function cancelBooking(id: string, reason: string) {
  patchBooking(id, (b) => ({ ...b, status: 'cancelled_by_pujari', cancelledReason: reason }));
  return net(true, 480);
}

export async function requestReschedule(id: string, newIso: string, reason: string) {
  patchBooking(id, (b) => ({
    ...b,
    status: 'reschedule_requested',
    scheduledAt: newIso,
    cancelledReason: reason,
  }));
  return net(true, 420);
}

export async function toggleChecklistItem(id: string, item: string) {
  patchBooking(id, (b) => ({
    ...b,
    checklistDone: b.checklistDone.includes(item)
      ? b.checklistDone.filter((i) => i !== item)
      : [...b.checklistDone, item],
  }));
  return clone(db.bookings.find((b) => b.id === id))!;
}

/** Devotee OTP at check-in. 4-digit; 1234 is the happy path in the mock. */
export async function verifyCheckInOtp(id: string, otp: string) {
  await wait(600);
  if (otp !== '1234') return { ok: false as const, message: 'That code doesn’t match. Ask the devotee to read it again, or resend it.' };
  patchBooking(id, (b) => ({ ...b, status: 'in_progress' }));
  return { ok: true as const };
}

/** Ops-assisted fallback when the devotee's OTP can't be delivered at all. */
export async function verifyWithOps(id: string) {
  await wait(900);
  patchBooking(id, (b) => ({ ...b, status: 'in_progress' }));
  return { ok: true as const };
}

/* ---------------------------------------------------------------- earnings */

export async function getEarnings(): Promise<EarningsSummary> {
  const settled = db.bookings.filter((b) => b.status === 'settled');
  const completed = db.bookings.filter((b) => b.status === 'completed');
  const net_ = (b: Booking) => Math.round(b.gross * (1 - b.commissionRate));

  const weekAgo = Date.now() - 7 * 86_400_000;
  const monthAgo = Date.now() - 30 * 86_400_000;

  return net({
    pendingSettlement: completed.reduce((s, b) => s + net_(b), 0),
    paidOut: db.payouts.filter((p) => p.status === 'paid').reduce((s, p) => s + p.net, 0),
    thisWeek: [...settled, ...completed]
      .filter((b) => new Date(b.completedAt ?? 0).getTime() > weekAgo)
      .reduce((s, b) => s + net_(b), 0),
    thisMonth: [...settled, ...completed]
      .filter((b) => new Date(b.completedAt ?? 0).getTime() > monthAgo)
      .reduce((s, b) => s + net_(b), 0),
    completedThisMonth: [...settled, ...completed].filter(
      (b) => new Date(b.completedAt ?? 0).getTime() > monthAgo,
    ).length,
  });
}

export const getPayouts = () => net(clone(db.payouts));
export const getPayout = (id: string) => net(clone(db.payouts.find((p) => p.id === id)) ?? null);

/* ----------------------------------------------------- engagement surfaces */

export const getNotifications = () => net(clone(db.notifications));

export async function markNotificationsRead() {
  db.notifications = db.notifications.map((n) => ({ ...n, read: true }));
  return net(clone(db.notifications), 120);
}

export const getReviews = () => net(clone(db.reviews));

export async function respondToReview(id: string, response: string) {
  db.reviews = db.reviews.map((r) => (r.id === id ? { ...r, response } : r));
  return net(true, 350);
}

export async function disputeReview(id: string) {
  db.reviews = db.reviews.map((r) => (r.id === id ? { ...r, disputed: true } : r));
  return net(true, 350);
}

export const getMessages = (bookingId: string) =>
  net(clone(db.messages.filter((m) => m.bookingId === bookingId)));

export async function sendMessage(bookingId: string, text: string) {
  const msg: ChatMessage = {
    id: `m_${Date.now()}`,
    bookingId,
    from: 'pujari',
    text,
    sentAt: new Date().toISOString(),
    queued: simulateOffline,
  };
  db.messages = [...db.messages, msg];
  await wait(220);
  return clone(msg);
}

export const getTickets = () => net(clone(db.tickets));
export const getTicket = (id: string) => net(clone(db.tickets.find((t) => t.id === id)) ?? null);

export async function createTicket(
  category: SupportTicket['category'],
  subject: string,
  body: string,
  bookingId?: string,
) {
  const ticket: SupportTicket = {
    id: `tk_${Date.now()}`,
    reference: `HLP-${2300 + db.tickets.length}`,
    category,
    subject,
    status: 'open',
    createdAt: new Date().toISOString(),
    bookingId,
    messages: [{ from: 'pujari', text: body, sentAt: new Date().toISOString() }],
  };
  db.tickets = [ticket, ...db.tickets];
  return net(clone(ticket), 520);
}

/* ------------------------------------------------------------------ helpers */

function patchBooking(id: string, fn: (b: Booking) => Booking) {
  db.bookings = db.bookings.map((b) => (b.id === id ? fn(b) : b));
}

function clone<T>(v: T): T {
  return v === undefined ? v : (JSON.parse(JSON.stringify(v)) as T);
}

function fmtTime(ms: number) {
  return new Date(ms).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export { COMMISSION_RATE };
