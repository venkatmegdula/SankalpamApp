import { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from '@/ui/Icon';
import { useSession } from '@/store/session';
import { useColors } from '@/ui/ThemeProvider';
import { AppBar, ListGroup, ListRow, Screen, Section } from '@/ui/layout';
import { Banner, Button, Card, Row, StatusPill, Text } from '@/ui/primitives';
import { BrandGlyph } from '@/components/BrandMark';
import { space } from '@/ui/tokens';
import { dayLabel, time } from '@/lib/format';
import { at } from '@/data/fixtures/seed';
import type { VerificationStage } from '@/data/types';

type StageState = 'done' | 'active' | 'todo' | 'problem';

/**
 * The verification hub.
 *
 * For one to three weeks this IS the product. It is the home screen for the
 * entire waiting period, never buried in a settings menu, and every stage shows
 * a real date rather than a bare "Pending".
 */
function stageStates(stage: VerificationStage): [StageState, StageState, StageState, StageState] {
  const order: Record<string, number> = {
    submitted: 0,
    under_review: 0,
    docs_rejected: 0,
    stage1_cleared: 1,
    stage2_scheduling: 1,
    stage2_scheduled: 1,
    stage2_passed: 2,
    stage3_scheduling: 2,
    stage3_scheduled: 2,
    stage3_passed: 3,
    stage4_agreement: 3,
    stage4_profile: 3,
    active: 4,
  };
  const idx = order[stage] ?? 0;
  return [0, 1, 2, 3].map((i) => {
    if (stage === 'docs_rejected' && i === 0) return 'problem';
    if (i < idx) return 'done';
    if (i === idx) return 'active';
    return 'todo';
  }) as [StageState, StageState, StageState, StageState];
}

const NEXT_COPY: Partial<Record<VerificationStage, { title: string; body: string }>> = {
  submitted: {
    title: 'We\'re checking your documents',
    body: 'Our team reviews each document individually. This usually takes 2–3 business days.',
  },
  under_review: {
    title: 'We\'re checking your documents',
    body: 'Our team reviews each document individually. This usually takes 2–3 business days.',
  },
  docs_rejected: {
    title: 'One document needs your attention',
    body: 'Re-upload the document below and we\'ll continue the review straight away.',
  },
  stage1_cleared: {
    title: 'Choose a time for your conversation',
    body: 'A Sankalpam team member will talk through your top 3–5 poojas, the samagri each needs, and how the rate card works. It\'s a conversation, not an exam.',
  },
  stage2_scheduling: {
    title: 'Choose a time for your conversation',
    body: 'Pick any slot that suits you in the next seven days.',
  },
  stage2_scheduled: {
    title: 'Your conversation is booked',
    body: 'We\'ll call you on your registered number. If you miss it, you can rebook straight away — there\'s no penalty.',
  },
  stage2_passed: {
    title: 'We\'re arranging your supervised pooja',
    body: 'You\'ll perform one pooja while a Sankalpam representative observes. We\'ll confirm the date shortly.',
  },
  stage3_scheduling: {
    title: 'We\'re arranging your supervised pooja',
    body: 'We\'ll confirm the date within two business days.',
  },
  stage3_scheduled: {
    title: 'Your supervised pooja is scheduled',
    body: 'It appears in your bookings marked as a trial. Use the app for check-in and completion exactly as you would for a real booking — that\'s part of what\'s assessed.',
  },
  stage3_passed: {
    title: 'Accept your partner agreement',
    body: 'Commission, code of conduct, and cancellation policy. Read it in full, then accept to go live.',
  },
  stage4_agreement: {
    title: 'Accept your partner agreement',
    body: 'Commission, code of conduct, and cancellation policy.',
  },
  stage4_profile: {
    title: 'Confirm your public profile',
    body: 'This is exactly how devotees will see you. Check it before you go live.',
  },
};

export default function VerificationHub() {
  const { profile } = useSession();
  const t = useColors();
  const stage = profile?.stage ?? 'submitted';

  // A deep link here from a state with no application yet would strand the user
  // on a tracker for something that doesn't exist. Send them to the start.
  useEffect(() => {
    if (profile && profile.stage === 'not_started') router.replace('/apply/intro');
    if (profile && profile.stage === 'active') router.replace('/(tabs)');
  }, [profile]);
  const states = stageStates(stage);
  const next = NEXT_COPY[stage];
  const rejected = profile?.documents.filter((d) => d.status === 'rejected') ?? [];

  const STAGES = [
    {
      title: 'Documents & identity',
      meta:
        states[0] === 'done'
          ? 'Cleared'
          : states[0] === 'problem'
            ? 'Needs your attention'
            : 'Under review · 2–3 business days',
    },
    {
      title: 'Competency conversation',
      meta:
        stage === 'stage2_scheduled'
          ? `${dayLabel(at(4, 11, 0))}, ${time(at(4, 11, 0))}`
          : states[1] === 'done'
            ? 'Passed'
            : states[1] === 'active'
              ? 'Choose a time'
              : 'Not started',
    },
    {
      title: 'Supervised pooja',
      meta:
        stage === 'stage3_scheduled'
          ? `${dayLabel(at(6, 7, 0))}, ${time(at(6, 7, 0))}`
          : states[2] === 'done'
            ? 'Passed'
            : states[2] === 'active'
              ? 'Being arranged'
              : 'Not started',
    },
    {
      title: 'Agreement & go live',
      meta: states[3] === 'done' ? 'Complete' : states[3] === 'active' ? 'Ready for you' : 'Not started',
    },
  ];

  const primaryAction = (() => {
    switch (stage) {
      case 'docs_rejected':
        return { label: 'Re-upload document', href: '/apply/documents' };
      case 'stage1_cleared':
      case 'stage2_scheduling':
        return { label: 'Choose a time', href: '/verification/schedule' };
      case 'stage3_passed':
      case 'stage4_agreement':
        return { label: 'Read the agreement', href: '/verification/agreement' };
      case 'stage4_profile':
        return { label: 'Confirm my profile', href: '/verification/profile-setup' };
      default:
        return null;
    }
  })();

  return (
    <Screen
      header={<AppBar onBack={false} title="Your application" />}
      footer={
        primaryAction ? (
          <Button label={primaryAction.label} onPress={() => router.push(primaryAction.href as never)} />
        ) : undefined
      }>
      <Card padded={false}>
        <View style={{ padding: space.base, gap: space.md }}>
          <Row justify="space-between" align="center">
            <Row gap={space.sm} align="center">
              <BrandGlyph size={22} color={t.fg.brand} />
              <Text variant="micro" tone="tertiary">
                Verification progress
              </Text>
            </Row>
            <StatusPill
              label={`${states.filter((s) => s === 'done').length} of 4 done`}
              tone="brand"
              size="sm"
            />
          </Row>

          <View style={{ gap: 0 }}>
            {STAGES.map((s, i) => {
              const state = states[i];
              const color =
                state === 'done'
                  ? t.status.successFg
                  : state === 'problem'
                    ? t.status.errorFg
                    : state === 'active'
                      ? t.fg.brand
                      : t.fg.faint;
              return (
                <Row key={s.title} gap={space.md} align="flex-start">
                  <View style={{ alignItems: 'center', width: 24 }}>
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor:
                          state === 'done'
                            ? t.status.successBg
                            : state === 'problem'
                              ? t.status.errorBg
                              : state === 'active'
                                ? t.bg.brandTint
                                : t.bg.sunken,
                        borderWidth: state === 'active' ? 2 : 0,
                        borderColor: t.fg.brand,
                      }}>
                      {state === 'done' ? (
                        <Icon name="checkmark" size={13} color={t.status.successFg} />
                      ) : state === 'problem' ? (
                        <Icon name="alert" size={13} color={t.status.errorFg} />
                      ) : state === 'active' ? (
                        <View
                          style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: t.fg.brand }}
                        />
                      ) : null}
                    </View>
                    {i < 3 ? (
                      <View
                        style={{
                          width: 2,
                          height: 26,
                          backgroundColor: state === 'done' ? t.status.successFg : t.line.default,
                          opacity: state === 'done' ? 0.4 : 1,
                        }}
                      />
                    ) : null}
                  </View>
                  <View style={{ flex: 1, paddingBottom: i < 3 ? space.md : 0, gap: 2 }}>
                    <Text variant="title" tone={state === 'todo' ? 'tertiary' : 'primary'}>
                      {s.title}
                    </Text>
                    <Text variant="caption" style={{ color }}>
                      {s.meta}
                    </Text>
                  </View>
                </Row>
              );
            })}
          </View>
        </View>
      </Card>

      {rejected.length > 0 ? (
        <Banner
          tone="error"
          title={`${rejected[0].label} was not accepted`}
          body={rejected[0].rejectionReason}
          actionLabel="Re-upload it now"
          onAction={() => router.push(`/apply/document/${rejected[0].kind}` as never)}
        />
      ) : null}

      {next ? (
        <Card>
          <View style={{ gap: 6 }}>
            <Text variant="micro" tone="tertiary">
              What happens next
            </Text>
            <Text variant="title">{next.title}</Text>
            <Text variant="small" tone="secondary">
              {next.body}
            </Text>
          </View>
        </Card>
      ) : null}

      <Section title="While you wait">
        <ListGroup>
          <ListRow
            first
            icon="pricetags-outline"
            iconTone="accent"
            title="See the rate card"
            subtitle="What each pooja pays, and what you keep"
            onPress={() => router.push('/rate-card')}
          />
          <ListRow
            icon="book-outline"
            iconTone="brand"
            title="How bookings work"
            subtitle="From request to payout, step by step"
            onPress={() => router.push('/how-it-works')}
          />
          <ListRow
            last
            icon="shield-checkmark-outline"
            title="Code of conduct"
            subtitle="The standards every Sankalpam pujari agrees to"
            onPress={() => router.push('/legal')}
          />
        </ListGroup>
      </Section>

      <Section title="Need help">
        <ListGroup>
          <ListRow
            first
            last
            icon="call-outline"
            iconTone="brand"
            title="Contact my coordinator"
            subtitle="We aim to respond within 24 hours"
            onPress={() => router.push('/support/new')}
          />
        </ListGroup>
      </Section>

    </Screen>
  );
}
