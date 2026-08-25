import { router } from 'expo-router';
import { useSession } from '@/store/session';
import { StepField, WizardStep } from '@/components/WizardStep';
import { Input } from '@/ui/forms';
import { ListGroup, ListRow } from '@/ui/layout';
import { Banner } from '@/ui/primitives';

/** Minimal, illustrative IFSC directory for the mock. */
const IFSC_DIRECTORY: Record<string, { bank: string; branch: string }> = {
  HDFC0000545: { bank: 'HDFC Bank', branch: 'Hitech City' },
  SBIN0020123: { bank: 'State Bank of India', branch: 'Gachibowli' },
  ICIC0001129: { bank: 'ICICI Bank', branch: 'Kondapur' },
  UBIN0812345: { bank: 'Union Bank of India', branch: 'Kukatpally' },
};

/**
 * Step 4 — documents and payout account.
 *
 * Each document is a camera flow of its own, so the six of them stay behind a
 * summary row rather than expanding inline above the bank fields.
 */
export default function Paperwork() {
  const { draft, patchDraft, profile } = useSession();

  const docs = profile?.documents ?? [];
  const docsDone = docs.filter((d) => d.status === 'uploaded').length;
  const docsComplete = docs.length > 0 && docsDone === docs.length;

  const ifsc = draft.ifsc.toUpperCase();
  const bank = IFSC_DIRECTORY[ifsc];
  const ifscShaped = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);
  const ifscInvalid = ifsc.length === 11 && !ifscShaped;

  const accountsMatch =
    draft.accountNumber.length > 0 && draft.accountNumber === draft.confirmAccountNumber;
  const accountLongEnough = draft.accountNumber.length >= 9;

  // Name mismatch warns rather than blocks — it is flagged for ops review.
  const nameMismatch =
    draft.holderName.trim().length > 2 &&
    draft.fullName.trim().length > 2 &&
    draft.holderName.trim().toLowerCase() !== draft.fullName.trim().toLowerCase();

  return (
    <WizardStep
      step={4}
      title="Documents & payouts"
      subtitle="Six documents to verify, and the account we settle your earnings to."
      nextHref="/apply/review"
      checks={[
        {
          name: 'documents',
          valid: docsComplete,
          message: `${docs.length - docsDone} document${docs.length - docsDone === 1 ? '' : 's'} still to add.`,
        },
        {
          name: 'accountNumber',
          valid: accountLongEnough,
          message: 'Enter your account number.',
        },
        {
          name: 'confirmAccountNumber',
          valid: accountsMatch,
          message: "The account numbers don't match.",
        },
        { name: 'ifsc', valid: ifscShaped, message: 'Enter a valid 11-character IFSC.' },
        {
          name: 'holderName',
          valid: draft.holderName.trim().length > 2,
          message: 'Enter the account holder name.',
        },
      ]}>
      <StepField
        name="documents"
        label="Your documents"
        hint="Each one is explained before you take the photo."
        required>
        <ListGroup>
          <ListRow
            first
            last
            icon="document-text-outline"
            iconTone={docsComplete ? 'brand' : 'neutral'}
            title={docsComplete ? 'All documents added' : 'Add your documents'}
            subtitle={`${docsDone} of ${docs.length} added`}
            onPress={() => router.push('/apply/documents')}
          />
        </ListGroup>
      </StepField>

      <StepField name="accountNumber" label="Account number" required>
        <Input
          value={draft.accountNumber}
          onChangeText={(v) => patchDraft({ accountNumber: v.replace(/\D/g, '').slice(0, 18) })}
          placeholder="Account number"
          keyboardType="number-pad"
        />
      </StepField>

      <StepField name="confirmAccountNumber" label="Re-enter account number" required>
        <Input
          value={draft.confirmAccountNumber}
          onChangeText={(v) =>
            patchDraft({ confirmAccountNumber: v.replace(/\D/g, '').slice(0, 18) })
          }
          placeholder="Confirm account number"
          keyboardType="number-pad"
          invalid={draft.confirmAccountNumber.length > 0 && !accountsMatch}
        />
      </StepField>

      <StepField
        name="ifsc"
        label="IFSC code"
        required
        hint={bank ? `${bank.bank} · ${bank.branch}` : 'We fill in the bank and branch for you.'}>
        <Input
          value={draft.ifsc}
          onChangeText={(v) => patchDraft({ ifsc: v.toUpperCase().slice(0, 11) })}
          placeholder="HDFC0000545"
          invalid={ifscInvalid}
        />
      </StepField>

      <StepField
        name="holderName"
        label="Account holder name"
        required
        hint="Exactly as printed on your passbook or cheque.">
        <Input
          value={draft.holderName}
          onChangeText={(v) => patchDraft({ holderName: v })}
          placeholder={draft.fullName || 'Account holder name'}
        />
      </StepField>

      {nameMismatch ? (
        <Banner
          tone="warning"
          title="This name differs from your application"
          body={`You entered "${draft.fullName}" earlier. You can continue — our team will check both documents — but payouts can only go to an account in your own name.`}
        />
      ) : null}

      <Banner
        tone="info"
        title="Your PAN is needed for larger payouts"
        body="Once your total earnings pass the TDS threshold, payouts are held until we have your PAN on file. You've already added it with your documents above."
      />
    </WizardStep>
  );
}
