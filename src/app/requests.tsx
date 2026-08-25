import { View } from 'react-native';
import { useColors } from '@/ui/ThemeProvider';
import { AppBar, Screen } from '@/ui/layout';
import { Banner, Card, EmptyState, Row, Skeleton, Text } from '@/ui/primitives';
import { RequestCard } from '@/components/BookingCards';
import { useAsync } from '@/lib/useAsync';
import * as repo from '@/data/repository';
import { space } from '@/ui/tokens';
import { Icon, type IconName } from '@/ui/Icon';

export default function Requests() {
  const t = useColors();
  const { data, loading, error, reload } = useAsync(() => repo.getRequests(), []);

  return (
    <Screen
      header={
        <AppBar
          large
          title="Requests"
          subtitle="Sorted by how soon they expire"
        />
      }>
      {error === 'offline' ? (
        <Banner
          tone="warning"
          title="You're offline"
          body="Requests can't be accepted offline — acceptance is a race against other pujaris, and we won't tell you it worked when it hasn't."
          actionLabel="Try again"
          onAction={reload}
        />
      ) : null}

      {loading ? (
        <View style={{ gap: space.md }}>
          {[0, 1, 2].map((i) => (
            <Card key={i}>
              <View style={{ gap: space.sm }}>
                <Skeleton height={22} width="55%" />
                <Skeleton height={14} width="72%" />
                <Skeleton height={14} width="35%" />
              </View>
            </Card>
          ))}
        </View>
      ) : data && data.length > 0 ? (
        <>
          <Row gap={space.sm} align="flex-start">
            <Icon name="information-circle-outline" size={15} color={t.fg.tertiary} />
            <Text variant="caption" tone="tertiary" style={{ flex: 1 }}>
              Declining is always fine — it never counts against you. The amount shown is what
              reaches your bank, after the 15% commission.
            </Text>
          </Row>
          <View style={{ gap: space.md }}>
            {data.map((b) => (
              <RequestCard key={b.id} booking={b} />
            ))}
          </View>
        </>
      ) : (
        <Card>
          <EmptyState
            icon="notifications-off-outline"
            title="No pending requests"
            body="When a devotee in your zone books a pooja you perform, it appears here and we'll notify you by push and SMS."
          />
        </Card>
      )}
    </Screen>
  );
}
