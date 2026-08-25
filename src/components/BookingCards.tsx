import { View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from '@/ui/Icon';
import { useColors } from '@/ui/ThemeProvider';
import { Card, Money, Row, StatusPill, Text } from '@/ui/primitives';
import { CeremonyPanel } from '@/ui/Ornament';
import { Pressable } from 'react-native';
import { poojaById } from '@/data/fixtures/catalog';
import {
  STATUS_ICON,
  STATUS_LABEL,
  STATUS_TONE,
  countdown,
  dayLabel,
  duration,
  netOf,
  time,
} from '@/lib/format';
import { useNow } from '@/lib/useAsync';
import { radius, space } from '@/ui/tokens';
import type { Booking } from '@/data/types';

/* ------------------------------------------------------------- RequestCard */

/**
 * A pending request. Net payout and the expiry countdown are the two things a
 * pujari decides on, so both are given real weight — no hunting for either.
 */
export function RequestCard({ booking }: { booking: Booking }) {
  const t = useColors();
  const nowMs = useNow(1000);
  const pooja = poojaById(booking.poojaId);
  const cd = booking.expiresAt ? countdown(booking.expiresAt, nowMs) : null;

  return (
    <Card
      onPress={() => router.push(`/request/${booking.id}`)}
      accessibilityLabel={`${pooja?.name} request, you receive ${netOf(booking)} rupees`}
      padded={false}
      style={{ borderColor: cd?.urgent ? t.status.urgentFg : t.line.subtle, borderWidth: 1.5 }}>
      {cd ? (
        <Row
          justify="space-between"
          align="center"
          style={{
            paddingHorizontal: space.base,
            paddingVertical: 7,
            backgroundColor: cd.urgent ? t.status.urgentBg : t.bg.sunken,
          }}>
          <Row gap={5} align="center">
            <Icon
              name="time"
              size={12}
              color={cd.urgent ? t.status.urgentFg : t.fg.secondary}
            />
            <Text
              variant="micro"
              style={{ color: cd.urgent ? t.status.urgentFg : t.fg.secondary }}>
              {cd.expired ? 'Expired' : `Respond within ${cd.text}`}
            </Text>
          </Row>
          {booking.isUrgent ? <StatusPill label="Urgent" tone="urgent" size="sm" /> : null}
        </Row>
      ) : null}

      <View style={{ padding: space.base, gap: space.md }}>
        <View style={{ gap: 3 }}>
          <Text variant="h3">{pooja?.name}</Text>
          <Text variant="caption" tone="tertiary">
            {dayLabel(booking.scheduledAt)} · {time(booking.scheduledAt)} ·{' '}
            {duration(booking.durationMinutes)}
          </Text>
        </View>

        <Row gap={space.base} align="center">
          <Row gap={5} align="center" style={{ flex: 1 }}>
            <Icon
              name={booking.serviceType === 'remote' ? 'globe-outline' : 'location-outline'}
              size={14}
              color={t.fg.tertiary}
            />
            <Text variant="caption" tone="secondary" numberOfLines={1}>
              {booking.locality}
              {booking.serviceType === 'home_visit' ? ` · ${booking.distanceKm} km` : ''}
            </Text>
          </Row>
          <View style={{ alignItems: 'flex-end' }}>
            <Money value={netOf(booking)} variant="title" />
            <Text variant="micro" tone="tertiary">
              You receive
            </Text>
          </View>
        </Row>
      </View>
    </Card>
  );
}

/* ------------------------------------------------------------- BookingCard */

export function BookingCard({ booking, compact }: { booking: Booking; compact?: boolean }) {
  const t = useColors();
  const pooja = poojaById(booking.poojaId);

  return (
    <Card
      onPress={() => router.push(`/booking/${booking.id}`)}
      accessibilityLabel={`${pooja?.name}, ${STATUS_LABEL[booking.status]}`}>
      <View style={{ gap: space.md }}>
        {/* Title and status share a row; the date runs full width beneath, so a
            long status label can never squeeze it into wrapping. */}
        <View style={{ gap: 5 }}>
          <Row justify="space-between" align="center" gap={space.sm}>
            <Text variant="title" numberOfLines={1} style={{ flex: 1, minWidth: 0 }}>
              {pooja?.name}
            </Text>
            <StatusPill
              label={STATUS_LABEL[booking.status]}
              tone={STATUS_TONE[booking.status]}
              icon={STATUS_ICON[booking.status]}
              size="sm"
            />
          </Row>
          <Text variant="caption" tone="tertiary" numberOfLines={1}>
            {dayLabel(booking.scheduledAt)} · {time(booking.scheduledAt)}
          </Text>
        </View>

        {!compact ? (
          <Row justify="space-between" align="center">
            <Row gap={5} align="center" style={{ flex: 1 }}>
              <Icon
                name={booking.serviceType === 'remote' ? 'globe-outline' : 'location-outline'}
                size={13}
                color={t.fg.tertiary}
              />
              <Text variant="caption" tone="secondary" numberOfLines={1}>
                {booking.locality} · {booking.devotee.name}
              </Text>
            </Row>
            <Money value={netOf(booking)} variant="smallStrong" tone="secondary" />
          </Row>
        ) : null}
      </View>
    </Card>
  );
}

/* -------------------------------------------------------- TodayCeremonyCard */

/** The single most important card in the app on a working day. */
export function TodayCeremonyCard({ booking }: { booking: Booking }) {
  const t = useColors();
  const pooja = poojaById(booking.poojaId);
  const leaveBy = new Date(
    new Date(booking.scheduledAt).getTime() - (booking.travelMinutes + 25) * 60_000,
  ).toISOString();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Today's ceremony, ${pooja?.name}`}
      onPress={() => router.push(`/booking/${booking.id}`)}
      style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.99 : 1 }] })}>
      <CeremonyPanel>
      <View style={{ padding: space.lg, gap: space.base }}>
        <Row justify="space-between" align="center">
          <Text variant="micro" style={{ color: 'rgba(255,255,255,0.72)' }}>
            Today’s ceremony
          </Text>
          <Icon name="arrow-forward" size={16} color="rgba(255,255,255,0.72)" />
        </Row>

        <View style={{ gap: 4 }}>
          <Text variant="h1" style={{ color: '#FFFFFF' }}>
            {pooja?.name}
          </Text>
          <Text variant="small" style={{ color: 'rgba(255,255,255,0.82)' }}>
            {time(booking.scheduledAt)} · {booking.locality} · {booking.devotee.name}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 7,
            alignSelf: 'flex-start',
            backgroundColor: 'rgba(255,255,255,0.14)',
            paddingHorizontal: 11,
            paddingVertical: 7,
            borderRadius: radius.pill,
          }}>
          <Icon name="navigate" size={13} color="#FFFFFF" />
          <Text variant="caption" style={{ color: '#FFFFFF' }}>
            Leave by {time(leaveBy)} · {booking.travelMinutes} min away
          </Text>
        </View>
      </View>
      </CeremonyPanel>
    </Pressable>
  );
}
