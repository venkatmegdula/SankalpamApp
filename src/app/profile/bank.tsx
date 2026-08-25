import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from '@/ui/Icon';
import { useSession } from '@/store/session';
import { useColors } from '@/ui/ThemeProvider';
import { AppBar, Screen, Section, Sheet } from '@/ui/layout';
import { Banner, Button, Card, Divider, Row, StatusPill, Text } from '@/ui/primitives';
import { Field, Input } from '@/ui/forms';
import { space } from '@/ui/tokens';

/**
 * Changing payout details is a payout redirection, so it is treated as
 * high-risk: re-authentication first, ops verification before the next cycle,
 * and pending payouts held in the meantime — stated upfront, not discovered.
 */
export default function BankAccount() {
  const { profile, showToast } = useSession();
  const t = useColors();
  const [changing, setChanging] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [account, setAccount] = useState('');
  const [ifsc, setIfsc] = useState('');

  const bank = profile?.bank;

  return (
    <Screen
      header={<AppBar title="Bank account" />}
      footer={
        changing ? (
          <>
            <Button
              label="Submit for verification"
              disabled={account.length < 9 || ifsc.length !== 11}
              onPress={() => {
                setChanging(false);
                showToast('Submitted. We\'ll verify before your next payout.', 'info');
                router.back();
              }}
            />
            <Button label="Cancel" variant="ghost" onPress={() => setChanging(false)} />
          </>
        ) : (
          <Button label="Change bank account" variant="secondary" onPress={() => setOtpOpen(true)} />
        )
      }>
      {!changing ? (
        <>
          <Card>
            <View style={{ gap: space.base }}>
              <Row justify="space-between" align="center">
                <Text variant="micro" tone="tertiary">
                  Payouts are sent to
                </Text>
                <StatusPill
                  label={bank?.verified ? 'Verified' : 'Pending verification'}
                  tone={bank?.verified ? 'success' : 'warning'}
                  icon={bank?.verified ? 'shield-checkmark' : 'time'}
                  size="sm"
                />
              </Row>
              <Text variant="h3">{bank?.bankName ?? 'Not added'}</Text>
              <Divider />
              <Row justify="space-between">
                <Text variant="small" tone="secondary">
                  Account
                </Text>
                <Text variant="smallStrong" numeric>
                  {bank?.accountNumberMasked ?? '—'}
                </Text>
              </Row>
              <Row justify="space-between">
                <Text variant="small" tone="secondary">
                  IFSC
                </Text>
                <Text variant="smallStrong" numeric>
                  {bank?.ifsc ?? '—'}
                </Text>
              </Row>
              <Row justify="space-between">
                <Text variant="small" tone="secondary">
                  Holder
                </Text>
                <Text variant="smallStrong">{bank?.holderName ?? '—'}</Text>
              </Row>
            </View>
          </Card>

          <Section title="Payout schedule">
            <Card>
              <Row gap={space.md} align="flex-start">
                <Icon name="calendar-outline" size={17} color={t.fg.tertiary} />
                <Text variant="small" tone="secondary" style={{ flex: 1 }}>
                  Weekly, every Friday. Ceremonies completed by Thursday night are included in that
                  week’s payout.
                </Text>
              </Row>
            </Card>
          </Section>

          <Banner
            tone="warning"
            title="Payouts must go to your own account"
            body="The account holder name has to match the name on your verified identity documents."
          />
        </>
      ) : (
        <>
          <Banner
            tone="warning"
            title="Pending payouts will be held"
            body="Any payout due before we verify the new account is held until verification completes. This usually takes 1–2 business days."
          />
          <Field label="New account number" required>
            <Input
              value={account}
              onChangeText={(v) => setAccount(v.replace(/\D/g, '').slice(0, 18))}
              keyboardType="number-pad"
              placeholder="Account number"
            />
          </Field>
          <Field label="IFSC code" required>
            <Input
              value={ifsc}
              onChangeText={(v) => setIfsc(v.toUpperCase().slice(0, 11))}
              placeholder="HDFC0000545"
            />
          </Field>
          <Button
            label="Add cancelled cheque"
            variant="secondary"
            icon="camera-outline"
            onPress={() => showToast('Camera opens on a real device', 'info')}
          />
        </>
      )}

      <Sheet
        visible={otpOpen}
        onClose={() => setOtpOpen(false)}
        title="Confirm it's you"
        footer={
          <>
            <Button
              label="Verify"
              disabled={otp.length !== 6}
              onPress={() => {
                setOtpOpen(false);
                setOtp('');
                setChanging(true);
              }}
            />
            <Button label="Cancel" variant="ghost" onPress={() => setOtpOpen(false)} />
          </>
        }>
        <Text variant="small" tone="secondary">
          Changing where your money goes needs a fresh code. We’ve sent one to +91{' '}
          {profile?.phone}.
        </Text>
        <Input
          value={otp}
          onChangeText={(v) => setOtp(v.replace(/\D/g, '').slice(0, 6))}
          keyboardType="number-pad"
          placeholder="6-digit code"
          autoFocus
        />
        <Text variant="caption" tone="tertiary">
          Demo: any 6 digits.
        </Text>
      </Sheet>
    </Screen>
  );
}
