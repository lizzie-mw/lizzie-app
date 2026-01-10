// 개발/테스트 환경을 위한 fallback 값 (실제 배포시에는 환경 변수 사용)
const DEV_SUPABASE_URL = 'https://placeholder.supabase.co';
const DEV_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

export const CONFIG = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.lizzie.app',
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || DEV_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || DEV_SUPABASE_ANON_KEY,
} as const;

// 타입 안전한 환경 변수 검증
if (__DEV__) {
  if (CONFIG.SUPABASE_URL === DEV_SUPABASE_URL) {
    console.warn('Using placeholder Supabase URL. Set EXPO_PUBLIC_SUPABASE_URL for production.');
  }
}
