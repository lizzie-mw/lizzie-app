import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LizardAvatar, LizardInfo } from '@/entities/lizard';
import type { Lizard } from '@/entities/lizard';
import { haptics } from '@/shared/lib';

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
    haptics.light();
    router.push('/settings/lizard');
  };

  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm">
      <View className="flex-row items-center">
        <LizardAvatar lizard={lizard} size="lg" />

        <View className="flex-1 ml-4">
          <LizardInfo lizard={lizard} />
        </View>

        {showEditButton && (
          <Pressable
            className="p-2 rounded-full active:bg-gray-100"
            onPress={handleEdit}
          >
            <Text className="text-gray-400">✏️</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
