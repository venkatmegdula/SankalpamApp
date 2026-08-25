import { useState } from 'react';
import { router } from 'expo-router';
import { AppBar, ListGroup, ListRow, Screen, Section } from '@/ui/layout';
import { AccordionRow } from '@/components/AccordionRow';
import { Card, EmptyState, StatusPill } from '@/ui/primitives';
import { Input } from '@/ui/forms';
import { useAsync } from '@/lib/useAsync';
import * as repo from '@/data/repository';
import { relative } from '@/lib/format';

const FAQS = [
  {
    q: 'When do I get paid?',
    a: 'Every Friday. Ceremonies completed by Thursday night are included in that week\'s payout, sent to your verified bank account. Each payout comes with a statement showing every booking, the commission, and the net amount.',
  },
  {
    q: 'Why is 15% deducted?',
    a: 'That is the Sankalpam platform commission, covering devotee acquisition, verification, payments, and support. It is deducted before payout and shown on every booking before you accept it, so there are never surprises.',
  },
  {
    q: 'Can I set my own price?',
    a: 'No. Sankalpam publishes one fixed rate per pooja for every pujari, so devotees never negotiate and priests never compete on price. You always keep 85% of the published rate.',
  },
  {
    q: 'What if I need to cancel a booking?',
    a: 'Open the booking and choose "Cancel this booking". Before you confirm, the app shows exactly what it means — the notice you are giving, any penalty, and the effect on your standing. Our team then reassigns the booking.',
  },
  {
    q: 'A devotee asked me to take cash directly. What do I do?',
    a: 'Decline and report it through the app. All payments must go through Sankalpam. Reporting this is expected and never counts against you — it protects both you and the devotee.',
  },
  {
    q: 'The devotee is not at home when I arrive.',
    a: 'Tap "Having trouble?" on the check-in screen. You can verify against the household contact, ask our team to confirm by phone, or report a no-show after a 15-minute wait. The ceremony is never blocked by the app.',
  },
  {
    q: 'What happens if I get a low rating?',
    a: 'You can respond publicly, or dispute it if you believe it is unfair. Our team reviews the booking record and speaks to the devotee. Nothing changes on your profile while a dispute is under review.',
  },
  {
    q: 'How often are my documents re-checked?',
    a: 'Annually. We remind you 60 days before, and you only re-upload what has expired or changed.',
  },
];

export default function Help() {
  const [q, setQ] = useState('');
  const { data: tickets } = useAsync(() => repo.getTickets(), []);

  const filtered = q.trim()
    ? FAQS.filter(
        (f) =>
          f.q.toLowerCase().includes(q.toLowerCase()) || f.a.toLowerCase().includes(q.toLowerCase()),
      )
    : FAQS;

  return (
    <Screen header={<AppBar title="Help & support" />}>
      <Input value={q} onChangeText={setQ} placeholder="Search help" icon="search-outline" />

      <Section title="Common questions">
        {filtered.length > 0 ? (
          <Card padded={false}>
            {filtered.map((f, i) => (
              <AccordionRow key={f.q} title={f.q} body={f.a} last={i === filtered.length - 1} />
            ))}
          </Card>
        ) : (
          <Card>
            <EmptyState
              icon="search-outline"
              title="Nothing matched"
              body="Try different words, or raise a request and we'll answer directly."
            />
          </Card>
        )}
      </Section>

      <Section title="Contact us">
        <ListGroup>
          <ListRow
            first
            icon="create-outline"
            iconTone="brand"
            title="Raise a request"
            subtitle="We aim to respond within 24 hours"
            onPress={() => router.push('/support/new')}
          />
          <ListRow
            last
            icon="warning-outline"
            iconTone="error"
            title="Report a safety concern"
            subtitle="Handled immediately"
            onPress={() => router.push('/safety')}
          />
        </ListGroup>
      </Section>

      {tickets && tickets.length > 0 ? (
        <Section title="Your requests">
          <ListGroup>
            {tickets.map((tk, i) => (
              <ListRow
                key={tk.id}
                first={i === 0}
                last={i === tickets.length - 1}
                title={tk.subject}
                subtitle={`${tk.reference} · ${relative(tk.createdAt)}`}
                onPress={() => router.push(`/support/${tk.id}`)}
                trailing={
                  <StatusPill
                    label={
                      tk.status === 'open' ? 'Open' : tk.status === 'in_progress' ? 'In progress' : 'Resolved'
                    }
                    tone={tk.status === 'resolved' ? 'success' : tk.status === 'open' ? 'info' : 'warning'}
                    size="sm"
                  />
                }
              />
            ))}
          </ListGroup>
        </Section>
      ) : null}
    </Screen>
  );
}
