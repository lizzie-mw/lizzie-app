import { queryOptions } from '@tanstack/react-query';
import { chatApi } from './chatApi';
import type { ChatCreate } from '../model/types';

// Query Key Factory
export const chatKeys = {
  all: ['chat'] as const,
  lists: () => [...chatKeys.all, 'list'] as const,
  list: (lizardId: string) => [...chatKeys.lists(), lizardId] as const,
  details: () => [...chatKeys.all, 'detail'] as const,
  detail: (chatId: string) => [...chatKeys.details(), chatId] as const,
};

// Query Options Factory
export const chatQueries = {
  list: (lizardId: string) =>
    queryOptions({
      queryKey: chatKeys.list(lizardId),
      queryFn: () => chatApi.getChats(lizardId),
      enabled: !!lizardId,
    }),

  detail: (chatId: string) =>
    queryOptions({
      queryKey: chatKeys.detail(chatId),
      queryFn: () => chatApi.getChat(chatId),
      enabled: !!chatId,
    }),
};

// Mutation Options
export const chatMutations = {
  create: {
    mutationFn: (data: ChatCreate) => chatApi.createChat(data),
  },

  updateTitle: {
    mutationFn: ({ chatId, title }: { chatId: string; title: string }) =>
      chatApi.updateChatTitle(chatId, title),
  },

  delete: {
    mutationFn: (chatId: string) => chatApi.deleteChat(chatId),
  },
};
