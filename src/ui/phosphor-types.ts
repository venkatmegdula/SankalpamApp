import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

/**
 * Local mirror of Phosphor's public icon props.
 *
 * Declared here rather than imported so that nothing in our TypeScript program
 * has to reach into the dependency's untranspiled source — see
 * `src/types/phosphor-icons.d.ts` for why that matters.
 */
export type IconWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';

export type PhosphorProps = {
  size?: number | string;
  color?: string;
  weight?: IconWeight;
  mirrored?: boolean;
  duotoneColor?: string;
  duotoneOpacity?: number;
  style?: StyleProp<ViewStyle | TextStyle>;
};
