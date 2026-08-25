import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from '@/ui/Icon';
import { useSession } from '@/store/session';
import { useColors } from '@/ui/ThemeProvider';
import { AppBar, Screen } from '@/ui/layout';
import { Avatar, Banner, Button, Card, Row, StatusPill, Text } from '@/ui/primitives';
import { Field, Input } from '@/ui/forms';
import { LANGUAGES, poojaById, zoneById } from '@/data/fixtures/catalog';
import { space } from '@/ui/tokens';

/**
 * "This is how devotees will see you."
 * Shown before go-live so nothing about the public profile is a surprise.
 */
export default function ProfileSetup() {
  const { profile, draft, advance, showToast } = useSession();
  const t = useColors();
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [busy, setBusy] = useState(false);

  const name = draft.fullName || profile?.fullName || 'Your name';
  const langs = (draft.languages.length ? draft.languages : profile?.languages ?? [])
    .map((l) => LANGUAGES.find((x) => x.id === l)?.label ?? l)
    .join(' · ');
  const poojaIds = draft.poojaIds.length ? draft.poojaIds : (profile?.poojaIds ?? []);
  const years = draft.yearsExperience || profile?.yearsExperience || 0;
  const zone = zoneById(draft.zoneId || profile?.zoneId);

  return (
    <Screen
      header={<AppBar title="Your public profile" />}
      footer={
        <Button
          label="Confirm and go live"
          loading={busy}
          onPress={async () => {
            setBusy(true);
            await advance('active');
            showToast('You are live. Bookings will start appearing.');
            router.replace('/(tabs)');
          }}
        />
      }>
      <Banner
        tone="info"
        title="This is exactly what devotees see"
        body="Your phone number and documents are never shown. Check everything before you go live."
      />

      <Card>
        <View style={{ gap: space.base }}>
          <Row gap={space.base} align="center">
            <Avatar name={name} size={60} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text variant="h3">{name}</Text>
              <Text variant="caption" tone="tertiary">
                {years} years experience
              </Text>
              <Row gap={space.xs}>
                <StatusPill label="Verified" tone="success" icon="shield-checkmark" size="sm" />
                <StatusPill label="New partner" tone="brand" size="sm" />
              </Row>
            </View>
          </Row>

          <View style={{ gap: 3 }}>
            <Text variant="micro" tone="tertiary">
              Languages
            </Text>
            <Text variant="small">{langs || '—'}</Text>
          </View>

          <View style={{ gap: 3 }}>
            <Text variant="micro" tone="tertiary">
              Serves
            </Text>
            <Text variant="small">{zone?.name ?? '—'}</Text>
          </View>

          <View style={{ gap: 6 }}>
            <Text variant="micro" tone="tertiary">
              Poojas performed
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {poojaIds.map((id) => (
                <View
                  key={id}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 999,
                    backgroundColor: t.bg.sunken,
                  }}>
                  <Text variant="caption" tone="secondary">
                    {poojaById(id)?.name ?? id}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Card>

      <Field
        label="A short introduction"
        hint="Optional. Devotees read this when choosing a pujari — a sentence or two about how you work is enough.">
        <Input
          value={bio}
          onChangeText={setBio}
          multiline
          placeholder="Fourteen years performing household ceremonies across west Hyderabad…"
        />
      </Field>

      <Row gap={space.sm} align="flex-start">
        <Icon name="create-outline" size={15} color={t.fg.tertiary} style={{ marginTop: 2 }} />
        <Text variant="caption" tone="tertiary" style={{ flex: 1 }}>
          You can edit any of this later from Profile.
        </Text>
      </Row>
    </Screen>
  );
}
