import { type ReactNode, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Icon, type IconName } from '@/ui/Icon';
import * as Haptics from 'expo-haptics';
import { useColors } from './ThemeProvider';
import { Row, Text } from './primitives';
import { HIT, control, radius, space, type as typeScale } from './tokens';


/* ------------------------------------------------------------------- Field */

export function Field({
  label,
  hint,
  error,
  required,
  children,
  style,
}: {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[{ gap: space.sm }, style]}>
      {label ? (
        <Row gap={4} align="baseline">
          <Text variant="smallStrong">{label}</Text>
          {required ? (
            <Text variant="smallStrong" tone="error">
              *
            </Text>
          ) : null}
        </Row>
      ) : null}
      {children}
      {error ? (
        <Row gap={5} align="flex-start">
          <Icon name="alert-circle" size={13} color="#A32E24" style={{ marginTop: 2 }} />
          <Text variant="caption" tone="error" style={{ flex: 1 }}>
            {error}
          </Text>
        </Row>
      ) : hint ? (
        <Text variant="caption" tone="tertiary">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

/* ------------------------------------------------------------------- Input */

export function Input({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  maxLength,
  autoFocus,
  multiline,
  prefix,
  icon,
  invalid,
  editable = true,
  accessibilityLabel,
  onSubmitEditing,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  autoFocus?: boolean;
  multiline?: boolean;
  prefix?: string;
  icon?: IconName;
  invalid?: boolean;
  editable?: boolean;
  accessibilityLabel?: string;
  onSubmitEditing?: () => void;
}) {
  const t = useColors();
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: multiline ? 'flex-start' : 'center',
        gap: space.sm,
        minHeight: multiline ? 92 : control.height.md,
        paddingHorizontal: space.base,
        paddingVertical: multiline ? space.md : 0,
        borderRadius: radius.md,
        backgroundColor: editable ? t.bg.surface : t.bg.sunken,
        borderWidth: 1.5,
        borderColor: invalid ? t.status.errorFg : focused ? t.line.focus : t.line.default,
      }}>
      {icon ? <Icon name={icon} size={18} color={t.fg.tertiary} /> : null}
      {prefix ? (
        <Text variant="body" tone="secondary" numeric>
          {prefix}
        </Text>
      ) : null}
      <TextInput
        accessibilityLabel={accessibilityLabel ?? placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={t.fg.faint}
        keyboardType={keyboardType}
        maxLength={maxLength}
        autoFocus={autoFocus}
        multiline={multiline}
        editable={editable}
        onSubmitEditing={onSubmitEditing}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          typeScale.body,
          {
            flex: 1,
            color: t.fg.primary,
            paddingVertical: multiline ? 0 : 12,
            textAlignVertical: multiline ? 'top' : 'center',
            // RNW focus ring is handled by our own border
            outlineStyle: 'none',
          } as object,
        ]}
      />
    </View>
  );
}

/* -------------------------------------------------------------------- Chip */

export function Chip({
  label,
  selected,
  onPress,
  icon,
  disabled,
  size = 'md',
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: IconName;
  disabled?: boolean;
  size?: 'sm' | 'md';
}) {
  const t = useColors();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: !!selected, disabled: !!disabled }}
      accessibilityLabel={label}
      disabled={disabled}
      onPress={() => {
        void Haptics.selectionAsync().catch(() => {});
        onPress?.();
      }}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        minHeight: size === 'sm' ? 34 : 42,
        paddingHorizontal: size === 'sm' ? 12 : 15,
        borderRadius: radius.pill,
        backgroundColor: selected ? t.bg.brand : t.bg.surface,
        borderWidth: 1.5,
        borderColor: selected ? t.bg.brand : t.line.default,
        opacity: disabled ? 0.4 : pressed ? 0.8 : 1,
      })}>
      {selected ? (
        <Icon name="checkmark" size={size === 'sm' ? 13 : 15} color={t.fg.onBrand} />
      ) : icon ? (
        <Icon name={icon} size={size === 'sm' ? 13 : 15} color={t.fg.secondary} />
      ) : null}
      <Text
        variant={size === 'sm' ? 'caption' : 'smallStrong'}
        style={{ color: selected ? t.fg.onBrand : t.fg.primary }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function ChipGroup({
  options,
  value,
  onChange,
  multi,
  size = 'md',
}: {
  options: { id: string; label: string; icon?: IconName }[];
  value: string[];
  onChange: (next: string[]) => void;
  multi?: boolean;
  size?: 'sm' | 'md';
}) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
      {options.map((o) => {
        const selected = value.includes(o.id);
        return (
          <Chip
            key={o.id}
            label={o.label}
            icon={o.icon}
            selected={selected}
            size={size}
            onPress={() => {
              if (multi) {
                onChange(selected ? value.filter((v) => v !== o.id) : [...value, o.id]);
              } else {
                onChange(selected ? [] : [o.id]);
              }
            }}
          />
        );
      })}
    </View>
  );
}

/* ------------------------------------------------------------------ Stepper */

export function Stepper({
  value,
  onChange,
  min = 0,
  max = 99,
  suffix,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
}) {
  const t = useColors();
  const btn = (name: IconName, delta: number, label: string, off: boolean) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={off}
      onPress={() => {
        void Haptics.selectionAsync().catch(() => {});
        onChange(Math.max(min, Math.min(max, value + delta)));
      }}
      style={({ pressed }) => ({
        width: HIT,
        height: HIT,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius.md,
        backgroundColor: t.bg.sunken,
        opacity: off ? 0.35 : pressed ? 0.7 : 1,
      })}>
      <Icon name={name} size={20} color={t.fg.primary} />
    </Pressable>
  );

  return (
    <Row gap={space.md} align="center">
      {btn('remove', -1, 'Decrease', value <= min)}
      <View style={{ minWidth: 76, alignItems: 'center' }}>
        <Text variant="h3" numeric>
          {value}
          {suffix ? <Text variant="small" tone="secondary">{` ${suffix}`}</Text> : null}
        </Text>
      </View>
      {btn('add', 1, 'Increase', value >= max)}
    </Row>
  );
}

/* ------------------------------------------------------------------- Toggle */

export function Toggle({
  value,
  onChange,
  label,
  accessibilityLabel,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  accessibilityLabel?: string;
}) {
  const t = useColors();
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={() => {
        void Haptics.selectionAsync().catch(() => {});
        onChange(!value);
      }}
      style={{
        width: 50,
        height: 30,
        borderRadius: radius.pill,
        padding: 3,
        justifyContent: 'center',
        backgroundColor: value ? t.bg.brand : t.line.strong,
      }}>
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: '#FFFFFF',
          transform: [{ translateX: value ? 20 : 0 }],
        }}
      />
    </Pressable>
  );
}

/* ----------------------------------------------------------------- Checkbox */

export function Checkbox({
  checked,
  onChange,
  label,
  sublabel,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  sublabel?: string;
  disabled?: boolean;
}) {
  const t = useColors();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled: !!disabled }}
      accessibilityLabel={label}
      disabled={disabled}
      onPress={() => {
        void Haptics.selectionAsync().catch(() => {});
        onChange(!checked);
      }}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: space.md,
        minHeight: HIT,
        paddingVertical: space.sm,
        opacity: disabled ? 0.45 : pressed ? 0.75 : 1,
      })}>
      <View
        style={{
          width: 23,
          height: 23,
          borderRadius: radius.xs,
          marginTop: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: checked ? t.bg.brand : 'transparent',
          borderWidth: 1.8,
          borderColor: checked ? t.bg.brand : t.line.strong,
        }}>
        {checked ? <Icon name="checkmark" size={15} color={t.fg.onBrand} /> : null}
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="body">{label}</Text>
        {sublabel ? (
          <Text variant="caption" tone="tertiary">
            {sublabel}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

/* ---------------------------------------------------------------- RadioRow */

export function RadioRow({
  selected,
  onPress,
  title,
  subtitle,
  icon,
  trailing,
}: {
  selected: boolean;
  onPress: () => void;
  title: string;
  subtitle?: string;
  icon?: IconName;
  trailing?: ReactNode;
}) {
  const t = useColors();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={title}
      onPress={() => {
        void Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.md,
        padding: space.base,
        borderRadius: radius.md,
        backgroundColor: selected ? t.bg.brandTint : t.bg.surface,
        borderWidth: 1.5,
        borderColor: selected ? t.line.brand : t.line.default,
        opacity: pressed ? 0.9 : 1,
      })}>
      {icon ? (
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: radius.sm,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: selected ? t.bg.surface : t.bg.sunken,
          }}>
          <Icon name={icon} size={19} color={selected ? t.fg.brand : t.fg.secondary} />
        </View>
      ) : null}
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="title">{title}</Text>
        {subtitle ? (
          <Text variant="caption" tone="secondary">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing ?? (
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: selected ? t.line.brand : t.line.strong,
          }}>
          {selected ? (
            <View
              style={{ width: 11, height: 11, borderRadius: 6, backgroundColor: t.bg.brand }}
            />
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

/* ---------------------------------------------------------- SegmentedControl */

export function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  const t = useColors();
  return (
    <View
      accessibilityRole="tablist"
      style={{
        flexDirection: 'row',
        backgroundColor: t.bg.sunken,
        borderRadius: radius.md,
        padding: 4,
        gap: 4,
      }}>
      {options.map((o) => {
        const active = o.id === value;
        return (
          <Pressable
            key={o.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={o.label}
            onPress={() => {
              void Haptics.selectionAsync().catch(() => {});
              onChange(o.id);
            }}
            style={{
              flex: 1,
              minHeight: 38,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: radius.sm,
              backgroundColor: active ? t.bg.surface : 'transparent',
              borderWidth: active ? StyleSheet.hairlineWidth : 0,
              borderColor: t.line.subtle,
            }}>
            <Text variant="smallStrong" tone={active ? 'primary' : 'tertiary'} numberOfLines={1}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ------------------------------------------------------------------ Slider */

/** Discrete slider — used for travel radius. Tap targets, not a thin thumb. */
export function StepSlider({
  value,
  onChange,
  steps,
  format,
}: {
  value: number;
  onChange: (v: number) => void;
  steps: number[];
  format: (v: number) => string;
}) {
  const t = useColors();
  return (
    <View style={{ gap: space.md }}>
      <Text variant="h3" numeric>
        {format(value)}
      </Text>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        {steps.map((s) => {
          const active = s <= value;
          return (
            <Pressable
              key={s}
              accessibilityRole="button"
              accessibilityLabel={format(s)}
              onPress={() => {
                void Haptics.selectionAsync().catch(() => {});
                onChange(s);
              }}
              style={{ flex: 1, paddingVertical: space.md }}>
              <View
                style={{
                  height: 8,
                  borderRadius: radius.pill,
                  backgroundColor: active ? t.bg.brand : t.bg.sunken,
                }}
              />
            </Pressable>
          );
        })}
      </View>
      <Row justify="space-between">
        <Text variant="caption" tone="tertiary">
          {format(steps[0])}
        </Text>
        <Text variant="caption" tone="tertiary">
          {format(steps[steps.length - 1])}
        </Text>
      </Row>
    </View>
  );
}
