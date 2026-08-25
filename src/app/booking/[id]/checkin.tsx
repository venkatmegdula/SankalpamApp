import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Icon, type IconName } from '@/ui/Icon';
import { Appear } from '@/components/Appear';
import { useSession } from '@/store/session';
import { useColors } from '@/ui/ThemeProvider';
import { AppBar, Screen, Sheet } from '@/ui/layout';
import { Banner, Button, Card, Row, Text } from '@/ui/primitives';
import { useAsync } from '@/lib/useAsync';
import * as repo from '@/data/repository';
import { poojaById } from '@/data/fixtures/catalog';
import { time } from '@/lib/format';
import { radius, space, type as typeScale } from '@/ui/tokens';

const LEN = 4;

/**
 * Check-in happens at a doorstep, in front of a waiting family, and must not be
 * awkward. Every failure path ends in a way that lets the ceremony begin — the
 * app must never be the thing that blocks the ritual.
 */
export default function CheckIn() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showToast, offline } = useSession();
  const t = useColors();
  const { data: booking } = useAsync(() => repo.getBooking(String(id)), [id]);

  const [arrived, setArrived] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [lateOpen, setLateOpen] = useState(false);

  const pooja = booking ? poojaById(booking.poojaId) : undefined;

  const verify = async (value: string) => {
    if (!booking) return;
    setBusy(true);
    setError(null);
    const res = await repo.verifyCheckInOtp(booking.id, value);
    setBusy(false);
    if (!res.ok) {
      setError(res.message);
      setCode('');
      return;
    }
    router.replace(`/booking/${booking.id}/ceremony`);
  };

  const fallback = async (message: string) => {
    if (!booking) return;
    setBusy(true);
    await repo.verifyWithOps(booking.id);
    setBusy(false);
    setHelpOpen(false);
    showToast(message);
    router.replace(`/booking/${booking.id}/ceremony`);
  };

  if (!arrived) {
    return (
      <Screen
        header={<AppBar title="Arriving" subtitle={pooja?.name} />}
        footer={
          <>
            <Button
              label="I have arrived"
              icon="location"
              onPress={async () => {
                if (booking) await repo.setBookingStatus(booking.id, 'arrived');
                setArrived(true);
              }}
            />
            <Button
              label="Tell the devotee I'm delayed"
              variant="ghost"
              onPress={() => setLateOpen(true)}
            />
          </>
        }>
        <Card>
          <View style={{ gap: space.md }}>
            <Text variant="micro" tone="tertiary">
              On the way to
            </Text>
            <Text variant="h3">{booking?.fullAddress ?? booking?.locality}</Text>
            <Row gap={space.md}>
              <Row gap={5} align="center">
                <Icon name="time-outline" size={14} color={t.fg.tertiary} />
                <Text variant="caption" tone="secondary">
                  Muhurtham {booking ? time(booking.scheduledAt) : ''}
                </Text>
              </Row>
              <Row gap={5} align="center">
                <Icon name="navigate-outline" size={14} color={t.fg.tertiary} />
                <Text variant="caption" tone="secondary">
                  {booking?.distanceKm} km
                </Text>
              </Row>
            </Row>
          </View>
        </Card>

        <Button
          label="Open in Maps"
          variant="secondary"
          icon="navigate-outline"
          onPress={() => showToast('Maps opens on a real device', 'info')}
        />

        <Banner
          tone="info"
          title="The devotee knows you're coming"
          body="They were notified when you set off, with your estimated arrival time."
        />

        <Sheet
          visible={lateOpen}
          onClose={() => setLateOpen(false)}
          title="How late will you be?"
          footer={<Button label="Close" variant="ghost" onPress={() => setLateOpen(false)} />}>
          <Text variant="small" tone="secondary">
            Late arrival without notice is the single biggest complaint in this business. Telling
            them takes one tap.
          </Text>
          {[10, 15, 30].map((m) => (
            <Button
              key={m}
              label={`About ${m} minutes late`}
              variant="secondary"
              onPress={() => {
                setLateOpen(false);
                showToast(`The devotee has been told you're ${m} minutes away`);
              }}
            />
          ))}
        </Sheet>
      </Screen>
    );
  }

  return (
    <Screen
      header={<AppBar title="Check in" subtitle={pooja?.name} />}
      footer={
        <>
          <Button
            label="Verify and begin"
            disabled={code.length !== LEN}
            loading={busy}
            onPress={() => void verify(code)}
          />
          <Button
            label="Having trouble?"
            variant="ghost"
            onPress={() => setHelpOpen(true)}
          />
        </>
      }>
      <View style={{ gap: space.sm }}>
        <Text variant="h2">Ask the devotee for their code</Text>
        <Text variant="body" tone="secondary">
          We’ve sent a 4-digit code to {booking?.devotee.name}. This confirms you’ve arrived and
          starts the ceremony record.
        </Text>
      </View>

      <Row gap={space.md} align="center" style={{ marginTop: space.sm }}>
        {Array.from({ length: LEN }, (_, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: 68,
              borderRadius: radius.md,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: t.bg.surface,
              borderWidth: 2,
              borderColor: error
                ? t.status.errorFg
                : i === code.length
                  ? t.line.focus
                  : code[i]
                    ? t.line.strong
                    : t.line.default,
            }}>
            <Text variant="numeric" numeric>
              {code[i] ?? ''}
            </Text>
          </View>
        ))}
      </Row>

      <TextInput
        value={code}
        onChangeText={(v) => {
          const next = v.replace(/\D/g, '').slice(0, LEN);
          setCode(next);
          setError(null);
          if (next.length === LEN) void verify(next);
        }}
        keyboardType="number-pad"
        autoFocus
        maxLength={LEN}
        accessibilityLabel="Devotee verification code"
        style={[typeScale.body, { position: 'absolute', opacity: 0 }]}
      />

      {error ? (
        <Appear from="none">
          <Banner
            tone="error"
            title="That code doesn't match"
            body={error}
            actionLabel="Resend the code"
            onAction={() => showToast('Code sent again to the devotee', 'info')}
          />
        </Appear>
      ) : null}

      {offline ? (
        <Banner
          tone="warning"
          title="You're offline — check in anyway"
          body="We'll record the time now and sync it when you reconnect. The ceremony is never blocked by the app."
          actionLabel="Check in offline"
          onAction={() => void fallback('Checked in offline. It will sync shortly.')}
        />
      ) : null}

      <Card style={{ backgroundColor: t.bg.sunken }} elevated={false}>
        <Text variant="caption" tone="tertiary">
          Demo: enter 1234 to verify, or any other code to see the failure path.
        </Text>
      </Card>

      <Sheet
        visible={helpOpen}
        onClose={() => setHelpOpen(false)}
        title="Can't get the code?"
        footer={<Button label="Go back" variant="ghost" onPress={() => setHelpOpen(false)} />}>
        <Text variant="small" tone="secondary">
          Pick whichever fits. None of these delay the ceremony.
        </Text>

        <Button
          label="Resend the code to the devotee"
          variant="secondary"
          icon="refresh-outline"
          onPress={() => {
            setHelpOpen(false);
            showToast('Code sent again to the devotee', 'info');
          }}
        />
        <Button
          label="Someone else is here"
          variant="secondary"
          icon="people-outline"
          onPress={() => void fallback('Verified against the household contact')}
        />
        <Button
          label="Their phone is unreachable"
          variant="secondary"
          icon="call-outline"
          onPress={() => void fallback('Verified by Sankalpam support')}
        />
        <Button
          label="Nobody is at the address"
          variant="danger"
          icon="alert-circle-outline"
          onPress={async () => {
            if (booking) await repo.setBookingStatus(booking.id, 'no_show_devotee');
            setHelpOpen(false);
            showToast('Reported. Our team is calling the devotee now.', 'info');
            router.replace(`/booking/${String(id)}`);
          }}
        />

        <Text variant="caption" tone="tertiary">
          “Someone else is here“ checks the household contact on the booking — common when an adult
          child has booked for their parents.
        </Text>
      </Sheet>
    </Screen>
  );
}
