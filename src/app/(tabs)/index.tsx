import { View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from '@/ui/Icon';
import { useSession } from '@/store/session';
import { useColors } from '@/ui/ThemeProvider';
import { AppBar, Screen, Section } from '@/ui/layout';
import {
  Avatar,
  Banner,
  Button,
  Card,
  EmptyState,
  IconButton,
  Money,
  Row,
  Skeleton,
  Stat,
  Text,
} from '@/ui/primitives';
import { BookingCard, RequestCard, TodayCeremonyCard } from '@/components/BookingCards';
import { useAsync } from '@/lib/useAsync';
import * as repo from '@/data/repository';
import { greeting } from '@/lib/format';
import { space } from '@/ui/tokens';

export default function Home() {
  const { profile } = useSession();
  const t = useColors();

  const { data: requests, loading: loadingReq, error } = useAsync(() => repo.getRequests(), []);
  const { data: upcoming } = useAsync(() => repo.getUpcoming(), []);
  const { data: earnings } = useAsync(() => repo.getEarnings(), []);
  const { data: notifications } = useAsync(() => repo.getNotifications(), []);

  const unread = notifications?.filter((n) => !n.read).length ?? 0;
  const today = upcoming?.find(
    (b) => new Date(b.scheduledAt).toDateString() === new Date().toDateString(),
  );
  const later = (upcoming ?? []).filter((b) => b.id !== today?.id).slice(0, 3);
  const firstName = (profile?.fullName ?? '').split(' ')[0] || 'Pujari';

  return (
    <Screen
      header={
        <AppBar
          onBack={false}
          right={
            <Row gap={0} align="center">
              <View>
                <IconButton
                  name="notifications-outline"
                  label={`Notifications, ${unread} unread`}
                  onPress={() => router.push('/notifications')}
                />
                {unread > 0 ? (
                  <View
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      width: 9,
                      height: 9,
                      borderRadius: 5,
                      backgroundColor: t.status.urgentFg,
                      borderWidth: 1.5,
                      borderColor: t.bg.canvas,
                    }}
                  />
                ) : null}
              </View>
              <IconButton
                name="help-circle-outline"
                label="Help"
                onPress={() => router.push('/help')}
              />
            </Row>
          }
        />
      }>
      {/* Greeting. Availability lives on its own screen, reachable below. */}
      <Row justify="space-between" align="center">
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="caption" tone="tertiary">
            {greeting()}
          </Text>
          <Text variant="h1" numberOfLines={1}>
            {firstName}
          </Text>
        </View>
        <Avatar name={profile?.fullName || 'Pujari'} size={46} />
      </Row>

      {error === 'offline' ? (
        <Banner
          tone="warning"
          title="Showing your last synced information"
          body="New requests won't appear until you're back online."
        />
      ) : null}

      {today ? <TodayCeremonyCard booking={today} /> : null}

      <Section
        title={`Pending requests${requests?.length ? ` · ${requests.length}` : ''}`}
        action={requests?.length ? 'See all' : undefined}
        onAction={() => router.push('/requests')}>
        {loadingReq ? (
          <Card>
            <View style={{ gap: space.sm }}>
              <Skeleton height={20} width="60%" />
              <Skeleton height={14} width="40%" />
            </View>
          </Card>
        ) : requests && requests.length > 0 ? (
          <View style={{ gap: space.md }}>
            {requests.slice(0, 2).map((b) => (
              <RequestCard key={b.id} booking={b} />
            ))}
          </View>
        ) : (
          <Card>
            <EmptyState
              icon="notifications-off-outline"
              title="No requests right now"
              body="You'll be notified as soon as a devotee in your zone books a pooja you perform."
            />
          </Card>
        )}
      </Section>

      <Section title="This week">
        <Card>
          <Row justify="space-between" align="center">
            <Stat label="Earned">
              <Money value={earnings?.thisWeek ?? 0} variant="numeric" />
            </Stat>
            <View style={{ width: 1, height: 34, backgroundColor: t.line.default }} />
            <Stat label="Awaiting payout" align="center">
              <Money value={earnings?.pendingSettlement ?? 0} variant="numeric" tone="accent" />
            </Stat>
            <View style={{ width: 1, height: 34, backgroundColor: t.line.default }} />
            <Stat label="Ceremonies" align="right">
              <Text variant="numeric" numeric>
                {earnings?.completedThisMonth ?? 0}
              </Text>
            </Stat>
          </Row>
        </Card>
      </Section>

      {later.length > 0 ? (
        <Section title="Coming up" action="Calendar" onAction={() => router.push('/(tabs)/calendar')}>
          <View style={{ gap: space.md }}>
            {later.map((b) => (
              <BookingCard key={b.id} booking={b} />
            ))}
          </View>
        </Section>
      ) : null}

      <Section title="Quick actions">
        <Row gap={space.md}>
          <Button
            label="Get help"
            variant="secondary"
            size="sm"
            icon="help-buoy-outline"
            onPress={() => router.push('/help')}
            style={{ flex: 1 }}
          />
        </Row>
      </Section>

    </Screen>
  );
}
