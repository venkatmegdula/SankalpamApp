import { View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from '@/ui/Icon';
import { useColors } from '@/ui/ThemeProvider';
import { AppBar, Screen } from '@/ui/layout';
import { Button, Row, Text } from '@/ui/primitives';
import { radius, space } from '@/ui/tokens';
import { AssistedHelpLink } from '@/components/AssistedHelpLink';

/**
 * The four-stage explainer. Honest expectations up front: the waiting period is
 * where applicants are lost, and it is far better to name it now than to let
 * someone discover it on day four.
 */
const STAGES = [
  {
    n: 1,
    title: 'Documents & identity',
    time: '30 minutes now, then 2–3 business days',
    body: 'Your details, the poojas you perform, and six documents. We verify each one.',
  },
  {
    n: 2,
    title: 'Competency conversation',
    time: 'About 30 minutes, scheduled with you',
    body: 'A Sankalpam team member talks through your top poojas and samagri. A conversation, not an exam.',
  },
  {
    n: 3,
    title: 'Supervised pooja',
    time: 'One ceremony, arranged with you',
    body: 'You perform one pooja while a Sankalpam representative observes.',
  },
  {
    n: 4,
    title: 'Agreement & go live',
    time: 'Same day',
    body: 'Accept the partner agreement, confirm your public profile, and start receiving bookings.',
  },
];

export default function ApplyIntro() {
  const t = useColors();

  return (
    <Screen
      header={<AppBar onBack={false} />}
      footer={
        <>
          <Button label="Start my application" onPress={() => router.push('/apply/about')} />
          <AssistedHelpLink />
        </>
      }>
      <View style={{ gap: space.sm }}>
        <Text variant="h1">How joining works</Text>
        <Text variant="body" tone="secondary">
          Four stages, in order. Most pujaris are live within one to three weeks.
        </Text>
      </View>

      <View style={{ gap: space.sm, marginTop: space.sm }}>
        {STAGES.map((s, i) => (
          <View key={s.n} style={{ flexDirection: 'row', gap: space.base }}>
            <View style={{ alignItems: 'center', width: 30 }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: t.bg.brandTint,
                }}>
                <Text variant="smallStrong" tone="brand" numeric>
                  {s.n}
                </Text>
              </View>
              {i < STAGES.length - 1 ? (
                <View style={{ flex: 1, width: 2, backgroundColor: t.line.default, marginTop: 4 }} />
              ) : null}
            </View>
            <View style={{ flex: 1, paddingBottom: space.lg, gap: 4 }}>
              <Text variant="title">{s.title}</Text>
              <Row gap={5} align="center">
                <Icon name="time-outline" size={13} color={t.fg.tertiary} />
                <Text variant="caption" tone="tertiary">
                  {s.time}
                </Text>
              </Row>
              <Text variant="small" tone="secondary" style={{ marginTop: 2 }}>
                {s.body}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View
        style={{
          padding: space.base,
          borderRadius: radius.md,
          backgroundColor: t.bg.sunken,
          gap: 6,
        }}>
        <Text variant="smallStrong">Have these ready</Text>
        <Text variant="small" tone="secondary">
          Aadhaar · address proof · passport photograph · proof of training or lineage · PAN ·
          cancelled cheque or passbook
        </Text>
        <Text variant="caption" tone="tertiary" style={{ marginTop: 2 }}>
          Your progress is saved after every step. You can stop and come back at any time.
        </Text>
      </View>
    </Screen>
  );
}
