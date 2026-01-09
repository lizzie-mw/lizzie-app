import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth';
import { setupOnlineManager } from '@/shared/lib/offline';
import { Loading } from '@/shared/ui';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { initialize, isInitialized, isLoading } = useAuthStore();

  useEffect(() => {
    // 온라인 매니저 설정
    setupOnlineManager();

    // 인증 초기화
    initialize();
  }, [initialize]);

  if (!isInitialized || isLoading) {
    return <Loading fullScreen message="로딩 중..." />;
  }

  return <>{children}</>;
}
