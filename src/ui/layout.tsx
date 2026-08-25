import { Children, type ReactNode, type RefObject } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, type IconName } from '@/ui/Icon';
import { router } from 'expo-router';
import { useColors } from './ThemeProvider';
import { CanvasBackdrop } from './Ornament';
import { IconButton, Row, Text } from './primitives';
import { HIT, layout, radius, shadow, space } from './tokens';


/* ------------------------------------------------------------------ AppBar */

export function AppBar({
  title,
  subtitle,
  onBack,
  right,
  transparent,
  large,
}: {
  title?: string;
  subtitle?: string;
  onBack?: (() => void) | false;
  right?: ReactNode;
  transparent?: boolean;
  large?: boolean;
}) {
  const t = useColors();
  const showBack = onBack !== false;

  return (
    <View
      style={{
        backgroundColor: transparent ? 'transparent' : t.bg.canvas,
        borderBottomWidth: transparent ? 0 : StyleSheet.hairlineWidth,
        borderBottomColor: t.line.subtle,
        paddingHorizontal: space.md,
        paddingBottom: large ? space.md : space.sm,
      }}>
      <Row gap={space.xs} align="center" style={{ minHeight: HIT + 4 }}>
        {showBack ? (
          <IconButton
            name="chevron-back"
            label="Go back"
            size={24}
            onPress={() => (onBack ? onBack() : router.back())}
          />
        ) : (
          <View style={{ width: space.sm }} />
        )}
        {!large && title ? (
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text variant="title" numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? (
              <Text variant="caption" tone="tertiary" numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        ) : (
          <View style={{ flex: 1 }} />
        )}
        {right}
      </Row>
      {large && title ? (
        <View style={{ paddingHorizontal: space.sm, paddingTop: space.xs, gap: 3 }}>
          <Text variant="h1">{title}</Text>
          {subtitle ? (
            <Text variant="small" tone="secondary">
              {subtitle}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

/* ------------------------------------------------------------------ Screen */

/**
 * Every screen goes through here. Owns safe areas, the phone-shaped max width
 * on wide viewports, the sticky footer treatment, and consistent padding.
 */
export function Screen({
  children,
  header,
  footer,
  scroll = true,
  padded = true,
  background,
  contentStyle,
  scrollRef,
}: {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  background?: string;
  contentStyle?: StyleProp<ViewStyle>;
  /** Lets a caller scroll the content — the wizard uses it to reach the first invalid field. */
  scrollRef?: RefObject<ScrollView | null>;
}) {
  const t = useColors();
  const insets = useSafeAreaInsets();
  const bg = background ?? t.bg.canvas;

  const inner = (
    <View
      style={[
        {
          flex: 1,
          width: '100%',
          maxWidth: layout.maxContentWidth,
          alignSelf: 'center',
        },
        Platform.OS === 'web' && {
          borderLeftWidth: StyleSheet.hairlineWidth,
          borderRightWidth: StyleSheet.hairlineWidth,
          borderColor: t.line.subtle,
        },
      ]}>
      <View style={{ paddingTop: insets.top }} />
      {header}
      {scroll ? (
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            {
              padding: padded ? layout.screenPadding : 0,
              paddingBottom: (padded ? layout.screenPadding : 0) + (footer ? 0 : insets.bottom + 24),
              gap: space.base,
            },
            contentStyle,
          ]}>
          {children}
        </ScrollView>
      ) : (
        <View
          style={[
            { flex: 1, padding: padded ? layout.screenPadding : 0, gap: space.base },
            contentStyle,
          ]}>
          {children}
        </View>
      )}
      {footer ? (
        <View
          style={{
            paddingHorizontal: layout.screenPadding,
            paddingTop: space.md,
            paddingBottom: Math.max(insets.bottom, space.base),
            backgroundColor: t.bg.surface,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: t.line.subtle,
            gap: space.sm,
          }}>
          {footer}
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      {/* Warm champagne wash + botanical veil, behind every screen. This is what
          makes the app feel like one ceremonial surface rather than a stack of
          white cards. */}
      <CanvasBackdrop />
      {inner}
    </View>
  );
}

/* ----------------------------------------------------------------- Section */

export function Section({
  title,
  action,
  onAction,
  children,
  style,
  dense,
}: {
  title?: string;
  action?: string;
  onAction?: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  dense?: boolean;
}) {
  return (
    <View style={[{ gap: dense ? space.sm : space.md }, style]}>
      {title ? (
        <Row justify="space-between" align="center" style={{ paddingHorizontal: 2 }}>
          <Text variant="micro" tone="tertiary">
            {title}
          </Text>
          {action ? (
            <Pressable onPress={onAction} accessibilityRole="button" hitSlop={8}>
              <Text variant="caption" tone="brand">
                {action}
              </Text>
            </Pressable>
          ) : null}
        </Row>
      ) : null}
      {children}
    </View>
  );
}

/* ----------------------------------------------------------------- ListRow */

export function ListRow({
  title,
  subtitle,
  icon,
  iconTone = 'neutral',
  value,
  trailing,
  onPress,
  chevron = true,
  destructive,
  first,
  last,
}: {
  title: string;
  subtitle?: string;
  icon?: IconName;
  iconTone?: 'neutral' | 'brand' | 'accent' | 'error';
  value?: string;
  trailing?: ReactNode;
  onPress?: () => void;
  chevron?: boolean;
  destructive?: boolean;
  first?: boolean;
  last?: boolean;
}) {
  const t = useColors();
  const iconBg =
    iconTone === 'brand'
      ? t.bg.brandTint
      : iconTone === 'accent'
        ? t.bg.accentTint
        : iconTone === 'error'
          ? t.status.errorBg
          : t.bg.sunken;
  const iconFg =
    iconTone === 'brand'
      ? t.fg.brand
      : iconTone === 'accent'
        ? t.fg.accent
        : iconTone === 'error'
          ? t.status.errorFg
          : t.fg.secondary;

  const body = (
    <Row gap={space.md} align="center" style={{ minHeight: HIT + 6, paddingVertical: space.sm }}>
      {icon ? (
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: radius.sm,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: iconBg,
          }}>
          <Icon name={icon} size={18} color={destructive ? t.status.errorFg : iconFg} />
        </View>
      ) : null}
      <View style={{ flex: 1, gap: 2, minWidth: 0 }}>
        <Text variant="body" tone={destructive ? 'error' : 'primary'} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" tone="tertiary" numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {value ? (
        <Text variant="smallStrong" tone="secondary" numeric>
          {value}
        </Text>
      ) : null}
      {trailing}
      {onPress && chevron ? (
        <Icon name="chevron-forward" size={17} color={t.fg.faint} />
      ) : null}
    </Row>
  );

  const container: ViewStyle = {
    paddingHorizontal: space.base,
    backgroundColor: t.bg.surface,
    borderTopLeftRadius: first ? radius.lg : 0,
    borderTopRightRadius: first ? radius.lg : 0,
    borderBottomLeftRadius: last ? radius.lg : 0,
    borderBottomRightRadius: last ? radius.lg : 0,
    borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth,
    borderBottomColor: t.line.subtle,
  };

  if (!onPress) return <View style={container}>{body}</View>;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [container, pressed && { backgroundColor: t.bg.sunken }]}>
      {body}
    </Pressable>
  );
}

/** Groups ListRows into a single rounded card with correct corner handling. */
export function ListGroup({ children }: { children: ReactNode }) {
  const t = useColors();
  // Children may be a single element, an array, or contain conditional nulls.
  const items = Children.toArray(children).filter(Boolean);
  return (
    <View
      style={[
        {
          borderRadius: radius.lg,
          overflow: 'hidden',
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: t.line.subtle,
        },
        shadow.sm,
      ]}>
      {items}
    </View>
  );
}

/* ------------------------------------------------------------------- Sheet */

export function Sheet({
  visible,
  onClose,
  title,
  children,
  footer,
}: {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const t = useColors();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        accessibilityLabel="Close"
        onPress={onClose}
        style={{ flex: 1, backgroundColor: t.bg.overlay, justifyContent: 'flex-end' }}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={[
            {
              backgroundColor: t.bg.surface,
              borderTopLeftRadius: radius.xxl,
              borderTopRightRadius: radius.xxl,
              paddingTop: space.md,
              paddingBottom: Math.max(insets.bottom, space.lg),
              width: '100%',
              maxWidth: layout.maxContentWidth,
              alignSelf: 'center',
            },
            shadow.lg,
          ]}>
          <View
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: t.line.strong,
              alignSelf: 'center',
              marginBottom: space.base,
            }}
          />
          {title ? (
            <View style={{ paddingHorizontal: layout.screenPadding, paddingBottom: space.md }}>
              <Text variant="h3">{title}</Text>
            </View>
          ) : null}
          <ScrollView
            style={{ maxHeight: 480 }}
            contentContainerStyle={{ paddingHorizontal: layout.screenPadding, gap: space.md }}>
            {children}
          </ScrollView>
          {footer ? (
            <View
              style={{ paddingHorizontal: layout.screenPadding, paddingTop: space.base, gap: space.sm }}>
              {footer}
            </View>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/* ------------------------------------------------------------- StepProgress */

/** The application wizard's progress indicator. Honest: "Step 7 of 14". */
export function StepProgress({ step, total }: { step: number; total: number }) {
  const t = useColors();
  return (
    <View style={{ gap: space.sm }}>
      <Row justify="space-between">
        <Text variant="micro" tone="tertiary">{`Step ${step} of ${total}`}</Text>
        <Text variant="micro" tone="tertiary">{`${Math.round((step / total) * 100)}%`}</Text>
      </Row>
      <View style={{ flexDirection: 'row', gap: 3 }}>
        {Array.from({ length: total }, (_, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: radius.pill,
              backgroundColor: i < step ? t.bg.brand : t.bg.sunken,
            }}
          />
        ))}
      </View>
    </View>
  );
}
