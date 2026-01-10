import type {
  LizardResponse,
  LizardCreate as ApiLizardCreate,
  LizardUpdate as ApiLizardUpdate,
} from '@/shared/api';

// Re-export API types
export type Lizard = LizardResponse;
export type LizardCreate = ApiLizardCreate;
export type LizardUpdate = ApiLizardUpdate;

// Gender and Personality literal types (from OpenAPI pattern)
export type Gender = 'male' | 'female' | 'unknown';
export type Personality = 'shy' | 'active' | 'sassy' | 'chill';
