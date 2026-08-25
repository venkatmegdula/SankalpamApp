import { useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSession } from '@/store/session';
import { useColors } from '@/ui/ThemeProvider';
import { AppBar, Screen } from '@/ui/layout';
import { Button, Card, Row, Skeleton, StatusPill, Text } from '@/ui/primitives';
import { Input } from '@/ui/forms';
import { useAsync } from '@/lib/useAsync';
import * as repo from '@/data/repository';
import { relative } from '@/lib/format';
import { radius, space } from '@/ui/tokens';

export default function TicketThread() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showToast } = useSession();
  const t = useColors();
  const { data: ticket, loading } = useAsync(() => repo.getTicket(String(id)), [id]);
  const [reply, setReply] = useState('');
  const [local, setLocal] = useState<{ text: string; sentAt: string }[]>([]);

  if (loading || !ticket) {
    return (
      <Screen header={<AppBar title="Request" />}>
        <Card>
          <Skeleton height={22} width="60%" />
        </Card>
      </Screen>
    );
  }

  const messages = [
    ...ticket.messages,
    ...local.map((l) => ({ from: 'pujari' as const, text: l.text, sentAt: l.sentAt })),
  ];

  return (
    <Screen
      header={<AppBar title={ticket.subject} subtitle={ticket.reference} />}
      footer={
        ticket.status !== 'resolved' ? (
          <Row gap={space.sm} align="flex-end">
            <View style={{ flex: 1 }}>
              <Input value={reply} onChangeText={setReply} placeholder="Add a reply" />
            </View>
            <Button
              label="Send"
              fullWidth={false}
              disabled={!reply.trim()}
              onPress={() => {
                setLocal((l) => [...l, { text: reply.trim(), sentAt: new Date().toISOString() }]);
                setReply('');
                showToast('Reply sent');
              }}
            />
          </Row>
        ) : undefined
      }>
      <Row justify="space-between" align="center">
        <StatusPill
          label={
            ticket.status === 'open'
              ? 'Open'
              : ticket.status === 'in_progress'
                ? 'In progress'
                : 'Resolved'
          }
          tone={ticket.status === 'resolved' ? 'success' : ticket.status === 'open' ? 'info' : 'warning'}
          icon={ticket.status === 'resolved' ? 'checkmark-circle' : 'time'}
        />
        <Text variant="caption" tone="tertiary">
          Opened {relative(ticket.createdAt)}
        </Text>
      </Row>

      <View style={{ gap: space.md }}>
        {messages.map((m, i) => {
          const mine = m.from === 'pujari';
          return (
            <View key={i} style={{ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '88%', gap: 4 }}>
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
              <Text
                variant="micro"
                tone="faint"
                style={{ alignSelf: mine ? 'flex-end' : 'flex-start' }}>
                {mine ? 'You' : 'Sankalpam support'} · {relative(m.sentAt)}
              </Text>
            </View>
          );
        })}
      </View>

      {ticket.status === 'resolved' ? (
        <Card style={{ backgroundColor: t.bg.sunken }} elevated={false}>
          <Text variant="caption" tone="secondary" center>
            This request is resolved. Raise a new one if you need anything else.
          </Text>
        </Card>
      ) : null}
    </Screen>
  );
}
