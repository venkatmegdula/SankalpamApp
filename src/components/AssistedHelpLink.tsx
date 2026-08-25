import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Icon, type IconName } from '@/ui/Icon';
import { useSession } from '@/store/session';
import { useColors } from '@/ui/ThemeProvider';
import { Sheet } from '@/ui/layout';
import { Button, Row, Text } from '@/ui/primitives';
import { space } from '@/ui/tokens';

/**
 * The assisted path is a first-class flow, not a fallback.
 *
 * A senior pujari with high ritual authority and low technology comfort is a
 * core persona. Designing as though everyone can complete a 14-step form with
 * six document captures unaided would quietly exclude them.
 */
export function AssistedHelpLink({ compact }: { compact?: boolean }) {
  const t = useColors();
  const { showToast } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Request help with your application"
        onPress={() => setOpen(true)}
        style={{ paddingVertical: space.md, alignItems: 'center' }}>
        <Row gap={6} align="center">
          <Icon name="call-outline" size={15} color={t.fg.brand} />
          <Text variant={compact ? 'caption' : 'smallStrong'} tone="brand">
            Need help? Request a callback
          </Text>
        </Row>
      </Pressable>

      <Sheet
        visible={open}
        onClose={() => setOpen(false)}
        title="We'll call and help you apply"
        footer={
          <>
            <Button
              label="Request a callback"
              onPress={() => {
                setOpen(false);
                showToast('A coordinator will call you within 24 hours');
              }}
            />
            <Button label="Not now" variant="ghost" onPress={() => setOpen(false)} />
          </>
        }>
        <Text variant="body" tone="secondary">
          A Sankalpam coordinator will call you and complete the application with you over the
          phone. You’ll only need your documents to hand.
        </Text>
        <View style={{ gap: space.sm }}>
          {[
            'We call you at a time that suits you',
            'We fill in the details as you say them',
            'You photograph your documents with our guidance',
          ].map((line) => (
            <Row key={line} gap={space.sm} align="flex-start">
              <Icon name="checkmark-circle" size={16} color={t.fg.brand} style={{ marginTop: 2 }} />
              <Text variant="small" tone="secondary" style={{ flex: 1 }}>
                {line}
              </Text>
            </Row>
          ))}
        </View>
      </Sheet>
    </>
  );
}
