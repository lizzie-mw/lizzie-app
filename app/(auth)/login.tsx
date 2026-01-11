import { View, Text, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { GoogleLoginButton, useAuthStore } from '@/features/auth';
import { lizardKeys } from '@/entities/lizard';
import { Icon } from '@/shared/ui';
import type { Lizard } from '@/entities/lizard';

export default function LoginScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mockSignIn } = useAuthStore();
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      500,
      withRepeat(
        withSequence(
          withTiming(-6, { duration: 600 }),
          withTiming(0, { duration: 600 })
        ),
        -1,
        true
      )
    );
  }, [translateY]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleError = (error: Error) => {
    Alert.alert('로그인 실패', error.message || '다시 시도해주세요.');
  };

  const handleMockLogin = () => {
    const mockLizard: Lizard = {
      id: 'mock-lizard-id',
      name: '리치',
      species: 'leopard_gecko',
      birth_date: '2023-01',
      gender: 'male',
      personality: 'active',
      profile_image_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    queryClient.setQueryData(lizardKeys.me(), mockLizard);

    mockSignIn();
    router.replace('/');
  };

  return (
    <SafeAreaView testID="login-screen" className="flex-1 bg-cream-50">
      {/* Decorative Background Blobs */}
      <View className="absolute top-0 left-0 w-40 h-40 bg-primary-100 rounded-full -translate-x-20 -translate-y-10 opacity-60" />
      <View className="absolute top-20 right-0 w-32 h-32 bg-accent-100 rounded-full translate-x-16 opacity-50" />
      <View className="absolute bottom-40 left-0 w-24 h-24 bg-primary-200 rounded-full -translate-x-10 opacity-40" />

      <View className="flex-1 justify-center items-center px-8">
        {/* Logo with Animation */}
        <Animated.View
          testID="login-logo"
          style={animatedIconStyle}
          className="w-36 h-36 mb-6 bg-primary-100 rounded-full items-center justify-center shadow-lg"
        >
          <Icon family="material" name="lizard" size="xl" color="#5cb82f" />
        </Animated.View>

        {/* Title */}
        <Text
          testID="login-title"
          className="text-5xl font-extrabold text-gray-900 mb-3"
          style={{ letterSpacing: -1 }}
        >
          Lizzie
        </Text>
        <Text
          testID="login-description"
          className="text-base text-earth-500 mb-10 text-center leading-6"
        >
          {'도마뱀과 함께하는\n케어 파트너'}
        </Text>

        {/* Google Login Button */}
        <View className="w-full mb-6">
          <GoogleLoginButton onError={handleError} />
        </View>

        {/* Terms */}
        <Text
          testID="login-terms"
          className="text-xs text-gray-400 text-center leading-5"
        >
          {'계속하면 이용약관 및 개인정보처리방침에\n동의하는 것으로 간주합니다.'}
        </Text>

        {/* Dev Mock Login Button */}
        {__DEV__ && (
          <Pressable
            testID="login-mock-button"
            onPress={handleMockLogin}
            className="mt-8 px-4 py-2 bg-earth-200 rounded-xl"
          >
            <Text className="text-earth-500 text-sm font-medium">DEV: Mock 로그인</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}
