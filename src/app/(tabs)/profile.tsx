import { View } from 'react-native';
import { router } from 'expo-router';
import { useSession } from '@/store/session';
import { AppBar, ListGroup, ListRow, Screen, Section } from '@/ui/layout';
import { Avatar, Button, Card, Divider, Row, StatusPill, Text } from '@/ui/primitives';
import { useAsync } from '@/lib/useAsync';
import * as repo from '@/data/repository';
import { LANGUAGES, zoneById } from '@/data/fixtures/catalog';
import { shortDate } from '@/lib/format';
import { space } from '@/ui/tokens';

export default function Profile() {
  const { profile } = useSession();
  const { data: reviews } = useAsync(() => repo.getReviews(), []);

  const langs = (profile?.languages ?? [])
    .map((l) => LANGUAGES.find((x) => x.id === l)?.label ?? l)
    .join(' · ');

  return (
    <Screen header={<AppBar onBack={false} large title="Profile" />}>
      <Card>
        <View style={{ gap: space.base }}>
          <Row gap={space.base} align="center">
            <Avatar name={profile?.fullName || 'Pujari'} size={62} />
            <View style={{ flex: 1, gap: 5 }}>
              <Text variant="h3" numberOfLines={1}>
                {profile?.fullName || 'Pujari'}
              </Text>
              <Text variant="caption" tone="tertiary">
                {profile?.yearsExperience} years · {zoneById(profile?.zoneId)?.name.split('—')[0].trim()}
              </Text>
              <Row gap={space.xs}>
                <StatusPill label="Verified" tone="success" icon="shield-checkmark" size="sm" />
                {profile?.rating ? (
                  <StatusPill
                    label={`${profile.rating.toFixed(1)} · ${profile.ratingCount}`}
                    tone="brand"
                    icon="star"
                    size="sm"
                  />
                ) : null}
              </Row>
            </View>
          </Row>

          <Divider />

          <Row justify="space-between">
            <View style={{ gap: 2 }}>
              <Text variant="micro" tone="tertiary">
                Ceremonies
              </Text>
              <Text variant="title" numeric>
                {profile?.completedBookings ?? 0}
              </Text>
            </View>
            <View style={{ gap: 2 }}>
              <Text variant="micro" tone="tertiary">
                Languages
              </Text>
              <Text variant="title">{(profile?.languages ?? []).length}</Text>
            </View>
            <View style={{ gap: 2, alignItems: 'flex-end' }}>
              <Text variant="micro" tone="tertiary">
                Member since
              </Text>
              <Text variant="title">
                {profile?.memberSince ? shortDate(profile.memberSince) : '—'}
              </Text>
            </View>
          </Row>
        </View>
      </Card>

      <Button
        label="See how devotees see you"
        variant="secondary"
        icon="eye-outline"
        onPress={() => router.push('/profile/public')}
      />

      <Section title="Your practice">
        <ListGroup>
          <ListRow
            first
            icon="person-outline"
            iconTone="brand"
            title="Edit profile"
            subtitle={langs || 'Photo, bio, languages'}
            onPress={() => router.push('/profile/edit')}
          />
          <ListRow
            icon="flame-outline"
            iconTone="brand"
            title="Poojas I perform"
            value={`${profile?.poojaIds.length ?? 0}`}
            onPress={() => router.push('/profile/services')}
          />
          <ListRow
            last
            icon="star-outline"
            iconTone="accent"
            title="Ratings & reviews"
            value={`${reviews?.length ?? 0}`}
            onPress={() => router.push('/profile/reviews')}
          />
        </ListGroup>
      </Section>

      <Section title="Payouts">
        <ListGroup>
          <ListRow
            first
            icon="card-outline"
            iconTone="accent"
            title="Bank account"
            subtitle={
              profile?.bank
                ? `${profile.bank.bankName} ${profile.bank.accountNumberMasked}`
                : 'Not added'
            }
            onPress={() => router.push('/profile/bank')}
          />
          <ListRow
            last
            icon="document-text-outline"
            title="Documents & re-verification"
            subtitle="Next annual check in 10 months"
            onPress={() => router.push('/apply/documents')}
          />
        </ListGroup>
      </Section>

      <Section title="Support">
        <ListGroup>
          <ListRow
            first
            icon="help-buoy-outline"
            iconTone="brand"
            title="Help & support"
            onPress={() => router.push('/help')}
          />
          <ListRow
            icon="warning-outline"
            iconTone="error"
            title="Report a safety concern"
            onPress={() => router.push('/safety')}
          />
          <ListRow
            last
            icon="document-lock-outline"
            title="Agreement & policies"
            onPress={() => router.push('/legal')}
          />
        </ListGroup>
      </Section>

      <Section title="App">
        <ListGroup>
          <ListRow
            first
            icon="settings-outline"
            title="Settings"
            subtitle="Language, notifications, theme"
            onPress={() => router.push('/settings')}
          />
          <ListRow
            last
            icon="log-out-outline"
            destructive
            title="Sign out"
            onPress={() => router.replace('/welcome')}
          />
        </ListGroup>
      </Section>

    </Screen>
  );
}
