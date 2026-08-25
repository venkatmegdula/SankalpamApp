import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Icon, type IconName } from '@/ui/Icon';
import { useSession } from '@/store/session';
import { useColors } from '@/ui/ThemeProvider';
import { AppBar, Screen, Section } from '@/ui/layout';
import { Banner, Button, Card, Divider, Money, Row, Skeleton, StatusPill, Text } from '@/ui/primitives';
import { useAsync } from '@/lib/useAsync';
import * as repo from '@/data/repository';
import { poojaById } from '@/data/fixtures/catalog';
import { commissionOf, netOf, shortDate } from '@/lib/format';
import { space } from '@/ui/tokens';

export default function PayoutDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showToast, profile } = useSession();
  const t = useColors();
  const { data: payout, loading } = useAsync(() => repo.getPayout(String(id)), [id]);
  const { data: bookings } = useAsync(() => repo.getBookings(), []);

  if (loading || !payout) {
    return (
      <Screen header={<AppBar title="Payout" />}>
        <Card>
          <Skeleton height={30} width="50%" />
        </Card>
      </Screen>
    );
  }

  const included = (bookings ?? []).filter((b) => payout.bookingIds.includes(b.id));
  const held = payout.status === 'held_pan' || payout.status === 'held_bank';

  return (
    <Screen
      header={<AppBar title="Payout" subtitle={`${shortDate(payout.periodStart)} – ${shortDate(payout.periodEnd)}`} />}
      footer={
        <Button
          label="Download statement"
          variant="secondary"
          icon="download-outline"
          onPress={() => showToast('Statement downloaded', 'info')}
        />
      }>
      {held ? (
        <Banner
          tone="error"
          title={payout.status === 'held_pan' ? 'Waiting on your PAN' : 'Bank transfer failed'}
          body={payout.heldReason}
          actionLabel={payout.status === 'held_pan' ? 'Add my PAN' : 'Update bank details'}
          onAction={() =>
            router.push(payout.status === 'held_pan' ? '/apply/document/pan' : '/profile/bank')
          }
        />
      ) : null}

      <Card>
        <View style={{ gap: space.base }}>
          <Row justify="space-between" align="center">
            <Text variant="micro" tone="tertiary">
              {payout.status === 'paid' ? 'Credited' : 'Amount'}
            </Text>
            <StatusPill
              label={
                payout.status === 'paid'
                  ? 'Paid'
                  : payout.status === 'processing'
                    ? 'Processing'
                    : 'On hold'
              }
              tone={payout.status === 'paid' ? 'success' : payout.status === 'processing' ? 'info' : 'error'}
              icon={payout.status === 'paid' ? 'checkmark-circle' : 'time'}
              size="sm"
            />
          </Row>
          <Money value={payout.net} variant="numericLarge" />
          {payout.paidAt ? (
            <Row gap={6} align="center">
              <Icon name="card-outline" size={13} color={t.fg.tertiary} />
              <Text variant="caption" tone="tertiary">
                {shortDate(payout.paidAt)} · {profile?.bank?.bankName ?? 'Bank'}{' '}
                {profile?.bank?.accountNumberMasked ?? ''}
              </Text>
            </Row>
          ) : null}
        </View>
      </Card>

      <Section title="How this was calculated">
        <Card>
          <View style={{ gap: space.md }}>
            <Row justify="space-between">
              <Text variant="small" tone="secondary">
                Total booking value
              </Text>
              <Money value={payout.gross} variant="smallStrong" tone="secondary" />
            </Row>
            <Row justify="space-between">
              <Text variant="small" tone="secondary">
                Sankalpam commission (15%)
              </Text>
              <Text variant="smallStrong" tone="secondary" numeric>
                −₹{payout.commission.toLocaleString('en-IN')}
              </Text>
            </Row>
            <Row justify="space-between">
              <Text variant="small" tone="secondary">
                TDS
              </Text>
              <Text variant="smallStrong" tone="secondary" numeric>
                {payout.tds > 0 ? `−₹${payout.tds.toLocaleString('en-IN')}` : '₹0'}
              </Text>
            </Row>
            <Divider />
            <Row justify="space-between" align="center">
              <Text variant="title">Paid to you</Text>
              <Money value={payout.net} variant="numeric" />
            </Row>
          </View>
        </Card>
      </Section>

      <Section title={`Ceremonies included · ${included.length}`}>
        {included.length > 0 ? (
          <Card>
            <View style={{ gap: space.base }}>
              {included.map((b, i) => (
                <View key={b.id} style={{ gap: space.base }}>
                  {i > 0 ? <Divider /> : null}
                  <Row justify="space-between" align="flex-start">
                    <View style={{ flex: 1, gap: 3 }}>
                      <Text variant="small">{poojaById(b.poojaId)?.name}</Text>
                      <Text variant="caption" tone="tertiary">
                        {b.completedAt ? shortDate(b.completedAt) : ''} · {b.reference}
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
            <Text variant="small" tone="tertiary">
              No individual ceremonies are attached to this payout.
            </Text>
          </Card>
        )}
      </Section>
    </Screen>
  );
}
