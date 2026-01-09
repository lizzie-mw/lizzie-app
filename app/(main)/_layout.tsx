import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Lizzie',
          headerLargeTitle: true,
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
  );
}
