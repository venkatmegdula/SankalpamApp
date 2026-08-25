import type {
  AppNotification,
  Availability,
  Booking,
  ChatMessage,
  DocumentRecord,
  Payout,
  PujariProfile,
  Review,
  SupportTicket,
} from '../types';
import { COMMISSION_RATE } from './catalog';

/* --------------------------------------------------------------- date utils */

const DAY = 86_400_000;
const MIN = 60_000;

const now = () => new Date();

/** Today at a given hour:minute, offset by whole days. */
export function at(dayOffset: number, hour: number, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export const inMinutes = (m: number) => new Date(Date.now() + m * MIN).toISOString();
export const daysAgo = (d: number) => new Date(Date.now() - d * DAY).toISOString();

/* ------------------------------------------------------------------ documents */

export const DOCUMENT_TEMPLATE: DocumentRecord[] = [
  {
    kind: 'aadhaar',
    label: 'Aadhaar card',
    why: 'Confirms your identity. Devotees are letting you into their home, so we verify every pujari.',
    status: 'not_started',
  },
  {
    kind: 'address_proof',
    label: 'Address proof',
    why: 'Confirms the zone you can realistically serve.',
    status: 'not_started',
  },
  {
    kind: 'photograph',
    label: 'Passport photograph',
    why: 'Shown on your public profile so devotees recognise you at the door.',
    status: 'not_started',
  },
  {
    kind: 'training_proof',
    label: 'Proof of training or lineage',
    why: 'A certificate, guru reference letter, or temple experience letter.',
    status: 'not_started',
  },
  {
    kind: 'pan',
    label: 'PAN card',
    why: 'Required for payouts above the TDS threshold.',
    status: 'not_started',
  },
  {
    kind: 'bank_proof',
    label: 'Cancelled cheque or passbook',
    why: 'Confirms the account your weekly payouts are sent to.',
    status: 'not_started',
  },
];

/* --------------------------------------------------------------- availability */

const DEFAULT_AVAILABILITY: Availability = {
  windows: [
    { day: 0, start: '05:30', end: '12:00' },
    { day: 1, start: '05:30', end: '11:00' },
    { day: 2, start: '05:30', end: '11:00' },
    { day: 3, start: '05:30', end: '11:00' },
    { day: 4, start: '05:30', end: '11:00' },
    { day: 5, start: '05:30', end: '11:00' },
    { day: 6, start: '05:30', end: '13:00' },
  ],
  maxPerDay: 2,
  bufferMinutes: 90,
  blackoutDates: [],
  acceptsEarlyMuhurtham: true,
};

/* -------------------------------------------------------------- the pujaris */

/** A brand-new applicant. The default entry state so the full journey is walkable. */
export function newApplicant(phone: string): PujariProfile {
  return {
    id: 'pujari_self',
    fullName: '',
    phone,
    yearsExperience: 0,
    trainingType: [],
    vedas: [],
    sampradaya: [],
    languages: [],
    poojaIds: [],
    serviceType: 'home_visit',
    travelRadiusKm: 10,
    stage: 'not_started',
    ratingCount: 0,
    completedBookings: 0,
    documents: DOCUMENT_TEMPLATE.map((d) => ({ ...d })),
    availability: { ...DEFAULT_AVAILABILITY, windows: [...DEFAULT_AVAILABILITY.windows] },
    isPaused: false,
  };
}

/** A fully onboarded pujari with history — used for the steady-state demo. */
export function activePujari(): PujariProfile {
  return {
    id: 'pujari_self',
    fullName: 'Srinivasa Sharma',
    phone: '9848012345',
    dateOfBirth: '1988-04-12',
    yearsExperience: 14,
    trainingType: ['guru_shishya', 'temple'],
    guruOrInstitution: 'Sri Veda Vijnana Gurukulam',
    templeServed: 'Sri Venkateswara Temple, Kondapur',
    vedas: ['krishna_yajurveda'],
    sampradaya: ['smarta'],
    languages: ['telugu', 'sanskrit', 'hindi'],
    poojaIds: [
      'griha_pravesh',
      'satyanarayana',
      'ganapati',
      'rudrabhishekam',
      'lakshmi',
      'navagraha_shanti',
      'ayushya_homam',
    ],
    serviceType: 'both',
    zoneId: 'zone_a',
    travelRadiusKm: 15,
    stage: 'active',
    bio: 'Fourteen years performing household ceremonies across west Hyderabad. Trained in the Krishna Yajurveda tradition, and known for explaining each step of the ritual to the family as it happens.',
    rating: 4.8,
    ratingCount: 63,
    completedBookings: 71,
    memberSince: daysAgo(400),
    bank: {
      accountNumberMasked: '•••• •••• 2528',
      ifsc: 'HDFC0000545',
      bankName: 'HDFC Bank',
      branch: 'Hitech City',
      holderName: 'Srinivasa Sharma',
      verified: true,
    },
    documents: DOCUMENT_TEMPLATE.map((d) => ({ ...d, status: 'uploaded', capturedAt: daysAgo(402) })),
    availability: { ...DEFAULT_AVAILABILITY, windows: [...DEFAULT_AVAILABILITY.windows] },
    isPaused: false,
  };
}

/* ------------------------------------------------------------------ bookings */

const gross = (n: number) => n;

/**
 * Scenario coverage is deliberate: an expiring urgent request, a request that
 * collides with a confirmed booking, a remote Archana, a booking with missing
 * devotee data, a devotee cancellation, a reschedule, and settled history.
 */
export function seedBookings(): Booking[] {
  return [
    // ---------------------------------------------------------- REQUESTS ----
    {
      id: 'bk_req_1',
      reference: 'SKP-4821',
      poojaId: 'satyanarayana',
      status: 'requested',
      serviceType: 'home_visit',
      scheduledAt: at(2, 6, 30),
      durationMinutes: 150,
      devotee: {
        id: 'dev_1',
        name: 'Ananya Reddy',
        phoneMasked: '+91 ••••• •4417',
        language: 'te',
        bookingOnBehalfOf: 'her parents',
        attendeeName: 'Lakshmi Reddy',
        attendeePhoneMasked: '+91 ••••• •8802',
      },
      zoneId: 'zone_a',
      locality: 'Kondapur',
      distanceKm: 8.2,
      travelMinutes: 25,
      gross: gross(3100),
      commissionRate: COMMISSION_RATE,
      gotra: 'Bharadwaja',
      // Deliberately missing — flagged in the request detail, not hidden.
      nakshatra: undefined,
      familyNotes: 'Booking for my parents. My mother will be at home.',
      samagriStatus: 'pending',
      expiresAt: inMinutes(42),
      checklistDone: [],
      createdAt: inMinutes(-18),
    },
    {
      id: 'bk_req_2',
      reference: 'SKP-4822',
      poojaId: 'ganapati',
      status: 'requested',
      serviceType: 'home_visit',
      // Collides with the confirmed Griha Pravesh below — exercises conflict detection.
      scheduledAt: at(1, 7, 0),
      durationMinutes: 90,
      devotee: {
        id: 'dev_2',
        name: 'Karthik Varma',
        phoneMasked: '+91 ••••• •2290',
        language: 'te',
      },
      zoneId: 'zone_b',
      locality: 'Banjara Hills',
      distanceKm: 14.6,
      travelMinutes: 40,
      gross: gross(2100),
      commissionRate: COMMISSION_RATE,
      gotra: 'Kashyapa',
      nakshatra: 'Rohini',
      samagriStatus: 'delivered',
      expiresAt: inMinutes(96),
      checklistDone: [],
      createdAt: inMinutes(-40),
    },
    {
      id: 'bk_req_3',
      reference: 'SKP-4823',
      poojaId: 'rudrabhishekam',
      status: 'requested',
      serviceType: 'remote',
      scheduledAt: at(0, 17, 30),
      durationMinutes: 150,
      devotee: {
        id: 'dev_3',
        name: 'Meera Iyer',
        phoneMasked: '+91 ••••• •7734',
        language: 'en',
      },
      zoneId: 'zone_a',
      locality: 'Remote',
      distanceKm: 0,
      travelMinutes: 0,
      gross: gross(4100),
      commissionRate: COMMISSION_RATE,
      gotra: 'Vasishta',
      nakshatra: 'Ashwini',
      samagriStatus: 'not_applicable',
      expiresAt: inMinutes(8),
      isUrgent: true,
      checklistDone: [],
      createdAt: inMinutes(-52),
    },

    // ------------------------------------------------------------ TODAY ----
    {
      id: 'bk_today',
      reference: 'SKP-4790',
      poojaId: 'lakshmi',
      status: 'confirmed',
      serviceType: 'home_visit',
      scheduledAt: at(0, 18, 0),
      durationMinutes: 120,
      devotee: {
        id: 'dev_4',
        name: 'Ravi Teja Chowdary',
        phoneMasked: '+91 ••••• •1156',
        language: 'te',
      },
      zoneId: 'zone_a',
      locality: 'Gachibowli',
      fullAddress: 'Flat 704, Aparna Sarovar, Nallagandla Road, Gachibowli, Hyderabad 500032',
      distanceKm: 6.4,
      travelMinutes: 20,
      gross: gross(2700),
      commissionRate: COMMISSION_RATE,
      gotra: 'Gautama',
      nakshatra: 'Uttara',
      samagriStatus: 'delivered',
      checklistDone: ['Panchapatra & udharini'],
      createdAt: daysAgo(4),
    },

    // --------------------------------------------------------- UPCOMING ----
    {
      id: 'bk_up_1',
      reference: 'SKP-4801',
      poojaId: 'griha_pravesh',
      status: 'confirmed',
      serviceType: 'home_visit',
      scheduledAt: at(1, 6, 0),
      durationMinutes: 180,
      devotee: {
        id: 'dev_5',
        name: 'Sneha Kulkarni',
        phoneMasked: '+91 ••••• •3345',
        language: 'hi',
      },
      zoneId: 'zone_a',
      locality: 'Manikonda',
      fullAddress: 'Villa 22, Rainbow Vistas, Manikonda, Hyderabad 500089',
      distanceKm: 9.1,
      travelMinutes: 28,
      gross: gross(5100),
      commissionRate: COMMISSION_RATE,
      gotra: 'Atri',
      nakshatra: 'Punarvasu',
      samagriStatus: 'pending',
      checklistDone: [],
      createdAt: daysAgo(6),
    },
    {
      id: 'bk_up_2',
      reference: 'SKP-4805',
      poojaId: 'ayushya_homam',
      status: 'reschedule_requested',
      serviceType: 'home_visit',
      scheduledAt: at(4, 7, 30),
      durationMinutes: 180,
      devotee: {
        id: 'dev_6',
        name: 'Prakash Rao',
        phoneMasked: '+91 ••••• •9921',
        language: 'te',
      },
      zoneId: 'zone_b',
      locality: 'Secunderabad',
      fullAddress: '3-6-291, Sainikpuri, Secunderabad 500094',
      distanceKm: 18.3,
      travelMinutes: 48,
      gross: gross(5500),
      commissionRate: COMMISSION_RATE,
      gotra: 'Bharadwaja',
      nakshatra: 'Magha',
      samagriStatus: 'pending',
      checklistDone: [],
      createdAt: daysAgo(9),
    },

    // -------------------------------------------------------- COMPLETED ----
    {
      id: 'bk_done_1',
      reference: 'SKP-4712',
      poojaId: 'satyanarayana',
      status: 'settled',
      serviceType: 'home_visit',
      scheduledAt: daysAgo(5),
      durationMinutes: 150,
      devotee: { id: 'dev_7', name: 'Divya Prasad', phoneMasked: '+91 ••••• •5510', language: 'te' },
      zoneId: 'zone_a',
      locality: 'Kukatpally',
      fullAddress: 'Flat 302, My Home Jewel, Kukatpally, Hyderabad 500072',
      distanceKm: 11.2,
      travelMinutes: 32,
      gross: gross(3100),
      commissionRate: COMMISSION_RATE,
      gotra: 'Shandilya',
      nakshatra: 'Chitra',
      samagriStatus: 'delivered',
      checklistDone: [],
      createdAt: daysAgo(12),
      completedAt: daysAgo(5),
      rating: 5,
      reviewText: 'He explained every step to my children. We felt completely at ease.',
      payoutId: 'po_2',
    },
    {
      id: 'bk_done_2',
      reference: 'SKP-4698',
      poojaId: 'ganapati',
      status: 'settled',
      serviceType: 'home_visit',
      scheduledAt: daysAgo(8),
      durationMinutes: 90,
      devotee: { id: 'dev_8', name: 'Naresh Kumar', phoneMasked: '+91 ••••• •7781', language: 'te' },
      zoneId: 'zone_a',
      locality: 'Miyapur',
      distanceKm: 13.4,
      travelMinutes: 35,
      gross: gross(2100),
      commissionRate: COMMISSION_RATE,
      gotra: 'Kaundinya',
      nakshatra: 'Hasta',
      samagriStatus: 'delivered',
      checklistDone: [],
      createdAt: daysAgo(15),
      completedAt: daysAgo(8),
      rating: 4,
      payoutId: 'po_2',
    },
    {
      id: 'bk_done_3',
      reference: 'SKP-4655',
      poojaId: 'rudrabhishekam',
      status: 'completed',
      serviceType: 'remote',
      scheduledAt: daysAgo(2),
      durationMinutes: 150,
      devotee: { id: 'dev_9', name: 'Shalini Menon', phoneMasked: '+91 ••••• •3390', language: 'en' },
      zoneId: 'zone_a',
      locality: 'Remote',
      distanceKm: 0,
      travelMinutes: 0,
      gross: gross(4100),
      commissionRate: COMMISSION_RATE,
      gotra: 'Vishwamitra',
      nakshatra: 'Revati',
      samagriStatus: 'not_applicable',
      checklistDone: [],
      createdAt: daysAgo(7),
      completedAt: daysAgo(2),
      rating: 2,
      reviewText: 'The recording arrived late and I could not tell whether the sankalp used our gotra.',
    },
    {
      id: 'bk_done_4',
      reference: 'SKP-4640',
      poojaId: 'navagraha_shanti',
      status: 'settled',
      serviceType: 'home_visit',
      scheduledAt: daysAgo(16),
      durationMinutes: 180,
      devotee: { id: 'dev_10', name: 'Vikram Sinha', phoneMasked: '+91 ••••• •2214', language: 'hi' },
      zoneId: 'zone_b',
      locality: 'Begumpet',
      distanceKm: 15.8,
      travelMinutes: 42,
      gross: gross(4500),
      commissionRate: COMMISSION_RATE,
      gotra: 'Bharadwaja',
      nakshatra: 'Ashlesha',
      samagriStatus: 'delivered',
      checklistDone: [],
      createdAt: daysAgo(22),
      completedAt: daysAgo(16),
      rating: 5,
      payoutId: 'po_1',
    },

    // -------------------------------------------------------- CANCELLED ----
    {
      id: 'bk_canc_1',
      reference: 'SKP-4744',
      poojaId: 'saraswati',
      status: 'cancelled_by_devotee',
      serviceType: 'home_visit',
      scheduledAt: daysAgo(3),
      durationMinutes: 105,
      devotee: { id: 'dev_11', name: 'Harika Bandi', phoneMasked: '+91 ••••• •6672', language: 'te' },
      zoneId: 'zone_a',
      locality: 'Madhapur',
      distanceKm: 7.5,
      travelMinutes: 22,
      gross: gross(2500),
      commissionRate: COMMISSION_RATE,
      samagriStatus: 'delivered',
      checklistDone: [],
      createdAt: daysAgo(10),
      cancelledReason: 'Family travel plans changed',
    },
  ];
}

/* ------------------------------------------------------------------ payouts */

export function seedPayouts(): Payout[] {
  return [
    {
      id: 'po_pending',
      periodStart: daysAgo(3),
      periodEnd: at(4, 23, 59),
      bookingIds: ['bk_done_3'],
      gross: 4100,
      commission: 615,
      tds: 0,
      net: 3485,
      status: 'processing',
    },
    {
      id: 'po_2',
      periodStart: daysAgo(10),
      periodEnd: daysAgo(4),
      bookingIds: ['bk_done_1', 'bk_done_2'],
      gross: 5200,
      commission: 780,
      tds: 0,
      net: 4420,
      status: 'paid',
      paidAt: daysAgo(3),
    },
    {
      id: 'po_1',
      periodStart: daysAgo(21),
      periodEnd: daysAgo(15),
      bookingIds: ['bk_done_4'],
      gross: 4500,
      commission: 675,
      tds: 0,
      net: 3825,
      status: 'paid',
      paidAt: daysAgo(14),
    },
    {
      id: 'po_held',
      periodStart: daysAgo(31),
      periodEnd: daysAgo(25),
      bookingIds: [],
      gross: 9200,
      commission: 1380,
      tds: 0,
      net: 7820,
      status: 'held_pan',
      heldReason:
        'This payout is above the TDS threshold, so we need your PAN before we can release it.',
    },
  ];
}

/* ------------------------------------------------------------ notifications */

export function seedNotifications(): AppNotification[] {
  return [
    {
      id: 'n1',
      kind: 'request_expiring',
      title: 'A request is expiring soon',
      body: 'Rudrabhishekam (Remote) — respond within 8 minutes.',
      createdAt: inMinutes(-2),
      read: false,
      href: '/request/bk_req_3',
    },
    {
      id: 'n2',
      kind: 'request',
      title: 'New booking request',
      body: 'Satyanarayana Vratam in Kondapur, Sunday 6:30 am.',
      createdAt: inMinutes(-18),
      read: false,
      href: '/request/bk_req_1',
    },
    {
      id: 'n3',
      kind: 'reminder',
      title: 'Ceremony today at 6:00 pm',
      body: 'Lakshmi Pooja in Gachibowli. Leave by 5:35 pm.',
      createdAt: inMinutes(-180),
      read: false,
      href: '/booking/bk_today',
    },
    {
      id: 'n4',
      kind: 'payout',
      title: '₹4,420 credited',
      body: 'Weekly payout sent to HDFC Bank •••• 2528.',
      createdAt: daysAgo(3),
      read: true,
      href: '/earnings/payout/po_2',
    },
    {
      id: 'n5',
      kind: 'rating',
      title: 'Shalini Menon left a 2-star review',
      body: 'You can respond or dispute this review.',
      createdAt: daysAgo(2),
      read: true,
      href: '/profile/reviews',
    },
    {
      id: 'n6',
      kind: 'cancellation',
      title: 'Booking cancelled by devotee',
      body: 'Saraswati Pooja on ' + new Date(daysAgo(3)).toLocaleDateString('en-IN') + ' was cancelled.',
      createdAt: daysAgo(4),
      read: true,
    },
  ];
}

/* ---------------------------------------------------------------- reviews */

export function seedReviews(): Review[] {
  return [
    {
      id: 'rv1',
      bookingId: 'bk_done_1',
      poojaId: 'satyanarayana',
      devoteeName: 'Divya Prasad',
      rating: 5,
      text: 'He explained every step to my children. We felt completely at ease.',
      createdAt: daysAgo(5),
    },
    {
      id: 'rv2',
      bookingId: 'bk_done_3',
      poojaId: 'rudrabhishekam',
      devoteeName: 'Shalini Menon',
      rating: 2,
      text: 'The recording arrived late and I could not tell whether the sankalp used our gotra.',
      createdAt: daysAgo(2),
    },
    {
      id: 'rv3',
      bookingId: 'bk_done_2',
      poojaId: 'ganapati',
      devoteeName: 'Naresh Kumar',
      rating: 4,
      text: 'Punctual and thorough. Would book again.',
      createdAt: daysAgo(8),
    },
    {
      id: 'rv4',
      bookingId: 'bk_done_4',
      poojaId: 'navagraha_shanti',
      devoteeName: 'Vikram Sinha',
      rating: 5,
      text: 'Very patient with our questions throughout the homam.',
      createdAt: daysAgo(16),
    },
  ];
}

/* ---------------------------------------------------------------- messages */

export function seedMessages(): ChatMessage[] {
  return [
    {
      id: 'm1',
      bookingId: 'bk_today',
      from: 'devotee',
      text: 'Namaste. We are on the 7th floor, the lift is working today.',
      sentAt: inMinutes(-240),
    },
    {
      id: 'm2',
      bookingId: 'bk_today',
      from: 'pujari',
      text: 'Namaste. Noted, I will reach by 5:50 pm.',
      sentAt: inMinutes(-236),
    },
    {
      id: 'm3',
      bookingId: 'bk_up_1',
      from: 'devotee',
      text: 'The samagri kit has not arrived yet. Should I arrange it separately?',
      sentAt: inMinutes(-90),
    },
  ];
}

/* ---------------------------------------------------------------- tickets */

export function seedTickets(): SupportTicket[] {
  return [
    {
      id: 'tk1',
      reference: 'HLP-2261',
      category: 'payout',
      subject: 'Payout held for PAN',
      status: 'in_progress',
      createdAt: daysAgo(6),
      messages: [
        {
          from: 'pujari',
          text: 'My payout from last month is still on hold. I have uploaded my PAN twice.',
          sentAt: daysAgo(6),
        },
        {
          from: 'support',
          text: 'Thank you for flagging this. The PAN image was unreadable on the second attempt. We have shared clearer capture guidance in the app — could you try once more?',
          sentAt: daysAgo(5),
        },
      ],
    },
    {
      id: 'tk2',
      reference: 'HLP-2190',
      category: 'conduct',
      subject: 'Devotee requested off-platform payment',
      status: 'resolved',
      createdAt: daysAgo(19),
      messages: [
        {
          from: 'pujari',
          text: 'A devotee asked me to take cash directly and cancel the booking. I declined.',
          sentAt: daysAgo(19),
        },
        {
          from: 'support',
          text: 'You handled that exactly right, and thank you for reporting it. We have spoken with the devotee and noted it on their account.',
          sentAt: daysAgo(18),
        },
      ],
    },
  ];
}

export { now };
