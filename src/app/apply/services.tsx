import { View } from 'react-native';
import { router } from 'expo-router';
import { useSession } from '@/store/session';
import { useColors } from '@/ui/ThemeProvider';
import { StepField, WizardStep } from '@/components/WizardStep';
import { RadioRow, StepSlider } from '@/ui/forms';
import { ListGroup, ListRow } from '@/ui/layout';
import { Text } from '@/ui/primitives';
import { ZONES } from '@/data/fixtures/catalog';
import { radius, space } from '@/ui/tokens';
import type { ServiceType } from '@/data/types';

export const MIN_POOJAS = 5;

const SERVICE_OPTIONS: {
  id: ServiceType;
  title: string;
  subtitle: string;
  icon: 'home-outline' | 'globe-outline' | 'swap-horizontal-outline';
}[] = [
  {
    id: 'home_visit',
    title: 'Home visit',
    subtitle: "You travel to the devotee's home and perform the pooja in person.",
    icon: 'home-outline',
  },
  {
    id: 'remote',
    title: 'Remote',
    subtitle: "You perform Archana on the devotee's behalf, usually at a temple. They don't travel.",
    icon: 'globe-outline',
  },
  {
    id: 'both',
    title: 'Both',
    subtitle: "You're available for either, depending on demand.",
    icon: 'swap-horizontal-outline',
  },
];

/**
 * Step 3 — what you offer and where.
 *
 * The pooja catalogue is long and searchable, so it stays a full-screen picker
 * reached from the summary row here. Keeping it inline would bury the zone and
 * service-type questions under a hundred rows.
 */
export default function Services() {
  const { draft, patchDraft } = useSession();
  const t = useColors();

  const chosen = draft.poojaIds.length;
  const needsRadius = draft.serviceType !== 'remote';

  return (
    <WizardStep
      step={3}
      title="Services & area"
      subtitle="The poojas you perform, the kind of bookings you take, and where you can serve."
      nextHref="/apply/paperwork"
      checks={[
        {
          name: 'poojaIds',
          valid: chosen >= MIN_POOJAS,
          message: `Select at least ${MIN_POOJAS} poojas.`,
        },
        { name: 'zoneId', valid: !!draft.zoneId, message: 'Select your zone.' },
      ]}>
      <StepField
        name="poojaIds"
        label="Poojas you perform"
        hint="Prices are set by Sankalpam — you never negotiate with devotees."
        required>
        <ListGroup>
          <ListRow
            first
            last
            icon="flame-outline"
            iconTone={chosen >= MIN_POOJAS ? 'brand' : 'neutral'}
            title={chosen > 0 ? `${chosen} selected` : 'Choose your poojas'}
            subtitle={
              chosen >= MIN_POOJAS
                ? 'Tap to review or change'
                : `At least ${MIN_POOJAS} required — ${MIN_POOJAS - chosen} more to go`
            }
            onPress={() => router.push('/apply/poojas')}
          />
        </ListGroup>
      </StepField>

      <StepField name="serviceType" label="What kind of bookings can you take?" required>
        <View style={{ gap: space.md }}>
          {SERVICE_OPTIONS.map((o) => (
            <RadioRow
              key={o.id}
              selected={draft.serviceType === o.id}
              onPress={() => patchDraft({ serviceType: o.id })}
              title={o.title}
              subtitle={o.subtitle}
              icon={o.icon}
            />
          ))}
        </View>
      </StepField>

      <StepField
        name="zoneId"
        label="Where can you serve?"
        hint="Sankalpam operates in two Hyderabad zones. Pick the one covering your primary area."
        required>
        <View style={{ gap: space.md }}>
          {ZONES.map((z) => (
            <RadioRow
              key={z.id}
              selected={draft.zoneId === z.id}
              onPress={() => patchDraft({ zoneId: z.id })}
              title={z.name}
              subtitle={z.localities.join(' · ')}
              icon="map-outline"
            />
          ))}
        </View>
      </StepField>

      {needsRadius ? (
        <StepField
          name="travelRadiusKm"
          label="How far will you travel?"
          hint="We won't show you home-visit bookings beyond this distance.">
          <View
            style={{
              padding: space.base,
              borderRadius: radius.md,
              backgroundColor: t.bg.surface,
              borderWidth: 1.5,
              borderColor: t.line.default,
            }}>
            <StepSlider
              value={draft.travelRadiusKm}
              onChange={(v) => patchDraft({ travelRadiusKm: v })}
              steps={[5, 10, 15, 20, 25, 30]}
              format={(v) => `${v} km`}
            />
          </View>
        </StepField>
      ) : (
        <Text variant="small" tone="secondary">
          Remote bookings have no travel, so no radius is needed.
        </Text>
      )}
    </WizardStep>
  );
}
