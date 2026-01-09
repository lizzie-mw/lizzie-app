// 공통 타입 정의

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

// 날짜 문자열 (ISO 8601)
export type DateString = string;

// 타임스탬프가 있는 엔티티
export interface Timestamped {
  created_at: DateString;
  updated_at: DateString;
}

// 로딩 상태
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// 비동기 상태
export interface AsyncState<T, E = Error> {
  data: T | null;
  isLoading: boolean;
  error: E | null;
}
