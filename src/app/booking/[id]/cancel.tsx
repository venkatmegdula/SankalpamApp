import { useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Icon, type IconName } from '@/ui/Icon';
import { useSession } from '@/store/session';
import { useColors } from '@/ui/ThemeProvider';
import { AppBar, Screen, Section } from '@/ui/layout';
import { Banner, Button, Card, Row, Text } from '@/ui/primitives';
import { Chip } from '@/ui/forms';
import { useAsync, useNow } from '@/lib/useAsync';
import * as repo from '@/data/repository';
import { CANCEL_REASONS, poojaById } from '@/data/fixtures/catalog';
import { fullDate, time } from '@/lib/format';
import { space } from '@/ui/tokens';

/**
 * Consequences are stated in full BEFORE the cancellation is confirmed.
 * Vague or surprising penalties are the fastest route to churn, so nothing here
 * is softened or hidden.
 */
export default function Cancel() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showToast } = useSession();
  const t = useColors();
  const { data: booking } = useAsync(() => repo.getBooking(String(id)), [id]);
  const [reason, setReason] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const pooja = booking ? poojaById(booking.poojaId) : undefined;
  // `now` comes from state, not a bare Date.now() during render — the notice
  // period must stay stable across re-renders rather than drifting.
  const nowMs = useNow(30_000);
  const hoursNotice = booking
    ? Math.max(0, Math.round((new Date(booking.scheduledAt).getTime() - nowMs) / 3_600_000))
    : 0;
  const shortNotice = hoursNotice < 48;

  const CONSEQUENCES = [
    {
      icon: 'time-outline' as const,
      label: 'Notice given',
      value: `${hoursNotice} hours before the muhurtham`,
    },
    {
      icon: 'star-outline' as const,
      label: 'Effect on your rating',
      value: shortNotice
        ? 'Recorded on your profile as a short-notice cancellation'
        : 'No effect at this notice period',
    },
    {
      icon: 'cash-outline' as const,
      label: 'Penalty',
      value: shortNotice ? '₹250, deducted from your next payout' : 'None',
    },
    {
      icon: 'repeat-outline' as const,
      label: 'Repeated cancellations',
      value: 'May lead to a review of your standing on the platform',
    },
  ];

  return (
    <Screen
      header={<AppBar title="Cancel booking" />}
      footer={
        <>
          <Button
            label="Confirm cancellation"
            variant="danger"
            disabled={!reason}
            loading={busy}
            onPress={async () => {
              if (!booking) return;
              setBusy(true);
              await repo.cancelBooking(booking.id, reason!);
              setBusy(false);
              showToast('Booking cancelled. Our team is reassigning it.', 'info');
              router.replace('/(tabs)');
            }}
          />
          <Button label="Keep this booking" variant="ghost" onPress={() => router.back()} />
        </>
      }>
      <Card>
        <View style={{ gap: 4 }}>
          <Text variant="micro" tone="tertiary">
            You are cancelling
          </Text>
          <Text variant="h3">{pooja?.name}</Text>
          <Text variant="small" tone="secondary">
            {booking ? `${fullDate(booking.scheduledAt)} · ${time(booking.scheduledAt)}` : ''}
          </Text>
          <Text variant="small" tone="secondary">
            {booking?.devotee.name} · {booking?.locality}
          </Text>
        </View>
      </Card>

      <Banner
        tone={shortNotice ? 'error' : 'warning'}
        title={shortNotice ? 'This is a short-notice cancellation' : 'Before you cancel'}
        body={
          shortNotice
            ? 'The devotee has arranged their family and the muhurtham around this booking. Our team will try to find a replacement, but it may not be possible at this notice.'
            : 'Our operations team will reassign this booking to another verified pujari.'
        }
      />

      <Section title="What this means">
        <Card>
          <View style={{ gap: space.base }}>
            {CONSEQUENCES.map((c) => (
              <Row key={c.label} gap={space.md} align="flex-start">
                <Icon name={c.icon} size={16} color={t.fg.tertiary} style={{ marginTop: 2 }} />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text variant="micro" tone="tertiary">
                    {c.label}
                  </Text>
                  <Text variant="small">{c.value}</Text>
                </View>
              </Row>
            ))}
          </View>
        </Card>
      </Section>

      <Section title="Why are you cancelling?">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
          {CANCEL_REASONS.map((r) => (
            <Chip
              key={r.id}
              label={r.label}
              selected={reason === r.id}
              onPress={() => setReason(r.id)}
            />
          ))}
        </View>
      </Section>

      <Text variant="caption" tone="tertiary">
        If this is a safety concern, report it instead — that never counts against you.
      </Text>
      <Button
        label="Report a safety concern"
        variant="secondary"
        size="sm"
        icon="warning-outline"
        onPress={() => router.push('/safety')}
      />
    </Screen>
  );
}
