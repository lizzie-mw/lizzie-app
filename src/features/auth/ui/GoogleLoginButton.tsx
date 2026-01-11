import { Button } from '@/shared/ui';
import { useAuthStore } from '../model/authStore';

interface GoogleLoginButtonProps {
  onError?: (error: Error) => void;
}

export function GoogleLoginButton({ onError }: GoogleLoginButtonProps) {
  const { signInWithGoogle, isLoading } = useAuthStore();

  const handlePress = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      onError?.(error as Error);
    }
  };

  return (
    <Button
      testID="login-google-button"
      variant="outline"
      size="lg"
      fullWidth
      loading={isLoading}
      onPress={handlePress}
      leftIcon="logo-google"
    >
      Google로 계속하기
    </Button>
  );
}
