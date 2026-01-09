import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { lizardApi, lizardKeys } from '@/entities/lizard';
import { haptics } from '@/shared/lib';
import type { LizardFormData } from './lizardSchema';

interface UseRegisterLizardOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useRegisterLizard(options: UseRegisterLizardOptions = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: LizardFormData) => lizardApi.createLizard(data),
    onSuccess: () => {
      haptics.success();

      // 도마뱀 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: lizardKeys.all,
      });

      options.onSuccess?.();

      // 메인으로 이동
      router.replace('/');
    },
    onError: (error: Error) => {
      haptics.error();
      options.onError?.(error);
    },
  });

  return {
    register: mutation.mutate,
    isRegistering: mutation.isPending,
    error: mutation.error,
  };
}
