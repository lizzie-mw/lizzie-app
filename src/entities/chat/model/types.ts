import type {
  ChatResponse,
  ChatCreate as ApiChatCreate,
  ChatListResponse,
} from '@/shared/api';

// Re-export API types
export type Chat = ChatResponse;
export type ChatCreate = ApiChatCreate;
export type { ChatListResponse };
