import { Pressable, View } from 'react-native';
import { Icon } from '@/ui/Icon';
import { useSession } from '@/store/session';
import { useColors } from '@/ui/ThemeProvider';
import { StepField, WizardStep } from '@/components/WizardStep';
import { Input } from '@/ui/forms';
import { Section } from '@/ui/layout';
import { Row, Text } from '@/ui/primitives';
import { radius, space } from '@/ui/tokens';

/**
 * Step 1 — identity and contact in one page.
 *
 * Only the name is required; everything else here is either pre-verified or
 * genuinely optional, so this page should feel like a quick start rather than
 * a gate.
 */
export default function About() {
  const { draft, patchDraft, profile, showToast } = useSession();
  const t = useColors();

  const nameOk = draft.fullName.trim().length >= 3;

  return (
    <WizardStep
      step={1}
      title="About you"
      subtitle="Your name as it appears on your Aadhaar, and how we reach you."
      nextHref="/apply/practice"
      checks={[
        { name: 'fullName', valid: nameOk, message: 'Enter your full name as on Aadhaar.' },
      ]}>
      <StepField name="fullName" label="Full name" required>
        <Input
          value={draft.fullName}
          onChangeText={(v) => patchDraft({ fullName: v })}
          placeholder="Srinivasa Sharma"
        />
      </StepField>

      <StepField
        name="dateOfBirth"
        label="Date of birth"
        hint="Used only to verify your identity documents.">
        <Input
          value={draft.dateOfBirth}
          onChangeText={(v) => {
            const digits = v.replace(/\D/g, '').slice(0, 8);
            const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
            patchDraft({ dateOfBirth: parts.join(' / ') });
          }}
          placeholder="DD / MM / YYYY"
          keyboardType="number-pad"
          icon="calendar-outline"
        />
      </StepField>

      <StepField
        name="photo"
        label="Your photograph"
        hint="Shown on your public profile so devotees recognise you at the door.">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Take your photograph"
          onPress={() => showToast('Camera opens on a real device', 'info')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: space.base,
            padding: space.base,
            borderRadius: radius.md,
            borderWidth: 1.5,
            borderStyle: 'dashed',
            borderColor: t.line.strong,
            backgroundColor: t.bg.surface,
          }}>
          <View
            style={{
              width: 54,
              height: 54,
              borderRadius: radius.sm,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: t.bg.sunken,
            }}>
            <Icon name="person-outline" size={24} color={t.fg.tertiary} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text variant="title">Take a photo</Text>
            <Text variant="caption" tone="tertiary">
              Plain background, face clearly visible
            </Text>
          </View>
          <Icon name="camera-outline" size={20} color={t.fg.brand} />
        </Pressable>
      </StepField>

      <Section title="HOW WE REACH YOU" dense>
        <Text variant="caption" tone="tertiary">
          The numbers below are optional. We use them only if we can’t reach your main number.
        </Text>
      </Section>

      <StepField
        name="mainPhone"
        label="Main number"
        hint="Verified. Devotees never see this — calls are masked.">
        <Input value={`+91 ${profile?.phone ?? ''}`} onChangeText={() => {}} editable={false} />
      </StepField>

      <StepField name="altPhone" label="Alternate number">
        <Input
          value={draft.altPhone}
          onChangeText={(v) => patchDraft({ altPhone: v.replace(/\D/g, '').slice(0, 10) })}
          placeholder="Family member or landline"
          keyboardType="number-pad"
          prefix="+91"
        />
      </StepField>

      <StepField
        name="email"
        label="Email address"
        hint="For payout statements and your partner agreement copy.">
        <Input
          value={draft.email}
          onChangeText={(v) => patchDraft({ email: v })}
          placeholder="name@example.com"
          keyboardType="email-address"
          icon="mail-outline"
        />
      </StepField>

      <Row gap={space.sm} align="flex-start">
        <Icon name="lock-closed" size={14} color={t.fg.tertiary} style={{ marginTop: 2 }} />
        <Text variant="caption" tone="tertiary" style={{ flex: 1 }}>
          Your details are encrypted and shared only with the Sankalpam verification team.
        </Text>
      </Row>
    </WizardStep>
  );
}
