import { Text, Image } from 'react-native';
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
      variant="outline"
      size="lg"
      fullWidth
      loading={isLoading}
      onPress={handlePress}
    >
      <Image
        source={require('../../../../assets/google-logo.png')}
        className="w-5 h-5 mr-3"
        defaultSource={require('../../../../assets/google-logo.png')}
      />
      <Text className="text-gray-900 font-medium">Google로 계속하기</Text>
    </Button>
  );
}
