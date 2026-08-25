import { useEffect, useRef, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSession } from '@/store/session';
import { useColors } from '@/ui/ThemeProvider';
import { AppBar, Screen } from '@/ui/layout';
import { Button, Row, Text } from '@/ui/primitives';
import { radius, space, type as typeScale } from '@/ui/tokens';

const LENGTH = 6;

export default function OtpScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const { signIn, showToast } = useSession();
  const t = useColors();

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const [sendCount, setSendCount] = useState(1);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  const submit = async (value: string) => {
    setBusy(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 700));
    // Mock: any 6 digits are accepted except 000000, which exercises the error state.
    if (value === '000000') {
      setError("That code isn't right. Check the SMS and try again.");
      setCode('');
      setBusy(false);
      return;
    }
    await signIn(String(phone ?? ''));
    setBusy(false);
    router.replace('/apply/intro');
  };

  return (
    <Screen
      header={<AppBar />}
      footer={
        <Button
          label="Verify"
          disabled={code.length !== LENGTH}
          loading={busy}
          onPress={() => void submit(code)}
        />
      }>
      <View style={{ gap: space.sm, marginTop: space.sm }}>
        <Text variant="h1">Enter the code</Text>
        <Text variant="body" tone="secondary">
          Sent to +91 {String(phone ?? '').replace(/(\d{5})(\d{5})/, '$1 $2')}
        </Text>
      </View>

      {/* Single hidden input drives the boxes — one caret, no focus juggling. */}
      <Pressable
        accessibilityRole="none"
        onPress={() => inputRef.current?.focus()}
        style={{ marginTop: space.lg }}>
        <Row gap={space.sm} justify="space-between">
          {Array.from({ length: LENGTH }, (_, i) => {
            const char = code[i];
            const active = i === code.length;
            return (
              <View
                key={i}
                style={{
                  flex: 1,
                  height: 58,
                  borderRadius: radius.md,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: t.bg.surface,
                  borderWidth: 1.8,
                  borderColor: error
                    ? t.status.errorFg
                    : active
                      ? t.line.focus
                      : char
                        ? t.line.strong
                        : t.line.default,
                }}>
                <Text variant="h2" numeric>
                  {char ?? ''}
                </Text>
              </View>
            );
          })}
        </Row>
        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={(v) => {
            const next = v.replace(/\D/g, '').slice(0, LENGTH);
            setCode(next);
            setError(null);
            if (next.length === LENGTH) void submit(next);
          }}
          keyboardType="number-pad"
          maxLength={LENGTH}
          autoFocus
          accessibilityLabel="Verification code"
          style={[typeScale.body, { position: 'absolute', opacity: 0, height: 58, width: '100%' }]}
        />
      </Pressable>

      {error ? (
        <Text variant="caption" tone="error" style={{ marginTop: space.sm }}>
          {error}
        </Text>
      ) : null}

      <View style={{ marginTop: space.lg, gap: space.md }}>
        {seconds > 0 ? (
          <Text variant="small" tone="tertiary">
            Resend code in {seconds}s
          </Text>
        ) : (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setSeconds(30);
              setSendCount((c) => c + 1);
              showToast('Code sent again', 'info');
            }}>
            <Text variant="smallStrong" tone="brand">
              Resend code
            </Text>
          </Pressable>
        )}

        {/* Critical fallback — SMS delivery in India is unreliable enough that a
            voice-call option is a requirement, not a nicety. */}
        {sendCount >= 2 || seconds === 0 ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => showToast('We\'ll call you with the code shortly', 'info')}>
            <Text variant="smallStrong" tone="brand">
              Call me with the code instead
            </Text>
          </Pressable>
        ) : null}
      </View>

      <View
        style={{
          marginTop: space.base,
          padding: space.md,
          borderRadius: radius.sm,
          backgroundColor: t.bg.sunken,
        }}>
        <Text variant="caption" tone="tertiary">
          Demo: any 6 digits work. Enter 000000 to see the error state.
        </Text>
      </View>
    </Screen>
  );
}
