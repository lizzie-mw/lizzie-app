import { View, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore, useUser } from '@/features/auth';
import { lizardApi, lizardKeys, type Lizard } from '@/entities/lizard';
import { Button, Card, Icon } from '@/shared/ui';
import { haptics } from '@/shared/lib';

export default function AccountSettingsScreen() {
  const router = useRouter();
  const user = useUser();
  const { signOut } = useAuthStore();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const lizard = queryClient.getQueryData<Lizard>(lizardKeys.me());
      if (lizard?.id) {
        await lizardApi.deleteLizard(lizard.id);
      }
      await signOut();
    },
    onSuccess: () => {
      haptics.success();
      router.replace('/login');
    },
    onError: (error: Error) => {
      haptics.error();
      Alert.alert('오류', error.message || '다시 시도해주세요.');
    },
  });

  const handleDeleteAccount = () => {
    Alert.alert(
      '계정 삭제',
      '정말 계정을 삭제하시겠어요?\n모든 데이터가 영구적으로 삭제됩니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-cream-50" edges={['bottom']}>
      {/* Account Info */}
      <View className="p-4">
        <Card variant="default" padding="lg">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 rounded-full bg-primary-100 items-center justify-center mr-3">
              <Icon name="mail-outline" size="sm" color="#5cb82f" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-earth-400 mb-0.5">이메일</Text>
              <Text className="text-base font-medium text-gray-900">
                {user?.email || '-'}
              </Text>
            </View>
          </View>

          <View className="h-px bg-cream-200 my-2" />

          <View className="flex-row items-center mt-2">
            <View className="w-10 h-10 rounded-full bg-primary-100 items-center justify-center mr-3">
              <Icon name="calendar-outline" size="sm" color="#5cb82f" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-earth-400 mb-0.5">가입일</Text>
              <Text className="text-base font-medium text-gray-900">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString('ko-KR')
                  : '-'}
              </Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Danger Zone */}
      <View className="flex-1" />

      <View className="p-4">
        <Card variant="default" padding="md" className="bg-red-50 border border-red-100">
          <Text className="text-sm font-semibold text-red-600 mb-2">
            위험 영역
          </Text>
          <Text className="text-xs text-red-400 mb-4">
            계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.
          </Text>
          <Button
            variant="danger"
            size="md"
            fullWidth
            loading={deleteMutation.isPending}
            onPress={handleDeleteAccount}
          >
            계정 삭제
          </Button>
        </Card>
      </View>
    </SafeAreaView>
  );
}
