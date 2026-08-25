import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { Text } from '@/ui/primitives';
import { fontFamily, space } from '@/ui/tokens';

/**
 * Placeholder brand mark.
 *
 * The client is finalising the Sankalpam logo and brand identity separately.
 * This is a neutral, token-driven stand-in — a diya flame inside a ring — so
 * the real mark drops in without touching layout.
 */
export function BrandGlyph({ size = 40, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Circle cx="20" cy="20" r="18.25" stroke={color} strokeWidth="1.5" opacity={0.32} />
      <Path
        d="M20 9c3.6 3.9 5.4 7.1 5.4 10.2 0 3.5-2.4 6.1-5.4 6.1s-5.4-2.6-5.4-6.1C14.6 16.1 16.4 12.9 20 9Z"
        fill={color}
      />
      <Path
        d="M13 28.5c1.9 1.6 4.3 2.4 7 2.4s5.1-.8 7-2.4"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function BrandLockup({
  color,
  tagline,
  size = 40,
}: {
  color: string;
  tagline?: string;
  size?: number;
}) {
  return (
    <View style={{ alignItems: 'center', gap: space.md }}>
      <BrandGlyph size={size} color={color} />
      <View style={{ alignItems: 'center', gap: 4 }}>
        <Text
          style={{
            color,
            fontSize: size * 0.44,
            lineHeight: size * 0.54,
            fontFamily: fontFamily.serif,
            letterSpacing: size * 0.13,
            marginRight: -size * 0.13,
          }}>
          SANKALPAM
        </Text>
        {tagline ? (
          <Text variant="caption" style={{ color, opacity: 0.72, letterSpacing: 0.3 }}>
            {tagline}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
