import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Link, Stack, useRouter, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotFoundScreen() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Development Client의 deep link나 잘못된 경로는 자동으로 홈으로 리다이렉트
    // expo-development-client 관련 경로이거나 빈 경로인 경우
    if (pathname === '/' || pathname.includes('expo-development-client') || pathname === '') {
      router.replace('/');
      return;
    }

    // 다른 잘못된 경로는 2초 후 자동 리다이렉트
    const timer = setTimeout(() => {
      router.replace('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname, router]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ title: '페이지를 찾을 수 없음' }} />
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-6xl mb-4">404</Text>
        <Text className="text-xl font-bold text-gray-900 mb-2">
          페이지를 찾을 수 없어요
        </Text>
        <Text className="text-gray-500 text-center mb-6">
          잠시 후 홈으로 이동합니다...
        </Text>
        <Link href="/" className="text-primary-500 font-semibold">
          지금 홈으로 이동
        </Link>
      </View>
    </SafeAreaView>
  );
}
