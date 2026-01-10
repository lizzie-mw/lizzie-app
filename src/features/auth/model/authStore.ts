import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/shared/lib/supabase';

interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: Error | null;
}

interface AuthActions {
  initialize: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  // 테스트용 Mock 로그인
  mockSignIn: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  session: null,
  user: null,
  isLoading: true,
  isInitialized: false,
  error: null,
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        initialize: async () => {
          if (get().isInitialized) return;

          try {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) throw error;

            set((state) => {
              state.session = session;
              state.user = session?.user ?? null;
              state.isLoading = false;
              state.isInitialized = true;
            });

            // 세션 변경 리스너
            supabase.auth.onAuthStateChange((_event, session) => {
              set((state) => {
                state.session = session;
                state.user = session?.user ?? null;
              });
            });
          } catch (error) {
            set((state) => {
              state.error = error as Error;
              state.isLoading = false;
              state.isInitialized = true;
            });
          }
        },

        signInWithGoogle: async () => {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            const { error } = await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: 'lizzie://auth/callback',
                queryParams: {
                  access_type: 'offline',
                  prompt: 'consent',
                },
              },
            });

            if (error) throw error;
          } catch (error) {
            set((state) => {
              state.error = error as Error;
            });
            throw error;
          } finally {
            set((state) => {
              state.isLoading = false;
            });
          }
        },

        signOut: async () => {
          await supabase.auth.signOut();
          set((state) => {
            state.session = null;
            state.user = null;
          });
        },

        clearError: () => {
          set((state) => {
            state.error = null;
          });
        },

        // 테스트용 Mock 로그인 (E2E 테스트에서 사용)
        mockSignIn: () => {
          if (!__DEV__) return; // 프로덕션에서는 동작하지 않음

          const mockUser = {
            id: 'mock-user-id',
            email: 'test@lizzie.app',
            created_at: new Date().toISOString(),
          } as User;

          const mockSession = {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            expires_at: Date.now() + 3600000,
            user: mockUser,
          } as Session;

          set((state) => {
            state.session = mockSession;
            state.user = mockUser;
            state.isLoading = false;
            state.isInitialized = true;
          });
        },
      })),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          session: state.session,
          user: state.user,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);

// 최적화된 셀렉터
export const useIsAuthenticated = () =>
  useAuthStore((state) => !!state.session);

export const useUser = () =>
  useAuthStore((state) => state.user);

export const useAuthLoading = () =>
  useAuthStore((state) => state.isLoading);

export const useAuthInitialized = () =>
  useAuthStore((state) => state.isInitialized);
