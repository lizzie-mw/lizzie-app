import { apiClient } from '@/shared/api';
import type { Message, MessagesResponse } from '../model/types';

export const messageApi = {
  getMessages: async (
    chatId: string,
    options?: { limit?: number; before?: string }
  ): Promise<MessagesResponse> => {
    const searchParams: Record<string, string> = {};

    if (options?.limit) {
      searchParams.limit = String(options.limit);
    }
    if (options?.before) {
      searchParams.before = options.before;
    }

    return await apiClient
      .get(`chats/${chatId}/messages`, { searchParams })
      .json<MessagesResponse>();
  },

  getMessage: async (messageId: string): Promise<Message> => {
    return await apiClient.get(`messages/${messageId}`).json<Message>();
  },
};
