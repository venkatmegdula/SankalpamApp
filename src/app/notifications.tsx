import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from '@/ui/Icon';
import { useColors } from '@/ui/ThemeProvider';
import { AppBar, Screen } from '@/ui/layout';
import { Card, EmptyState, Row, Text } from '@/ui/primitives';
import { useAsync } from '@/lib/useAsync';
import * as repo from '@/data/repository';
import { relative } from '@/lib/format';
import { radius, space } from '@/ui/tokens';
import type { AppNotification } from '@/data/types';

const ICON: Record<AppNotification['kind'], IconName> = {
  request: 'notifications',
  request_expiring: 'time',
  verification: 'shield-checkmark',
  document: 'document-text',
  reminder: 'alarm',
  message: 'chatbubble-ellipses',
  cancellation: 'close-circle',
  payout: 'wallet',
  rating: 'star',
  reverification: 'refresh-circle',
};

export default function Notifications() {
  const t = useColors();
  const { data, loading } = useAsync(() => repo.getNotifications(), []);

  useEffect(() => {
    void repo.markNotificationsRead();
  }, []);

  const tone = (k: AppNotification['kind']) =>
    k === 'request_expiring' || k === 'cancellation'
      ? { fg: t.status.urgentFg, bg: t.status.urgentBg }
      : k === 'payout'
        ? { fg: t.fg.accent, bg: t.bg.accentTint }
        : k === 'verification'
          ? { fg: t.status.successFg, bg: t.status.successBg }
          : { fg: t.fg.brand, bg: t.bg.brandTint };

  return (
    <Screen header={<AppBar title="Notifications" />}>
      {loading ? null : data && data.length > 0 ? (
        <View style={{ gap: space.sm }}>
          {data.map((n) => {
            const c = tone(n.kind);
            return (
              <Pressable
                key={n.id}
                accessibilityRole="button"
                accessibilityLabel={n.title}
                disabled={!n.href}
                onPress={() => n.href && router.push(n.href as never)}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  gap: space.md,
                  padding: space.base,
                  borderRadius: radius.md,
                  backgroundColor: n.read ? t.bg.surface : t.bg.brandTint,
                  borderWidth: 1,
                  borderColor: t.line.subtle,
                  opacity: pressed ? 0.9 : 1,
                })}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: radius.sm,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: c.bg,
                  }}>
                  <Icon name={ICON[n.kind]} size={17} color={c.fg} />
                </View>
                <View style={{ flex: 1, gap: 3 }}>
                  <Row justify="space-between" align="flex-start" gap={space.sm}>
                    <Text variant="smallStrong" style={{ flex: 1 }}>
                      {n.title}
                    </Text>
                    <Text variant="micro" tone="faint">
                      {relative(n.createdAt)}
                    </Text>
                  </Row>
                  <Text variant="caption" tone="secondary">
                    {n.body}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <Card>
          <EmptyState
            icon="notifications-off-outline"
            title="Nothing new"
            body="Booking requests, verification updates, reminders, and payouts all appear here."
          />
        </Card>
      )}

      <Text variant="caption" tone="tertiary">
        Notifications are paused automatically while a ceremony is in progress.
      </Text>
    </Screen>
  );
}
