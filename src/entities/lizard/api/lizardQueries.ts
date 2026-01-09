import { queryOptions } from '@tanstack/react-query';
import { lizardApi } from './lizardApi';
import type { LizardCreate, LizardUpdate } from '../model/types';

// Query Key Factory
export const lizardKeys = {
  all: ['lizard'] as const,
  me: () => [...lizardKeys.all, 'me'] as const,
  detail: (id: string) => [...lizardKeys.all, 'detail', id] as const,
};

// Query Options Factory
export const lizardQueries = {
  me: () =>
    queryOptions({
      queryKey: lizardKeys.me(),
      queryFn: lizardApi.getMyLizard,
      staleTime: 1000 * 60 * 5, // 5분
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: lizardKeys.detail(id),
      queryFn: () => lizardApi.getMyLizard(),
      enabled: !!id,
    }),
};

// Mutation Options Factory
export const lizardMutations = {
  create: {
    mutationFn: (data: LizardCreate) => lizardApi.createLizard(data),
  },

  update: {
    mutationFn: ({ id, data }: { id: string; data: LizardUpdate }) =>
      lizardApi.updateLizard(id, data),
  },

  delete: {
    mutationFn: (id: string) => lizardApi.deleteLizard(id),
  },
};
