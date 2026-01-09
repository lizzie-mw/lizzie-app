export const CONFIG = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.lizzie.app',
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
} as const;

// 타입 안전한 환경 변수 검증
if (__DEV__) {
  if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_ANON_KEY) {
    console.warn('Missing required environment variables: SUPABASE_URL or SUPABASE_ANON_KEY');
  }
}
