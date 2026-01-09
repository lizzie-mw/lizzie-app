import { View, Text } from 'react-native';
import { formatMessageTime } from '@/shared/lib';
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
        flex-row mb-3
        ${isUser ? 'justify-end' : 'justify-start'}
      `}
    >
      <View
        className={`
          max-w-[80%] px-4 py-3 rounded-2xl
          ${isUser
            ? 'bg-primary-500 rounded-br-sm'
            : 'bg-gray-100 rounded-bl-sm'
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
            <Text className="text-gray-400">▋</Text>
          )}
        </Text>
        {!isStreaming && (
          <Text
            className={`
              text-xs mt-1
              ${isUser ? 'text-white/70' : 'text-gray-400'}
            `}
          >
            {formatMessageTime(message.created_at)}
          </Text>
        )}
      </View>
    </View>
  );
}
