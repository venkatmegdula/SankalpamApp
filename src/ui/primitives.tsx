import { type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text as RNText,
  View,
  type StyleProp,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { Icon, type IconName } from '@/ui/Icon';
import * as Haptics from 'expo-haptics';
import { useColors } from './ThemeProvider';
import { HIT, control, radius, shadow, space, tabularNums, type as typeScale } from './tokens';


/* -------------------------------------------------------------------- Text */

type Tone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'faint'
  | 'brand'
  | 'accent'
  | 'inverse'
  | 'onBrand'
  | 'success'
  | 'warning'
  | 'error'
  | 'urgent';

export type TextVariant = keyof typeof typeScale;

export function Text({
  variant = 'body',
  tone = 'primary',
  center,
  numeric,
  style,
  children,
  ...rest
}: TextProps & {
  variant?: TextVariant;
  tone?: Tone;
  center?: boolean;
  numeric?: boolean;
  children?: ReactNode;
}) {
  const t = useColors();
  const toneColor: Record<Tone, string> = {
    primary: t.fg.primary,
    secondary: t.fg.secondary,
    tertiary: t.fg.tertiary,
    faint: t.fg.faint,
    brand: t.fg.brand,
    accent: t.fg.accent,
    inverse: t.fg.inverse,
    onBrand: t.fg.onBrand,
    success: t.status.successFg,
    warning: t.status.warningFg,
    error: t.status.errorFg,
    urgent: t.status.urgentFg,
  };

  return (
    <RNText
      allowFontScaling
      maxFontSizeMultiplier={2}
      style={[
        typeScale[variant] as TextStyle,
        { color: toneColor[tone] },
        center && { textAlign: 'center' },
        numeric && tabularNums,
        style,
      ]}
      {...rest}>
      {children}
    </RNText>
  );
}

/* ------------------------------------------------------------------ Button */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'inverse';
type ButtonSize = 'sm' | 'md' | 'lg';

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  disabled,
  loading,
  fullWidth = true,
  style,
}: {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconRight?: IconName;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useColors();
  const off = disabled || loading;

  const skin: Record<ButtonVariant, { bg: string; fg: string; border?: string }> = {
    primary: { bg: t.bg.brand, fg: t.fg.onBrand },
    secondary: { bg: 'transparent', fg: t.fg.brand, border: t.line.strong },
    ghost: { bg: 'transparent', fg: t.fg.brand },
    danger: { bg: t.status.errorBg, fg: t.status.errorFg },
    inverse: { bg: t.bg.surface, fg: t.fg.brand },
  };
  const s = skin[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!off, busy: !!loading }}
      disabled={off}
      onPress={() => {
        if (off) return;
        void Haptics.selectionAsync().catch(() => {});
        onPress?.();
      }}
      style={({ pressed }) => [
        {
          minHeight: control.height[size],
          paddingHorizontal: control.paddingX[size],
          borderRadius: radius.md,
          backgroundColor: s.bg,
          borderWidth: s.border ? 1.5 : 0,
          borderColor: s.border,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: space.sm,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          opacity: off ? 0.42 : pressed ? 0.82 : 1,
          transform: [{ scale: pressed && !off ? 0.985 : 1 }],
        },
        variant === 'primary' && !off && shadow.sm,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator size="small" color={s.fg} />
      ) : (
        <>
          {icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} color={s.fg} />}
          <Text
            variant={size === 'sm' ? 'smallStrong' : 'title'}
            style={{ color: s.fg }}
            numberOfLines={1}>
            {label}
          </Text>
          {iconRight && <Icon name={iconRight} size={size === 'sm' ? 16 : 18} color={s.fg} />}
        </>
      )}
    </Pressable>
  );
}

/* --------------------------------------------------------------- IconButton */

export function IconButton({
  name,
  onPress,
  tone = 'primary',
  size = 20,
  label,
  variant = 'plain',
}: {
  name: IconName;
  onPress?: () => void;
  tone?: Tone;
  size?: number;
  label: string;
  variant?: 'plain' | 'filled';
}) {
  const t = useColors();
  const colors: Partial<Record<Tone, string>> = {
    primary: t.fg.primary,
    secondary: t.fg.secondary,
    brand: t.fg.brand,
    onBrand: t.fg.onBrand,
    error: t.status.errorFg,
  };
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => ({
        width: HIT - 8,
        height: HIT - 8,
        borderRadius: radius.pill,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: variant === 'filled' ? t.bg.sunken : 'transparent',
        opacity: pressed ? 0.55 : 1,
      })}>
      <Icon name={name} size={size} color={colors[tone] ?? t.fg.primary} />
    </Pressable>
  );
}

/* -------------------------------------------------------------------- Card */

export function Card({
  children,
  style,
  onPress,
  padded = true,
  elevated = true,
  accessibilityLabel,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  padded?: boolean;
  elevated?: boolean;
  accessibilityLabel?: string;
}) {
  const t = useColors();
  const base: ViewStyle = {
    backgroundColor: t.bg.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.line.subtle,
    padding: padded ? space.base : 0,
    overflow: 'hidden',
  };

  if (!onPress) {
    return <View style={[base, elevated && shadow.sm, style]}>{children}</View>;
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        base,
        elevated && shadow.sm,
        pressed && { opacity: 0.9, transform: [{ scale: 0.994 }] },
        style,
      ]}>
      {children}
    </Pressable>
  );
}

/* ---------------------------------------------------------------- StatusPill */

export type PillTone = 'success' | 'warning' | 'error' | 'info' | 'urgent' | 'neutral' | 'brand';

export function StatusPill({
  label,
  tone = 'neutral',
  icon,
  size = 'md',
}: {
  label: string;
  tone?: PillTone;
  icon?: IconName;
  size?: 'sm' | 'md';
}) {
  const t = useColors();
  const map: Record<PillTone, { fg: string; bg: string }> = {
    success: { fg: t.status.successFg, bg: t.status.successBg },
    warning: { fg: t.status.warningFg, bg: t.status.warningBg },
    error: { fg: t.status.errorFg, bg: t.status.errorBg },
    info: { fg: t.status.infoFg, bg: t.status.infoBg },
    urgent: { fg: t.status.urgentFg, bg: t.status.urgentBg },
    neutral: { fg: t.status.neutralFg, bg: t.status.neutralBg },
    brand: { fg: t.fg.brand, bg: t.bg.brandTint },
  };
  const c = map[tone];
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        alignSelf: 'flex-start',
        backgroundColor: c.bg,
        paddingHorizontal: size === 'sm' ? 8 : 10,
        paddingVertical: size === 'sm' ? 3 : 5,
        borderRadius: radius.pill,
      }}>
      {/* Status is never conveyed by colour alone — icon or text always accompanies it. */}
      {icon && <Icon name={icon} size={size === 'sm' ? 11 : 13} color={c.fg} />}
      <Text variant={size === 'sm' ? 'micro' : 'caption'} style={{ color: c.fg }}>
        {label}
      </Text>
    </View>
  );
}

/* ------------------------------------------------------------------ Banner */

export function Banner({
  tone = 'info',
  title,
  body,
  icon,
  actionLabel,
  onAction,
  style,
}: {
  tone?: PillTone;
  title: string;
  body?: string;
  icon?: IconName;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useColors();
  const map: Record<PillTone, { fg: string; bg: string }> = {
    success: { fg: t.status.successFg, bg: t.status.successBg },
    warning: { fg: t.status.warningFg, bg: t.status.warningBg },
    error: { fg: t.status.errorFg, bg: t.status.errorBg },
    info: { fg: t.status.infoFg, bg: t.status.infoBg },
    urgent: { fg: t.status.urgentFg, bg: t.status.urgentBg },
    neutral: { fg: t.status.neutralFg, bg: t.status.neutralBg },
    brand: { fg: t.fg.brand, bg: t.bg.brandTint },
  };
  const c = map[tone];
  const defaultIcon: Record<PillTone, IconName> = {
    success: 'checkmark-circle',
    warning: 'alert-circle',
    error: 'close-circle',
    info: 'information-circle',
    urgent: 'time',
    neutral: 'ellipse',
    brand: 'sparkles',
  };

  return (
    <View
      accessibilityRole="alert"
      style={[
        {
          flexDirection: 'row',
          gap: space.md,
          backgroundColor: c.bg,
          borderRadius: radius.md,
          padding: space.md + 2,
        },
        style,
      ]}>
      <Icon name={icon ?? defaultIcon[tone]} size={19} color={c.fg} style={{ marginTop: 1 }} />
      <View style={{ flex: 1, gap: body ? 3 : 0 }}>
        <Text variant="smallStrong" style={{ color: c.fg }}>
          {title}
        </Text>
        {body ? (
          <Text variant="small" style={{ color: c.fg, opacity: 0.92 }}>
            {body}
          </Text>
        ) : null}
        {actionLabel ? (
          <Pressable onPress={onAction} accessibilityRole="button" style={{ marginTop: 6 }}>
            <Text variant="smallStrong" style={{ color: c.fg, textDecorationLine: 'underline' }}>
              {actionLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------- Misc */

export function Divider({ style, inset = 0 }: { style?: StyleProp<ViewStyle>; inset?: number }) {
  const t = useColors();
  return (
    <View
      style={[
        { height: StyleSheet.hairlineWidth, backgroundColor: t.line.default, marginLeft: inset },
        style,
      ]}
    />
  );
}

export function Avatar({
  name,
  size = 44,
  uri,
  tone = 'brand',
}: {
  name: string;
  size?: number;
  uri?: string;
  tone?: 'brand' | 'accent';
}) {
  const t = useColors();
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
  return (
    <View
      accessible
      accessibilityLabel={name}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: tone === 'brand' ? t.bg.brandTint : t.bg.accentTint,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: t.line.subtle,
      }}>
      <Text
        style={{
          color: tone === 'brand' ? t.fg.brand : t.fg.accent,
          fontSize: size * 0.36,
          lineHeight: size * 0.44,
          fontWeight: '700',
        }}>
        {initials}
      </Text>
    </View>
  );
}

/** Currency, always formatted the same way, always tabular. */
export function Money({
  value,
  variant = 'numeric',
  tone = 'primary',
  showSign,
}: {
  value: number;
  variant?: TextVariant;
  tone?: Tone;
  showSign?: boolean;
}) {
  const sign = showSign ? (value < 0 ? '−' : '+') : value < 0 ? '−' : '';
  const formatted = Math.abs(value).toLocaleString('en-IN');
  return (
    <Text variant={variant} tone={tone} numeric>
      {sign}₹{formatted}
    </Text>
  );
}

export function ProgressBar({ value, tone = 'brand' }: { value: number; tone?: 'brand' | 'accent' }) {
  const t = useColors();
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ now: Math.round(pct * 100), min: 0, max: 100 }}
      style={{
        height: 6,
        borderRadius: radius.pill,
        backgroundColor: t.bg.sunken,
        overflow: 'hidden',
      }}>
      <View
        style={{
          width: `${pct * 100}%`,
          height: '100%',
          borderRadius: radius.pill,
          backgroundColor: tone === 'brand' ? t.bg.brand : t.fg.accent,
        }}
      />
    </View>
  );
}

export function EmptyState({
  icon = 'file-tray-outline',
  title,
  body,
  actionLabel,
  onAction,
}: {
  icon?: IconName;
  title: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const t = useColors();
  return (
    <View style={{ alignItems: 'center', paddingVertical: space.xxl, paddingHorizontal: space.lg }}>
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: t.bg.sunken,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: space.base,
        }}>
        <Icon name={icon} size={26} color={t.fg.tertiary} />
      </View>
      <Text variant="h3" center>
        {title}
      </Text>
      {body ? (
        <Text variant="small" tone="secondary" center style={{ marginTop: 6, maxWidth: 300 }}>
          {body}
        </Text>
      ) : null}
      {actionLabel ? (
        <Button
          label={actionLabel}
          onPress={onAction}
          variant="secondary"
          size="sm"
          fullWidth={false}
          style={{ marginTop: space.lg }}
        />
      ) : null}
    </View>
  );
}

export function Skeleton({
  height = 16,
  width = '100%',
  style,
}: {
  height?: number;
  width?: number | `${number}%`;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useColors();
  return (
    <View
      style={[{ height, width, borderRadius: radius.sm, backgroundColor: t.bg.sunken }, style]}
    />
  );
}

/** Small labelled figure used across dashboards. */
export function Stat({
  label,
  children,
  align = 'left',
}: {
  label: string;
  children: ReactNode;
  align?: 'left' | 'right' | 'center';
}) {
  return (
    <View style={{ gap: 3, alignItems: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center' }}>
      <Text variant="micro" tone="tertiary">
        {label}
      </Text>
      {children}
    </View>
  );
}

export function Row({
  children,
  gap = space.md,
  align = 'center',
  justify = 'flex-start',
  style,
}: {
  children: ReactNode;
  gap?: number;
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[{ flexDirection: 'row', alignItems: align, justifyContent: justify, gap }, style]}>
      {children}
    </View>
  );
}
