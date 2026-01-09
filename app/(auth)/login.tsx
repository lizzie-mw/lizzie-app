import { View, Text, Alert } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleLoginButton } from '@/features/auth';

export default function LoginScreen() {
  const handleError = (error: Error) => {
    Alert.alert('로그인 실패', error.message || '다시 시도해주세요.');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        {/* 로고 */}
        <View className="w-32 h-32 mb-8 bg-primary-100 rounded-full items-center justify-center">
          <Text className="text-6xl">🦎</Text>
        </View>

        {/* 타이틀 */}
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Lizzie
        </Text>
        <Text className="text-base text-gray-500 mb-12 text-center leading-6">
          내 도마뱀과 대화하며{'\n'}케어 정보를 배워보세요
        </Text>

        {/* Google 로그인 버튼 */}
        <View className="w-full">
          <GoogleLoginButton onError={handleError} />
        </View>

        {/* 이용약관 */}
        <Text className="text-xs text-gray-400 mt-6 text-center leading-5">
          계속하면 이용약관 및 개인정보처리방침에{'\n'}동의하는 것으로 간주합니다.
        </Text>
      </View>
    </SafeAreaView>
  );
}
