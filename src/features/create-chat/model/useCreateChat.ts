import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { chatApi, chatKeys } from '@/entities/chat';
import { haptics } from '@/shared/lib';

interface UseCreateChatOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useCreateChat(lizardId: string, options: UseCreateChatOptions = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => chatApi.createChat({ lizard_id: lizardId }),
    onSuccess: (chat) => {
      haptics.success();

      // 채팅 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: chatKeys.list(lizardId),
      });

      options.onSuccess?.();

      // 새 채팅방으로 이동
      router.push(`/chat/${chat.id}`);
    },
    onError: (error: Error) => {
      haptics.error();
      options.onError?.(error);
    },
  });

  return {
    createChat: mutation.mutate,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
}
