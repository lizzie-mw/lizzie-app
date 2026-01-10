export const PERSONALITY_OPTIONS = [
  { label: '소심한', value: 'shy' },
  { label: '활발한', value: 'active' },
  { label: '도도한', value: 'sassy' },
  { label: '느긋한', value: 'chill' },
] as const satisfies readonly { label: string; value: string }[];

export type Personality = (typeof PERSONALITY_OPTIONS)[number]['value'];
