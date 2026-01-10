import { Text, View } from 'react-native';
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
    >
      <View className="flex-row items-center">
        <Text className="text-lg mr-2">G</Text>
        <Text className="text-gray-900 font-medium">Google로 계속하기</Text>
      </View>
    </Button>
  );
}
