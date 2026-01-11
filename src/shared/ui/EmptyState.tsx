import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { useEffect, type ReactNode } from 'react';
import { Icon, type IconFamily } from './Icon';

interface EmptyStateProps {
  icon: string;
  iconFamily?: IconFamily;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  iconFamily,
  title,
  description,
  action,
}: EmptyStateProps) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      1000,
      withRepeat(
        withSequence(
          withTiming(-8, { duration: 400 }),
          withTiming(0, { duration: 400 })
        ),
        -1,
        false
      )
    );
  }, [translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View className="flex-1 items-center justify-center py-12 px-6">
      <Animated.View
        style={animatedStyle}
        className="w-20 h-20 rounded-full bg-primary-100 items-center justify-center mb-4"
      >
        <Icon
          family={iconFamily}
          name={icon}
          size="xl"
          color="#5cb82f"
        />
      </Animated.View>
      <Text className="text-lg font-semibold text-gray-900 mb-2 text-center">
        {title}
      </Text>
      <Text className="text-sm text-gray-500 text-center leading-5">
        {description}
      </Text>
      {action && (
        <View className="mt-6">
          {action}
        </View>
      )}
    </View>
  );
}
