import { useCallback, useRef, useMemo, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, View, Text, Pressable, RefreshControl } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { messageQueries, messageKeys, ChatBubble, TypingIndicator, DateSeparator, toDisplayMessage } from '@/entities/message';
import type { DisplayMessage } from '@/entities/message';
import { useSSE, ChatInput } from '@/features/send-message';
import { ChatLimitBanner, useIsLimitReached, useDailyUsageStore } from '@/features/rewarded-ad';
import { isSameDay } from '@/shared/lib';
import { Loading, EmptyState, Icon } from '@/shared/ui';

interface ChatRoomProps {
  chatId: string;
}

export function ChatRoom({ chatId }: ChatRoomProps) {
  const headerHeight = useHeaderHeight();
  const queryClient = useQueryClient();
  const flatListRef = useRef<FlatList>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isLimitReached = useIsLimitReached();
  const incrementMessageCount = useDailyUsageStore((state) => state.incrementMessageCount);

  const { data, isLoading } = useQuery(messageQueries.list(chatId));

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: messageKeys.list(chatId) });
    setIsRefreshing(false);
  };

  const {
    sendMessage,
    isStreaming,
    streamingText,
    error,
    retry,
  } = useSSE(chatId, {
    onComplete: () => {
      // 스크롤 to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }, 100);
    },
  });

  // 메시지 목록 + 스트리밍 메시지 조합
  const messages: DisplayMessage[] = useMemo(() => {
    const baseMessages: DisplayMessage[] = (data?.data || [])
      .map(toDisplayMessage)
      .filter((msg): msg is DisplayMessage => msg !== null);

    if (isStreaming && streamingText) {
      const streamingMessage: DisplayMessage = {
        id: 'streaming',
        role: 'assistant',
        content: streamingText,
        isStreaming: true,
      };
      return [streamingMessage, ...baseMessages];
    }

    return baseMessages;
  }, [data?.data, isStreaming, streamingText]);

  const handleSend = useCallback(
    (content: string) => {
      incrementMessageCount();
      sendMessage(content);
    },
    [sendMessage, incrementMessageCount]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: DisplayMessage; index: number }) => {
      const showDateSeparator = (() => {
        if (!('created_at' in item)) return false;
        const nextItem = messages[index + 1];
        if (!nextItem || !('created_at' in nextItem)) return true;
        return !isSameDay(item.created_at, nextItem.created_at);
      })();

      return (
        <>
          <ChatBubble message={item} />
          {showDateSeparator && 'created_at' in item && (
            <DateSeparator date={item.created_at} />
          )}
        </>
      );
    },
    [messages]
  );

  const keyExtractor = useCallback(
    (item: DisplayMessage) => item.id,
    []
  );

  if (isLoading) {
    return <Loading fullScreen message="메시지를 불러오는 중..." />;
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        inverted
        keyboardDismissMode="on-drag"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#5cb82f"
          />
        }
        contentContainerStyle={
          messages.length === 0
            ? { flex: 1, justifyContent: 'center' }
            : { padding: 16, paddingTop: 8 }
        }
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          isStreaming && !streamingText ? <TypingIndicator /> : null
        }
        ListEmptyComponent={
          !isStreaming ? (
            <EmptyState
              icon="chatbubble-outline"
              title="대화를 시작해보세요"
              description="도마뱀 친구에게 궁금한 것을 물어보세요!"
            />
          ) : null
        }
      />

      {error && (
        <View className="flex-row items-center bg-red-50 px-4 py-2.5 border-t border-red-100">
          <Icon name="alert-circle-outline" size="sm" color="#ef4444" />
          <Text className="flex-1 text-sm text-red-600 ml-2">{error.message}</Text>
          <Pressable className="bg-red-500 px-3 py-1.5 rounded-lg" onPress={retry}>
            <Text className="text-white text-sm font-medium">재시도</Text>
          </Pressable>
        </View>
      )}

      {isLimitReached && !isStreaming ? (
        <ChatLimitBanner />
      ) : (
        <ChatInput onSend={handleSend} disabled={isStreaming || isLimitReached} />
      )}
    </KeyboardAvoidingView>
  );
}
