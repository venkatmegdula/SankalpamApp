import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { AppBar, Screen } from '@/ui/layout';
import { Button, Text } from '@/ui/primitives';
import { Field, Input } from '@/ui/forms';
import { space } from '@/ui/tokens';

export default function PhoneScreen() {
  const [phone, setPhone] = useState('');
  const [sending, setSending] = useState(false);
  const valid = /^[6-9]\d{9}$/.test(phone);
  const touched = phone.length === 10;

  return (
    <Screen
      header={<AppBar />}
      footer={
        <Button
          label="Send code"
          disabled={!valid}
          loading={sending}
          onPress={() => {
            setSending(true);
            setTimeout(() => {
              setSending(false);
              router.push({ pathname: '/auth/otp', params: { phone } });
            }, 600);
          }}
        />
      }>
      <View style={{ gap: space.sm, marginTop: space.sm }}>
        <Text variant="h1">What’s your mobile number?</Text>
        <Text variant="body" tone="secondary">
          We’ll send a 6-digit code to confirm it. This becomes the number devotees reach you on.
        </Text>
      </View>

      <Field
        label="Mobile number"
        error={touched && !valid ? 'Enter a valid 10-digit Indian mobile number.' : undefined}
        style={{ marginTop: space.md }}>
        <Input
          value={phone}
          onChangeText={(v) => setPhone(v.replace(/\D/g, '').slice(0, 10))}
          placeholder="98480 12345"
          keyboardType="number-pad"
          prefix="+91"
          autoFocus
          invalid={touched && !valid}
          accessibilityLabel="Mobile number"
        />
      </Field>

      <Text variant="caption" tone="tertiary" style={{ marginTop: space.xs }}>
        By continuing you agree to Sankalpam’s Terms and Privacy Policy. Your number is never shown
        to devotees — calls are masked in both directions.
      </Text>
    </Screen>
  );
}
