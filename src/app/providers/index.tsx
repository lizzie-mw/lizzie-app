import { QueryProvider } from './QueryProvider';
import { AuthProvider } from './AuthProvider';
import { SuspenseView } from '@/shared/ui';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <SuspenseView loadingMessage="앱을 불러오는 중...">
        <AuthProvider>{children}</AuthProvider>
      </SuspenseView>
    </QueryProvider>
  );
}

export { QueryProvider } from './QueryProvider';
export { AuthProvider } from './AuthProvider';
