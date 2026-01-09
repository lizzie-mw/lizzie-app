import type { UserId, DateString } from '@/shared/types';

export interface User {
  id: UserId;
  email: string;
  created_at: DateString;
}
