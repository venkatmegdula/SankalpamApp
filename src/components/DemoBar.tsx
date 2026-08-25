import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, type IconName } from '@/ui/Icon';
import { useSession } from '@/store/session';
import { useColors, useTheme } from '@/ui/ThemeProvider';
import { Sheet } from '@/ui/layout';
import { Button, Row, Text } from '@/ui/primitives';
import { Toggle } from '@/ui/forms';
import { layout, radius, shadow, space } from '@/ui/tokens';
import type { VerificationStage } from '@/data/types';

/**
 * Scenario switcher for review.
 *
 * Mounted once at the root as a floating control, so **no screen is ever a dead
 * end**. Several states here legitimately have no forward action — "your
 * documents are under review" is correct product design and completely wrong
 * for someone trying to explore the whole app in ten minutes.
 */
const STAGES: { id: VerificationStage; label: string; note: string }[] = [
  { id: 'not_started', label: 'Fresh applicant', note: 'Start the journey from the welcome screen' },
  { id: 'under_review', label: 'Stage 1 · Under review', note: 'Documents submitted, waiting' },
  { id: 'docs_rejected', label: 'Stage 1 · Document rejected', note: 'Address proof needs re-upload' },
  { id: 'stage1_cleared', label: 'Stage 2 · Ready to schedule', note: 'Pick a competency call slot' },
  { id: 'stage2_scheduled', label: 'Stage 2 · Call booked', note: 'Waiting for the conversation' },
  { id: 'stage3_scheduled', label: 'Stage 3 · Trial scheduled', note: 'Supervised pooja arranged' },
  { id: 'stage4_agreement', label: 'Stage 4 · Agreement', note: 'Read and accept to go live' },
  { id: 'active', label: 'Active pujari', note: 'Full app with bookings, earnings, history' },
];

const SHORTCUTS: { label: string; href: string; icon: IconName }[] = [
  { label: 'Conflict on accept', href: '/request/bk_req_2', icon: 'git-branch-outline' },
  { label: 'Check-in failure paths', href: '/booking/bk_today/checkin', icon: 'shield-outline' },
  { label: 'Ceremony mode', href: '/booking/bk_today/ceremony', icon: 'flame-outline' },
  { label: 'Cancellation consequences', href: '/booking/bk_up_1/cancel', icon: 'close-circle-outline' },
];

function DemoSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { jump, offline, setOffline, profile } = useSession();
  const { isDark, setMode } = useTheme();
  const t = useColors();

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title="Demo controls"
      footer={<Button label="Close" variant="ghost" onPress={onClose} />}>
      <Text variant="small" tone="secondary">
        Jump to any point in the journey. Onboarding spans one to three weeks in reality, so these
        states can’t be reached by using the app normally.
      </Text>

      <View style={{ gap: space.sm }}>
        {STAGES.map((s) => {
          const current = profile?.stage === s.id;
          return (
            <Pressable
              key={s.id}
              accessibilityRole="button"
              accessibilityLabel={s.label}
              onPress={async () => {
                onClose();
                await jump(s.id);
                if (s.id === 'active') router.replace('/(tabs)');
                else if (s.id === 'not_started') router.replace('/welcome');
                else router.replace('/verification');
              }}
              style={{
                padding: space.md,
                borderRadius: radius.md,
                backgroundColor: current ? t.bg.brandTint : t.bg.sunken,
                borderWidth: 1.5,
                borderColor: current ? t.line.brand : 'transparent',
                gap: 2,
              }}>
              <Row justify="space-between" align="center">
                <Text variant="smallStrong">{s.label}</Text>
                {current ? <Icon name="checkmark-circle" size={16} color={t.fg.brand} /> : null}
              </Row>
              <Text variant="caption" tone="tertiary">
                {s.note}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {profile?.stage === 'active' ? (
        <View style={{ gap: space.sm, marginTop: space.sm }}>
          <Text variant="micro" tone="tertiary">
            Jump straight to
          </Text>
          {SHORTCUTS.map((s) => (
            <Pressable
              key={s.href}
              accessibilityRole="button"
              accessibilityLabel={s.label}
              onPress={() => {
                onClose();
                router.push(s.href as never);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: space.md,
                padding: space.md,
                borderRadius: radius.md,
                backgroundColor: t.bg.sunken,
              }}>
              <Icon name={s.icon} size={16} color={t.fg.brand} />
              <Text variant="small" style={{ flex: 1 }}>
                {s.label}
              </Text>
              <Icon name="chevron-forward" size={15} color={t.fg.faint} />
            </Pressable>
          ))}
        </View>
      ) : null}

      <View style={{ gap: space.md, marginTop: space.sm }}>
        <Row justify="space-between" align="center">
          <View style={{ flex: 1, gap: 2 }}>
            <Text variant="smallStrong">Simulate offline</Text>
            <Text variant="caption" tone="tertiary">
              Reads serve cached data, writes queue
            </Text>
          </View>
          <Toggle value={offline} onChange={setOffline} accessibilityLabel="Simulate offline" />
        </Row>

        <Row justify="space-between" align="center">
          <View style={{ flex: 1, gap: 2 }}>
            <Text variant="smallStrong">Dark theme</Text>
            <Text variant="caption" tone="tertiary">
              For 4:30 am muhurthams
            </Text>
          </View>
          <Toggle
            value={isDark}
            onChange={(v) => setMode(v ? 'dark' : 'light')}
            accessibilityLabel="Dark theme"
          />
        </Row>
      </View>
    </Sheet>
  );
}

/** Floating launcher, mounted once at the root so it is reachable everywhere. */
export function DemoLauncher() {
  const insets = useSafeAreaInsets();
  const t = useColors();
  const [open, setOpen] = useState(false);

  return (
    <>
      <View
        pointerEvents="box-none"
        style={{ position: 'absolute', inset: 0, alignItems: 'center' } as object}>
        <View
          pointerEvents="box-none"
          style={{ flex: 1, width: '100%', maxWidth: layout.maxContentWidth }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Demo controls"
            onPress={() => setOpen(true)}
            style={({ pressed }) => [
              {
                position: 'absolute',
                right: space.base,
                bottom: insets.bottom + layout.tabBarHeight + space.md,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 7,
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: radius.pill,
                backgroundColor: t.bg.inverse,
                opacity: pressed ? 0.85 : 0.94,
              },
              shadow.lg,
            ]}>
            <Icon name="options-outline" size={15} color={t.fg.inverse} />
            <Text variant="caption" style={{ color: t.fg.inverse }}>
              Demo
            </Text>
          </Pressable>
        </View>
      </View>

      <DemoSheet visible={open} onClose={() => setOpen(false)} />
    </>
  );
}
