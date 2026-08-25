import { View } from 'react-native';
import { useSession } from '@/store/session';
import { AppBar, Screen, Section } from '@/ui/layout';
import { AccordionRow } from '@/components/AccordionRow';
import { Button, Card, Text } from '@/ui/primitives';
import { space } from '@/ui/tokens';

const CONDUCT = [
  {
    q: 'Punctuality and preparation',
    a: 'Arrive on time, in appropriate attire, with all personal ritual items you are expected to bring for the ceremony.',
  },
  {
    q: 'Respect for the household',
    a: "Treat every devotee's home and family with respect, regardless of the size of the booking.",
  },
  {
    q: 'No off-platform solicitation',
    a: 'Never solicit direct, off-platform bookings or payments from a devotee met through Sankalpam. Decline and report any such request.',
  },
  {
    q: 'No substitution or upselling',
    a: 'Do not substitute or upsell samagri, poojas, or pricing outside what is confirmed in the booking.',
  },
  {
    q: 'Report safety concerns',
    a: 'Report any safety concern, unsafe location, or inappropriate request to Sankalpam support immediately.',
  },
  {
    q: 'Confidentiality',
    a: 'Maintain confidentiality about devotee households. No photographs or details are shared publicly without explicit consent.',
  },
];

const PRIVACY = [
  {
    q: 'What we collect',
    a: 'Your identity and qualification documents, bank details for payouts, your location while a booking is active, and your booking and earnings history.',
  },
  {
    q: 'How documents are handled',
    a: 'Identity documents are encrypted in transit and at rest, are visible only to the Sankalpam verification team, are never shown to devotees, and are never included in logs or analytics.',
  },
  {
    q: 'Location',
    a: 'Location is used only while a booking is active, to give the devotee your estimated arrival and to record check-in. It is not tracked between bookings.',
  },
  {
    q: 'Your phone number',
    a: 'Devotees never see your number. Calls in both directions are masked.',
  },
  {
    q: 'Retention',
    a: 'Booking and payout records are retained as required for tax and dispute resolution. Identity documents are retained while you are an active partner and for the statutory period afterwards.',
  },
];

export default function Legal() {
  const { showToast } = useSession();

  return (
    <Screen header={<AppBar title="Agreement & policies" />}>
      <Card>
        <View style={{ gap: space.md }}>
          <View style={{ gap: 4 }}>
            <Text variant="title">Sankalpam Partner Agreement</Text>
            <Text variant="caption" tone="tertiary">
              Version 1.0 · Accepted during onboarding
            </Text>
          </View>
          <Button
            label="Download my copy"
            variant="secondary"
            size="sm"
            icon="download-outline"
            onPress={() => showToast('Agreement downloaded', 'info')}
          />
        </View>
      </Card>

      <Section title="Code of conduct">
        <Card padded={false}>
          {CONDUCT.map((c, i) => (
            <AccordionRow key={c.q} title={c.q} body={c.a} last={i === CONDUCT.length - 1} />
          ))}
        </Card>
      </Section>

      <Section title="Privacy & your data">
        <Card padded={false}>
          {PRIVACY.map((p, i) => (
            <AccordionRow key={p.q} title={p.q} body={p.a} last={i === PRIVACY.length - 1} />
          ))}
        </Card>
      </Section>

      <Section title="Quality & review">
        <Card>
          <Text variant="small" tone="secondary">
            Ratings are visible on your profile after every booking. Sankalpam conducts random
            post-booking quality calls with devotees and re-verifies documents annually.
            Consistently low ratings, verified complaints, or a code-of-conduct violation may lead
            to temporary suspension pending review. You will always be notified and given the
            opportunity to respond before any final decision.
          </Text>
        </Card>
      </Section>

      <Text variant="caption" tone="tertiary">
        Sankalpam Private Limited · Hyderabad
      </Text>
    </Screen>
  );
}
