/**
 * Domain types for the Sankalpam Pujari app.
 *
 * These are the contract between the UI and the data layer. The mock repository
 * in `api.ts` satisfies them today; a real HTTP client satisfies them tomorrow
 * without any screen changing.
 */

export type Locale = 'te' | 'hi' | 'en';

export type ServiceType = 'home_visit' | 'remote' | 'both';

/** Every stage in the four-stage onboarding, plus its failure branches. */
export type VerificationStage =
  | 'not_started'
  | 'submitted'
  | 'under_review'
  | 'docs_rejected'
  | 'stage1_cleared'
  | 'stage2_scheduling'
  | 'stage2_scheduled'
  | 'stage2_passed'
  | 'stage3_scheduling'
  | 'stage3_scheduled'
  | 'stage3_passed'
  | 'stage4_agreement'
  | 'stage4_profile'
  | 'active'
  | 'suspended'
  | 'rejected';

export type BookingStatus =
  | 'requested'
  | 'expired'
  | 'declined_by_pujari'
  | 'accepted'
  | 'confirmed'
  | 'en_route'
  | 'arrived'
  | 'checked_in'
  | 'in_progress'
  | 'completed'
  | 'settled'
  | 'cancelled_by_devotee'
  | 'cancelled_by_pujari'
  | 'reschedule_requested'
  | 'no_show_devotee'
  | 'disputed';

export type DocumentKind =
  | 'aadhaar'
  | 'address_proof'
  | 'photograph'
  | 'training_proof'
  | 'pan'
  | 'bank_proof';

export type DocumentStatus = 'not_started' | 'captured' | 'uploading' | 'uploaded' | 'rejected';

export interface DocumentRecord {
  kind: DocumentKind;
  label: string;
  why: string;
  status: DocumentStatus;
  rejectionReason?: string;
  capturedAt?: string;
}

export interface PoojaCategory {
  id: string;
  name: string;
  teluguName: string;
  category: 'house' | 'homam' | 'life_event' | 'deity' | 'dosha' | 'ancestral';
  /** Platform-fixed. Pujaris do not set prices — see D2 in the master brief. */
  price: number;
  durationMinutes: number;
  serviceTypes: ServiceType[];
  summary: string;
  /** Items the pujari is expected to bring, per the code of conduct. */
  pujariBrings: string[];
  /** Items supplied by the devotee or the samagri kit. */
  devoteeProvides: string[];
  /** True where the ritual cannot proceed without gotra — blocks remote Archana. */
  requiresGotra: boolean;
  /** Provisional entries pending the client's Annexure A. */
  provisional?: boolean;
}

export interface Zone {
  id: string;
  name: string;
  localities: string[];
}

export interface LookupOption {
  id: string;
  label: string;
}

export interface PujariProfile {
  id: string;
  fullName: string;
  phone: string;
  photoUri?: string;
  dateOfBirth?: string;
  yearsExperience: number;
  trainingType: string[];
  guruOrInstitution?: string;
  templeServed?: string;
  vedas: string[];
  sampradaya: string[];
  languages: string[];
  poojaIds: string[];
  serviceType: ServiceType;
  zoneId?: string;
  travelRadiusKm: number;
  stage: VerificationStage;
  bio?: string;
  rating?: number;
  ratingCount: number;
  completedBookings: number;
  memberSince?: string;
  bank?: BankAccount;
  documents: DocumentRecord[];
  /** Weekly recurring availability plus exceptions. */
  availability: Availability;
  isPaused: boolean;
  pauseUntil?: string;
}

export interface BankAccount {
  accountNumberMasked: string;
  ifsc: string;
  bankName: string;
  branch: string;
  holderName: string;
  verified: boolean;
}

export interface AvailabilityWindow {
  /** 0 = Sunday */
  day: number;
  start: string;
  end: string;
}

export interface Availability {
  windows: AvailabilityWindow[];
  maxPerDay: number;
  bufferMinutes: number;
  blackoutDates: string[];
  acceptsEarlyMuhurtham: boolean;
}

export interface Devotee {
  id: string;
  name: string;
  phoneMasked: string;
  language: Locale;
  /** Set when someone books on behalf of a relative — the flow's known failure mode. */
  bookingOnBehalfOf?: string;
  attendeeName?: string;
  attendeePhoneMasked?: string;
}

export interface Booking {
  id: string;
  reference: string;
  poojaId: string;
  status: BookingStatus;
  serviceType: Exclude<ServiceType, 'both'>;
  /** ISO datetime of the muhurtham. */
  scheduledAt: string;
  durationMinutes: number;
  devotee: Devotee;
  zoneId: string;
  locality: string;
  /** Withheld from the UI until the booking is accepted. */
  fullAddress?: string;
  distanceKm: number;
  travelMinutes: number;
  gross: number;
  commissionRate: number;
  gotra?: string;
  nakshatra?: string;
  familyNotes?: string;
  samagriStatus: 'delivered' | 'pending' | 'not_applicable';
  /** Set on requested bookings — the response deadline. */
  expiresAt?: string;
  isUrgent?: boolean;
  isTrial?: boolean;
  checklistDone: string[];
  createdAt: string;
  completedAt?: string;
  cancelledReason?: string;
  declineReason?: string;
  rating?: number;
  reviewText?: string;
  payoutId?: string;
}

export interface Payout {
  id: string;
  periodStart: string;
  periodEnd: string;
  bookingIds: string[];
  gross: number;
  commission: number;
  tds: number;
  net: number;
  status: 'paid' | 'processing' | 'held_pan' | 'held_bank' | 'under_review';
  paidAt?: string;
  heldReason?: string;
}

export interface AppNotification {
  id: string;
  kind:
    | 'request'
    | 'request_expiring'
    | 'verification'
    | 'document'
    | 'reminder'
    | 'message'
    | 'cancellation'
    | 'payout'
    | 'rating'
    | 'reverification';
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  /** Deep link target — every notification lands on the exact screen. */
  href?: string;
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  from: 'pujari' | 'devotee';
  text: string;
  sentAt: string;
  queued?: boolean;
}

export interface Review {
  id: string;
  bookingId: string;
  poojaId: string;
  devoteeName: string;
  rating: number;
  text?: string;
  createdAt: string;
  response?: string;
  disputed?: boolean;
}

export interface SupportTicket {
  id: string;
  reference: string;
  category: 'booking' | 'payout' | 'verification' | 'conduct' | 'app' | 'safety';
  subject: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  bookingId?: string;
  messages: { from: 'pujari' | 'support'; text: string; sentAt: string }[];
}

/** A booking-acceptance conflict detected before confirmation. */
export interface ConflictWarning {
  severity: 'block' | 'warn';
  kind: 'overlap' | 'travel' | 'max_per_day' | 'blackout';
  title: string;
  detail: string;
  relatedBookingId?: string;
}

export interface EarningsSummary {
  pendingSettlement: number;
  paidOut: number;
  thisWeek: number;
  thisMonth: number;
  completedThisMonth: number;
}
