import { useState } from 'react';
import { View, FlatList, Text, Alert, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { lizardQueries } from '@/entities/lizard';
import { chatQueries, chatKeys, chatApi, ChatListItem } from '@/entities/chat';
import { NewChatButton } from '@/features/create-chat';
import { LizardProfileCard } from '@/widgets/lizard-profile-card';
import { Loading, IconButton, Icon, EmptyState } from '@/shared/ui';
import { haptics } from '@/shared/lib';

export default function HomeScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();

  const { data: lizard, isLoading: isLizardLoading } = useQuery(lizardQueries.me());

  const { data: chats, isLoading: isChatsLoading } = useQuery({
    ...chatQueries.list(lizard?.id || ''),
    enabled: !!lizard?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: chatApi.deleteChat,
    onMutate: async (chatId) => {
      if (!lizard?.id) return;
      await queryClient.cancelQueries({ queryKey: chatKeys.list(lizard.id) });
      const previous = queryClient.getQueryData(chatKeys.list(lizard.id));
      queryClient.setQueryData(
        chatKeys.list(lizard.id),
        (old: typeof chats) => old?.filter((c) => c.id !== chatId),
      );
      haptics.success();
      return { previous };
    },
    onError: (error: Error, _chatId, context) => {
      if (lizard?.id && context?.previous) {
        queryClient.setQueryData(chatKeys.list(lizard.id), context.previous);
      }
      haptics.error();
      Alert.alert('삭제 실패', error.message || '다시 시도해주세요.');
    },
    onSettled: () => {
      if (lizard?.id) {
        queryClient.invalidateQueries({ queryKey: chatKeys.list(lizard.id) });
      }
    },
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

  const handleChatDelete = (chatId: string) => {
    deleteMutation.mutate(chatId);
  };

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!lizard?.id) return;
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: chatKeys.list(lizard.id) });
    setIsRefreshing(false);
  };

  const handleSettingsPress = () => {
    router.push('/settings');
  };

  return (
    <SafeAreaView testID="home-screen" className="flex-1 bg-cream-50" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 pt-2 pb-3">
        <View className="flex-row items-center">
          <Icon family="material" name="lizard" size="md" color="#5cb82f" />
          <Text className="text-xl font-bold text-gray-900 ml-2">꼬물톡</Text>
        </View>
        <IconButton
          testID="settings-button"
          icon="settings-outline"
          variant="ghost"
          size="md"
          onPress={handleSettingsPress}
        />
      </View>

      <View className="flex-1">
        {/* Profile Card */}
        <View testID="home-profile-card" className="px-4 pb-4">
          <LizardProfileCard lizard={lizard} />
        </View>

        {/* Chat List */}
        <View testID="home-chat-list" className="flex-1 bg-white rounded-t-3xl">
          <View className="flex-row justify-between items-center px-4 py-4 border-b border-cream-200">
            <Text testID="home-chat-title" className="text-lg font-bold text-gray-900">
              대화
            </Text>
            <View className="bg-primary-100 px-2.5 py-1 rounded-full">
              <Text testID="home-chat-count" className="text-xs font-semibold text-primary-600">
                {chats?.length || 0} / 5
              </Text>
            </View>
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
                  onDelete={handleChatDelete}
                />
              )}
              contentContainerStyle={{ paddingBottom: 100 }}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  tintColor="#5cb82f"
                />
              }
              ItemSeparatorComponent={() => (
                <View className="h-px bg-cream-100 mx-4" />
              )}
            />
          ) : (
            <EmptyState
              icon="chatbubble-ellipses-outline"
              title="아직 대화가 없어요"
              description="새 대화를 시작해서 도마뱀과 이야기해보세요!"
            />
          )}
        </View>
      </View>

      {/* FAB */}
      <View className="absolute right-6" style={{ bottom: Math.max(insets.bottom, 24) }}>
        <NewChatButton
          lizardId={lizard.id}
          chatCount={chats?.length || 0}
        />
      </View>
    </SafeAreaView>
  );
}
