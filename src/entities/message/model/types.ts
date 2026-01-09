import type { MessageId, ChatId, DateString } from '@/shared/types';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: MessageId;
  chat_id: ChatId;
  role: MessageRole;
  content: string;
  created_at: DateString;
}

// Discriminated Union for display messages
export interface UserMessage {
  id: MessageId;
  role: 'user';
  content: string;
  created_at: DateString;
}

export interface AssistantMessage {
  id: MessageId;
  role: 'assistant';
  content: string;
  created_at: DateString;
}

export interface StreamingMessage {
  id: string;
  role: 'assistant';
  content: string;
  isStreaming: true;
}

export type DisplayMessage = UserMessage | AssistantMessage | StreamingMessage;

// Type guard
export function isStreamingMessage(msg: DisplayMessage): msg is StreamingMessage {
  return 'isStreaming' in msg && msg.isStreaming === true;
}

export interface MessageCreate {
  chat_id: string;
  content: string;
}

export interface MessagesResponse {
  data: Message[];
  has_more: boolean;
}
