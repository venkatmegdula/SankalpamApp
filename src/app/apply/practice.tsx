import { View } from 'react-native';
import { useSession } from '@/store/session';
import { StepField, WizardStep } from '@/components/WizardStep';
import { ChipGroup, Input, Stepper } from '@/ui/forms';
import { Banner } from '@/ui/primitives';
import { AssistedHelpLink } from '@/components/AssistedHelpLink';
import { LANGUAGES, SAMPRADAYA, TRAINING_TYPES, VEDAS } from '@/data/fixtures/catalog';
import { space } from '@/ui/tokens';

/**
 * Step 2 — everything that establishes the pujari's credentials.
 *
 * Experience, training, tradition and language were five separate screens for
 * what is really one question: who taught you, and what do you practise.
 *
 * The eligibility floor is 2 years (Onboarding Guide §2). Below that we explain
 * and offer the callback rather than dead-ending someone whose lineage doesn't
 * fit a simple year count.
 */
export default function Practice() {
  const { draft, patchDraft } = useSession();

  const eligible = draft.yearsExperience >= 2;
  const hasCoreLanguage = draft.languages.includes('telugu') || draft.languages.includes('hindi');

  return (
    <WizardStep
      step={2}
      title="Your practice"
      subtitle="Your experience, training, tradition, and the languages you conduct poojas in."
      nextHref="/apply/services"
      checks={[
        {
          name: 'yearsExperience',
          valid: eligible,
          message: 'Sankalpam requires at least 2 years of experience.',
        },
        {
          name: 'trainingType',
          valid: draft.trainingType.length > 0,
          message: 'Select how you trained.',
        },
        { name: 'vedas', valid: draft.vedas.length > 0, message: 'Select at least one Veda.' },
        {
          name: 'sampradaya',
          valid: draft.sampradaya.length > 0,
          message: 'Select at least one sampradaya.',
        },
        {
          name: 'languages',
          valid: draft.languages.length > 0 && hasCoreLanguage,
          message:
            draft.languages.length === 0
              ? 'Select at least one language.'
              : 'Telugu or Hindi is required to serve Hyderabad.',
        },
      ]}>
      <StepField
        name="yearsExperience"
        label="Years of active experience"
        hint="Count the years you've actively performed ceremonies for households or temples."
        required>
        <View style={{ alignItems: 'center', paddingVertical: space.sm }}>
          <Stepper
            value={draft.yearsExperience}
            onChange={(v) => patchDraft({ yearsExperience: v })}
            min={0}
            max={60}
            suffix={draft.yearsExperience === 1 ? 'year' : 'years'}
          />
        </View>
      </StepField>

      {!eligible ? (
        <View style={{ gap: space.sm }}>
          <Banner
            tone="warning"
            title="Sankalpam requires at least 2 years of experience"
            body="This is how we keep the network trustworthy for devotees. If you have lineage or training that doesn't fit a simple year count, please speak to us — we'd rather hear from you than lose you here."
          />
          <AssistedHelpLink />
        </View>
      ) : null}

      <StepField
        name="trainingType"
        label="How did you train?"
        hint="Select everything that applies. Most pujaris have more than one."
        required>
        <ChipGroup
          options={TRAINING_TYPES}
          value={draft.trainingType}
          onChange={(v) => patchDraft({ trainingType: v })}
          multi
        />
      </StepField>

      <StepField
        name="guruOrInstitution"
        label="Guru or institution"
        hint="The name we'll look for on your proof of training.">
        <Input
          value={draft.guruOrInstitution}
          onChangeText={(v) => patchDraft({ guruOrInstitution: v })}
          placeholder="Sri Veda Vijnana Gurukulam"
        />
      </StepField>

      <StepField
        name="templeServed"
        label="Temple served"
        hint="Optional. Helps devotees place your background.">
        <Input
          value={draft.templeServed}
          onChangeText={(v) => patchDraft({ templeServed: v })}
          placeholder="Sri Venkateswara Temple, Kondapur"
        />
      </StepField>

      <StepField
        name="vedas"
        label="Which Veda do you follow?"
        hint="Select all that apply to your practice."
        required>
        <ChipGroup options={VEDAS} value={draft.vedas} onChange={(v) => patchDraft({ vedas: v })} multi />
      </StepField>

      <StepField
        name="sampradaya"
        label="Your sampradaya"
        hint="Devotees often look for a pujari from their own tradition."
        required>
        <ChipGroup
          options={SAMPRADAYA}
          value={draft.sampradaya}
          onChange={(v) => patchDraft({ sampradaya: v })}
          multi
        />
      </StepField>

      <StepField
        name="languages"
        label="Which languages do you conduct poojas in?"
        hint="Devotees are matched to pujaris who speak their language."
        required>
        <ChipGroup
          options={LANGUAGES}
          value={draft.languages}
          onChange={(v) => patchDraft({ languages: v })}
          multi
        />
      </StepField>

      {draft.languages.length > 2 ? (
        <Banner
          tone="success"
          title="Multilingual pujaris receive more requests"
          body="Devotees filter by language, so each one you add widens the bookings you're shown."
        />
      ) : null}
    </WizardStep>
  );
}
