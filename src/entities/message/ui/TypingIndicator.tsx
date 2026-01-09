import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

export function TypingIndicator() {
  const dot1Opacity = useSharedValue(0.3);
  const dot2Opacity = useSharedValue(0.3);
  const dot3Opacity = useSharedValue(0.3);

  useEffect(() => {
    dot1Opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 300 }),
        withTiming(0.3, { duration: 300 })
      ),
      -1,
      false
    );

    setTimeout(() => {
      dot2Opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0.3, { duration: 300 })
        ),
        -1,
        false
      );
    }, 150);

    setTimeout(() => {
      dot3Opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0.3, { duration: 300 })
        ),
        -1,
        false
      );
    }, 300);
  }, []);

  const dot1Style = useAnimatedStyle(() => ({
    opacity: dot1Opacity.value,
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: dot2Opacity.value,
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: dot3Opacity.value,
  }));

  return (
    <View className="flex-row justify-start mb-3">
      <View className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm flex-row items-center">
        <Animated.View
          style={dot1Style}
          className="w-2 h-2 rounded-full bg-gray-400 mr-1"
        />
        <Animated.View
          style={dot2Style}
          className="w-2 h-2 rounded-full bg-gray-400 mr-1"
        />
        <Animated.View
          style={dot3Style}
          className="w-2 h-2 rounded-full bg-gray-400"
        />
      </View>
    </View>
  );
}
