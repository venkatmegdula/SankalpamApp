import { useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Icon, type IconName } from '@/ui/Icon';
import { useColors } from '@/ui/ThemeProvider';
import { AppBar, Screen, Section } from '@/ui/layout';
import { Banner, Card, ProgressBar, Row, StatusPill, Text } from '@/ui/primitives';
import { Checkbox } from '@/ui/forms';
import { useAsync } from '@/lib/useAsync';
import * as repo from '@/data/repository';
import { poojaById } from '@/data/fixtures/catalog';
import { space } from '@/ui/tokens';

/**
 * The split checklist.
 *
 * The most common on-the-day failure in this business is a disagreement about
 * who was bringing what. Making both sides explicit and mutually visible is the
 * whole point of this screen.
 */
export default function Checklist() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useColors();
  const { data: booking } = useAsync(() => repo.getBooking(String(id)), [id]);
  const [done, setDone] = useState<string[] | null>(null);

  const pooja = booking ? poojaById(booking.poojaId) : undefined;
  const checked = done ?? booking?.checklistDone ?? [];
  const mine = pooja?.pujariBrings ?? [];
  const theirs = pooja?.devoteeProvides ?? [];
  const mineDone = mine.filter((i) => checked.includes(i)).length;

  const toggle = async (item: string) => {
    const next = checked.includes(item) ? checked.filter((i) => i !== item) : [...checked, item];
    setDone(next);
    if (booking) await repo.toggleChecklistItem(booking.id, item);
  };

  return (
    <Screen header={<AppBar title="Preparation" subtitle={pooja?.name} />}>
      <Card>
        <View style={{ gap: space.md }}>
          <Row justify="space-between" align="center">
            <Text variant="title">Your items</Text>
            <Text variant="smallStrong" tone="secondary" numeric>
              {mineDone} of {mine.length}
            </Text>
          </Row>
          <ProgressBar value={mine.length ? mineDone / mine.length : 0} />
        </View>
      </Card>

      <Section title="You bring">
        <Card>
          <View style={{ gap: 0 }}>
            {mine.map((item) => (
              <Checkbox
                key={item}
                checked={checked.includes(item)}
                onChange={() => void toggle(item)}
                label={item}
              />
            ))}
          </View>
        </Card>
      </Section>

      <Section title="Devotee provides">
        <Card>
          <View style={{ gap: space.md }}>
            <Row justify="space-between" align="center">
              <Text variant="small" tone="secondary">
                Samagri kit
              </Text>
              <StatusPill
                label={booking?.samagriStatus === 'delivered' ? 'Delivered' : 'Not yet delivered'}
                tone={booking?.samagriStatus === 'delivered' ? 'success' : 'warning'}
                icon={booking?.samagriStatus === 'delivered' ? 'checkmark-circle' : 'time'}
                size="sm"
              />
            </Row>
            <View style={{ gap: space.sm }}>
              {theirs.map((item) => (
                <Row key={item} gap={space.sm} align="flex-start">
                  <Icon name="ellipse" size={5} color={t.fg.faint} style={{ marginTop: 8 }} />
                  <Text variant="small" tone="secondary" style={{ flex: 1 }}>
                    {item}
                  </Text>
                </Row>
              ))}
            </View>
          </View>
        </Card>
      </Section>

      {booking?.samagriStatus === 'pending' ? (
        <Banner
          tone="warning"
          title="The kit has not arrived yet"
          body="If it's still undelivered 24 hours before the ceremony, you and our operations team are both alerted automatically."
        />
      ) : null}

      <Text variant="caption" tone="tertiary">
        Your ticks are saved as you go, and work offline.
      </Text>
    </Screen>
  );
}
