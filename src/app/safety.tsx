import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from '@/ui/Icon';
import { useSession } from '@/store/session';
import { useColors } from '@/ui/ThemeProvider';
import { AppBar, Screen, Section } from '@/ui/layout';
import { Banner, Button, Card, Row, Text } from '@/ui/primitives';
import { Input, RadioRow } from '@/ui/forms';
import * as repo from '@/data/repository';
import { space } from '@/ui/tokens';

const CONCERNS = [
  {
    id: 'unsafe_location',
    title: 'Unsafe location',
    subtitle: 'The address or surroundings feel unsafe',
    icon: 'location-outline' as const,
  },
  {
    id: 'inappropriate',
    title: 'Inappropriate request',
    subtitle: 'You were asked to do something you are not comfortable with',
    icon: 'hand-left-outline' as const,
  },
  {
    id: 'off_platform',
    title: 'Off-platform payment requested',
    subtitle: 'A devotee asked to pay you directly or cancel and book privately',
    icon: 'cash-outline' as const,
  },
  {
    id: 'urgent',
    title: 'I need help right now',
    subtitle: 'Our team will call you back immediately',
    icon: 'alert-circle-outline' as const,
  },
];

/**
 * Must be findable in one tap and must never feel like an accusation to open.
 * A pujari alone in a stranger's home needs this to be frictionless.
 */
export default function Safety() {
  const { showToast } = useSession();
  const t = useColors();
  const [concern, setConcern] = useState<string | null>(null);
  const [detail, setDetail] = useState('');
  const [busy, setBusy] = useState(false);

  const urgent = concern === 'urgent';

  return (
    <Screen
      header={<AppBar title="Report a safety concern" />}
      footer={
        <Button
          label={urgent ? 'Request an immediate call' : 'Send report'}
          variant={urgent ? 'danger' : 'primary'}
          disabled={!concern}
          loading={busy}
          onPress={async () => {
            setBusy(true);
            await repo.createTicket(
              'safety',
              CONCERNS.find((c) => c.id === concern)?.title ?? 'Safety concern',
              detail || 'No further detail provided.',
            );
            setBusy(false);
            showToast(
              urgent ? 'Our team is calling you now' : 'Reported. Our team will follow up.',
              'info',
            );
            router.back();
          }}
        />
      }>
      <Banner
        tone="info"
        title="Reporting never counts against you"
        body="Your standing, rating, and bookings are unaffected. The code of conduct expects you to report these."
      />

      <Section title="What's happening?">
        <View style={{ gap: space.md }}>
          {CONCERNS.map((c) => (
            <RadioRow
              key={c.id}
              selected={concern === c.id}
              onPress={() => setConcern(c.id)}
              title={c.title}
              subtitle={c.subtitle}
              icon={c.icon}
            />
          ))}
        </View>
      </Section>

      {urgent ? (
        <Banner
          tone="error"
          title="If you are in immediate danger, call 112 first"
          body="Then tell us — we'll handle the booking, the devotee, and any reassignment."
        />
      ) : null}

      <Input
        value={detail}
        onChangeText={setDetail}
        multiline
        placeholder="Anything else we should know (optional)"
      />

      <Card style={{ backgroundColor: t.bg.sunken }} elevated={false}>
        <Row gap={space.sm} align="flex-start">
          <Icon name="lock-closed-outline" size={15} color={t.fg.secondary} />
          <Text variant="caption" tone="secondary" style={{ flex: 1 }}>
            Your report goes to the Sankalpam safety team with the booking details, time, and
            location attached. It is never shared with the devotee.
          </Text>
        </Row>
      </Card>
    </Screen>
  );
}
