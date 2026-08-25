import { useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Icon, type IconName } from '@/ui/Icon';
import { useSession } from '@/store/session';
import { useColors } from '@/ui/ThemeProvider';
import { AppBar, Screen, Section, Sheet } from '@/ui/layout';
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
import { Chip, Input } from '@/ui/forms';
import { useAsync, useNow } from '@/lib/useAsync';
import * as repo from '@/data/repository';
import { DECLINE_REASONS, PRE_ACCEPT_QUESTIONS, poojaById } from '@/data/fixtures/catalog';
import {
  commissionOf,
  countdown,
  duration,
  fullDate,
  netOf,
  time,
} from '@/lib/format';
import { radius, space } from '@/ui/tokens';
import type { ConflictWarning } from '@/data/types';

export default function RequestDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showToast } = useSession();
  const t = useColors();
  const nowMs = useNow(1000);

  const { data: booking, loading } = useAsync(() => repo.getBooking(String(id)), [id]);
  const [conflicts, setConflicts] = useState<ConflictWarning[] | null>(null);
  const [showAccept, setShowAccept] = useState(false);
  const [showDecline, setShowDecline] = useState(false);
  const [showAsk, setShowAsk] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [busy, setBusy] = useState(false);
  const [paused, setPaused] = useState(false);

  if (loading || !booking) {
    return (
      <Screen header={<AppBar title="Request" />}>
        <Card>
          <View style={{ gap: space.md }}>
            <Skeleton height={26} width="60%" />
            <Skeleton height={16} width="80%" />
            <Skeleton height={16} width="45%" />
          </View>
        </Card>
      </Screen>
    );
  }

  const pooja = poojaById(booking.poojaId);
  const cd = booking.expiresAt ? countdown(booking.expiresAt, nowMs) : null;
  const isRemote = booking.serviceType === 'remote';
  const blocking = conflicts?.some((c) => c.severity === 'block');
  const missingGotra = !booking.gotra;
  const missingNakshatra = !booking.nakshatra;

  const startAccept = async () => {
    setBusy(true);
    const found = await repo.detectConflicts(booking.id);
    setConflicts(found);
    setBusy(false);
    setShowAccept(true);
  };

  const confirmAccept = async () => {
    setBusy(true);
    await repo.acceptBooking(booking.id);
    setBusy(false);
    setShowAccept(false);
    showToast('Booking confirmed. The devotee has been notified.');
    router.replace(`/booking/${booking.id}`);
  };

  return (
    <Screen
      header={<AppBar title={pooja?.name} subtitle={booking.reference} />}
      footer={
        <>
          <Row gap={space.md}>
            <Button
              label="Decline"
              variant="secondary"
              onPress={() => setShowDecline(true)}
              style={{ flex: 1 }}
            />
            <Button
              label="Accept"
              loading={busy && !showAccept}
              onPress={() => void startAccept()}
              style={{ flex: 1.4 }}
            />
          </Row>
          <Button label="Ask a question first" variant="ghost" onPress={() => setShowAsk(true)} />
        </>
      }>
      {/* Countdown — unmissable, never buried. */}
      {cd ? (
        <Card
          padded={false}
          elevated={false}
          style={{
            backgroundColor: paused ? t.status.infoBg : cd.urgent ? t.status.urgentBg : t.bg.sunken,
            borderWidth: 0,
          }}>
          <Row
            gap={space.sm}
            align="center"
            justify="center"
            style={{ paddingVertical: space.md }}>
            <Icon
              name={paused ? 'pause-circle' : 'time'}
              size={16}
              color={paused ? t.status.infoFg : cd.urgent ? t.status.urgentFg : t.fg.secondary}
            />
            <Text
              variant="smallStrong"
              style={{
                color: paused ? t.status.infoFg : cd.urgent ? t.status.urgentFg : t.fg.secondary,
              }}
              numeric>
              {paused
                ? 'Paused while you wait for a reply'
                : cd.expired
                  ? 'This request has expired'
                  : `Respond within ${cd.text}`}
            </Text>
          </Row>
        </Card>
      ) : null}

      {/* Earnings before acceptance — the pujari never computes their own pay. */}
      <Card style={{ backgroundColor: t.bg.brandTint }} elevated={false}>
        <View style={{ gap: space.md }}>
          <Row justify="space-between" align="center">
            <Text variant="micro" tone="brand">
              You receive
            </Text>
            <StatusPill label="Fixed rate" tone="brand" size="sm" icon="lock-closed" />
          </Row>
          <Money value={netOf(booking)} variant="numericLarge" tone="brand" />
          <Divider />
          <Row justify="space-between">
            <Text variant="small" tone="secondary">
              Booking value
            </Text>
            <Money value={booking.gross} variant="smallStrong" tone="secondary" />
          </Row>
          <Row justify="space-between">
            <Text variant="small" tone="secondary">
              Sankalpam commission (15%)
            </Text>
            <Text variant="smallStrong" tone="secondary" numeric>
              −₹{commissionOf(booking).toLocaleString('en-IN')}
            </Text>
          </Row>
        </View>
      </Card>

      <Section title="Ceremony">
        <Card>
          <View style={{ gap: space.md }}>
            <DetailRow icon="calendar-outline" label="Date" value={fullDate(booking.scheduledAt)} />
            <DetailRow
              icon="time-outline"
              label="Muhurtham"
              value={`${time(booking.scheduledAt)} · ${duration(booking.durationMinutes)}`}
            />
            <DetailRow
              icon={isRemote ? 'globe-outline' : 'location-outline'}
              label={isRemote ? 'Service' : 'Location'}
              value={
                isRemote
                  ? 'Remote — performed on the devotee’s behalf'
                  : `${booking.locality} · ${booking.distanceKm} km · about ${booking.travelMinutes} min`
              }
            />
            {!isRemote ? (
              <Text variant="caption" tone="tertiary">
                The exact address is shared once you accept.
              </Text>
            ) : null}
          </View>
        </Card>
      </Section>

      <Section title="Devotee">
        <Card>
          <View style={{ gap: space.md }}>
            <DetailRow icon="person-outline" label="Booked by" value={booking.devotee.name} />
            {booking.devotee.bookingOnBehalfOf ? (
              <DetailRow
                icon="people-outline"
                label="Booking for"
                value={`${booking.devotee.bookingOnBehalfOf} · ${booking.devotee.attendeeName} will be present`}
              />
            ) : null}
            <DetailRow
              icon="chatbubble-ellipses-outline"
              label="Language"
              value={
                booking.devotee.language === 'te'
                  ? 'Telugu'
                  : booking.devotee.language === 'hi'
                    ? 'Hindi'
                    : 'English'
              }
            />
            <DetailRow icon="git-branch-outline" label="Gotra" value={booking.gotra ?? 'Not provided'} />
            <DetailRow
              icon="star-outline"
              label="Nakshatra"
              value={booking.nakshatra ?? 'Not provided'}
            />
            {booking.familyNotes ? (
              <DetailRow icon="document-text-outline" label="Note" value={booking.familyNotes} />
            ) : null}
          </View>
        </Card>
      </Section>

      {/* Missing devotee data is flagged, not hidden — it becomes the pujari's
          problem at the ceremony, so it is their information now. */}
      {missingGotra && isRemote ? (
        <Banner
          tone="error"
          title="Gotra is missing"
          body="A Remote booking cannot be performed without the gotra. Ask before accepting."
          actionLabel="Ask the devotee"
          onAction={() => setShowAsk(true)}
        />
      ) : missingNakshatra || missingGotra ? (
        <Banner
          tone="warning"
          title={missingGotra ? 'Gotra not provided' : 'Nakshatra not provided'}
          body="You can ask the devotee now, or collect it when you arrive."
          actionLabel="Ask the devotee"
          onAction={() => setShowAsk(true)}
        />
      ) : null}

      <Section title="Samagri">
        <Card>
          <View style={{ gap: space.md }}>
            <Row justify="space-between" align="center">
              <Text variant="small" tone="secondary">
                Responsibility
              </Text>
              <StatusPill
                label={
                  booking.samagriStatus === 'delivered'
                    ? 'Kit delivered'
                    : booking.samagriStatus === 'pending'
                      ? 'Kit not yet delivered'
                      : 'Not applicable'
                }
                tone={
                  booking.samagriStatus === 'delivered'
                    ? 'success'
                    : booking.samagriStatus === 'pending'
                      ? 'warning'
                      : 'neutral'
                }
                icon={booking.samagriStatus === 'delivered' ? 'checkmark-circle' : 'time'}
                size="sm"
              />
            </Row>
            <Divider />
            <View style={{ gap: 6 }}>
              <Text variant="micro" tone="tertiary">
                You bring
              </Text>
              <Text variant="small" tone="secondary">
                {pooja?.pujariBrings.join(' · ')}
              </Text>
            </View>
            <View style={{ gap: 6 }}>
              <Text variant="micro" tone="tertiary">
                Devotee provides
              </Text>
              <Text variant="small" tone="secondary">
                {pooja?.devoteeProvides.join(' · ')}
              </Text>
            </View>
          </View>
        </Card>
      </Section>

      {/* ---------------------------------------------------- accept sheet */}
      <Sheet
        visible={showAccept}
        onClose={() => setShowAccept(false)}
        title={blocking ? 'This clashes with a confirmed booking' : 'Confirm this booking'}
        footer={
          <>
            <Button
              label={blocking ? 'Accept anyway' : 'Confirm'}
              variant={blocking ? 'danger' : 'primary'}
              loading={busy}
              onPress={() => void confirmAccept()}
            />
            <Button label="Go back" variant="ghost" onPress={() => setShowAccept(false)} />
          </>
        }>
        {conflicts && conflicts.length > 0 ? (
          <View style={{ gap: space.md }}>
            {conflicts.map((c, i) => (
              <Banner
                key={i}
                tone={c.severity === 'block' ? 'error' : 'warning'}
                title={c.title}
                body={c.detail}
              />
            ))}
            <Text variant="caption" tone="tertiary">
              We’ll never stop you accepting — you may know a route or a shortcut we don’t. But
              please be sure you can reach both.
            </Text>
          </View>
        ) : (
          <View style={{ gap: space.md }}>
            <Text variant="body" tone="secondary">
              You’re committing to perform {pooja?.name} on {fullDate(booking.scheduledAt)} at{' '}
              {time(booking.scheduledAt)}.
            </Text>
            <View
              style={{ padding: space.md, borderRadius: radius.md, backgroundColor: t.bg.sunken, gap: 6 }}>
              <Row justify="space-between">
                <Text variant="small" tone="secondary">
                  You receive
                </Text>
                <Money value={netOf(booking)} variant="smallStrong" />
              </Row>
              <Text variant="caption" tone="tertiary">
                Cancelling a confirmed booking affects your standing. The full policy is shown
                before any cancellation is confirmed.
              </Text>
            </View>
          </View>
        )}
      </Sheet>

      {/* --------------------------------------------------- decline sheet */}
      <Sheet
        visible={showDecline}
        onClose={() => setShowDecline(false)}
        title="Why are you declining?"
        footer={
          <>
            <Button
              label="Decline request"
              variant="danger"
              disabled={!reason}
              loading={busy}
              onPress={async () => {
                setBusy(true);
                await repo.declineBooking(booking.id, reason!);
                setBusy(false);
                setShowDecline(false);
                showToast('Request declined', 'info');
                router.back();
              }}
            />
            <Button label="Cancel" variant="ghost" onPress={() => setShowDecline(false)} />
          </>
        }>
        <Text variant="small" tone="secondary">
          Declining never counts against you. This helps us send you better-matched requests.
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
          {DECLINE_REASONS.map((r) => (
            <Chip
              key={r.id}
              label={r.label}
              selected={reason === r.id}
              onPress={() => setReason(r.id)}
            />
          ))}
        </View>
      </Sheet>

      {/* ------------------------------------------------------- ask sheet */}
      <Sheet
        visible={showAsk}
        onClose={() => setShowAsk(false)}
        title="Ask before you accept"
        footer={
          <>
            <Button
              label="Send question"
              disabled={question.trim().length < 3}
              onPress={async () => {
                await repo.sendMessage(booking.id, question);
                setShowAsk(false);
                setQuestion('');
                setPaused(true);
                showToast('Question sent. Your response time is paused.');
              }}
            />
            <Button label="Cancel" variant="ghost" onPress={() => setShowAsk(false)} />
          </>
        }>
        <Text variant="small" tone="secondary">
          Your time to respond pauses while you wait for the devotee’s reply.
        </Text>
        <View style={{ gap: space.sm }}>
          {PRE_ACCEPT_QUESTIONS.map((q) => (
            <Chip key={q} label={q} selected={question === q} onPress={() => setQuestion(q)} size="sm" />
          ))}
        </View>
        <Input value={question} onChangeText={setQuestion} placeholder="Or type your own" multiline />
      </Sheet>
    </Screen>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: IconName;
  label: string;
  value: string;
}) {
  const t = useColors();
  const missing = value === 'Not provided';
  return (
    <Row gap={space.md} align="flex-start">
      <Icon name={icon} size={16} color={t.fg.tertiary} style={{ marginTop: 2 }} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="micro" tone="tertiary">
          {label}
        </Text>
        <Text variant="small" tone={missing ? 'warning' : 'primary'}>
          {value}
        </Text>
      </View>
    </Row>
  );
}
