import { View, FlatList, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { lizardQueries } from '@/entities/lizard';
import { chatQueries, ChatListItem } from '@/entities/chat';
import { NewChatButton } from '@/features/create-chat';
import { LizardProfileCard } from '@/widgets/lizard-profile-card';
import { Loading } from '@/shared/ui';
import { haptics } from '@/shared/lib';

export default function HomeScreen() {
  const router = useRouter();

  const { data: lizard, isLoading: isLizardLoading } = useQuery(lizardQueries.me());

  const { data: chats, isLoading: isChatsLoading } = useQuery({
    ...chatQueries.list(lizard?.id || ''),
    enabled: !!lizard?.id,
  });

  if (isLizardLoading) {
    return <Loading fullScreen message="로딩 중..." />;
  }

  if (!lizard) {
    return null;
  }

  const handleChatPress = (chatId: string) => {
    haptics.light();
    router.push(`/chat/${chatId}`);
  };

  const handleSettingsPress = () => {
    haptics.light();
    router.push('/settings');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      <View className="flex-1">
        {/* 프로필 카드 */}
        <View className="px-4 pt-2 pb-4">
          <LizardProfileCard lizard={lizard} />
        </View>

        {/* 채팅 목록 */}
        <View className="flex-1 bg-white rounded-t-3xl">
          <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100">
            <Text className="text-lg font-semibold text-gray-900">대화</Text>
            <Text className="text-sm text-gray-400">
              {chats?.length || 0} / 5
            </Text>
          </View>

          {isChatsLoading ? (
            <Loading message="채팅을 불러오는 중..." />
          ) : chats && chats.length > 0 ? (
            <FlatList
              data={chats}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ChatListItem
                  chat={item}
                  onPress={() => handleChatPress(item.id)}
                />
              )}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          ) : (
            <View className="flex-1 items-center justify-center py-12">
              <Text className="text-4xl mb-3">💬</Text>
              <Text className="text-gray-500 text-center">
                아직 대화가 없어요{'\n'}새 대화를 시작해보세요!
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* FAB */}
      <View className="absolute bottom-6 right-6">
        <NewChatButton
          lizardId={lizard.id}
          chatCount={chats?.length || 0}
        />
      </View>

      {/* 설정 버튼 (헤더) */}
      <Pressable
        className="absolute top-2 right-4 p-2"
        onPress={handleSettingsPress}
      >
        <Text className="text-2xl">⚙️</Text>
      </Pressable>
    </SafeAreaView>
  );
}
