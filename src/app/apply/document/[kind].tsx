import { useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Icon, type IconName } from '@/ui/Icon';
import { Appear } from '@/components/Appear';
import { useSession } from '@/store/session';
import { useColors } from '@/ui/ThemeProvider';
import { AppBar, Screen } from '@/ui/layout';
import { Banner, Button, Card, Row, Text } from '@/ui/primitives';
import * as repo from '@/data/repository';
import { radius, space } from '@/ui/tokens';
import type { DocumentKind } from '@/data/types';

type Phase = 'why' | 'capture' | 'checking' | 'failed' | 'preview' | 'uploading';

const QUALITY_TIPS = [
  'Place the document on a flat, dark surface',
  'Make sure all four corners are visible',
  'Avoid glare — move away from direct light',
  'Hold steady until the photo is sharp',
];

/**
 * Document capture, reused for all six documents.
 *
 * The quality check is the point: a rejected document days later costs an
 * applicant far more than a retake now, and "blurry" is the single most common
 * rejection reason in KYC flows.
 *
 * The mock fails that check exactly once per session so the guidance path is
 * demonstrated without making a reviewer retake all six.
 */
let blurPathShown = false;
export default function DocumentCapture() {
  const { kind } = useLocalSearchParams<{ kind: string }>();
  const { profile, refreshProfile, showToast, offline } = useSession();
  const t = useColors();

  const doc = profile?.documents.find((d) => d.kind === kind);
  const [phase, setPhase] = useState<Phase>(doc?.status === 'rejected' ? 'why' : 'why');
  const [attempts, setAttempts] = useState(0);

  if (!doc) {
    return (
      <Screen header={<AppBar title="Document" />}>
        <Text variant="body">This document could not be found.</Text>
      </Screen>
    );
  }

  const runCapture = () => {
    setPhase('checking');
    setTimeout(() => {
      if (!blurPathShown && attempts === 0) {
        blurPathShown = true;
        setAttempts(1);
        setPhase('failed');
      } else {
        setPhase('preview');
      }
    }, 1100);
  };

  const upload = async () => {
    setPhase('uploading');
    try {
      await repo.setDocumentStatus(doc.kind as DocumentKind, 'uploaded');
      await refreshProfile();
      showToast(`${doc.label} added`);
      router.back();
    } catch {
      // Offline writes queue rather than fail — never claim success falsely.
      await repo.setDocumentStatus(doc.kind as DocumentKind, 'captured');
      await refreshProfile();
      showToast('Saved. It will upload when you\'re back online.', 'info');
      router.back();
    }
  };

  return (
    <Screen
      header={<AppBar title={doc.label} />}
      footer={
        phase === 'why' ? (
          <Button label="Take photo" icon="camera" onPress={runCapture} />
        ) : phase === 'failed' ? (
          <Button label="Retake photo" icon="camera" onPress={runCapture} />
        ) : phase === 'preview' ? (
          <>
            <Button label="Use this photo" loading={false} onPress={() => void upload()} />
            <Button label="Retake" variant="ghost" onPress={runCapture} />
          </>
        ) : (
          <Button label="Please wait" loading disabled />
        )
      }>
      {doc.status === 'rejected' && doc.rejectionReason ? (
        <Banner
          tone="error"
          title="This document was not accepted"
          body={doc.rejectionReason}
          icon="alert-circle"
        />
      ) : null}

      <Card style={{ backgroundColor: t.bg.brandTint }} elevated={false}>
        <Row gap={space.md} align="flex-start">
          <Icon name="help-circle" size={20} color={t.fg.brand} />
          <View style={{ flex: 1, gap: 3 }}>
            <Text variant="smallStrong" tone="brand">
              Why we need this
            </Text>
            <Text variant="small" tone="secondary">
              {doc.why}
            </Text>
          </View>
        </Row>
      </Card>

      {/* Viewfinder stand-in. On device this is the live camera with a framing guide. */}
      <View
        style={{
          aspectRatio: 1.58,
          borderRadius: radius.lg,
          backgroundColor: t.bg.inverse,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
        <View
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            right: 16,
            bottom: 16,
            borderRadius: radius.md,
            borderWidth: 2,
            borderStyle: 'dashed',
            borderColor:
              phase === 'failed'
                ? t.status.errorFg
                : phase === 'preview'
                  ? t.status.successFg
                  : 'rgba(255,255,255,0.42)',
          }}
        />
        {phase === 'checking' || phase === 'uploading' ? (
          <Appear from="none" style={{ alignItems: 'center', gap: space.sm }}>
            <Icon name="scan" size={30} color="#FFFFFF" />
            <Text variant="caption" style={{ color: '#FFFFFF' }}>
              {phase === 'checking' ? 'Checking photo quality…' : 'Uploading…'}
            </Text>
          </Appear>
        ) : phase === 'preview' ? (
          <Appear from="none" style={{ alignItems: 'center', gap: space.sm }}>
            <Icon name="checkmark-circle" size={34} color="#63C795" />
            <Text variant="caption" style={{ color: '#FFFFFF' }}>
              Sharp and readable
            </Text>
          </Appear>
        ) : (
          <Icon name="camera-outline" size={32} color="rgba(255,255,255,0.6)" />
        )}
      </View>

      {phase === 'failed' ? (
        <Appear from="none">
          <Banner
            tone="warning"
            title="Too blurry to read"
            body="Hold the phone steady and make sure the document is flat. Try once more."
          />
        </Appear>
      ) : null}

      {phase === 'why' || phase === 'failed' ? (
        <View style={{ gap: space.sm }}>
          <Text variant="micro" tone="tertiary">
            For a clear photo
          </Text>
          {QUALITY_TIPS.map((tip) => (
            <Row key={tip} gap={space.sm} align="flex-start">
              <Icon name="ellipse" size={5} color={t.fg.faint} style={{ marginTop: 8 }} />
              <Text variant="small" tone="secondary" style={{ flex: 1 }}>
                {tip}
              </Text>
            </Row>
          ))}
        </View>
      ) : null}

      {offline ? (
        <Banner
          tone="warning"
          title="You're offline"
          body="You can still take the photo. It will upload automatically when you reconnect."
        />
      ) : null}
    </Screen>
  );
}
