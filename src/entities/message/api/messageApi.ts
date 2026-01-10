import { apiClient } from '@/shared/api';
import type { MessageListResponse } from '@/shared/api';

export interface MessagesResponse extends MessageListResponse {
  has_more: boolean;
}

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
};
