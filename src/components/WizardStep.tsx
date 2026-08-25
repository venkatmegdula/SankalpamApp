import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { AppBar, Screen, StepProgress } from '@/ui/layout';
import { Field } from '@/ui/forms';
import { Button, Text } from '@/ui/primitives';
import { space } from '@/ui/tokens';
import { AssistedHelpLink } from './AssistedHelpLink';

export const APPLY_STEPS = 5;

/**
 * One check per required answer on the page.
 *
 * `name` ties the check to the `<StepField>` that owns the answer, so a failed
 * check can mark that field and scroll to it.
 */
export type Check = { name: string; valid: boolean; message: string };

type FieldNode = React.ComponentRef<typeof View>;

type Ctx = {
  errorFor: (name: string) => string | undefined;
  register: (name: string, node: FieldNode | null) => void;
};

const WizardCtx = createContext<Ctx | null>(null);

/**
 * A `Field` that participates in the page's validation.
 *
 * Pages now carry five to seven answers, so a greyed-out Continue button no
 * longer tells anyone what is wrong. Continue stays live; pressing it with
 * something missing marks every offending field and scrolls to the first.
 */
export function StepField({
  name,
  label,
  hint,
  required,
  children,
}: {
  name: string;
  label?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  const ctx = useContext(WizardCtx);

  return (
    <View ref={(node) => ctx?.register(name, node)}>
      <Field label={label} hint={hint} required={required} error={ctx?.errorFor(name)}>
        {children}
      </Field>
    </View>
  );
}

/**
 * Shared shell for every application step.
 *
 * Five grouped pages rather than one question per screen — the same answers,
 * a fifth of the taps. Progress is always visible and the assisted callback is
 * always reachable. Progress is saved on every keystroke by the session store,
 * so leaving mid-page loses nothing.
 */
export function WizardStep({
  step,
  title,
  subtitle,
  children,
  nextLabel = 'Continue',
  nextHref,
  onNext,
  checks = [],
  footerNote,
}: {
  step: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  nextLabel?: string;
  nextHref?: string;
  onNext?: () => void;
  /** Required answers on this page. Empty means the page is always passable. */
  checks?: Check[];
  footerNote?: string;
}) {
  const [showErrors, setShowErrors] = useState(false);
  const scrollRef = useRef<ScrollView | null>(null);
  const fields = useRef<Record<string, FieldNode | null>>({});

  const failing = checks.filter((c) => !c.valid);

  const register = useCallback((name: string, node: FieldNode | null) => {
    fields.current[name] = node;
  }, []);

  /**
   * `onLayout` never fires for these wrappers under react-native-web, so the
   * field's own node does the measuring: the DOM can scroll itself, and native
   * measures against the scroll view's content.
   */
  const scrollToField = (name: string) => {
    const node = fields.current[name];
    if (!node) return;

    if (Platform.OS === 'web') {
      // Instant, not smooth: smooth scrolling is a no-op inside this
      // container in some browsers, which would leave the error off-screen.
      (node as unknown as { scrollIntoView?: (opts?: unknown) => void }).scrollIntoView?.({
        behavior: 'auto',
        block: 'center',
      });
      return;
    }

    const scroller = scrollRef.current;
    if (!scroller) return;
    node.measureLayout(
      scroller.getScrollableNode(),
      (_x, y) => scroller.scrollTo({ y: Math.max(0, y - 16), animated: true }),
      () => {},
    );
  };

  // Deliberately not memoised: a check's message can change while it stays
  // invalid (picking only Sanskrit swaps "select a language" for "Telugu or
  // Hindi is required"), so caching on validity alone would show stale text.
  // Consumers re-render with this component anyway.
  const ctx: Ctx = {
    errorFor: (name) =>
      showErrors ? checks.find((c) => c.name === name && !c.valid)?.message : undefined,
    register,
  };

  const handleNext = () => {
    if (failing.length > 0) {
      setShowErrors(true);
      // `checks` are authored in field order, so the first failure is the
      // highest one on the page.
      scrollToField(failing[0].name);
      return;
    }
    onNext?.();
    if (nextHref) router.push(nextHref as never);
  };

  return (
    <Screen
      scrollRef={scrollRef}
      header={
        <View>
          <AppBar />
          <View style={{ paddingHorizontal: space.lg, paddingBottom: space.md }}>
            <StepProgress step={step} total={APPLY_STEPS} />
          </View>
        </View>
      }
      footer={
        <>
          {showErrors && failing.length > 0 ? (
            <Text variant="caption" tone="error" center style={{ marginBottom: 2 }}>
              {failing.length === 1
                ? failing[0].message
                : `${failing.length} answers still needed on this page.`}
            </Text>
          ) : footerNote ? (
            <Text variant="caption" tone="tertiary" center style={{ marginBottom: 2 }}>
              {footerNote}
            </Text>
          ) : null}
          <Button label={nextLabel} onPress={handleNext} />
          <AssistedHelpLink compact />
        </>
      }>
      <View style={{ gap: space.xs, marginTop: space.xs }}>
        <Text variant="h2">{title}</Text>
        {subtitle ? (
          <Text variant="small" tone="secondary">
            {subtitle}
          </Text>
        ) : null}
      </View>
      <WizardCtx.Provider value={ctx}>
        <View style={{ gap: space.lg, marginTop: space.sm }}>{children}</View>
      </WizardCtx.Provider>
    </Screen>
  );
}
