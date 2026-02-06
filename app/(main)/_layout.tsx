import { View } from 'react-native';
import { Stack } from 'expo-router';
import { NetworkBanner } from '@/shared/ui';

export default function MainLayout() {
  return (
    <View style={{ flex: 1 }}>
      <NetworkBanner />
      <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="chat/[chatId]"
        options={{
          title: '채팅',
          headerBackTitle: '뒤로',
        }}
      />
      <Stack.Screen
        name="settings/index"
        options={{
          title: '설정',
          headerBackTitle: '뒤로',
        }}
      />
      <Stack.Screen
        name="settings/lizard"
        options={{
          title: '도마뱀 정보',
          headerBackTitle: '설정',
        }}
      />
      <Stack.Screen
        name="settings/account"
        options={{
          title: '계정',
          headerBackTitle: '설정',
        }}
      />
    </Stack>
    </View>
  );
}
