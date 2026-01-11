import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  type SharedValue,
  type AnimatedStyle,
} from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';

const DEFAULT_SPRING_CONFIG = { damping: 15, stiffness: 400 };

interface UsePressAnimationOptions {
  scaleValue?: number;
}

interface UsePressAnimationReturn {
  scale: SharedValue<number>;
  animatedStyle: AnimatedStyle<ViewStyle>;
  handlePressIn: () => void;
  handlePressOut: () => void;
}

export function usePressAnimation(
  options: UsePressAnimationOptions = {}
): UsePressAnimationReturn {
  const { scaleValue = 0.9 } = options;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(scaleValue, DEFAULT_SPRING_CONFIG);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, DEFAULT_SPRING_CONFIG);
  };

  return { scale, animatedStyle, handlePressIn, handlePressOut };
}
