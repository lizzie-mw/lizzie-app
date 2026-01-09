declare const __brand: unique symbol;

export type Branded<T, Brand extends string> = T & { [__brand]: Brand };

// ID 타입들
export type UserId = Branded<string, 'UserId'>;
export type LizardId = Branded<string, 'LizardId'>;
export type ChatId = Branded<string, 'ChatId'>;
export type MessageId = Branded<string, 'MessageId'>;

// 헬퍼 함수
export const asUserId = (id: string): UserId => id as UserId;
export const asLizardId = (id: string): LizardId => id as LizardId;
export const asChatId = (id: string): ChatId => id as ChatId;
export const asMessageId = (id: string): MessageId => id as MessageId;
