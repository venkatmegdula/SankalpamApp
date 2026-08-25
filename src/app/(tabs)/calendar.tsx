import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from '@/ui/Icon';
import { useSession } from '@/store/session';
import { useColors } from '@/ui/ThemeProvider';
import { AppBar, Screen, Section } from '@/ui/layout';
import { Card, EmptyState, IconButton, Row, StatusPill, Text } from '@/ui/primitives';
import { SegmentedControl } from '@/ui/forms';
import { BookingCard } from '@/components/BookingCards';
import { useAsync } from '@/lib/useAsync';
import * as repo from '@/data/repository';
import { STATUS_ICON, STATUS_LABEL, STATUS_TONE, dayLabel, time } from '@/lib/format';
import { poojaById } from '@/data/fixtures/catalog';
import { radius, space } from '@/ui/tokens';
import type { Booking } from '@/data/types';

const TABS = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function CalendarTab() {
  const { profile } = useSession();
  const t = useColors();
  const [tab, setTab] = useState('upcoming');
  const [monthOffset, setMonthOffset] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const { data: all } = useAsync(() => repo.getBookings(), []);

  const month = useMemo(() => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + monthOffset);
    return d;
  }, [monthOffset]);

  const grid = useMemo(() => {
    const first = new Date(month);
    const startPad = first.getDay();
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const cells: (Date | null)[] = Array.from({ length: startPad }, () => null);
    for (let i = 1; i <= daysInMonth; i++) {
      cells.push(new Date(month.getFullYear(), month.getMonth(), i));
    }
    return cells;
  }, [month]);

  const byDate = useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const b of all ?? []) {
      const key = new Date(b.scheduledAt).toDateString();
      map.set(key, [...(map.get(key) ?? []), b]);
    }
    return map;
  }, [all]);

  const filtered = useMemo(() => {
    const list = all ?? [];
    if (tab === 'upcoming')
      return list.filter((b) =>
        ['accepted', 'confirmed', 'en_route', 'arrived', 'checked_in', 'in_progress', 'reschedule_requested'].includes(
          b.status,
        ),
      );
    if (tab === 'completed')
      return list.filter((b) => ['completed', 'settled'].includes(b.status));
    return list.filter((b) =>
      ['cancelled_by_devotee', 'cancelled_by_pujari', 'declined_by_pujari', 'no_show_devotee'].includes(
        b.status,
      ),
    );
  }, [all, tab]);

  const selectedBookings = selected ? (byDate.get(selected) ?? []) : [];
  const blackout = new Set(profile?.availability.blackoutDates ?? []);

  return (
    <Screen
      header={
        <AppBar onBack={false} large title="Calendar" />
      }>
      <Card>
        <View style={{ gap: space.md }}>
          <Row justify="space-between" align="center">
            <IconButton
              name="chevron-back"
              label="Previous month"
              size={18}
              onPress={() => setMonthOffset((m) => m - 1)}
            />
            <Text variant="title">
              {month.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </Text>
            <IconButton
              name="chevron-forward"
              label="Next month"
              size={18}
              onPress={() => setMonthOffset((m) => m + 1)}
            />
          </Row>

          <Row gap={0}>
            {DOW.map((d, i) => (
              <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                <Text variant="micro" tone="faint">
                  {d}
                </Text>
              </View>
            ))}
          </Row>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {grid.map((d, i) => {
              if (!d) return <View key={i} style={{ width: `${100 / 7}%`, height: 44 }} />;
              const key = d.toDateString();
              const isToday = key === new Date().toDateString();
              const events = byDate.get(key) ?? [];
              const isSelected = selected === key;
              const isBlackout = blackout.has(d.toISOString().slice(0, 10));

              return (
                <Pressable
                  key={i}
                  accessibilityRole="button"
                  accessibilityLabel={`${d.getDate()}, ${events.length} ceremonies`}
                  onPress={() => setSelected(isSelected ? null : key)}
                  style={{
                    width: `${100 / 7}%`,
                    height: 44,
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 3,
                  }}>
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isSelected
                        ? t.bg.brand
                        : isToday
                          ? t.bg.brandTint
                          : 'transparent',
                    }}>
                    <Text
                      variant="small"
                      numeric
                      style={{
                        color: isSelected
                          ? t.fg.onBrand
                          : isBlackout
                            ? t.fg.faint
                            : isToday
                              ? t.fg.brand
                              : t.fg.primary,
                        textDecorationLine: isBlackout ? 'line-through' : 'none',
                      }}>
                      {d.getDate()}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 2, height: 4 }}>
                    {events.slice(0, 3).map((e) => (
                      <View
                        key={e.id}
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: 2,
                          backgroundColor:
                            e.status === 'requested'
                              ? t.status.urgentFg
                              : ['completed', 'settled'].includes(e.status)
                                ? t.status.successFg
                                : t.fg.brand,
                        }}
                      />
                    ))}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Card>

      {selected ? (
        <Section title={dayLabel(new Date(selected).toISOString())}>
          {selectedBookings.length > 0 ? (
            <View style={{ gap: space.sm }}>
              {selectedBookings.map((b) => (
                <Pressable
                  key={b.id}
                  accessibilityRole="button"
                  accessibilityLabel={poojaById(b.poojaId)?.name}
                  onPress={() =>
                    router.push(b.status === 'requested' ? `/request/${b.id}` : `/booking/${b.id}`)
                  }
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: space.md,
                    padding: space.md,
                    borderRadius: radius.md,
                    backgroundColor: t.bg.surface,
                    borderWidth: 1,
                    borderColor: t.line.subtle,
                  }}>
                  <View style={{ alignItems: 'center', width: 54 }}>
                    <Text variant="smallStrong" numeric>
                      {time(b.scheduledAt).replace(' ', '')}
                    </Text>
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text variant="small">{poojaById(b.poojaId)?.name}</Text>
                    <Text variant="caption" tone="tertiary">
                      {b.locality}
                    </Text>
                  </View>
                  <StatusPill
                    label={STATUS_LABEL[b.status]}
                    tone={STATUS_TONE[b.status]}
                    icon={STATUS_ICON[b.status]}
                    size="sm"
                  />
                </Pressable>
              ))}
            </View>
          ) : (
            <Card>
              <Row gap={space.md} align="center" style={{ paddingVertical: space.sm }}>
                <Icon name="calendar-clear-outline" size={19} color={t.fg.tertiary} />
                <Text variant="small" tone="secondary" style={{ flex: 1 }}>
                  Nothing booked this day.
                </Text>
              </Row>
            </Card>
          )}
        </Section>
      ) : null}

      <SegmentedControl options={TABS} value={tab} onChange={setTab} />

      {filtered.length > 0 ? (
        <View style={{ gap: space.md }}>
          {filtered.map((b) => (
            <BookingCard key={b.id} booking={b} />
          ))}
        </View>
      ) : (
        <Card>
          <EmptyState
            icon="calendar-outline"
            title={
              tab === 'upcoming'
                ? 'No upcoming ceremonies'
                : tab === 'completed'
                  ? 'Nothing completed yet'
                  : 'Nothing cancelled'
            }
            body={
              tab === 'upcoming'
                ? 'Accepted bookings appear here with everything you need for the day.'
                : undefined
            }
          />
        </Card>
      )}
    </Screen>
  );
}
