import { useEffect } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, type IconName } from '@/ui/Icon';
import * as Haptics from 'expo-haptics';
import { useSession } from '@/store/session';
import { useColors } from '@/ui/ThemeProvider';
import { Text } from '@/ui/primitives';
import { layout, radius, shadow, space } from '@/ui/tokens';
import { Appear } from './Appear';

export function ToastHost() {
  const { toast } = useSession();
  const t = useColors();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!toast) return;
    void Haptics.notificationAsync(
      toast.tone === 'error'
        ? Haptics.NotificationFeedbackType.Error
        : Haptics.NotificationFeedbackType.Success,
    ).catch(() => {});
  }, [toast]);

  if (!toast) return null;

  const icon =
    toast.tone === 'error'
      ? 'alert-circle'
      : toast.tone === 'info'
        ? 'information-circle'
        : 'checkmark-circle';

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: insets.bottom + 82,
        alignItems: 'center',
        paddingHorizontal: space.lg,
      }}>
      {/* Keyed so each toast re-runs its entrance rather than swapping silently. */}
      <Appear key={toast.id} distance={14}>
        <View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              gap: space.sm,
              backgroundColor: t.bg.inverse,
              paddingVertical: space.md,
              paddingHorizontal: space.base,
              borderRadius: radius.pill,
              maxWidth: layout.maxContentWidth - space.xxl,
            },
            shadow.lg,
          ]}>
          <Icon
            name={icon}
            size={17}
            color={
              toast.tone === 'error' ? '#EF8279' : toast.tone === 'info' ? '#7FB4DE' : '#63C795'
            }
          />
          <Text variant="smallStrong" style={{ color: t.fg.inverse, flexShrink: 1 }}>
            {toast.message}
          </Text>
        </View>
      </Appear>
    </View>
  );
}
