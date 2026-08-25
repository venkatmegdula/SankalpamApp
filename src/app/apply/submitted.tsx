import { View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from '@/ui/Icon';
import { Appear } from '@/components/Appear';
import { useColors } from '@/ui/ThemeProvider';
import { Screen } from '@/ui/layout';
import { Button, Row, Text } from '@/ui/primitives';
import { radius, space } from '@/ui/tokens';

export default function Submitted() {
  const t = useColors();

  return (
    <Screen
      header={null}
      footer={<Button label="Track my application" onPress={() => router.replace('/verification')} />}
      contentStyle={{ justifyContent: 'center', flexGrow: 1 }}>
      <Appear style={{ alignItems: 'center', gap: space.lg }}>
        <View
          style={{
            width: 76,
            height: 76,
            borderRadius: 38,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: t.status.successBg,
          }}>
          <Icon name="checkmark" size={38} color={t.status.successFg} />
        </View>

        <View style={{ gap: space.sm, alignItems: 'center' }}>
          <Text variant="h1" center>
            Application submitted
          </Text>
          <Text variant="body" tone="secondary" center style={{ maxWidth: 320 }}>
            Our team reviews your documents within 2–3 business days. We’ll notify you in the app
            and by SMS the moment Stage 1 is cleared.
          </Text>
        </View>

        <View
          style={{
            width: '100%',
            padding: space.base,
            borderRadius: radius.md,
            backgroundColor: t.bg.sunken,
            gap: space.sm,
          }}>
          <Text variant="micro" tone="tertiary">
            What happens next
          </Text>
          {[
            'We check each document individually',
            'If anything needs re-uploading, we tell you exactly what and why',
            'Once cleared, you choose a time for your competency conversation',
          ].map((line) => (
            <Row key={line} gap={space.sm} align="flex-start">
              <Icon name="ellipse" size={5} color={t.fg.faint} style={{ marginTop: 8 }} />
              <Text variant="small" tone="secondary" style={{ flex: 1 }}>
                {line}
              </Text>
            </Row>
          ))}
        </View>
      </Appear>
    </Screen>
  );
}
