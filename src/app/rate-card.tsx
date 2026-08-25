import { useState } from 'react';
import { View } from 'react-native';
import { AppBar, Screen, Section } from '@/ui/layout';
import { Banner, Card, Divider, Money, Row, Text } from '@/ui/primitives';
import { Stepper } from '@/ui/forms';
import { CATEGORY_LABEL, COMMISSION_RATE, POOJAS } from '@/data/fixtures/catalog';
import { duration } from '@/lib/format';
import { space } from '@/ui/tokens';
import type { PoojaCategory } from '@/data/types';

/** Read-only. Prices are platform-set — this is a trust surface, not a form. */
export default function RateCard() {
  const [perWeek, setPerWeek] = useState(4);

  const grouped = POOJAS.reduce((acc, p) => {
    acc.set(p.category, [...(acc.get(p.category) ?? []), p]);
    return acc;
  }, new Map<PoojaCategory['category'], PoojaCategory[]>());

  const avgNet =
    POOJAS.reduce((s, p) => s + p.price * (1 - COMMISSION_RATE), 0) / POOJAS.length;

  return (
    <Screen header={<AppBar title="Rate card" />}>
      <Banner
        tone="info"
        title="One rate for every pujari"
        body="Sankalpam publishes these prices. You never set or negotiate them, and devotees never haggle. You keep 85% of every booking."
      />

      <Section title="Estimate your earnings">
        <Card>
          <View style={{ gap: space.lg }}>
            <View style={{ gap: space.sm }}>
              <Text variant="smallStrong">Ceremonies per week</Text>
              <View style={{ alignItems: 'center' }}>
                <Stepper value={perWeek} onChange={setPerWeek} min={1} max={14} />
              </View>
            </View>
            <Divider />
            <Row justify="space-between" align="center">
              <View style={{ gap: 2 }}>
                <Text variant="micro" tone="tertiary">
                  Roughly per week
                </Text>
                <Text variant="caption" tone="tertiary">
                  Based on the average rate across the catalog
                </Text>
              </View>
              <Money value={Math.round(avgNet * perWeek)} variant="numeric" />
            </Row>
            <Row justify="space-between" align="center">
              <Text variant="micro" tone="tertiary">
                Per month
              </Text>
              <Money value={Math.round(avgNet * perWeek * 4.3)} variant="title" tone="secondary" />
            </Row>
          </View>
        </Card>
      </Section>

      {[...grouped.entries()].map(([category, items]) => (
        <Section key={category} title={CATEGORY_LABEL[category]}>
          <Card>
            <View style={{ gap: space.base }}>
              {items.map((p, i) => (
                <View key={p.id} style={{ gap: space.base }}>
                  {i > 0 ? <Divider /> : null}
                  <Row justify="space-between" align="flex-start">
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text variant="small">{p.name}</Text>
                      <Text variant="caption" tone="tertiary">
                        {p.teluguName} · {duration(p.durationMinutes)}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: 2 }}>
                      <Money value={Math.round(p.price * (1 - COMMISSION_RATE))} variant="smallStrong" />
                      <Text variant="micro" tone="faint" numeric>
                        of ₹{p.price.toLocaleString('en-IN')}
                      </Text>
                    </View>
                  </Row>
                </View>
              ))}
            </View>
          </Card>
        </Section>
      ))}

      <Text variant="caption" tone="tertiary">
        Rates are reviewed periodically. You’ll be notified in advance of any change, and no change
        ever affects a booking you’ve already accepted.
      </Text>
    </Screen>
  );
}
