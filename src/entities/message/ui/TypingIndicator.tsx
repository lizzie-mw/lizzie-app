import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useEffect, useMemo } from 'react';
import { Icon } from '@/shared/ui';
import { withParticle } from '@/shared/lib';

interface TypingIndicatorProps {
  lizardName?: string;
}

const DOT_DELAYS = [0, 150, 300];
const ANIMATION_DURATION = 300;

function useDotAnimation(delay: number) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: ANIMATION_DURATION }),
          withTiming(0.3, { duration: ANIMATION_DURATION })
        ),
        -1,
        false
      )
    );
  }, [opacity, delay]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return style;
}

export function TypingIndicator({ lizardName = '리치' }: TypingIndicatorProps) {
  const dotStyles = DOT_DELAYS.map((delay) => useDotAnimation(delay));

  return (
    <View className="flex-row justify-start mb-3 items-end">
      <View className="w-8 h-8 rounded-full bg-primary-100 items-center justify-center mr-2">
        <Icon family="material" name="lizard" size="xs" color="#5cb82f" />
      </View>
      <View className="bg-cream-100 px-4 py-3 rounded-2xl rounded-bl-sm">
        <View className="flex-row items-center">
          {dotStyles.map((style, index) => (
            <Animated.View
              key={index}
              style={style}
              className={`w-2 h-2 rounded-full bg-primary-400 ${index < 2 ? 'mr-1' : ''}`}
            />
          ))}
        </View>
        <Text className="text-xs text-earth-400 mt-1">
          {lizardName}{withParticle(lizardName, '가', '이')} 생각 중...
        </Text>
      </View>
    </View>
  );
}
