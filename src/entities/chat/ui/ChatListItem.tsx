import { View, Text, Pressable, Alert } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useRef } from 'react';
import { formatChatTime, haptics } from '@/shared/lib';
import { Icon } from '@/shared/ui';
import type { Chat } from '../model/types';

interface ChatListItemProps {
  chat: Chat;
  onPress: () => void;
  onDelete?: (chatId: string) => void;
}

export function ChatListItem({ chat, onPress, onDelete }: ChatListItemProps) {
  const swipeableRef = useRef<Swipeable>(null);

  const handlePress = () => {
    haptics.light();
    onPress();
  };

  const handleDelete = () => {
    Alert.alert(
      '대화 삭제',
      '이 대화를 삭제하시겠어요?\n삭제된 대화는 복구할 수 없습니다.',
      [
        {
          text: '취소',
          style: 'cancel',
          onPress: () => swipeableRef.current?.close(),
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            haptics.warning();
            onDelete?.(chat.id);
            swipeableRef.current?.close();
          },
        },
      ]
    );
  };

  const renderRightActions = () => {
    if (!onDelete) return null;

    return (
      <Pressable
        className="bg-red-500 items-center justify-center px-6"
        onPress={handleDelete}
      >
        <Icon name="trash-outline" size="md" color="#ffffff" />
        <Text className="text-white text-xs mt-1">삭제</Text>
      </Pressable>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      onSwipeableOpen={() => haptics.light()}
    >
      <Pressable
        className="flex-row items-center px-4 py-4 bg-white active:bg-cream-100"
        onPress={handlePress}
      >
        <View className="w-10 h-10 rounded-full bg-primary-100 items-center justify-center mr-3">
          <Icon name="chatbubble-ellipses" size="sm" color="#5cb82f" />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-semibold text-gray-900" numberOfLines={1}>
              {chat.title || '새 대화'}
            </Text>
            {chat.last_message_at && (
              <Text className="text-xs text-earth-400 ml-2">
                {formatChatTime(chat.last_message_at)}
              </Text>
            )}
          </View>
          <Text className="text-sm text-earth-500 mt-0.5">
            {chat.message_count === 0 ? '새 대화' : `메시지 ${chat.message_count}개`}
          </Text>
        </View>
        <Icon name="chevron-forward" size="sm" color="#c9b69e" />
      </Pressable>
    </Swipeable>
  );
}
