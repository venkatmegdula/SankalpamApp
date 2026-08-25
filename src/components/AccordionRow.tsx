import { useState } from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, UIManager, View } from 'react-native';
import { Icon, type IconName } from '@/ui/Icon';
import { useColors } from '@/ui/ThemeProvider';
import { Row, Text } from '@/ui/primitives';
import { HIT, space } from '@/ui/tokens';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function AccordionRow({
  title,
  body,
  last,
}: {
  title: string;
  body: string;
  last?: boolean;
}) {
  const t = useColors();
  const [open, setOpen] = useState(false);

  return (
    <View
      style={{
        borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth,
        borderBottomColor: t.line.subtle,
      }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={title}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setOpen((o) => !o);
        }}
        style={({ pressed }) => ({
          paddingHorizontal: space.base,
          paddingVertical: space.md,
          minHeight: HIT,
          justifyContent: 'center',
          backgroundColor: pressed ? t.bg.sunken : 'transparent',
        })}>
        <Row gap={space.md} align="center">
          <Text variant="smallStrong" style={{ flex: 1 }}>
            {title}
          </Text>
          <Icon
            name={open ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={t.fg.tertiary}
          />
        </Row>
      </Pressable>

      {open ? (
        <View style={{ paddingHorizontal: space.base, paddingBottom: space.base }}>
          <Text variant="small" tone="secondary">
            {body}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
