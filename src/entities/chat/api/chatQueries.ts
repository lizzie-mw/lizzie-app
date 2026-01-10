import { queryOptions } from '@tanstack/react-query';
import { chatApi } from './chatApi';
import type { ChatCreate } from '@/shared/api';

// Query Key Factory
export const chatKeys = {
  all: ['chat'] as const,
  lists: () => [...chatKeys.all, 'list'] as const,
  list: (lizardId: string) => [...chatKeys.lists(), lizardId] as const,
};

// Query Options Factory
export const chatQueries = {
  list: (lizardId: string) =>
    queryOptions({
      queryKey: chatKeys.list(lizardId),
      queryFn: () => chatApi.getChats(lizardId),
      enabled: !!lizardId,
    }),
};

// Mutation Options
export const chatMutations = {
  create: {
    mutationFn: ({ lizardId, data }: { lizardId: string; data: ChatCreate }) =>
      chatApi.createChat(lizardId, data),
  },

  delete: {
    mutationFn: (chatId: string) => chatApi.deleteChat(chatId),
  },
};
