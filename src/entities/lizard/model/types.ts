import type { LizardId, UserId, DateString } from '@/shared/types';
import type { Species, Personality } from '@/shared/constants';

export interface Lizard {
  id: LizardId;
  user_id: UserId;
  name: string;
  species: Species;
  morph?: string;
  age_months?: number;
  personality?: Personality;
  image_url?: string;
  created_at: DateString;
  updated_at: DateString;
}

export interface LizardCreate {
  name: string;
  species: Species;
  morph?: string;
  age_months?: number;
  personality?: Personality;
}

export interface LizardUpdate {
  name?: string;
  species?: Species;
  morph?: string;
  age_months?: number;
  personality?: Personality;
  image_url?: string;
}
