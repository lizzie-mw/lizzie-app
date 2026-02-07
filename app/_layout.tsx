import { useEffect } from 'react';
import { Stack, useRouter, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import mobileAds from 'react-native-google-mobile-ads';
import * as Linking from 'expo-linking';
import { AppProviders } from '@/app/providers';
import '../global.css';

// AdMob SDK 초기화
mobileAds().initialize();

export default function RootLayout() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    // Navigation이 준비되면 초기 URL 처리
    if (!rootNavigationState?.key) return;

    const handleInitialURL = async () => {
      const initialURL = await Linking.getInitialURL();

      // Development Client의 deep link이거나 잘못된 URL인 경우 홈으로 이동
      if (initialURL && (
        initialURL.includes('expo-development-client') ||
        initialURL === 'lizzie:///' ||
        initialURL === 'lizzie://'
      )) {
        // 약간의 지연 후 리다이렉트 (navigation이 완전히 준비되도록)
        setTimeout(() => {
          router.replace('/');
        }, 100);
      }
    };

    handleInitialURL();
  }, [rootNavigationState?.key, router]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProviders>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(main)" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </AppProviders>
    </GestureHandlerRootView>
  );
}
