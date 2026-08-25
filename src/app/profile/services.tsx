import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from '@/ui/Icon';
import { useSession } from '@/store/session';
import { useColors } from '@/ui/ThemeProvider';
import { AppBar, Screen, Section } from '@/ui/layout';
import { Banner, Button, Text } from '@/ui/primitives';
import * as repo from '@/data/repository';
import { CATEGORY_LABEL, POOJAS } from '@/data/fixtures/catalog';
import { duration, money } from '@/lib/format';
import { radius, space } from '@/ui/tokens';
import type { PoojaCategory } from '@/data/types';

const MIN = 5;

export default function Services() {
  const { profile, refreshProfile, showToast } = useSession();
  const t = useColors();
  const [selected, setSelected] = useState<string[]>(profile?.poojaIds ?? []);
  const [busy, setBusy] = useState(false);

  const grouped = POOJAS.reduce((acc, p) => {
    acc.set(p.category, [...(acc.get(p.category) ?? []), p]);
    return acc;
  }, new Map<PoojaCategory['category'], PoojaCategory[]>());

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <Screen
      header={<AppBar title="Poojas I perform" />}
      footer={
        <>
          <Text variant="caption" tone={selected.length < MIN ? 'error' : 'tertiary'} center>
            {selected.length < MIN
              ? `Select at least ${MIN}. You have ${selected.length}.`
              : `${selected.length} selected`}
          </Text>
          <Button
            label="Save"
            disabled={selected.length < MIN}
            loading={busy}
            onPress={async () => {
              setBusy(true);
              await repo.updateProfile({ poojaIds: selected });
              await refreshProfile();
              setBusy(false);
              showToast('Updated. New requests will match your selection.');
              router.back();
            }}
          />
        </>
      }>
      <Banner
        tone="info"
        title="Prices are set by Sankalpam"
        body="One published rate per pooja for every pujari. You keep 85% — no negotiation with devotees, ever."
      />

      {[...grouped.entries()].map(([category, items]) => (
        <Section key={category} title={CATEGORY_LABEL[category]}>
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
                  <Text variant="smallStrong" numeric>
                    {money(p.price)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Section>
      ))}
    </Screen>
  );
}
