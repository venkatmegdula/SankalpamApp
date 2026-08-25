import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from '@/ui/Icon';
import { useSession } from '@/store/session';
import { useColors } from '@/ui/ThemeProvider';
import { AppBar, Screen, Section } from '@/ui/layout';
import { Button, Card, Row, Text } from '@/ui/primitives';
import { Chip } from '@/ui/forms';
import { at } from '@/data/fixtures/seed';
import { dayLabel } from '@/lib/format';
import { space } from '@/ui/tokens';

const SLOTS = ['09:30 am', '11:00 am', '02:00 pm', '04:30 pm', '06:00 pm'];

export default function ScheduleCall() {
  const { advance, showToast } = useSession();
  const t = useColors();
  const [day, setDay] = useState(2);
  const [slot, setSlot] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const days = [1, 2, 3, 4, 5, 6, 7];

  return (
    <Screen
      header={<AppBar title="Competency conversation" />}
      footer={
        <Button
          label="Confirm this time"
          disabled={!slot}
          loading={busy}
          onPress={async () => {
            setBusy(true);
            await advance('stage2_scheduled');
            showToast('Your conversation is booked');
            router.replace('/verification');
          }}
        />
      }>
      <View style={{ gap: space.sm }}>
        <Text variant="h2">Choose a time that suits you</Text>
        <Text variant="small" tone="secondary">
          About 30 minutes on your registered number. If you miss it you can rebook straight away —
          there’s no penalty.
        </Text>
      </View>

      <Card style={{ backgroundColor: t.bg.brandTint }} elevated={false}>
        <View style={{ gap: space.sm }}>
          <Text variant="smallStrong" tone="brand">
            What we’ll talk about
          </Text>
          {[
            'The sequence and mantras for your top 3–5 poojas',
            'The samagri each of those poojas needs',
            'How you handle common devotee questions',
            'How the Sankalpam rate card works',
          ].map((line) => (
            <Row key={line} gap={space.sm} align="flex-start">
              <Icon name="ellipse" size={5} color={t.fg.brand} style={{ marginTop: 8 }} />
              <Text variant="small" tone="secondary" style={{ flex: 1 }}>
                {line}
              </Text>
            </Row>
          ))}
          <Text variant="caption" tone="tertiary" style={{ marginTop: 2 }}>
            This is a conversation, not an exam.
          </Text>
        </View>
      </Card>

      <Section title="Day">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
          {days.map((d) => (
            <Chip
              key={d}
              label={dayLabel(at(d, 11, 0))}
              selected={day === d}
              onPress={() => setDay(d)}
              size="sm"
            />
          ))}
        </View>
      </Section>

      <Section title="Time">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
          {SLOTS.map((s) => (
            <Chip key={s} label={s} selected={slot === s} onPress={() => setSlot(s)} />
          ))}
        </View>
      </Section>
    </Screen>
  );
}
