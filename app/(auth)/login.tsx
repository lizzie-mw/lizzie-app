import { View, Text, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { GoogleLoginButton, useAuthStore } from '@/features/auth';
import { lizardKeys } from '@/entities/lizard';
import type { Lizard } from '@/entities/lizard';

export default function LoginScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mockSignIn } = useAuthStore();

  const handleError = (error: Error) => {
    Alert.alert('로그인 실패', error.message || '다시 시도해주세요.');
  };

  const handleMockLogin = () => {
    // Mock lizard 데이터를 QueryClient에 주입
    const mockLizard: Lizard = {
      id: 'mock-lizard-id' as Lizard['id'],
      user_id: 'mock-user-id' as Lizard['user_id'],
      name: '리치',
      species: 'leopard_gecko',
      morph: '탱제린',
      age_months: 12,
      personality: 'curious',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    queryClient.setQueryData(lizardKeys.me(), mockLizard);

    mockSignIn();
    router.replace('/');
  };

  return (
    <SafeAreaView testID="login-screen" className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        {/* 로고 */}
        <View testID="login-logo" className="w-32 h-32 mb-8 bg-primary-100 rounded-full items-center justify-center">
          <Text className="text-6xl">🦎</Text>
        </View>

        {/* 타이틀 */}
        <Text testID="login-title" className="text-3xl font-bold text-gray-900 mb-2">
          Lizzie
        </Text>
        <Text testID="login-description" className="text-base text-gray-500 mb-12 text-center leading-6">
          내 도마뱀과 대화하며{'\n'}케어 정보를 배워보세요
        </Text>

        {/* Google 로그인 버튼 */}
        <View className="w-full">
          <GoogleLoginButton onError={handleError} />
        </View>

        {/* 이용약관 */}
        <Text testID="login-terms" className="text-xs text-gray-400 mt-6 text-center leading-5">
          계속하면 이용약관 및 개인정보처리방침에{'\n'}동의하는 것으로 간주합니다.
        </Text>

        {/* 개발용 Mock 로그인 버튼 */}
        {__DEV__ && (
          <Pressable
            testID="login-mock-button"
            onPress={handleMockLogin}
            className="mt-8 px-4 py-2 bg-gray-200 rounded-lg"
          >
            <Text className="text-gray-600 text-sm">DEV: Mock 로그인</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}
