import type { IconName } from '@/ui/Icon';
import type { Booking, BookingStatus } from '@/data/types';
import type { PillTone } from '@/ui/primitives';

export const money = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

export const netOf = (b: Pick<Booking, 'gross' | 'commissionRate'>) =>
  Math.round(b.gross * (1 - b.commissionRate));

export const commissionOf = (b: Pick<Booking, 'gross' | 'commissionRate'>) =>
  Math.round(b.gross * b.commissionRate);

export function time(iso: string) {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function dayLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function fullDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export const dateTime = (iso: string) => `${dayLabel(iso)} · ${time(iso)}`;

export function relative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return shortDate(iso);
}

/** Countdown to an expiry, as a stable "42:07"-style string. */
export function countdown(iso: string, nowMs = Date.now()) {
  const ms = new Date(iso).getTime() - nowMs;
  if (ms <= 0) return { text: 'Expired', expired: true, urgent: true, ms: 0 };
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const text = h > 0 ? `${h}h ${m}m` : `${m}:${String(s).padStart(2, '0')}`;
  return { text, expired: false, urgent: ms < 15 * 60_000, ms };
}

export function duration(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}

/* --------------------------------------------------------- status display */

export const STATUS_LABEL: Record<BookingStatus, string> = {
  requested: 'Awaiting your response',
  expired: 'Expired',
  declined_by_pujari: 'Declined',
  accepted: 'Accepted',
  confirmed: 'Confirmed',
  en_route: 'On the way',
  arrived: 'Arrived',
  checked_in: 'Checked in',
  in_progress: 'In progress',
  completed: 'Completed',
  settled: 'Paid out',
  cancelled_by_devotee: 'Cancelled by devotee',
  cancelled_by_pujari: 'You cancelled',
  reschedule_requested: 'Reschedule requested',
  no_show_devotee: 'Devotee not present',
  disputed: 'Under review',
};

export const STATUS_TONE: Record<BookingStatus, PillTone> = {
  requested: 'urgent',
  expired: 'neutral',
  declined_by_pujari: 'neutral',
  accepted: 'brand',
  confirmed: 'brand',
  en_route: 'info',
  arrived: 'info',
  checked_in: 'info',
  in_progress: 'success',
  completed: 'success',
  settled: 'success',
  cancelled_by_devotee: 'error',
  cancelled_by_pujari: 'error',
  reschedule_requested: 'warning',
  no_show_devotee: 'error',
  disputed: 'warning',
};

/** Status is never colour-only — every pill carries an icon too. */
export const STATUS_ICON: Record<BookingStatus, IconName> = {
  requested: 'time',
  expired: 'close-circle',
  declined_by_pujari: 'close-circle',
  accepted: 'checkmark-circle',
  confirmed: 'checkmark-circle',
  en_route: 'navigate',
  arrived: 'location',
  checked_in: 'shield-checkmark',
  in_progress: 'flame',
  completed: 'checkmark-done',
  settled: 'wallet',
  cancelled_by_devotee: 'close-circle',
  cancelled_by_pujari: 'close-circle',
  reschedule_requested: 'calendar',
  no_show_devotee: 'alert-circle',
  disputed: 'help-buoy',
};

export const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

export const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
