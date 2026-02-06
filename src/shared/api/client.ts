import ky, { HTTPError } from 'ky';
import { CONFIG } from '@/shared/config/env';
import { supabase } from '@/shared/lib/supabase';
import { HttpError, type ApiError } from '@/shared/types';

export const apiClient = ky.create({
  prefixUrl: `${CONFIG.API_URL}/v1`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  hooks: {
    beforeRequest: [
      async (request) => {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.access_token) {
          request.headers.set('Authorization', `Bearer ${session.access_token}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        // 401 에러 시 토큰 리프레시 시도
        if (response.status === 401) {
          const { error: refreshError } = await supabase.auth.refreshSession();

          if (refreshError) {
            await supabase.auth.signOut();
            throw new HttpError(401, 'UNAUTHORIZED', '인증이 만료되었습니다.');
          }

          // 리프레시 성공 시 재요청
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.access_token) {
            request.headers.set('Authorization', `Bearer ${session.access_token}`);
            return ky(request);
          }
        }

        return response;
      },
    ],
    beforeError: [
      async (error) => {
        const { response } = error;

        if (response) {
          try {
            const body = await response.json() as ApiError;
            if (body.detail?.message) {
              throw new HttpError(response.status, body.detail.code, body.detail.message);
            }
          } catch (e) {
            if (e instanceof HttpError) throw e;
          }
        }

        return error;
      },
    ],
  },
});

// 에러 메시지 추출 헬퍼
export function getErrorMessage(error: unknown): string {
  if (error instanceof HttpError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return '오류가 발생했어요.';
}
