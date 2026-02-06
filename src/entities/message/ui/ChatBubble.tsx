import { View, Text } from 'react-native';
import { formatMessageTime } from '@/shared/lib';
import { Icon } from '@/shared/ui';
import type { DisplayMessage } from '../model/types';
import { isStreamingMessage } from '../model/types';

interface ChatBubbleProps {
  message: DisplayMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  const isStreaming = isStreamingMessage(message);

  return (
    <View
      className={`
        flex-row mb-3 items-end
        ${isUser ? 'justify-end' : 'justify-start'}
      `}
    >
      {/* AI Avatar */}
      {!isUser && (
        <View className="w-8 h-8 rounded-full bg-primary-100 items-center justify-center mr-2">
          <Icon family="material" name="lizard" size="xs" color="#5cb82f" />
        </View>
      )}

      <View
        className={`
          max-w-[80%] px-4 py-3 rounded-2xl
          ${isUser
            ? 'bg-primary-500 rounded-br-sm'
            : 'bg-cream-100 rounded-bl-sm'
          }
        `}
      >
        <Text
          className={`
            text-base leading-6
            ${isUser ? 'text-white' : 'text-gray-900'}
          `}
        >
          {message.content}
          {isStreaming && (
            <Text className="text-primary-400">▋</Text>
          )}
        </Text>
        {!isStreaming && (
          <Text
            className={`
              text-xs mt-1.5
              ${isUser ? 'text-white/70' : 'text-earth-400'}
            `}
          >
            {formatMessageTime(message.created_at)}
          </Text>
        )}
      </View>
    </View>
  );
}
