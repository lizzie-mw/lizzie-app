import { View, Text, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { lizardQueries, LizardAvatar } from '@/entities/lizard';
import { useAuthStore } from '@/features/auth';
import { haptics } from '@/shared/lib';
import { Icon } from '@/shared/ui';
import type { ComponentProps } from 'react';

type IconProps = ComponentProps<typeof Icon>;

interface SettingsItemProps {
  icon: IconProps['name'];
  iconFamily?: IconProps['family'];
  iconColor?: string;
  title: string;
  onPress: () => void;
  danger?: boolean;
}

function SettingsItem({
  icon,
  iconFamily,
  iconColor = '#5cb82f',
  title,
  onPress,
  danger,
}: SettingsItemProps) {
  return (
    <Pressable
      className="flex-row items-center px-4 py-4 bg-white active:bg-cream-50"
      onPress={() => {
        haptics.light();
        onPress();
      }}
    >
      <View
        className={`w-9 h-9 rounded-xl items-center justify-center mr-3 ${
          danger ? 'bg-red-50' : 'bg-primary-50'
        }`}
      >
        <Icon
          family={iconFamily}
          name={icon}
          size="sm"
          color={danger ? '#ef4444' : iconColor}
        />
      </View>
      <Text
        className={`text-base font-medium ${danger ? 'text-red-500' : 'text-gray-900'}`}
      >
        {title}
      </Text>
      <View className="flex-1" />
      <Icon name="chevron-forward" size="sm" color="#c9b69e" />
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
    <SafeAreaView className="flex-1 bg-cream-50" edges={['bottom']}>
      {/* Profile Header */}
      <View className="bg-white p-6 items-center mb-4">
        <View className="rounded-full border-3 border-primary-200 p-1">
          <LizardAvatar lizard={lizard || null} size="xl" />
        </View>
        <Text className="text-2xl font-bold text-gray-900 mt-4">
          {lizard?.name || '도마뱀'}
        </Text>
        <Text className="text-sm text-earth-400 mt-1">
          꼬물톡과 함께하는 케어 파트너
        </Text>
      </View>

      {/* Settings Menu */}
      <View className="bg-white rounded-2xl mx-4 mb-4 overflow-hidden">
        <SettingsItem
          icon="lizard"
          iconFamily="material"
          title="도마뱀 정보"
          onPress={() => router.push('/settings/lizard')}
        />
        <View className="h-px bg-cream-100 ml-16" />
        <SettingsItem
          icon="person-circle-outline"
          title="계정"
          onPress={() => router.push('/settings/account')}
        />
      </View>

      <View className="bg-white rounded-2xl mx-4 overflow-hidden">
        <SettingsItem
          icon="log-out-outline"
          title="로그아웃"
          onPress={handleSignOut}
          danger
        />
      </View>

      {/* Version */}
      <View className="flex-1" />
      <Text className="text-center text-earth-400 text-xs pb-4">
        꼬물톡 v1.0.0
      </Text>
    </SafeAreaView>
  );
}
