import { useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSession } from '@/store/session';
import { AppBar, Screen, Section } from '@/ui/layout';
import { Banner, Button, Card, Text } from '@/ui/primitives';
import { Chip, Field, Input } from '@/ui/forms';
import { useAsync } from '@/lib/useAsync';
import * as repo from '@/data/repository';
import { poojaById } from '@/data/fixtures/catalog';
import { at } from '@/data/fixtures/seed';
import { dayLabel, fullDate, time } from '@/lib/format';
import { space } from '@/ui/tokens';

const TIMES = ['05:30 am', '06:00 am', '06:30 am', '07:00 am', '10:00 am', '05:00 pm', '06:00 pm'];

export default function Reschedule() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showToast } = useSession();
  const { data: booking } = useAsync(() => repo.getBooking(String(id)), [id]);
  const [day, setDay] = useState<number | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const pooja = booking ? poojaById(booking.poojaId) : undefined;
  const ok = day !== null && slot !== null;

  return (
    <Screen
      header={<AppBar title="Request a different time" />}
      footer={
        <Button
          label="Send request to devotee"
          disabled={!ok}
          loading={busy}
          onPress={async () => {
            if (!booking || day === null) return;
            setBusy(true);
            await repo.requestReschedule(booking.id, at(day, 7, 0), note);
            setBusy(false);
            showToast('Sent. We\'ll notify you when they respond.');
            router.replace(`/booking/${booking.id}`);
          }}
        />
      }>
      <Card>
        <View style={{ gap: 4 }}>
          <Text variant="micro" tone="tertiary">
            Currently scheduled
          </Text>
          <Text variant="title">{pooja?.name}</Text>
          <Text variant="small" tone="secondary">
            {booking ? `${fullDate(booking.scheduledAt)} · ${time(booking.scheduledAt)}` : ''}
          </Text>
        </View>
      </Card>

      <Banner
        tone="info"
        title="The devotee has to agree"
        body="Muhurtham timings are often chosen for a reason, so a new time is a request, not a change. If they decline, the original booking stands."
      />

      <Section title="Suggest a day">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
          {[1, 2, 3, 4, 5, 6, 7].map((d) => (
            <Chip
              key={d}
              label={dayLabel(at(d, 7, 0))}
              selected={day === d}
              onPress={() => setDay(d)}
              size="sm"
            />
          ))}
        </View>
      </Section>

      <Section title="Suggest a time">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
          {TIMES.map((s) => (
            <Chip key={s} label={s} selected={slot === s} onPress={() => setSlot(s)} size="sm" />
          ))}
        </View>
      </Section>

      <Field label="Reason" hint="Optional, but it helps the devotee understand.">
        <Input value={note} onChangeText={setNote} placeholder="A brief reason" multiline />
      </Field>
    </Screen>
  );
}
