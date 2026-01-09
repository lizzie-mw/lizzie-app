import { View, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore, useUser } from '@/features/auth';
import { lizardApi, lizardKeys } from '@/entities/lizard';
import { Button } from '@/shared/ui';
import { haptics } from '@/shared/lib';

export default function AccountSettingsScreen() {
  const router = useRouter();
  const user = useUser();
  const { signOut } = useAuthStore();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      // 실제로는 계정 삭제 API 호출
      // 여기서는 도마뱀 삭제 + 로그아웃으로 시뮬레이션
      const lizard = queryClient.getQueryData(lizardKeys.me());
      if (lizard && typeof lizard === 'object' && 'id' in lizard) {
        await lizardApi.deleteLizard((lizard as any).id);
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
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      {/* 계정 정보 */}
      <View className="bg-white p-4 mb-4">
        <Text className="text-sm text-gray-500 mb-1">이메일</Text>
        <Text className="text-base text-gray-900">{user?.email || '-'}</Text>
      </View>

      <View className="bg-white p-4 mb-4">
        <Text className="text-sm text-gray-500 mb-1">가입일</Text>
        <Text className="text-base text-gray-900">
          {user?.created_at
            ? new Date(user.created_at).toLocaleDateString('ko-KR')
            : '-'}
        </Text>
      </View>

      {/* 위험 영역 */}
      <View className="flex-1" />

      <View className="p-4">
        <Button
          variant="ghost"
          size="lg"
          fullWidth
          loading={deleteMutation.isPending}
          onPress={handleDeleteAccount}
        >
          <Text className="text-red-500 font-medium">계정 삭제</Text>
        </Button>
        <Text className="text-xs text-gray-400 text-center mt-2">
          계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.
        </Text>
      </View>
    </SafeAreaView>
  );
}
