import { View } from 'react-native';
import { Icon, type IconName } from '@/ui/Icon';
import { useSession } from '@/store/session';
import { useColors } from '@/ui/ThemeProvider';
import { AppBar, Screen, Section } from '@/ui/layout';
import { Avatar, Banner, Card, Divider, Money, Row, StatusPill, Text } from '@/ui/primitives';
import { LANGUAGES, poojaById, zoneById } from '@/data/fixtures/catalog';
import { space } from '@/ui/tokens';

/** Exactly what a devotee sees. Nothing about the public profile is a surprise. */
export default function PublicProfile() {
  const { profile } = useSession();
  const t = useColors();

  const langs = (profile?.languages ?? [])
    .map((l) => LANGUAGES.find((x) => x.id === l)?.label ?? l)
    .join(' · ');

  return (
    <Screen header={<AppBar title="How devotees see you" />}>
      <Banner
        tone="info"
        title="Preview only"
        body="Your phone number, documents, and earnings are never shown to devotees."
      />

      <Card>
        <View style={{ gap: space.lg }}>
          <Row gap={space.base} align="center">
            <Avatar name={profile?.fullName || 'Pujari'} size={68} />
            <View style={{ flex: 1, gap: 5 }}>
              <Text variant="h3">{profile?.fullName}</Text>
              <Row gap={5} align="center">
                <Icon name="star" size={13} color={t.fg.accent} />
                <Text variant="caption" tone="secondary" numeric>
                  {profile?.rating?.toFixed(1) ?? 'New'} · {profile?.ratingCount ?? 0} ratings
                </Text>
              </Row>
              <StatusPill label="Verified pujari" tone="success" icon="shield-checkmark" size="sm" />
            </View>
          </Row>

          {profile?.bio ? (
            <Text variant="small" tone="secondary">
              {profile.bio}
            </Text>
          ) : null}

          <Divider />

          <Row justify="space-between">
            <View style={{ gap: 3 }}>
              <Text variant="micro" tone="tertiary">
                Experience
              </Text>
              <Text variant="title" numeric>
                {profile?.yearsExperience} yrs
              </Text>
            </View>
            <View style={{ gap: 3 }}>
              <Text variant="micro" tone="tertiary">
                Ceremonies
              </Text>
              <Text variant="title" numeric>
                {profile?.completedBookings}
              </Text>
            </View>
            <View style={{ gap: 3, alignItems: 'flex-end' }}>
              <Text variant="micro" tone="tertiary">
                Serves
              </Text>
              <Text variant="title">
                {zoneById(profile?.zoneId)?.name.split('—')[0].trim() ?? '—'}
              </Text>
            </View>
          </Row>
        </View>
      </Card>

      <Section title="Languages">
        <Card>
          <Text variant="small">{langs || '—'}</Text>
        </Card>
      </Section>

      <Section title="Tradition">
        <Card>
          <View style={{ gap: space.sm }}>
            {profile?.templeServed ? (
              <Row gap={space.sm} align="center">
                <Icon name="business-outline" size={15} color={t.fg.tertiary} />
                <Text variant="small" tone="secondary">
                  {profile.templeServed}
                </Text>
              </Row>
            ) : null}
            {profile?.guruOrInstitution ? (
              <Row gap={space.sm} align="center">
                <Icon name="school-outline" size={15} color={t.fg.tertiary} />
                <Text variant="small" tone="secondary">
                  {profile.guruOrInstitution}
                </Text>
              </Row>
            ) : null}
          </View>
        </Card>
      </Section>

      <Section title="Poojas performed">
        <Card>
          <View style={{ gap: space.base }}>
            {(profile?.poojaIds ?? []).map((id, i) => {
              const p = poojaById(id);
              if (!p) return null;
              return (
                <View key={id} style={{ gap: space.base }}>
                  {i > 0 ? <Divider /> : null}
                  <Row justify="space-between" align="center">
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text variant="small">{p.name}</Text>
                      <Text variant="caption" tone="tertiary">
                        {p.teluguName}
                      </Text>
                    </View>
                    <Money value={p.price} variant="smallStrong" tone="secondary" />
                  </Row>
                </View>
              );
            })}
          </View>
        </Card>
      </Section>
    </Screen>
  );
}
