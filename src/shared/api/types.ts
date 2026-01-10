import type { components } from './schema';

// ============================================
// API Schema Types (from OpenAPI)
// ============================================

// User
export type UserCreate = components['schemas']['UserCreate'];
export type UserResponse = components['schemas']['UserResponse'];

// Lizard
export type LizardCreate = components['schemas']['LizardCreate'];
export type LizardUpdate = components['schemas']['LizardUpdate'];
export type LizardResponse = components['schemas']['LizardResponse'];

// Chat
export type ChatCreate = components['schemas']['ChatCreate'];
export type ChatResponse = components['schemas']['ChatResponse'];
export type ChatListResponse = components['schemas']['ChatListResponse'];

// Message
export type MessageCreate = components['schemas']['MessageCreate'];
export type MessageResponse = components['schemas']['MessageResponse'];
export type MessageListResponse = components['schemas']['MessageListResponse'];

// Image
export type ImageUploadRequest = components['schemas']['ImageUploadRequest'];
export type ImageUploadResponse = components['schemas']['ImageUploadResponse'];
export type ImageUrlUpdate = components['schemas']['ImageUrlUpdate'];

// Error
export type HTTPValidationError = components['schemas']['HTTPValidationError'];
export type ValidationError = components['schemas']['ValidationError'];
