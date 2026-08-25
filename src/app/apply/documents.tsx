import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from '@/ui/Icon';
import { useSession } from '@/store/session';
import { useColors } from '@/ui/ThemeProvider';
import { AppBar, Screen } from '@/ui/layout';
import * as repo from '@/data/repository';
import { Button, Row, StatusPill, Text } from '@/ui/primitives';
import { radius, space } from '@/ui/tokens';
import type { DocumentStatus } from '@/data/types';

const STATUS_META: Record<
  DocumentStatus,
  { label: string; tone: 'neutral' | 'success' | 'error' | 'warning'; icon: 'ellipse-outline' | 'checkmark-circle' | 'alert-circle' | 'time' }
> = {
  not_started: { label: 'Not added', tone: 'neutral', icon: 'ellipse-outline' },
  captured: { label: 'Ready', tone: 'warning', icon: 'time' },
  uploading: { label: 'Uploading', tone: 'warning', icon: 'time' },
  uploaded: { label: 'Added', tone: 'success', icon: 'checkmark-circle' },
  rejected: { label: 'Needs re-upload', tone: 'error', icon: 'alert-circle' },
};

export default function Documents() {
  const { profile, refreshProfile, showToast } = useSession();
  const t = useColors();
  const [filling, setFilling] = useState(false);
  const docs = profile?.documents ?? [];
  const done = docs.filter((d) => d.status === 'uploaded').length;
  const all = done === docs.length && docs.length > 0;

  return (
    <Screen
      header={<AppBar title="Your documents" subtitle={`${done} of ${docs.length} added`} />}
      footer={
        <>
          <Text
            variant="caption"
            tone={all ? 'tertiary' : 'error'}
            center
            style={{ marginBottom: 2 }}>
            {all ? 'All six documents added' : `${docs.length - done} still to add.`}
          </Text>
          <Button label="Done" disabled={!all} onPress={() => router.back()} />
        </>
      }>
      <View style={{ gap: space.xs }}>
        <Text variant="h2">Your documents</Text>
        <Text variant="small" tone="secondary">
          Six documents. Each one is explained before you take the photo.
        </Text>
      </View>
      <View style={{ gap: space.sm }}>
        {docs.map((d) => {
          const meta = STATUS_META[d.status];
          return (
            <Pressable
              key={d.kind}
              accessibilityRole="button"
              accessibilityLabel={`${d.label}, ${meta.label}`}
              onPress={() => router.push(`/apply/document/${d.kind}`)}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: space.md,
                padding: space.base,
                borderRadius: radius.md,
                backgroundColor: t.bg.surface,
                borderWidth: 1.5,
                borderColor: d.status === 'rejected' ? t.status.errorFg : t.line.default,
                opacity: pressed ? 0.9 : 1,
              })}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: radius.sm,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor:
                    d.status === 'uploaded'
                      ? t.status.successBg
                      : d.status === 'rejected'
                        ? t.status.errorBg
                        : t.bg.sunken,
                }}>
                <Icon
                  name={d.status === 'uploaded' ? 'document-text' : 'document-text-outline'}
                  size={19}
                  color={
                    d.status === 'uploaded'
                      ? t.status.successFg
                      : d.status === 'rejected'
                        ? t.status.errorFg
                        : t.fg.secondary
                  }
                />
              </View>

              <View style={{ flex: 1, gap: 4 }}>
                <Text variant="title">{d.label}</Text>
                {d.status === 'rejected' && d.rejectionReason ? (
                  <Text variant="caption" tone="error">
                    {d.rejectionReason}
                  </Text>
                ) : (
                  <StatusPill label={meta.label} tone={meta.tone} icon={meta.icon} size="sm" />
                )}
              </View>

              <Icon name="chevron-forward" size={17} color={t.fg.faint} />
            </Pressable>
          );
        })}
      </View>

      <Row gap={space.sm} align="flex-start">
        <Icon name="shield-checkmark" size={15} color={t.fg.brand} style={{ marginTop: 1 }} />
        <Text variant="caption" tone="tertiary" style={{ flex: 1 }}>
          Documents are encrypted in transit and at rest, seen only by the verification team, and
          never shown to devotees.
        </Text>
      </Row>

      {/* Prototype affordance — no production equivalent. Reviewing on a desktop
          with no camera shouldn't mean six capture cycles to get past this step. */}
      {!all ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Demo: fill in all six documents"
          disabled={filling}
          onPress={async () => {
            setFilling(true);
            await repo.markAllDocumentsUploaded();
            await refreshProfile();
            setFilling(false);
            showToast('All six documents added');
          }}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            paddingVertical: space.md,
            borderRadius: radius.md,
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: t.line.default,
            opacity: filling ? 0.5 : pressed ? 0.7 : 1,
          })}>
          <Icon name="flash-outline" size={14} color={t.fg.tertiary} />
          <Text variant="caption" tone="tertiary">
            {filling ? 'Adding…' : 'Demo: fill in all six documents'}
          </Text>
        </Pressable>
      ) : null}
    </Screen>
  );
}
