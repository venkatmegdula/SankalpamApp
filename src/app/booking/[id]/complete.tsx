import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Icon, type IconName } from '@/ui/Icon';
import { Appear } from '@/components/Appear';
import { useSession } from '@/store/session';
import { useColors } from '@/ui/ThemeProvider';
import { Screen } from '@/ui/layout';
import { Banner, Button, Card, Divider, Money, Row, Text } from '@/ui/primitives';
import { Checkbox } from '@/ui/forms';
import { useAsync } from '@/lib/useAsync';
import * as repo from '@/data/repository';
import { poojaById } from '@/data/fixtures/catalog';
import { commissionOf, duration, netOf } from '@/lib/format';
import { radius, space } from '@/ui/tokens';

export default function Complete() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showToast } = useSession();
  const t = useColors();
  const { data: booking } = useAsync(() => repo.getBooking(String(id)), [id]);
  const [consent, setConsent] = useState(false);
  const [photoAdded, setPhotoAdded] = useState(false);

  const pooja = booking ? poojaById(booking.poojaId) : undefined;
  const isRemote = booking?.serviceType === 'remote';

  return (
    <Screen
      header={null}
      footer={
        <Button
          label="Done"
          onPress={() => {
            showToast('Ceremony recorded');
            router.replace('/(tabs)');
          }}
        />
      }>
      <Appear style={{ alignItems: 'center', gap: space.base, paddingTop: space.xl }}>
        <View
          style={{
            width: 68,
            height: 68,
            borderRadius: 34,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: t.status.successBg,
          }}>
          <Icon name="checkmark" size={34} color={t.status.successFg} />
        </View>
        <View style={{ gap: 6, alignItems: 'center' }}>
          <Text variant="h2" center>
            Ceremony complete
          </Text>
          <Text variant="small" tone="secondary" center>
            {booking?.devotee.name} has been notified and asked to rate it.
          </Text>
        </View>
      </Appear>

      <Card>
        <View style={{ gap: space.md }}>
          <Row justify="space-between">
            <Text variant="small" tone="secondary">
              Ceremony
            </Text>
            <Text variant="smallStrong">{pooja?.name}</Text>
          </Row>
          <Row justify="space-between">
            <Text variant="small" tone="secondary">
              Duration
            </Text>
            <Text variant="smallStrong" numeric>
              {duration(booking?.durationMinutes ?? 0)}
            </Text>
          </Row>
          <Divider />
          <Row justify="space-between">
            <Text variant="small" tone="secondary">
              Booking value
            </Text>
            <Money value={booking?.gross ?? 0} variant="smallStrong" tone="secondary" />
          </Row>
          <Row justify="space-between">
            <Text variant="small" tone="secondary">
              Commission (15%)
            </Text>
            <Text variant="smallStrong" tone="secondary" numeric>
              −₹{booking ? commissionOf(booking).toLocaleString('en-IN') : 0}
            </Text>
          </Row>
          <Divider />
          <Row justify="space-between" align="center">
            <Text variant="title">You receive</Text>
            <Money value={booking ? netOf(booking) : 0} variant="numeric" />
          </Row>
          <Text variant="caption" tone="tertiary">
            Included in your next weekly payout.
          </Text>
        </View>
      </Card>

      {/* Consent gate — the code of conduct forbids photographs of a devotee's
          household without explicit permission, so the app must ask and record it. */}
      <Card>
        <View style={{ gap: space.md }}>
          <View style={{ gap: 3 }}>
            <Text variant="title">
              {isRemote ? 'Proof of performance' : 'Add a photo for the devotee'}
            </Text>
            <Text variant="caption" tone="tertiary">
              {isRemote
                ? 'The devotee was not present, so a photo or recording is their only assurance the Archana was performed.'
                : 'Optional. Only with the family’s permission.'}
            </Text>
          </View>

          {!isRemote ? (
            <Checkbox
              checked={consent}
              onChange={setConsent}
              label="The family has agreed to a photograph"
              sublabel="Required by the code of conduct"
            />
          ) : null}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add photo"
            disabled={!isRemote && !consent}
            onPress={() => {
              setPhotoAdded(true);
              showToast('Photo added');
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: space.sm,
              paddingVertical: space.base,
              borderRadius: radius.md,
              borderWidth: 1.5,
              borderStyle: 'dashed',
              borderColor: photoAdded ? t.status.successFg : t.line.strong,
              opacity: !isRemote && !consent ? 0.4 : 1,
            }}>
            <Icon
              name={photoAdded ? 'checkmark-circle' : 'camera-outline'}
              size={19}
              color={photoAdded ? t.status.successFg : t.fg.brand}
            />
            <Text variant="smallStrong" tone={photoAdded ? 'success' : 'brand'}>
              {photoAdded ? 'Photo added' : isRemote ? 'Add photo or recording' : 'Add photo'}
            </Text>
          </Pressable>
        </View>
      </Card>

      {isRemote && !photoAdded ? (
        <Banner
          tone="warning"
          title="Proof is required for Remote bookings"
          body="Without it the devotee has no confirmation the Archana took place, and disputes are far more likely."
        />
      ) : null}
    </Screen>
  );
}
