import { useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Icon, type IconName } from '@/ui/Icon';
import { Appear } from '@/components/Appear';
import { Screen, Sheet } from '@/ui/layout';
import { Button, Row, Text } from '@/ui/primitives';
import { useAsync } from '@/lib/useAsync';
import * as repo from '@/data/repository';
import { poojaById } from '@/data/fixtures/catalog';
import { time } from '@/lib/format';
import { radius, space } from '@/ui/tokens';

/**
 * Ceremony mode.
 *
 * The pujari is performing a religious ritual in someone's home. Notifications
 * are suppressed, there is exactly one action, and nothing counts up — ritual
 * is not a stopwatch task. This screen is where cultural respect is either
 * demonstrated or violated, and a busy dashboard here would be a design failure
 * regardless of how it looked.
 */
export default function CeremonyMode() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: booking } = useAsync(() => repo.getBooking(String(id)), [id]);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  const pooja = booking ? poojaById(booking.poojaId) : undefined;
  const isRemote = booking?.serviceType === 'remote';

  return (
    <Screen background="#071F1A" padded={false} scroll={false}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.xl }}>
        <Appear duration={520} style={{ alignItems: 'center', gap: space.xl }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: radius.pill,
              backgroundColor: 'rgba(255,255,255,0.09)',
            }}>
            <Icon name="moon-outline" size={13} color="rgba(255,255,255,0.72)" />
            <Text variant="micro" style={{ color: 'rgba(255,255,255,0.72)' }}>
              Notifications paused
            </Text>
          </View>

          <View style={{ alignItems: 'center', gap: space.md }}>
            <Text
              variant="h1"
              center
              style={{ color: '#FFFFFF', fontSize: 30, lineHeight: 38 }}>
              {pooja?.name}
            </Text>
            <Text variant="body" center style={{ color: 'rgba(255,255,255,0.62)' }}>
              {pooja?.teluguName}
            </Text>
          </View>

          <Row gap={space.sm} align="center">
            <View
              style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#8FCDBC' }}
            />
            <Text variant="small" style={{ color: 'rgba(255,255,255,0.82)' }}>
              In progress
              {booking ? ` · began ${time(new Date().toISOString())}` : ''}
            </Text>
          </Row>

          <Text
            variant="caption"
            center
            style={{ color: 'rgba(255,255,255,0.42)', maxWidth: 260 }}>
            {isRemote
              ? "Performing on the devotee's behalf. You'll upload proof when you finish."
              : 'Only the devotee can reach you while the ceremony is in progress.'}
          </Text>
        </Appear>
      </View>

      <View style={{ padding: space.lg, gap: space.md }}>
        <Button
          label="Ceremony complete"
          variant="inverse"
          size="lg"
          onPress={() => setConfirm(true)}
        />
      </View>

      <Sheet
        visible={confirm}
        onClose={() => setConfirm(false)}
        title="Mark this ceremony complete?"
        footer={
          <>
            <Button
              label="Yes, it's complete"
              loading={busy}
              onPress={async () => {
                if (!booking) return;
                setBusy(true);
                await repo.setBookingStatus(booking.id, 'completed');
                setBusy(false);
                setConfirm(false);
                router.replace(`/booking/${booking.id}/complete`);
              }}
            />
            <Button label="Not yet" variant="ghost" onPress={() => setConfirm(false)} />
          </>
        }>
        <Text variant="body" tone="secondary">
          The devotee will be notified and asked to rate the ceremony. Your earnings enter the next
          weekly payout.
        </Text>
      </Sheet>
    </Screen>
  );
}
