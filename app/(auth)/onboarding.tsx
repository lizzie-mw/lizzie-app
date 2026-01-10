import { SafeAreaView } from 'react-native-safe-area-context';
import { LizardForm } from '@/features/register-lizard';

export default function OnboardingScreen() {
  return (
    <SafeAreaView testID="onboarding-screen" className="flex-1 bg-white">
      <LizardForm />
    </SafeAreaView>
  );
}
