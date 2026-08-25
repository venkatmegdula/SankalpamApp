import { View } from 'react-native';
import { Icon, type IconName } from '@/ui/Icon';
import { useColors } from '@/ui/ThemeProvider';
import { AppBar, Screen } from '@/ui/layout';
import { Card, Row, Text } from '@/ui/primitives';
import { radius, space } from '@/ui/tokens';

const STEPS = [
  {
    icon: 'notifications-outline' as const,
    title: 'A request arrives',
    body: 'A devotee in your zone books a pooja you perform, at a time you are available. You get a push notification and an SMS.',
  },
  {
    icon: 'eye-outline' as const,
    title: 'You see everything before deciding',
    body: 'The ceremony, the muhurtham, the area, the travel time, and exactly what reaches your bank after commission. The exact address stays private until you accept.',
  },
  {
    icon: 'checkmark-circle-outline' as const,
    title: 'Accept or decline',
    body: 'We check your calendar first and warn you about clashes or tight travel. Declining is always fine and never counts against you.',
  },
  {
    icon: 'list-outline' as const,
    title: 'Prepare',
    body: 'A checklist shows what you bring and what the devotee or the samagri kit provides, so nothing is ambiguous on the day.',
  },
  {
    icon: 'navigate-outline' as const,
    title: 'Travel and arrive',
    body: 'Tap "I\'m on my way" and the devotee sees your estimated arrival. Running late? Telling them takes one tap.',
  },
  {
    icon: 'shield-checkmark-outline' as const,
    title: 'Check in',
    body: 'The devotee reads you a 4-digit code. If it does not arrive or they are not there, there are fallbacks — the app never blocks the ceremony.',
  },
  {
    icon: 'flame-outline' as const,
    title: 'Perform the ceremony',
    body: 'The app goes quiet. Notifications are paused, one screen, one button. Only the devotee can reach you.',
  },
  {
    icon: 'wallet-outline' as const,
    title: 'Get paid',
    body: 'Mark it complete and your earnings enter the next weekly payout, with a full statement showing the arithmetic.',
  },
];

export default function HowItWorks() {
  const t = useColors();

  return (
    <Screen header={<AppBar title="How bookings work" />}>
      <Text variant="body" tone="secondary">
        From the moment a devotee books to the moment you are paid.
      </Text>

      <View style={{ gap: space.sm }}>
        {STEPS.map((s, i) => (
          <Row key={s.title} gap={space.base} align="flex-start">
            <View style={{ alignItems: 'center', width: 38 }}>
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: radius.sm,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: t.bg.brandTint,
                }}>
                <Icon name={s.icon} size={18} color={t.fg.brand} />
              </View>
              {i < STEPS.length - 1 ? (
                <View style={{ flex: 1, width: 2, backgroundColor: t.line.default, marginTop: 4 }} />
              ) : null}
            </View>
            <View style={{ flex: 1, gap: 4, paddingBottom: space.lg }}>
              <Text variant="title">{s.title}</Text>
              <Text variant="small" tone="secondary">
                {s.body}
              </Text>
            </View>
          </Row>
        ))}
      </View>

      <Card style={{ backgroundColor: t.bg.accentTint }} elevated={false}>
        <View style={{ gap: 4 }}>
          <Text variant="micro" tone="accent">
            One thing that never changes
          </Text>
          <Text variant="small" tone="secondary">
            All payments go through Sankalpam. If a devotee asks to pay you directly, decline and
            report it — that protects your standing and theirs.
          </Text>
        </View>
      </Card>
    </Screen>
  );
}
