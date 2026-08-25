import { type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, G, Path, Pattern, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from './ThemeProvider';
import { brandPalette, radius, shadow, space } from './tokens';

/**
 * Traditional ornament, drawn as code.
 *
 * Everything here is vector and theme-driven — no raster assets to license, and
 * it re-colours with the palette. Ornament is reserved for ceremonial surfaces;
 * dense working screens deliberately get none of it.
 */

/* ------------------------------------------------------------- BotanicalWash */

/**
 * The faint repeating botanical the reference uses behind its ivory panels.
 * Kept under 6% opacity: it should register as texture, never as pattern you
 * read through the text on top of it.
 */
export function BotanicalWash({
  opacity = 0.05,
  color,
  style,
}: {
  opacity?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useColors();
  const tint = color ?? t.fg.accent;

  return (
    <View pointerEvents="none" style={[{ position: 'absolute', inset: 0 } as object, style]}>
      <Svg width="100%" height="100%" opacity={opacity}>
        <Defs>
          <Pattern id="botanical" width="72" height="72" patternUnits="userSpaceOnUse">
            {/* stem + paired leaves — a simplified vine motif */}
            <Path
              d="M36 6 C36 22, 36 34, 36 50"
              stroke={tint}
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d="M36 18 C28 14, 22 18, 22 26 C30 28, 36 24, 36 18 Z"
              fill={tint}
            />
            <Path
              d="M36 30 C44 26, 50 30, 50 38 C42 40, 36 36, 36 30 Z"
              fill={tint}
            />
            <Circle cx="36" cy="56" r="3.2" fill={tint} />
            <Path
              d="M8 62 C14 58, 20 62, 20 68"
              stroke={tint}
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
            />
            <Circle cx="62" cy="14" r="2.2" fill={tint} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#botanical)" />
      </Svg>
    </View>
  );
}

/* ------------------------------------------------------------------ GoldRule */

/**
 * Gold divider with a centred lozenge — the reference's section separator.
 * Purely decorative, so it is hidden from assistive technology.
 */
export function GoldRule({
  width = 120,
  color,
  style,
}: {
  width?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useColors();
  const gold = color ?? t.line.gold;

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ alignItems: 'center' }, style]}>
      <Svg width={width} height={12} viewBox={`0 0 ${width} 12`}>
        <G>
          <Path d={`M0 6 H${width / 2 - 14}`} stroke={gold} strokeWidth="1" />
          <Path d={`M${width / 2 + 14} 6 H${width}`} stroke={gold} strokeWidth="1" />
          <Path
            d={`M${width / 2} 1 L${width / 2 + 7} 6 L${width / 2} 11 L${width / 2 - 7} 6 Z`}
            fill={gold}
          />
          <Circle cx={width / 2 - 11} cy={6} r={1.6} fill={gold} />
          <Circle cx={width / 2 + 11} cy={6} r={1.6} fill={gold} />
        </G>
      </Svg>
    </View>
  );
}

/* ----------------------------------------------------------------- ArchFrame */

/**
 * Temple-arch (mehrab) frame. The reference wraps its hero panel in one; here
 * it wraps ceremonial imagery and the welcome hero.
 */
export function ArchFrame({
  children,
  height,
  bordered = true,
  style,
}: {
  children: ReactNode;
  height?: number;
  bordered?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useColors();
  return (
    <View
      style={[
        {
          height,
          overflow: 'hidden',
          borderTopLeftRadius: 1000,
          borderTopRightRadius: 1000,
          borderBottomLeftRadius: radius.lg,
          borderBottomRightRadius: radius.lg,
          borderWidth: bordered ? 1.5 : 0,
          borderColor: t.line.gold,
          backgroundColor: t.bg.sunken,
        },
        style,
      ]}>
      {children}
    </View>
  );
}

/* -------------------------------------------------------------- CeremonyPanel */

/**
 * The ceremonial card: crimson gradient, botanical wash, gold hairline.
 * Used for the highest-status surface on a screen and nowhere else.
 */
export function CeremonyPanel({
  children,
  style,
  tone = 'brand',
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  tone?: 'brand' | 'champagne';
}) {
  const t = useColors();
  const colors = tone === 'brand' ? t.gradient.brand : t.gradient.champagne;

  return (
    <View style={[{ borderRadius: radius.lg, overflow: 'hidden' }, shadow.hero, style]}>
      <LinearGradient
        colors={colors as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: radius.lg }}>
        <BotanicalWash
          opacity={tone === 'brand' ? 0.09 : 0.06}
          color={tone === 'brand' ? brandPalette.gold300 : t.fg.accent}
        />
        <View
          style={{
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: tone === 'brand' ? 'rgba(237,212,152,0.34)' : t.line.gold,
          }}>
          {children}
        </View>
      </LinearGradient>
    </View>
  );
}

/* ------------------------------------------------------------- CanvasBackdrop */

/** Warm champagne-to-ivory wash with a botanical veil, behind whole screens. */
export function CanvasBackdrop() {
  const t = useColors();
  return (
    <View pointerEvents="none" style={{ position: 'absolute', inset: 0 } as object}>
      <LinearGradient
        colors={t.gradient.canvasWash as [string, string]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={{ flex: 1 }}
      />
      <BotanicalWash opacity={t.mode === 'dark' ? 0.035 : 0.045} />
    </View>
  );
}

/* ----------------------------------------------------------------- DiyaGlyph */

/** A small oil-lamp mark, used where a bullet would otherwise be generic. */
export function DiyaGlyph({ size = 16, color }: { size?: number; color?: string }) {
  const t = useColors();
  const c = color ?? t.fg.accent;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 3c2.4 2.7 3.6 4.9 3.6 7a3.6 3.6 0 0 1-7.2 0c0-2.1 1.2-4.3 3.6-7Z" fill={c} />
      <Path
        d="M4 16h16c0 2.8-3.6 5-8 5s-8-2.2-8-5Z"
        fill={c}
        opacity={0.42}
      />
    </Svg>
  );
}

/** Section heading with flanking gold rules — for ceremonial sections only. */
export function OrnateHeading({ children }: { children: ReactNode }) {
  return (
    <View style={{ alignItems: 'center', gap: space.sm }}>
      {children}
      <GoldRule width={96} />
    </View>
  );
}
