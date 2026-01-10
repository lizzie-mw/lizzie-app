import { apiClient } from '@/shared/api';
import type { ChatResponse, ChatCreate, ChatListResponse } from '@/shared/api';

export const chatApi = {
  getChats: async (lizardId: string): Promise<ChatResponse[]> => {
    const response = await apiClient
      .get(`lizards/${lizardId}/chats`)
      .json<ChatListResponse>();
    return response.data;
  },

  createChat: async (lizardId: string, payload: ChatCreate): Promise<ChatResponse> => {
    return await apiClient
      .post(`lizards/${lizardId}/chats`, { json: payload })
      .json<ChatResponse>();
  },

  deleteChat: async (chatId: string): Promise<void> => {
    await apiClient.delete(`chats/${chatId}`);
  },
};
