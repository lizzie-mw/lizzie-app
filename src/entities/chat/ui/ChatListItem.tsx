import { View, Text, Pressable } from 'react-native';
import { formatChatTime, haptics } from '@/shared/lib';
import { Icon } from '@/shared/ui';
import type { Chat } from '../model/types';

interface ChatListItemProps {
  chat: Chat;
  onPress: () => void;
}

export function ChatListItem({ chat, onPress }: ChatListItemProps) {
  const handlePress = () => {
    haptics.light();
    onPress();
  };

  return (
    <Pressable
      className="flex-row items-center px-4 py-4 active:bg-cream-100"
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
          메시지 {chat.message_count}개
        </Text>
      </View>
      <Icon name="chevron-forward" size="sm" color="#c9b69e" />
    </Pressable>
  );
}
