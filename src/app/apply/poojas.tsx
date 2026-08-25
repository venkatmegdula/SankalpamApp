import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Icon } from '@/ui/Icon';
import { useSession } from '@/store/session';
import { useColors } from '@/ui/ThemeProvider';
import { AppBar, Screen } from '@/ui/layout';
import { Input } from '@/ui/forms';
import { Button, Card, Row, Text } from '@/ui/primitives';
import { CATEGORY_LABEL, POOJAS } from '@/data/fixtures/catalog';
import { duration, money } from '@/lib/format';
import { radius, space } from '@/ui/tokens';
import { MIN_POOJAS } from './services';
import type { PoojaCategory } from '@/data/types';

/**
 * Capability declaration, not a price list.
 *
 * Prices are platform-fixed and shown read-only — the pujari never sets or
 * negotiates them (Onboarding Guide §4). Showing the rate here is a trust
 * surface: they know exactly what a booking is worth before they commit to it.
 *
 * This is a picker reached from Services, not a wizard step of its own — the
 * catalogue is far too long to sit inline above the zone question.
 */
export default function Poojas() {
  const { draft, patchDraft } = useSession();
  const t = useColors();
  const [query, setQuery] = useState('');

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? POOJAS.filter(
          (p) => p.name.toLowerCase().includes(q) || p.teluguName.includes(query.trim()),
        )
      : POOJAS;
    const map = new Map<PoojaCategory['category'], PoojaCategory[]>();
    for (const p of filtered) {
      map.set(p.category, [...(map.get(p.category) ?? []), p]);
    }
    return [...map.entries()];
  }, [query]);

  const selected = draft.poojaIds;
  const remaining = Math.max(0, MIN_POOJAS - selected.length);

  const toggle = (id: string) =>
    patchDraft({
      poojaIds: selected.includes(id) ? selected.filter((p) => p !== id) : [...selected, id],
    });

  return (
    <Screen
      header={<AppBar title="Poojas you perform" subtitle={`${selected.length} selected`} />}
      footer={
        <>
          <Text variant="caption" tone={remaining > 0 ? 'error' : 'tertiary'} center style={{ marginBottom: 2 }}>
            {remaining > 0
              ? `Select ${remaining} more ${remaining === 1 ? 'pooja' : 'poojas'}.`
              : `${selected.length} selected`}
          </Text>
          <Button label="Done" disabled={remaining > 0} onPress={() => router.back()} />
        </>
      }>
      <View style={{ gap: space.xs }}>
        <Text variant="h2">Which poojas do you perform?</Text>
        <Text variant="small" tone="secondary">
          Select at least {MIN_POOJAS}. Prices are set by Sankalpam — you never negotiate with
          devotees.
        </Text>
      </View>

      <Input
        value={query}
        onChangeText={setQuery}
        placeholder="Search poojas"
        icon="search-outline"
        accessibilityLabel="Search poojas"
      />

      {grouped.map(([category, items]) => (
        <View key={category} style={{ gap: space.sm }}>
          <Text variant="micro" tone="tertiary">
            {CATEGORY_LABEL[category]}
          </Text>
          <View style={{ gap: space.sm }}>
            {items.map((p) => {
              const on = selected.includes(p.id);
              return (
                <Pressable
                  key={p.id}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: on }}
                  accessibilityLabel={`${p.name}, ${money(p.price)}`}
                  onPress={() => toggle(p.id)}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: space.md,
                    padding: space.md + 2,
                    borderRadius: radius.md,
                    backgroundColor: on ? t.bg.brandTint : t.bg.surface,
                    borderWidth: 1.5,
                    borderColor: on ? t.line.brand : t.line.default,
                    opacity: pressed ? 0.9 : 1,
                  })}>
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: radius.xs,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: on ? t.bg.brand : 'transparent',
                      borderWidth: 1.8,
                      borderColor: on ? t.bg.brand : t.line.strong,
                    }}>
                    {on ? <Icon name="checkmark" size={14} color={t.fg.onBrand} /> : null}
                  </View>

                  <View style={{ flex: 1, gap: 2 }}>
                    <Text variant="title">{p.name}</Text>
                    <Text variant="caption" tone="tertiary">
                      {p.teluguName} · {duration(p.durationMinutes)}
                    </Text>
                  </View>

                  <View style={{ alignItems: 'flex-end', gap: 1 }}>
                    <Text variant="smallStrong" numeric>
                      {money(p.price)}
                    </Text>
                    <Text variant="micro" tone="tertiary">
                      Fixed
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}

      <Card style={{ backgroundColor: t.bg.sunken }} elevated={false}>
        <Row gap={space.sm} align="flex-start">
          <Icon name="information-circle-outline" size={17} color={t.fg.secondary} />
          <Text variant="caption" tone="secondary" style={{ flex: 1 }}>
            Sankalpam publishes one rate per pooja for every pujari. You keep{' '}
            <Text variant="caption" tone="primary">
              85%
            </Text>{' '}
            of the booking value — the platform commission is 15%, deducted before your weekly
            payout.
          </Text>
        </Row>
      </Card>
    </Screen>
  );
}
