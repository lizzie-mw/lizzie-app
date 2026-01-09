import type { ChatId, LizardId, DateString } from '@/shared/types';

export interface Chat {
  id: ChatId;
  lizard_id: LizardId;
  title: string;
  last_message?: string;
  last_message_at?: DateString;
  message_count: number;
  created_at: DateString;
  updated_at: DateString;
}

export interface ChatCreate {
  lizard_id: string;
  title?: string;
}
