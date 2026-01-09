import { View, Text, Pressable } from 'react-native';
import { formatChatTime } from '@/shared/lib';
import { haptics } from '@/shared/lib';
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
      className="flex-row items-center px-4 py-3 active:bg-gray-50"
      onPress={handlePress}
    >
      <View className="flex-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-medium text-gray-900" numberOfLines={1}>
            {chat.title || '새 대화'}
          </Text>
          {chat.last_message_at && (
            <Text className="text-xs text-gray-400 ml-2">
              {formatChatTime(chat.last_message_at)}
            </Text>
          )}
        </View>
        {chat.last_message && (
          <Text className="text-sm text-gray-500 mt-0.5" numberOfLines={1}>
            {chat.last_message}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
