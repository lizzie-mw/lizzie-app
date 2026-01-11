import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { LizardAvatar, LizardInfo } from '@/entities/lizard';
import type { Lizard } from '@/entities/lizard';
import { IconButton, Card } from '@/shared/ui';

interface LizardProfileCardProps {
  lizard: Lizard;
  showEditButton?: boolean;
}

export function LizardProfileCard({
  lizard,
  showEditButton = true,
}: LizardProfileCardProps) {
  const router = useRouter();

  const handleEdit = () => {
    router.push('/settings/lizard');
  };

  return (
    <Card variant="gradient" padding="md">
      <View className="flex-row items-center">
        <View className="rounded-full border-2 border-primary-300">
          <LizardAvatar lizard={lizard} size="lg" />
        </View>

        <View className="flex-1 ml-4">
          <LizardInfo lizard={lizard} />
        </View>

        {showEditButton && (
          <IconButton
            testID="edit-lizard-button"
            icon="create-outline"
            variant="ghost"
            size="md"
            onPress={handleEdit}
          />
        )}
      </View>
    </Card>
  );
}
