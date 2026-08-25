/**
 * Photography.
 *
 * Sourced from Unsplash, which permits commercial use without attribution.
 * These specific asset IDs are the ones already in use by the existing
 * Sankalpam backend, so they are known-good rather than guessed.
 *
 * Two deliberate limits:
 *
 * 1. **No stock photographs of people are used as pujari or devotee avatars.**
 *    A pujari's profile picture is their own likeness and a stranger's face
 *    standing in for it would misrepresent a real person to a devotee choosing
 *    who to let into their home. Those stay as monogram avatars until real
 *    photographs exist.
 *
 * 2. All imagery is decorative and **requires cultural review and licensed
 *    replacement before production** — the same caveat carried in the delivery
 *    plan.
 */

const UNSPLASH = 'https://images.unsplash.com/';

const asset = (id: string, opts = 'w=900&q=80&auto=format&fit=crop') => `${UNSPLASH}${id}?${opts}`;

/** Verified asset IDs, already used by the Sankalpam backend. */
const IDS = {
  grihaPravesh: 'photo-1666694051761-cd972857da30',
  priestRitual: 'photo-1636559527737-ea8576ae6571',
  kalashMarigold: 'photo-1637250750846-8247d2b1ea08',
} as const;

/** Hero imagery per pooja. Crop varies so repeated assets don't read as repeats. */
export const POOJA_IMAGE: Record<string, string> = {
  griha_pravesh: asset(IDS.grihaPravesh),
  satyanarayana: asset(IDS.kalashMarigold, 'w=900&q=80&auto=format&fit=crop&crop=entropy'),
  ganapati: asset(IDS.priestRitual),
  rudrabhishekam: asset(IDS.kalashMarigold, 'w=900&q=80&auto=format&fit=crop&crop=edges'),
  durga: asset(IDS.grihaPravesh, 'w=900&q=80&auto=format&fit=crop&crop=entropy'),
  lakshmi: asset(IDS.kalashMarigold),
  saraswati: asset(IDS.priestRitual, 'w=900&q=80&auto=format&fit=crop&crop=entropy'),
  guru_datta: asset(IDS.priestRitual, 'w=900&q=80&auto=format&fit=crop&crop=edges'),
  navagraha_shanti: asset(IDS.kalashMarigold, 'w=900&q=80&auto=format&fit=crop&crop=faces'),
  sudarshana_homam: asset(IDS.priestRitual),
  ayushya_homam: asset(IDS.priestRitual, 'w=900&q=80&auto=format&fit=crop&crop=top'),
  namakaranam: asset(IDS.grihaPravesh, 'w=900&q=80&auto=format&fit=crop&crop=edges'),
  annaprasana: asset(IDS.grihaPravesh, 'w=900&q=80&auto=format&fit=crop&crop=faces'),
  aksharabhyasam: asset(IDS.kalashMarigold, 'w=900&q=80&auto=format&fit=crop&crop=top'),
  upanayanam: asset(IDS.priestRitual, 'w=900&q=80&auto=format&fit=crop&crop=faces'),
  pitru_karma: asset(IDS.kalashMarigold, 'w=900&q=80&auto=format&fit=crop&crop=bottom'),
};

export const imageForPooja = (poojaId?: string) =>
  (poojaId && POOJA_IMAGE[poojaId]) || asset(IDS.kalashMarigold);

/** Standalone hero surfaces. */
export const HERO = {
  welcome: asset(IDS.priestRitual, 'w=1200&q=85&auto=format&fit=crop'),
  rateCard: asset(IDS.kalashMarigold, 'w=1200&q=85&auto=format&fit=crop'),
  verification: asset(IDS.grihaPravesh, 'w=1200&q=85&auto=format&fit=crop'),
  howItWorks: asset(IDS.priestRitual, 'w=1200&q=85&auto=format&fit=crop&crop=entropy'),
} as const;
