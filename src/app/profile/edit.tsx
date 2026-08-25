import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useSession } from '@/store/session';
import { AppBar, Screen } from '@/ui/layout';
import { Avatar, Button, Row, Text } from '@/ui/primitives';
import { ChipGroup, Field, Input } from '@/ui/forms';
import * as repo from '@/data/repository';
import { LANGUAGES } from '@/data/fixtures/catalog';
import { space } from '@/ui/tokens';

export default function EditProfile() {
  const { profile, refreshProfile, showToast } = useSession();
  const [name, setName] = useState(profile?.fullName ?? '');
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [langs, setLangs] = useState<string[]>(profile?.languages ?? []);
  const [temple, setTemple] = useState(profile?.templeServed ?? '');
  const [busy, setBusy] = useState(false);

  return (
    <Screen
      header={<AppBar title="Edit profile" />}
      footer={
        <Button
          label="Save changes"
          loading={busy}
          disabled={name.trim().length < 3 || langs.length === 0}
          onPress={async () => {
            setBusy(true);
            await repo.updateProfile({
              fullName: name,
              bio,
              languages: langs,
              templeServed: temple,
            });
            await refreshProfile();
            setBusy(false);
            showToast('Profile updated');
            router.back();
          }}
        />
      }>
      <Row gap={space.base} align="center">
        <Avatar name={name || 'Pujari'} size={64} />
        <View style={{ flex: 1 }}>
          <Button
            label="Change photo"
            variant="secondary"
            size="sm"
            icon="camera-outline"
            fullWidth={false}
            onPress={() => showToast('Camera opens on a real device', 'info')}
          />
        </View>
      </Row>

      <Field label="Full name" required>
        <Input value={name} onChangeText={setName} placeholder="Your name" />
      </Field>

      <Field
        label="Introduction"
        hint="Devotees read this when choosing a pujari. Two sentences is plenty.">
        <Input value={bio} onChangeText={setBio} multiline placeholder="How you work" />
      </Field>

      <Field label="Languages" required>
        <ChipGroup options={LANGUAGES} value={langs} onChange={setLangs} multi />
      </Field>

      <Field label="Temple served" hint="Optional.">
        <Input value={temple} onChangeText={setTemple} placeholder="Temple name" />
      </Field>

      <Text variant="caption" tone="tertiary">
        Changing your zone, service type, or the poojas you perform may need a short re-approval —
        those live under “Poojas I perform” and Availability.
      </Text>
    </Screen>
  );
}
