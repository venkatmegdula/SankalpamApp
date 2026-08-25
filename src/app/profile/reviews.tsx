import { useState } from 'react';
import { View } from 'react-native';
import { Icon, type IconName } from '@/ui/Icon';
import { useSession } from '@/store/session';
import { useColors } from '@/ui/ThemeProvider';
import { AppBar, Screen, Section, Sheet } from '@/ui/layout';
import { Button, Card, Divider, EmptyState, Row, StatusPill, Text } from '@/ui/primitives';
import { Input } from '@/ui/forms';
import { useAsync } from '@/lib/useAsync';
import * as repo from '@/data/repository';
import { poojaById } from '@/data/fixtures/catalog';
import { relative } from '@/lib/format';
import { space } from '@/ui/tokens';

function Stars({ n, size = 14 }: { n: number; size?: number }) {
  const t = useColors();
  return (
    <Row gap={2} align="center">
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon
          key={i}
          name={i <= n ? 'star' : 'star-outline'}
          size={size}
          color={i <= n ? t.fg.accent : t.fg.faint}
        />
      ))}
    </Row>
  );
}

export default function Reviews() {
  const { profile, showToast } = useSession();
  const t = useColors();
  const { data, reload } = useAsync(() => repo.getReviews(), []);
  const [target, setTarget] = useState<string | null>(null);
  const [mode, setMode] = useState<'respond' | 'dispute'>('respond');
  const [text, setText] = useState('');

  const reviews = data ?? [];
  const dist = [5, 4, 3, 2, 1].map((r) => ({
    r,
    count: reviews.filter((x) => x.rating === r).length,
  }));
  const total = reviews.length || 1;

  return (
    <Screen header={<AppBar title="Ratings & reviews" />}>
      <Card>
        <Row gap={space.xl} align="center">
          <View style={{ alignItems: 'center', gap: 4 }}>
            <Text variant="numericLarge" numeric>
              {profile?.rating?.toFixed(1) ?? '—'}
            </Text>
            <Stars n={Math.round(profile?.rating ?? 0)} />
            <Text variant="caption" tone="tertiary">
              {profile?.ratingCount ?? 0} ratings
            </Text>
          </View>
          <View style={{ flex: 1, gap: 5 }}>
            {dist.map((d) => (
              <Row key={d.r} gap={space.sm} align="center">
                <Text variant="micro" tone="tertiary" numeric style={{ width: 8 }}>
                  {d.r}
                </Text>
                <View
                  style={{
                    flex: 1,
                    height: 5,
                    borderRadius: 3,
                    backgroundColor: t.bg.sunken,
                    overflow: 'hidden',
                  }}>
                  <View
                    style={{
                      width: `${(d.count / total) * 100}%`,
                      height: '100%',
                      backgroundColor: t.fg.accent,
                    }}
                  />
                </View>
                <Text variant="micro" tone="faint" numeric style={{ width: 12, textAlign: 'right' }}>
                  {d.count}
                </Text>
              </Row>
            ))}
          </View>
        </Row>
      </Card>

      <Section title="All reviews">
        {reviews.length > 0 ? (
          <View style={{ gap: space.md }}>
            {reviews.map((r) => (
              <Card key={r.id}>
                <View style={{ gap: space.md }}>
                  <Row justify="space-between" align="flex-start">
                    <View style={{ gap: 4, flex: 1 }}>
                      <Text variant="title">{r.devoteeName}</Text>
                      <Text variant="caption" tone="tertiary">
                        {poojaById(r.poojaId)?.name} · {relative(r.createdAt)}
                      </Text>
                    </View>
                    <Stars n={r.rating} />
                  </Row>

                  {r.text ? (
                    <Text variant="small" tone="secondary">
                      {r.text}
                    </Text>
                  ) : null}

                  {r.response ? (
                    <View
                      style={{
                        padding: space.md,
                        borderRadius: 10,
                        backgroundColor: t.bg.sunken,
                        gap: 4,
                      }}>
                      <Text variant="micro" tone="tertiary">
                        Your response
                      </Text>
                      <Text variant="small" tone="secondary">
                        {r.response}
                      </Text>
                    </View>
                  ) : null}

                  {r.disputed ? (
                    <StatusPill label="Disputed — under review" tone="warning" icon="help-buoy" size="sm" />
                  ) : null}

                  {!r.response && !r.disputed ? (
                    <>
                      <Divider />
                      <Row gap={space.sm}>
                        <Button
                          label="Respond"
                          variant="secondary"
                          size="sm"
                          onPress={() => {
                            setTarget(r.id);
                            setMode('respond');
                            setText('');
                          }}
                          style={{ flex: 1 }}
                        />
                        {r.rating <= 2 ? (
                          <Button
                            label="Dispute"
                            variant="ghost"
                            size="sm"
                            onPress={() => {
                              setTarget(r.id);
                              setMode('dispute');
                              setText('');
                            }}
                            style={{ flex: 1 }}
                          />
                        ) : null}
                      </Row>
                    </>
                  ) : null}
                </View>
              </Card>
            ))}
          </View>
        ) : (
          <Card>
            <EmptyState
              icon="star-outline"
              title="No reviews yet"
              body="Devotees are invited to rate every ceremony once it's complete."
            />
          </Card>
        )}
      </Section>

      <Sheet
        visible={!!target}
        onClose={() => setTarget(null)}
        title={mode === 'respond' ? 'Respond publicly' : 'Dispute this review'}
        footer={
          <>
            <Button
              label={mode === 'respond' ? 'Post response' : 'Send to support'}
              disabled={text.trim().length < 5}
              onPress={async () => {
                if (!target) return;
                if (mode === 'respond') await repo.respondToReview(target, text);
                else await repo.disputeReview(target);
                setTarget(null);
                await reload();
                showToast(mode === 'respond' ? 'Response posted' : 'Sent to our team for review');
              }}
            />
            <Button label="Cancel" variant="ghost" onPress={() => setTarget(null)} />
          </>
        }>
        <Text variant="small" tone="secondary">
          {mode === 'respond'
            ? 'Devotees see this alongside the review. A calm, factual reply reads best.'
            : 'Tell us what happened. Our team reviews the booking record and contacts the devotee where needed. Nothing changes on your profile while it is under review.'}
        </Text>
        <Input
          value={text}
          onChangeText={setText}
          multiline
          placeholder={mode === 'respond' ? 'Your response' : 'What happened?'}
        />
      </Sheet>
    </Screen>
  );
}
