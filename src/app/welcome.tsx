import { View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from '@/ui/Icon';
import { useColors } from '@/ui/ThemeProvider';
import { Screen } from '@/ui/layout';
import { Button, Row, Text } from '@/ui/primitives';
import { BrandGlyph } from '@/components/BrandMark';
import { radius, space } from '@/ui/tokens';

const VALUE = [
  {
    icon: 'notifications-outline' as const,
    title: 'Bookings in your zone',
    body: 'Devotees near you request the poojas you already perform. You choose what to accept.',
  },
  {
    icon: 'pricetag-outline' as const,
    title: 'Fixed, transparent rates',
    body: 'Sankalpam publishes one rate per pooja. You always see exactly what you earn before accepting.',
  },
  {
    icon: 'wallet-outline' as const,
    title: 'Weekly payouts',
    body: 'Earnings are settled to your bank account every week, with a full statement each time.',
  },
];

export default function WelcomeScreen() {
  const t = useColors();

  return (
    <Screen
      header={null}
      footer={
        <>
          <Button label="Apply as a Pujari" onPress={() => router.push('/auth/phone')} />
          <Button
            label="I've already applied"
            variant="ghost"
            onPress={() => router.push('/auth/phone')}
          />
        </>
      }>
      <View style={{ paddingTop: space.xl, gap: space.lg }}>
        <BrandGlyph size={44} color={t.fg.brand} />
        <View style={{ gap: space.sm }}>
          <Text variant="h1">Join the Sankalpam pujari network</Text>
          <Text variant="body" tone="secondary">
            Verified priests performing home-visit poojas and remote Archana across Hyderabad.
          </Text>
        </View>
      </View>

      <View style={{ gap: space.md, marginTop: space.sm }}>
        {VALUE.map((v) => (
          <Row key={v.title} gap={space.base} align="flex-start">
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: radius.md,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: t.bg.brandTint,
              }}>
              <Icon name={v.icon} size={20} color={t.fg.brand} />
            </View>
            <View style={{ flex: 1, gap: 3, paddingTop: 2 }}>
              <Text variant="title">{v.title}</Text>
              <Text variant="small" tone="secondary">
                {v.body}
              </Text>
            </View>
          </Row>
        ))}
      </View>

      <View
        style={{
          marginTop: space.sm,
          padding: space.base,
          borderRadius: radius.md,
          backgroundColor: t.bg.sunken,
          gap: 4,
        }}>
        <Text variant="smallStrong">Before you begin</Text>
        <Text variant="small" tone="secondary">
          You’ll need your Aadhaar, address proof, proof of training or lineage, PAN, and bank
          details. The application takes about 30 minutes.
        </Text>
      </View>
    </Screen>
  );
}
