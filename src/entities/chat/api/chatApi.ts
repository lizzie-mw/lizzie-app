import { apiClient } from '@/shared/api';
import type { Chat, ChatCreate } from '../model/types';

export const chatApi = {
  getChats: async (lizardId: string): Promise<Chat[]> => {
    const response = await apiClient
      .get('chats', { searchParams: { lizard_id: lizardId } })
      .json<{ data: Chat[] }>();
    return response.data;
  },

  getChat: async (chatId: string): Promise<Chat> => {
    return await apiClient.get(`chats/${chatId}`).json<Chat>();
  },

  createChat: async (payload: ChatCreate): Promise<Chat> => {
    return await apiClient.post('chats', { json: payload }).json<Chat>();
  },

  updateChatTitle: async (chatId: string, title: string): Promise<Chat> => {
    return await apiClient
      .patch(`chats/${chatId}`, { json: { title } })
      .json<Chat>();
  },

  deleteChat: async (chatId: string): Promise<void> => {
    await apiClient.delete(`chats/${chatId}`);
  },
};
