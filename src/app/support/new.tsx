import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useSession } from '@/store/session';
import { AppBar, Screen, Section } from '@/ui/layout';
import { Button, Card, Text } from '@/ui/primitives';
import { Chip, Field, Input } from '@/ui/forms';
import * as repo from '@/data/repository';
import { space } from '@/ui/tokens';
import type { SupportTicket } from '@/data/types';

const CATEGORIES: { id: SupportTicket['category']; label: string }[] = [
  { id: 'booking', label: 'A booking' },
  { id: 'payout', label: 'Payouts' },
  { id: 'verification', label: 'Verification' },
  { id: 'conduct', label: 'Devotee conduct' },
  { id: 'app', label: 'App problem' },
];

export default function NewTicket() {
  const { showToast } = useSession();
  const [category, setCategory] = useState<SupportTicket['category'] | null>(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);

  const ok = category && subject.trim().length > 3 && body.trim().length > 9;

  return (
    <Screen
      header={<AppBar title="Raise a request" />}
      footer={
        <Button
          label="Send"
          disabled={!ok}
          loading={busy}
          onPress={async () => {
            setBusy(true);
            const tk = await repo.createTicket(category!, subject, body);
            setBusy(false);
            showToast('Sent. We aim to reply within 24 hours.');
            router.replace(`/support/${tk.id}`);
          }}
        />
      }>
      <Section title="What's it about?">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
          {CATEGORIES.map((c) => (
            <Chip
              key={c.id}
              label={c.label}
              selected={category === c.id}
              onPress={() => setCategory(c.id)}
            />
          ))}
        </View>
      </Section>

      <Field label="Subject" required>
        <Input value={subject} onChangeText={setSubject} placeholder="A short summary" />
      </Field>

      <Field label="What happened?" required hint="The more detail, the faster we can help.">
        <Input value={body} onChangeText={setBody} multiline placeholder="Describe the problem" />
      </Field>

      <Card>
        <Text variant="caption" tone="tertiary">
          Relevant bookings are attached automatically — you never need to look up a reference
          number.
        </Text>
      </Card>
    </Screen>
  );
}
