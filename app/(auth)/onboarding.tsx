import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LizardForm } from '@/features/register-lizard';
import { IconButton } from '@/shared/ui';

export default function OnboardingScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView testID="onboarding-screen" className="flex-1 bg-white">
      {/* Header with back button */}
      <View className="flex-row items-center px-4 py-2">
        <IconButton
          testID="onboarding-back-button"
          icon="arrow-back"
          variant="ghost"
          size="md"
          onPress={handleBack}
        />
      </View>

      {/* Progress Bar */}
      <View className="px-6 pb-2">
        <View className="h-1 bg-gray-200 rounded-full">
          <View className="h-1 bg-primary-500 rounded-full w-full" />
        </View>
      </View>

      <LizardForm />
    </SafeAreaView>
  );
}
