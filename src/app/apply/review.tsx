import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useSession } from '@/store/session';
import { useColors } from '@/ui/ThemeProvider';
import { AppBar, ListGroup, ListRow, Screen, Section, StepProgress } from '@/ui/layout';
import { Button, Card, Row, Text } from '@/ui/primitives';
import * as repo from '@/data/repository';
import {
  LANGUAGES,
  SAMPRADAYA,
  TRAINING_TYPES,
  VEDAS,
  poojaById,
  zoneById,
} from '@/data/fixtures/catalog';
import { APPLY_STEPS } from '@/components/WizardStep';
import { space } from '@/ui/tokens';
import { Icon, type IconName } from '@/ui/Icon';

const labelsFor = (ids: string[], source: { id: string; label: string }[]) =>
  ids.map((id) => source.find((s) => s.id === id)?.label ?? id).join(', ') || '—';

const SERVICE_LABEL: Record<string, string> = {
  home_visit: 'Home visit',
  remote: 'Remote',
  both: 'Home visit & Remote',
};

export default function Review() {
  const { draft, profile, refreshProfile, showToast } = useSession();
  const t = useColors();
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    try {
      await repo.updateProfile({
        fullName: draft.fullName,
        dateOfBirth: draft.dateOfBirth,
        yearsExperience: draft.yearsExperience,
        trainingType: draft.trainingType,
        guruOrInstitution: draft.guruOrInstitution,
        templeServed: draft.templeServed,
        vedas: draft.vedas,
        sampradaya: draft.sampradaya,
        languages: draft.languages,
        poojaIds: draft.poojaIds,
        serviceType: draft.serviceType,
        zoneId: draft.zoneId,
        travelRadiusKm: draft.travelRadiusKm,
        bank: {
          accountNumberMasked: `•••• •••• ${draft.accountNumber.slice(-4)}`,
          ifsc: draft.ifsc,
          bankName: 'Your bank',
          branch: '—',
          holderName: draft.holderName,
          verified: false,
        },
      });
      await repo.submitApplication();
      await refreshProfile();
      router.replace('/apply/submitted');
    } catch {
      showToast("Couldn't submit — you appear to be offline", 'error');
      setSubmitting(false);
    }
  };

  const edit = (path: string) => () => router.push(path as never);

  return (
    <Screen
      header={
        <View>
          <AppBar />
          <View style={{ paddingHorizontal: space.lg, paddingBottom: space.md }}>
            <StepProgress step={5} total={APPLY_STEPS} />
          </View>
        </View>
      }
      footer={
        <Button label="Submit application" loading={submitting} onPress={() => void submit()} />
      }>
      <View style={{ gap: space.xs }}>
        <Text variant="h2">Check everything before you submit</Text>
        <Text variant="small" tone="secondary">
          Tap any line to change it. After submitting, our team reviews your documents within 2–3
          business days.
        </Text>
      </View>

      <Section title="About you">
        <ListGroup>
          <ListRow first title="Full name" value={draft.fullName || '—'} onPress={edit('/apply/about')} />
          <ListRow title="Date of birth" value={draft.dateOfBirth || '—'} onPress={edit('/apply/about')} />
          <ListRow
            title="Experience"
            value={`${draft.yearsExperience} years`}
            onPress={edit('/apply/practice')}
          />
          <ListRow
            last
            title="Training"
            subtitle={labelsFor(draft.trainingType, TRAINING_TYPES)}
            onPress={edit('/apply/practice')}
          />
        </ListGroup>
      </Section>

      <Section title="Tradition">
        <ListGroup>
          <ListRow first title="Veda" subtitle={labelsFor(draft.vedas, VEDAS)} onPress={edit('/apply/practice')} />
          <ListRow
            title="Sampradaya"
            subtitle={labelsFor(draft.sampradaya, SAMPRADAYA)}
            onPress={edit('/apply/practice')}
          />
          <ListRow
            last
            title="Languages"
            subtitle={labelsFor(draft.languages, LANGUAGES)}
            onPress={edit('/apply/practice')}
          />
        </ListGroup>
      </Section>

      <Section title="Services">
        <ListGroup>
          <ListRow
            first
            title="Poojas offered"
            subtitle={draft.poojaIds.map((id) => poojaById(id)?.name).filter(Boolean).join(', ') || '—'}
            onPress={edit('/apply/poojas')}
          />
          <ListRow
            title="Service type"
            value={SERVICE_LABEL[draft.serviceType]}
            onPress={edit('/apply/services')}
          />
          <ListRow
            title="Zone"
            subtitle={zoneById(draft.zoneId)?.name ?? '—'}
            onPress={edit('/apply/services')}
          />
          <ListRow
            last
            title="Travel radius"
            value={draft.serviceType === 'remote' ? '—' : `${draft.travelRadiusKm} km`}
            onPress={edit('/apply/services')}
          />
        </ListGroup>
      </Section>

      <Section title="Documents & payouts">
        <ListGroup>
          <ListRow
            first
            title="Documents"
            value={`${profile?.documents.filter((d) => d.status === 'uploaded').length ?? 0} of 6`}
            onPress={edit('/apply/paperwork')}
          />
          <ListRow
            last
            title="Payout account"
            subtitle={draft.accountNumber ? `•••• ${draft.accountNumber.slice(-4)} · ${draft.ifsc}` : '—'}
            onPress={edit('/apply/paperwork')}
          />
        </ListGroup>
      </Section>

      <Card style={{ backgroundColor: t.bg.sunken }} elevated={false}>
        <Row gap={space.sm} align="flex-start">
          <Icon name="information-circle-outline" size={17} color={t.fg.secondary} />
          <Text variant="caption" tone="secondary" style={{ flex: 1 }}>
            By submitting, you confirm the information is accurate and agree to Sankalpam verifying
            it, including police verification where required.
          </Text>
        </Row>
      </Card>
    </Screen>
  );
}
