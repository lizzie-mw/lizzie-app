import { useState, useCallback, useRef, useEffect } from 'react';
import EventSource from 'react-native-sse';
import { useQueryClient } from '@tanstack/react-query';
import { CONFIG } from '@/shared/config/env';
import { supabase } from '@/shared/lib/supabase';
import { messageKeys } from '@/entities/message';
import type { Message } from '@/entities/message';

interface UseSSEOptions {
  onComplete?: (message: Message) => void;
  onError?: (error: Error) => void;
  maxRetries?: number;
}

interface UseSSEReturn {
  sendMessage: (content: string) => void;
  isStreaming: boolean;
  streamingText: string;
  error: Error | null;
  cancel: () => void;
  retry: () => void;
}

export function useSSE(chatId: string, options: UseSSEOptions = {}): UseSSEReturn {
  const { onComplete, onError, maxRetries = 3 } = options;

  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const queryClient = useQueryClient();
  const eventSourceRef = useRef<EventSource | null>(null);
  const retryCountRef = useRef(0);
  const isMountedRef = useRef(true);
  const lastContentRef = useRef<string | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      eventSourceRef.current?.close();
    };
  }, []);

  const cancel = useCallback(() => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    if (isMountedRef.current) {
      setIsStreaming(false);
      setStreamingText('');
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (isStreaming) return;

      lastContentRef.current = content;
      setIsStreaming(true);
      setStreamingText('');
      setError(null);
      retryCountRef.current = 0;

      const connect = async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();

          if (!session?.access_token) {
            throw new Error('인증이 필요합니다.');
          }

          const url = `${CONFIG.API_URL}/v1/chats/${chatId}/messages/stream`;

          eventSourceRef.current = new EventSource(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ content }),
          });

          eventSourceRef.current.addEventListener('message', (event: any) => {
            if (!isMountedRef.current) return;

            try {
              const data = JSON.parse(event.data);

              if (data.type === 'content') {
                setStreamingText((prev) => prev + data.content);
              } else if (data.type === 'done') {
                setIsStreaming(false);
                eventSourceRef.current?.close();

                // 캐시 무효화
                queryClient.invalidateQueries({
                  queryKey: messageKeys.list(chatId),
                });

                if (data.message) {
                  onComplete?.(data.message);
                }
              }
            } catch (e) {
              // JSON 파싱 에러 무시
            }
          });

          eventSourceRef.current.addEventListener('error', (event: any) => {
            if (!isMountedRef.current) return;

            eventSourceRef.current?.close();

            // 재시도 로직 (Exponential backoff)
            if (retryCountRef.current < maxRetries) {
              retryCountRef.current += 1;
              const delay = Math.pow(2, retryCountRef.current) * 1000;

              setTimeout(() => {
                if (isMountedRef.current) {
                  connect();
                }
              }, delay);
            } else {
              const err = new Error('메시지 전송에 실패했습니다.');
              setError(err);
              setIsStreaming(false);
              onError?.(err);
            }
          });
        } catch (err) {
          if (isMountedRef.current) {
            const error = err as Error;
            setError(error);
            setIsStreaming(false);
            onError?.(error);
          }
        }
      };

      connect();
    },
    [chatId, isStreaming, maxRetries, onComplete, onError, queryClient]
  );

  const retry = useCallback(() => {
    if (lastContentRef.current) {
      sendMessage(lastContentRef.current);
    }
  }, [sendMessage]);

  return {
    sendMessage,
    isStreaming,
    streamingText,
    error,
    cancel,
    retry,
  };
}
