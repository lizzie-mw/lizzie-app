import { useCallback, useRef, useMemo } from 'react';
import { FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useQuery } from '@tanstack/react-query';
import { messageQueries, ChatBubble, TypingIndicator, toDisplayMessage } from '@/entities/message';
import type { DisplayMessage } from '@/entities/message';
import { useSSE, ChatInput } from '@/features/send-message';
import { Loading, EmptyState } from '@/shared/ui';

interface ChatRoomProps {
  chatId: string;
}

export function ChatRoom({ chatId }: ChatRoomProps) {
  const headerHeight = useHeaderHeight();
  const flatListRef = useRef<FlatList>(null);

  const { data, isLoading } = useQuery(messageQueries.list(chatId));

  const {
    sendMessage,
    isStreaming,
    streamingText,
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
      // Optimistic update: 사용자 메시지 즉시 표시
      sendMessage(content);
    },
    [sendMessage]
  );

  const renderItem = useCallback(
    ({ item }: { item: DisplayMessage }) => <ChatBubble message={item} />,
    []
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

      <ChatInput onSend={handleSend} disabled={isStreaming} />
    </KeyboardAvoidingView>
  );
}
