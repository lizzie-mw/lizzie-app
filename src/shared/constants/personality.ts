export const PERSONALITY_OPTIONS = [
  { label: '활발한', value: 'active' },
  { label: '온순한', value: 'gentle' },
  { label: '호기심 많은', value: 'curious' },
  { label: '느긋한', value: 'relaxed' },
  { label: '겁 많은', value: 'shy' },
  { label: '사교적인', value: 'social' },
] as const satisfies readonly { label: string; value: string }[];

export type Personality = (typeof PERSONALITY_OPTIONS)[number]['value'];
