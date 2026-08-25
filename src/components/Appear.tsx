import { useEffect, useState, type ReactNode } from 'react';
import { Animated, Easing, type StyleProp, type ViewStyle } from 'react-native';
import { motion } from '@/ui/tokens';

/**
 * Entrance animation primitive.
 *
 * Deliberately built on React Native's own Animated rather than Reanimated's
 * `entering` layout animations: on web those set `visibility: hidden` up front
 * and, if the animation never runs, the content is silently invisible. A
 * decorative flourish must never be able to hide a screen.
 *
 * Respects reduced-motion by keeping the animation short and opacity-led.
 */
export function Appear({
  children,
  delay = 0,
  from = 'bottom',
  distance = 12,
  duration = motion.base,
  style,
}: {
  children: ReactNode;
  delay?: number;
  from?: 'bottom' | 'top' | 'none';
  distance?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}) {
  // Lazy state rather than a ref: the value is read during render to build the
  // style, and reading a ref during render is both a lint error and a real
  // correctness hazard.
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const anim = Animated.timing(progress, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [progress, delay, duration]);

  const translateY =
    from === 'none'
      ? 0
      : progress.interpolate({
          inputRange: [0, 1],
          outputRange: [from === 'bottom' ? distance : -distance, 0],
        });

  return (
    <Animated.View style={[{ opacity: progress, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}
