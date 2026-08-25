import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useSession } from '@/store/session';
import { useTheme } from '@/ui/ThemeProvider';
import { AppBar, ListGroup, ListRow, Screen, Section, Sheet } from '@/ui/layout';
import { Button, Text } from '@/ui/primitives';
import { RadioRow, Toggle } from '@/ui/forms';
import { space } from '@/ui/tokens';
import type { Locale } from '@/data/types';

const LOCALES: { id: Locale; label: string; sub: string }[] = [
  { id: 'te', label: 'తెలుగు', sub: 'Telugu' },
  { id: 'hi', label: 'हिंदी', sub: 'Hindi' },
  { id: 'en', label: 'English', sub: 'English' },
];

export default function Settings() {
  const { locale, setLocale, offline, setOffline, showToast } = useSession();
  const { mode, setMode, isDark } = useTheme();
  const [langOpen, setLangOpen] = useState(false);
  const [push, setPush] = useState(true);
  const [sms, setSms] = useState(true);
  const [whatsapp, setWhatsapp] = useState(false);

  const current = LOCALES.find((l) => l.id === locale);

  return (
    <Screen header={<AppBar title="Settings" />}>
      <Section title="Language">
        <ListGroup>
          <ListRow
            first
            last
            icon="language-outline"
            iconTone="brand"
            title="App language"
            value={current?.sub}
            onPress={() => setLangOpen(true)}
          />
        </ListGroup>
      </Section>

      <Section title="Notifications">
        <ListGroup>
          <ListRow
            first
            icon="notifications-outline"
            title="Push notifications"
            subtitle="Booking requests, reminders, payouts"
            chevron={false}
            trailing={<Toggle value={push} onChange={setPush} accessibilityLabel="Push notifications" />}
          />
          <ListRow
            icon="chatbox-outline"
            title="SMS"
            subtitle="Verification updates and payouts"
            chevron={false}
            trailing={<Toggle value={sms} onChange={setSms} accessibilityLabel="SMS notifications" />}
          />
          <ListRow
            last
            icon="logo-whatsapp"
            title="WhatsApp"
            subtitle="Often the most reliable channel"
            chevron={false}
            trailing={
              <Toggle value={whatsapp} onChange={setWhatsapp} accessibilityLabel="WhatsApp notifications" />
            }
          />
        </ListGroup>
        <Text variant="caption" tone="tertiary">
          Notifications are always paused while a ceremony is in progress. Calls from the devotee
          still come through.
        </Text>
      </Section>

      <Section title="Appearance">
        <ListGroup>
          <ListRow
            first
            icon="contrast-outline"
            title="Dark theme"
            subtitle="Easier on the eyes for early muhurthams"
            chevron={false}
            trailing={
              <Toggle
                value={isDark}
                onChange={(v) => setMode(v ? 'dark' : 'light')}
                accessibilityLabel="Dark theme"
              />
            }
          />
          <ListRow
            last
            icon="phone-portrait-outline"
            title="Match my phone"
            subtitle={mode === 'system' ? 'On' : 'Off'}
            onPress={() => setMode('system')}
          />
        </ListGroup>
      </Section>

      <Section title="Privacy & data">
        <ListGroup>
          <ListRow
            first
            icon="lock-closed-outline"
            title="Your documents"
            subtitle="Encrypted, seen only by the verification team"
            onPress={() => router.push('/legal')}
          />
          <ListRow
            icon="shield-outline"
            title="Consent & data retention"
            onPress={() => router.push('/legal')}
          />
          <ListRow
            last
            icon="cloud-offline-outline"
            title="Simulate offline"
            subtitle="For demonstration"
            chevron={false}
            trailing={<Toggle value={offline} onChange={setOffline} accessibilityLabel="Simulate offline" />}
          />
        </ListGroup>
      </Section>

      <Section title="Account">
        <ListGroup>
          <ListRow
            first
            last
            icon="trash-outline"
            destructive
            title="Deactivate account"
            onPress={() => showToast('Deactivation requires speaking to your coordinator', 'info')}
          />
        </ListGroup>
      </Section>

      <Sheet
        visible={langOpen}
        onClose={() => setLangOpen(false)}
        title="App language"
        footer={<Button label="Done" onPress={() => setLangOpen(false)} />}>
        <View style={{ gap: space.md }}>
          {LOCALES.map((l) => (
            <RadioRow
              key={l.id}
              selected={locale === l.id}
              onPress={() => {
                setLocale(l.id);
                showToast(`Language set to ${l.sub}`, 'info');
              }}
              title={l.label}
              subtitle={l.sub}
            />
          ))}
        </View>
        <Text variant="caption" tone="tertiary">
          Changing the language never affects your bookings or earnings.
        </Text>
      </Sheet>
    </Screen>
  );
}
