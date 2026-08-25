import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, type IconName } from '@/ui/Icon';
import { useSession } from '@/store/session';
import { useColors } from '@/ui/ThemeProvider';
import { Text } from '@/ui/primitives';
import { layout, space } from '@/ui/tokens';
import { Appear } from './Appear';

/**
 * The app degrades honestly. A pujari inside a thick-walled house mid-ceremony
 * must still be able to work — and must never be told something succeeded when
 * it didn't.
 */
export function OfflineBanner() {
  const { offline } = useSession();
  const t = useColors();
  const insets = useSafeAreaInsets();

  if (!offline) return null;

  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', top: insets.top, left: 0, right: 0, alignItems: 'center' }}>
      <Appear from="top" distance={10}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: space.sm,
            width: layout.maxContentWidth,
            maxWidth: '100%',
            backgroundColor: t.status.warningBg,
            paddingVertical: space.sm,
            paddingHorizontal: space.base,
          }}>
          <Icon name="cloud-offline" size={14} color={t.status.warningFg} />
          <Text variant="caption" style={{ color: t.status.warningFg }}>
            No connection — changes will be saved when you’re back online
          </Text>
        </View>
      </Appear>
    </View>
  );
}
