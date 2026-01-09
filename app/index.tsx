import { Redirect } from 'expo-router';
import { useAuth } from '@/features/auth';
import { Loading } from '@/shared/ui';

export default function Index() {
  const { isAuthenticated, isLoading, lizard } = useAuth();

  if (isLoading) {
    return <Loading fullScreen />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  if (!lizard) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(main)" />;
}
