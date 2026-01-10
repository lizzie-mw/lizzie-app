import type { MessageResponse } from '@/shared/api';

// Re-export API types
export type Message = MessageResponse;

// Message role type
export type MessageRole = 'user' | 'assistant' | 'system';

// Base message interface
interface BaseMessage {
  id: string;
  content: string;
  created_at: string;
}

// Discriminated Union for display messages
export interface UserMessage extends BaseMessage {
  role: 'user';
}

export interface AssistantMessage extends BaseMessage {
  role: 'assistant';
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

// Helper to convert API message to display message
export function toDisplayMessage(msg: Message): DisplayMessage | null {
  if (msg.role === 'user') {
    return {
      id: msg.id,
      role: 'user',
      content: msg.content,
      created_at: msg.created_at,
    };
  }
  if (msg.role === 'assistant') {
    return {
      id: msg.id,
      role: 'assistant',
      content: msg.content,
      created_at: msg.created_at,
    };
  }
  return null;
}

// Re-export MessagesResponse from messageApi
export type { MessagesResponse } from '../api/messageApi';
