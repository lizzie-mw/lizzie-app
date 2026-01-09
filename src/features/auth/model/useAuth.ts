import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore, useIsAuthenticated, useAuthLoading, useAuthInitialized } from './authStore';
import { lizardQueries } from '@/entities/lizard';

export function useAuth() {
  const router = useRouter();
  const segments = useSegments();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();
  const isInitialized = useAuthInitialized();
  const user = useAuthStore((state) => state.user);

  const { data: lizard, isLoading: isLizardLoading } = useQuery({
    ...lizardQueries.me(),
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!isInitialized || isLoading || isLizardLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // 미인증 → 로그인으로
      router.replace('/login');
    } else if (isAuthenticated && !lizard && !inAuthGroup) {
      // 인증됐지만 도마뱀 없음 → 온보딩으로
      router.replace('/onboarding');
    } else if (isAuthenticated && lizard && inAuthGroup) {
      // 인증 + 도마뱀 있음 → 메인으로
      router.replace('/');
    }
  }, [isAuthenticated, isInitialized, isLoading, lizard, isLizardLoading, segments]);

  return { isAuthenticated, isLoading, isInitialized, user, lizard };
}
