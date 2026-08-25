import { View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from '@/ui/Icon';
import { useColors } from '@/ui/ThemeProvider';
import { AppBar, ListGroup, ListRow, Screen, Section } from '@/ui/layout';
import {
  Banner,
  Card,
  Divider,
  EmptyState,
  Money,
  Row,
  Skeleton,
  StatusPill,
  Text,
} from '@/ui/primitives';
import { useAsync } from '@/lib/useAsync';
import * as repo from '@/data/repository';
import { poojaById } from '@/data/fixtures/catalog';
import { commissionOf, netOf, shortDate } from '@/lib/format';
import { space } from '@/ui/tokens';
import type { Payout } from '@/data/types';

const PAYOUT_META: Record<
  Payout['status'],
  { label: string; tone: 'success' | 'warning' | 'error' | 'info' }
> = {
  paid: { label: 'Paid', tone: 'success' },
  processing: { label: 'Processing', tone: 'info' },
  held_pan: { label: 'Held — PAN needed', tone: 'error' },
  held_bank: { label: 'Held — bank details', tone: 'error' },
  under_review: { label: 'Under review', tone: 'warning' },
};

export default function Earnings() {
  const t = useColors();
  const { data: summary, loading } = useAsync(() => repo.getEarnings(), []);
  const { data: payouts } = useAsync(() => repo.getPayouts(), []);
  const { data: bookings } = useAsync(() => repo.getBookings(), []);

  const completed = (bookings ?? [])
    .filter((b) => ['completed', 'settled'].includes(b.status))
    .sort((a, b) => new Date(b.completedAt ?? 0).getTime() - new Date(a.completedAt ?? 0).getTime());

  const held = (payouts ?? []).find((p) => p.status === 'held_pan' || p.status === 'held_bank');

  return (
    <Screen header={<AppBar onBack={false} large title="Earnings" />}>
      {held ? (
        <Banner
          tone="error"
          title={held.status === 'held_pan' ? 'A payout is waiting on your PAN' : 'A payout could not be sent'}
          body={held.heldReason}
          actionLabel={held.status === 'held_pan' ? 'Add my PAN' : 'Check bank details'}
          onAction={() => router.push(held.status === 'held_pan' ? '/apply/document/pan' : '/profile/bank')}
        />
      ) : null}

      {loading ? (
        <Card>
          <View style={{ gap: space.md }}>
            <Skeleton height={34} width="55%" />
            <Skeleton height={16} width="40%" />
          </View>
        </Card>
      ) : (
        <Card style={{ backgroundColor: t.bg.brand, borderColor: t.bg.brand }}>
          <View style={{ gap: space.base }}>
            <Text variant="micro" style={{ color: 'rgba(255,255,255,0.66)' }}>
              Awaiting payout
            </Text>
            <Text
              variant="numericLarge"
              numeric
              style={{ color: '#FFFFFF' }}>
              ₹{(summary?.pendingSettlement ?? 0).toLocaleString('en-IN')}
            </Text>
            <Row gap={7} align="center">
              <Icon name="calendar-outline" size={13} color="rgba(255,255,255,0.66)" />
              <Text variant="caption" style={{ color: 'rgba(255,255,255,0.8)' }}>
                Settled every Friday to HDFC Bank •••• 2528
              </Text>
            </Row>
          </View>
        </Card>
      )}

      <Row gap={space.md}>
        <Card style={{ flex: 1 }}>
          <View style={{ gap: 4 }}>
            <Text variant="micro" tone="tertiary">
              This week
            </Text>
            <Money value={summary?.thisWeek ?? 0} variant="numeric" />
          </View>
        </Card>
        <Card style={{ flex: 1 }}>
          <View style={{ gap: 4 }}>
            <Text variant="micro" tone="tertiary">
              This month
            </Text>
            <Money value={summary?.thisMonth ?? 0} variant="numeric" />
          </View>
        </Card>
      </Row>

      <Section title="Payout history">
        {payouts && payouts.length > 0 ? (
          <ListGroup>
            {payouts.map((p, i) => {
              const meta = PAYOUT_META[p.status];
              return (
                <ListRow
                  key={p.id}
                  first={i === 0}
                  last={i === payouts.length - 1}
                  title={`${shortDate(p.periodStart)} – ${shortDate(p.periodEnd)}`}
                  subtitle={`${p.bookingIds.length} ${p.bookingIds.length === 1 ? 'ceremony' : 'ceremonies'}`}
                  onPress={() => router.push(`/earnings/payout/${p.id}`)}
                  trailing={
                    <View style={{ alignItems: 'flex-end', gap: 4 }}>
                      <Money value={p.net} variant="smallStrong" />
                      <StatusPill label={meta.label} tone={meta.tone} size="sm" />
                    </View>
                  }
                />
              );
            })}
          </ListGroup>
        ) : (
          <Card>
            <EmptyState
              icon="wallet-outline"
              title="No payouts yet"
              body="Your first payout arrives the week after your first completed ceremony."
            />
          </Card>
        )}
      </Section>

      <Section title="Recent ceremonies">
        {completed.length > 0 ? (
          <Card>
            <View style={{ gap: space.base }}>
              {completed.slice(0, 6).map((b, i) => (
                <View key={b.id} style={{ gap: space.base }}>
                  {i > 0 ? <Divider /> : null}
                  <Row justify="space-between" align="flex-start">
                    <View style={{ flex: 1, gap: 3 }}>
                      <Text variant="small">{poojaById(b.poojaId)?.name}</Text>
                      <Text variant="caption" tone="tertiary">
                        {b.completedAt ? shortDate(b.completedAt) : ''} · {b.devotee.name}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: 2 }}>
                      <Money value={netOf(b)} variant="smallStrong" />
                      <Text variant="micro" tone="faint" numeric>
                        ₹{b.gross.toLocaleString('en-IN')} − ₹{commissionOf(b).toLocaleString('en-IN')}
                      </Text>
                    </View>
                  </Row>
                </View>
              ))}
            </View>
          </Card>
        ) : (
          <Card>
            <EmptyState icon="receipt-outline" title="No completed ceremonies yet" />
          </Card>
        )}
      </Section>

      <Row gap={space.sm} align="flex-start">
        <Icon name="calculator-outline" size={14} color={t.fg.tertiary} style={{ marginTop: 2 }} />
        <Text variant="caption" tone="tertiary" style={{ flex: 1 }}>
          Every figure shows the full arithmetic — booking value, the 15% commission, and what
          reaches your bank. Nothing is rounded away.
        </Text>
      </Row>
    </Screen>
  );
}
