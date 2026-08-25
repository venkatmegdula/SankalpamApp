import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Icon, type IconName } from '@/ui/Icon';
import { useSession } from '@/store/session';
import { useColors } from '@/ui/ThemeProvider';
import { AppBar, Screen } from '@/ui/layout';
import { Button, IconButton, Row, Text } from '@/ui/primitives';
import { Chip, Input } from '@/ui/forms';
import { useAsync } from '@/lib/useAsync';
import * as repo from '@/data/repository';
import { QUICK_REPLIES } from '@/data/fixtures/catalog';
import { relative } from '@/lib/format';
import { radius, space } from '@/ui/tokens';
import type { ChatMessage } from '@/data/types';

/** Typing is always possible but never required — quick replies lead. */
export default function Chat() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { offline, showToast } = useSession();
  const t = useColors();
  const { data: booking } = useAsync(() => repo.getBooking(String(id)), [id]);
  const { data: seeded } = useAsync(() => repo.getMessages(String(id)), [id]);

  const [local, setLocal] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const messages = [...(seeded ?? []), ...local];

  const send = async (body: string) => {
    if (!body.trim()) return;
    const msg = await repo.sendMessage(String(id), body.trim());
    setLocal((m) => [...m, msg]);
    setText('');
  };

  return (
    <Screen
      header={
        <AppBar
          title={booking?.devotee.name ?? 'Devotee'}
          subtitle="Messages stay on Sankalpam"
          right={
            <IconButton
              name="call-outline"
              label="Call the devotee"
              tone="brand"
              onPress={() => showToast('Masked call connects on a real device', 'info')}
            />
          }
        />
      }
      scroll={false}
      padded={false}
      footer={
        <View style={{ gap: space.sm }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
            {QUICK_REPLIES.map((q) => (
              <Chip key={q} label={q} size="sm" onPress={() => void send(q)} />
            ))}
          </ScrollView>
          <Row gap={space.sm} align="flex-end">
            <View style={{ flex: 1 }}>
              <Input value={text} onChangeText={setText} placeholder="Type a message" />
            </View>
            <Button
              label="Send"
              size="md"
              fullWidth={false}
              disabled={!text.trim()}
              onPress={() => void send(text)}
            />
          </Row>
        </View>
      }>
      <ScrollView
        contentContainerStyle={{ padding: space.lg, gap: space.md, flexGrow: 1, justifyContent: 'flex-end' }}>
        {messages.length === 0 ? (
          <View style={{ alignItems: 'center', gap: space.sm, paddingVertical: space.xxl }}>
            <Icon name="chatbubbles-outline" size={26} color={t.fg.faint} />
            <Text variant="small" tone="tertiary" center>
              No messages yet. Use a quick reply below to start.
            </Text>
          </View>
        ) : null}

        {messages.map((m) => {
          const mine = m.from === 'pujari';
          return (
            <View
              key={m.id}
              style={{
                alignSelf: mine ? 'flex-end' : 'flex-start',
                maxWidth: '82%',
                gap: 4,
              }}>
              <View
                style={{
                  backgroundColor: mine ? t.bg.brand : t.bg.surface,
                  borderWidth: mine ? 0 : 1,
                  borderColor: t.line.subtle,
                  paddingHorizontal: space.base,
                  paddingVertical: space.md,
                  borderRadius: radius.lg,
                  borderBottomRightRadius: mine ? radius.xs : radius.lg,
                  borderBottomLeftRadius: mine ? radius.lg : radius.xs,
                }}>
                <Text variant="small" style={{ color: mine ? t.fg.onBrand : t.fg.primary }}>
                  {m.text}
                </Text>
              </View>
              <Row gap={5} align="center" style={{ alignSelf: mine ? 'flex-end' : 'flex-start' }}>
                {m.queued ? (
                  <>
                    <Icon name="time-outline" size={10} color={t.status.warningFg} />
                    <Text variant="micro" tone="warning">
                      Queued
                    </Text>
                  </>
                ) : (
                  <Text variant="micro" tone="faint">
                    {relative(m.sentAt)}
                  </Text>
                )}
              </Row>
            </View>
          );
        })}

        {offline ? (
          <Text variant="caption" tone="warning" center>
            You’re offline. Messages will send when you reconnect.
          </Text>
        ) : null}
      </ScrollView>
    </Screen>
  );
}
