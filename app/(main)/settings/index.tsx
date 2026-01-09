import { View, Text, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { lizardQueries, LizardAvatar } from '@/entities/lizard';
import { useAuthStore } from '@/features/auth';
import { haptics } from '@/shared/lib';

interface SettingsItemProps {
  icon: string;
  title: string;
  onPress: () => void;
  danger?: boolean;
}

function SettingsItem({ icon, title, onPress, danger }: SettingsItemProps) {
  return (
    <Pressable
      className="flex-row items-center px-4 py-4 bg-white active:bg-gray-50"
      onPress={() => {
        haptics.light();
        onPress();
      }}
    >
      <Text className="text-xl mr-3">{icon}</Text>
      <Text className={`text-base ${danger ? 'text-red-500' : 'text-gray-900'}`}>
        {title}
      </Text>
      <View className="flex-1" />
      <Text className="text-gray-300">›</Text>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuthStore();
  const { data: lizard } = useQuery(lizardQueries.me());

  const handleSignOut = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃하시겠어요?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      {/* 프로필 */}
      <View className="bg-white p-6 items-center mb-4">
        <LizardAvatar lizard={lizard || null} size="xl" />
        <Text className="text-xl font-bold text-gray-900 mt-3">
          {lizard?.name || '도마뱀'}
        </Text>
      </View>

      {/* 설정 메뉴 */}
      <View className="bg-white mb-4">
        <SettingsItem
          icon="🦎"
          title="도마뱀 정보"
          onPress={() => router.push('/settings/lizard')}
        />
        <View className="h-px bg-gray-100 ml-12" />
        <SettingsItem
          icon="👤"
          title="계정"
          onPress={() => router.push('/settings/account')}
        />
      </View>

      <View className="bg-white">
        <SettingsItem
          icon="🚪"
          title="로그아웃"
          onPress={handleSignOut}
          danger
        />
      </View>

      {/* 버전 */}
      <View className="flex-1" />
      <Text className="text-center text-gray-400 text-sm pb-4">
        Lizzie v1.0.0
      </Text>
    </SafeAreaView>
  );
}
