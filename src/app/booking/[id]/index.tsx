import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Icon, type IconName } from '@/ui/Icon';
import { useSession } from '@/store/session';
import { useColors } from '@/ui/ThemeProvider';
import { AppBar, ListGroup, ListRow, Screen, Section } from '@/ui/layout';
import {
  Banner,
  Button,
  Card,
  Divider,
  Money,
  Row,
  Skeleton,
  StatusPill,
  Text,
} from '@/ui/primitives';
import { useAsync } from '@/lib/useAsync';
import * as repo from '@/data/repository';
import { poojaById } from '@/data/fixtures/catalog';
import {
  STATUS_ICON,
  STATUS_LABEL,
  STATUS_TONE,
  commissionOf,
  duration,
  fullDate,
  netOf,
  time,
} from '@/lib/format';
import { space } from '@/ui/tokens';

export default function BookingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showToast } = useSession();
  const t = useColors();
  const { data: booking, loading, reload } = useAsync(() => repo.getBooking(String(id)), [id]);

  if (loading || !booking) {
    return (
      <Screen header={<AppBar title="Booking" />}>
        <Card>
          <View style={{ gap: space.md }}>
            <Skeleton height={26} width="55%" />
            <Skeleton height={16} width="75%" />
          </View>
        </Card>
      </Screen>
    );
  }

  const pooja = poojaById(booking.poojaId);
  const isRemote = booking.serviceType === 'remote';
  const isToday = new Date(booking.scheduledAt).toDateString() === new Date().toDateString();
  const done = ['completed', 'settled'].includes(booking.status);
  const dead = ['cancelled_by_devotee', 'cancelled_by_pujari', 'declined_by_pujari'].includes(
    booking.status,
  );
  const checklistTotal = (pooja?.pujariBrings.length ?? 0) + (pooja?.devoteeProvides.length ?? 0);

  const primaryAction = (() => {
    if (done || dead) return null;
    if (booking.status === 'in_progress')
      return { label: 'Open ceremony', href: `/booking/${booking.id}/ceremony` };
    if (booking.status === 'arrived' || booking.status === 'en_route')
      return { label: 'I have arrived — check in', href: `/booking/${booking.id}/checkin` };
    if (isRemote && isToday)
      return { label: 'Begin Archana', href: `/booking/${booking.id}/ceremony` };
    if (isToday) return { label: "I'm on my way", href: `/booking/${booking.id}/checkin` };
    return null;
  })();

  return (
    <Screen
      header={<AppBar title={pooja?.name} subtitle={booking.reference} />}
      footer={
        primaryAction ? (
          <Button
            label={primaryAction.label}
            icon={booking.status === 'in_progress' ? 'flame' : 'navigate'}
            onPress={async () => {
              if (booking.status === 'confirmed' && !isRemote) {
                await repo.setBookingStatus(booking.id, 'en_route');
                showToast('The devotee has been told you are on the way');
                await reload();
              }
              router.push(primaryAction.href as never);
            }}
          />
        ) : undefined
      }>
      <Row justify="space-between" align="center">
        <StatusPill
          label={STATUS_LABEL[booking.status]}
          tone={STATUS_TONE[booking.status]}
          icon={STATUS_ICON[booking.status]}
        />
        {booking.isTrial ? <StatusPill label="Supervised trial" tone="brand" size="sm" /> : null}
      </Row>

      {booking.status === 'reschedule_requested' ? (
        <Banner
          tone="warning"
          title="Waiting for the devotee to confirm"
          body="You proposed a new time. We'll notify you as soon as they respond."
        />
      ) : null}

      {booking.status === 'cancelled_by_devotee' ? (
        <Banner
          tone="error"
          title="The devotee cancelled this booking"
          body={booking.cancelledReason ?? 'The slot has been released back to your calendar.'}
        />
      ) : null}

      <Card>
        <View style={{ gap: space.md }}>
          <View style={{ gap: 3 }}>
            <Text variant="h3">{pooja?.name}</Text>
            <Text variant="caption" tone="tertiary">
              {pooja?.teluguName}
            </Text>
          </View>
          <Divider />
          <Row gap={space.md} align="flex-start">
            <Icon name="calendar-outline" size={16} color={t.fg.tertiary} style={{ marginTop: 2 }} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text variant="small">{fullDate(booking.scheduledAt)}</Text>
              <Text variant="caption" tone="tertiary">
                {time(booking.scheduledAt)} · {duration(booking.durationMinutes)}
              </Text>
            </View>
          </Row>

          {isRemote ? (
            <Row gap={space.md} align="flex-start">
              <Icon name="globe-outline" size={16} color={t.fg.tertiary} style={{ marginTop: 2 }} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text variant="small">Remote</Text>
                <Text variant="caption" tone="tertiary">
                  Performed on the devotee’s behalf. No travel.
                </Text>
              </View>
            </Row>
          ) : (
            <Row gap={space.md} align="flex-start">
              <Icon name="location-outline" size={16} color={t.fg.tertiary} style={{ marginTop: 2 }} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text variant="small">{booking.fullAddress ?? booking.locality}</Text>
                <Text variant="caption" tone="tertiary">
                  {booking.distanceKm} km · about {booking.travelMinutes} minutes
                </Text>
              </View>
            </Row>
          )}
        </View>
      </Card>

      {!isRemote && !done && !dead ? (
        <Button
          label="Open in Maps"
          variant="secondary"
          icon="navigate-outline"
          onPress={() => showToast('Maps opens on a real device', 'info')}
        />
      ) : null}

      <Section title="Devotee">
        <ListGroup>
          <ListRow
            first
            icon="person-outline"
            title={booking.devotee.name}
            subtitle={
              booking.devotee.bookingOnBehalfOf
                ? `Booking for ${booking.devotee.bookingOnBehalfOf} · ${booking.devotee.attendeeName} will be present`
                : booking.devotee.phoneMasked
            }
            chevron={false}
          />
          <ListRow
            icon="call-outline"
            iconTone="brand"
            title="Call"
            subtitle="Your number stays private"
            onPress={() => showToast('Masked call connects on a real device', 'info')}
          />
          <ListRow
            last
            icon="chatbubble-ellipses-outline"
            iconTone="brand"
            title="Message"
            onPress={() => router.push(`/booking/${booking.id}/chat`)}
          />
        </ListGroup>
      </Section>

      <Section title="Ceremony details">
        <Card>
          <View style={{ gap: space.md }}>
            <Row justify="space-between">
              <Text variant="small" tone="secondary">
                Gotra
              </Text>
              <Text variant="smallStrong" tone={booking.gotra ? 'primary' : 'warning'}>
                {booking.gotra ?? 'Not provided'}
              </Text>
            </Row>
            <Row justify="space-between">
              <Text variant="small" tone="secondary">
                Nakshatra
              </Text>
              <Text variant="smallStrong" tone={booking.nakshatra ? 'primary' : 'warning'}>
                {booking.nakshatra ?? 'Not provided'}
              </Text>
            </Row>
          </View>
        </Card>
      </Section>

      {!done && !dead ? (
        <Section title="Preparation">
          <ListGroup>
            <ListRow
              first
              last
              icon="list-outline"
              iconTone="brand"
              title="Preparation checklist"
              subtitle={`${booking.checklistDone.length} of ${checklistTotal} ready`}
              onPress={() => router.push(`/booking/${booking.id}/checklist`)}
            />
          </ListGroup>
        </Section>
      ) : null}

      {booking.samagriStatus === 'pending' && !done && !dead ? (
        <Banner
          tone="warning"
          title="The samagri kit has not been delivered yet"
          body="We're tracking it. If it hasn't arrived 24 hours before the ceremony, both you and our team are alerted."
        />
      ) : null}

      <Section title="Payment">
        <Card>
          <View style={{ gap: space.sm }}>
            <Row justify="space-between">
              <Text variant="small" tone="secondary">
                Booking value
              </Text>
              <Money value={booking.gross} variant="smallStrong" tone="secondary" />
            </Row>
            <Row justify="space-between">
              <Text variant="small" tone="secondary">
                Commission (15%)
              </Text>
              <Text variant="smallStrong" tone="secondary" numeric>
                −₹{commissionOf(booking).toLocaleString('en-IN')}
              </Text>
            </Row>
            <Divider />
            <Row justify="space-between" align="center">
              <Text variant="title">You receive</Text>
              <Money value={netOf(booking)} variant="numeric" />
            </Row>
            <Text variant="caption" tone="tertiary">
              {booking.status === 'settled'
                ? 'Paid out in your weekly settlement.'
                : done
                  ? 'Included in your next weekly payout.'
                  : 'Paid out the week after the ceremony is completed.'}
            </Text>
          </View>
        </Card>
      </Section>

      {!done && !dead ? (
        <Section title="Changes">
          <ListGroup>
            <ListRow
              first
              icon="calendar-outline"
              title="Request a different time"
              onPress={() => router.push(`/booking/${booking.id}/reschedule`)}
            />
            <ListRow
              last
              icon="close-circle-outline"
              iconTone="error"
              destructive
              title="Cancel this booking"
              onPress={() => router.push(`/booking/${booking.id}/cancel`)}
            />
          </ListGroup>
        </Section>
      ) : null}

      <Section title="Support">
        <ListGroup>
          <ListRow
            first
            last
            icon="warning-outline"
            iconTone="error"
            title="Report a safety concern"
            subtitle="Unsafe location, inappropriate request, or off-platform payment"
            onPress={() => router.push('/safety')}
          />
        </ListGroup>
      </Section>
    </Screen>
  );
}
