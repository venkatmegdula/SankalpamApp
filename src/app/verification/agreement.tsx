import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { useSession } from '@/store/session';
import { useColors } from '@/ui/ThemeProvider';
import { AppBar, Screen } from '@/ui/layout';
import { Button, Card, Text } from '@/ui/primitives';
import { Checkbox } from '@/ui/forms';
import { radius, space } from '@/ui/tokens';

const CLAUSES: { heading: string; body: string }[] = [
  {
    heading: '1. Commission',
    body: 'Sankalpam deducts a platform commission of 15% of the booking value. The commission is deducted before payout and is shown on every booking before you accept it. There are no other deductions apart from TDS where applicable.',
  },
  {
    heading: '2. Payouts',
    body: 'Earnings are settled weekly to the bank account verified during onboarding. Where your cumulative earnings exceed the TDS threshold, payouts are held until a valid PAN is on file.',
  },
  {
    heading: '3. Pricing',
    body: 'Sankalpam publishes a fixed rate per pooja. You do not set or negotiate prices with devotees, and you may not request or accept any additional payment for a booking made through the platform.',
  },
  {
    heading: '4. Code of conduct',
    body: 'Arrive on time and in appropriate attire, bringing the personal ritual items expected for the ceremony. Treat every devotee\'s home and family with respect regardless of the size of the booking. Maintain confidentiality about devotee households — no photographs or details are shared publicly without explicit consent.',
  },
  {
    heading: '5. Off-platform bookings',
    body: 'You may not solicit direct, off-platform bookings or payments from any devotee you meet through Sankalpam. If a devotee requests this, decline and report it through the app. Reporting is expected and never counts against you.',
  },
  {
    heading: '6. Cancellations',
    body: 'Cancelling a confirmed booking affects your standing on the platform. The notice period, any applicable penalty, and the effect on your rating are shown in full before you confirm a cancellation. Repeated cancellations may lead to review.',
  },
  {
    heading: '7. Quality and review',
    body: 'Ratings are visible on your profile after every booking. Sankalpam conducts random post-booking quality calls with devotees and re-verifies documents annually. Consistently low ratings, verified complaints, or a code-of-conduct violation may result in temporary suspension pending review, or removal in serious cases. You will always be notified and given the opportunity to respond before any final decision.',
  },
  {
    heading: '8. Safety',
    body: 'Report any safety concern, unsafe location, or inappropriate request to Sankalpam support immediately. Support is reachable from any active booking in the app.',
  },
];

export default function Agreement() {
  const { advance, showToast } = useSession();
  const t = useColors();
  const [readToEnd, setReadToEnd] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <Screen
      header={<AppBar title="Partner agreement" />}
      scroll={false}
      padded={false}
      footer={
        <>
          <Checkbox
            checked={accepted}
            onChange={setAccepted}
            disabled={!readToEnd}
            label="I have read and agree to the Sankalpam Partner Agreement"
            sublabel={readToEnd ? undefined : 'Scroll to the end to enable this'}
          />
          <Button
            label="Accept and continue"
            disabled={!accepted}
            loading={busy}
            onPress={async () => {
              setBusy(true);
              await advance('stage4_profile');
              showToast('Agreement accepted');
              router.replace('/verification/profile-setup');
            }}
          />
        </>
      }>
      <ScrollView
        contentContainerStyle={{ padding: space.lg, gap: space.base, paddingBottom: space.xxl }}
        onScroll={(e) => {
          const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
          if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 40) {
            setReadToEnd(true);
          }
        }}
        scrollEventThrottle={80}
        showsVerticalScrollIndicator>
        <View style={{ gap: space.xs }}>
          <Text variant="h2">Sankalpam Partner Agreement</Text>
          <Text variant="caption" tone="tertiary">
            Version 1.0 · Hyderabad · Please read in full
          </Text>
        </View>

        <Card style={{ backgroundColor: t.bg.accentTint }} elevated={false}>
          <View style={{ gap: 4 }}>
            <Text variant="micro" tone="accent">
              At a glance
            </Text>
            <Text variant="body" tone="secondary">
              You keep <Text variant="bodyStrong">85%</Text> of every booking. Payouts are{' '}
              <Text variant="bodyStrong">weekly</Text>. Prices are set by Sankalpam, never
              negotiated. All payments go through the platform.
            </Text>
          </View>
        </Card>

        {CLAUSES.map((c) => (
          <View key={c.heading} style={{ gap: 5 }}>
            <Text variant="title">{c.heading}</Text>
            <Text variant="small" tone="secondary">
              {c.body}
            </Text>
          </View>
        ))}

        <View
          style={{
            padding: space.base,
            borderRadius: radius.md,
            backgroundColor: t.bg.sunken,
            marginTop: space.sm,
          }}>
          <Text variant="caption" tone="tertiary">
            A copy of this agreement is emailed to you and is always available under Profile →
            Legal.
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}
