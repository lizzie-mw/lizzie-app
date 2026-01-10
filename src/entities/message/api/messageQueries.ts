import { queryOptions, infiniteQueryOptions } from '@tanstack/react-query';
import { messageApi } from './messageApi';

// Query Key Factory
export const messageKeys = {
  all: ['message'] as const,
  lists: () => [...messageKeys.all, 'list'] as const,
  list: (chatId: string) => [...messageKeys.lists(), chatId] as const,
};

// Query Options Factory
export const messageQueries = {
  list: (chatId: string) =>
    queryOptions({
      queryKey: messageKeys.list(chatId),
      queryFn: () => messageApi.getMessages(chatId, { limit: 30 }),
      enabled: !!chatId,
    }),

  infinite: (chatId: string) =>
    infiniteQueryOptions({
      queryKey: messageKeys.list(chatId),
      queryFn: ({ pageParam }) =>
        messageApi.getMessages(chatId, {
          limit: 30,
          before: pageParam,
        }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => {
        if (!lastPage.has_more || lastPage.data.length === 0) {
          return undefined;
        }
        return lastPage.data[lastPage.data.length - 1]?.id;
      },
      enabled: !!chatId,
    }),
};
